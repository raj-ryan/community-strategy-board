import type { Strategy } from "./strategies";
import { shortProgram } from "./strategies";

// Field-weighted search with synonyms and one-character typo tolerance.
//
// The previous version tested whether the raw query string appeared anywhere in
// a concatenation of every field, so "due dates" found nothing, "prof" found
// nothing, and a result about notifications outranked nothing at all. This
// scores each token per field instead, and every token has to match somewhere.

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "to",
  "of",
  "in",
  "on",
  "for",
  "and",
  "or",
  "is",
  "are",
  "i",
  "my",
  "me",
  "it",
  "how",
  "do",
  "does",
  "can",
  "with",
  "at",
  "be",
]);

/** Words students actually type, mapped to words the cards actually use. */
const SYNONYMS: Record<string, string[]> = {
  deadline: [
    "due",
    "date",
    "dates",
    "duedate",
    "late",
    "overdue",
    "submission",
  ],
  due: ["deadline", "deadlines", "date"],
  assignment: ["homework", "hw", "coursework", "submission", "assignments"],
  homework: ["assignment", "problem", "set"],
  professor: ["instructor", "faculty", "teacher", "prof", "lecturer"],
  prof: ["professor", "instructor", "teacher"],
  instructor: ["professor", "teacher", "prof"],
  announcement: ["announcements", "update", "updates", "news", "posted"],
  notification: ["notifications", "alert", "alerts", "notify", "email"],
  email: ["inbox", "mail", "notification"],
  reading: [
    "readings",
    "article",
    "articles",
    "paper",
    "papers",
    "pdf",
    "text",
  ],
  calendar: ["schedule", "planner", "ical", "google", "apple", "timetable"],
  group: ["team", "teammate", "teammates", "groupwork", "partner"],
  team: ["group", "groupwork"],
  feedback: ["comments", "rubric", "grade", "grades", "graded", "resubmission"],
  grade: ["grades", "grading", "feedback", "mark", "marks"],
  canvas: ["lms", "modules", "module", "syllabus"],
  syllabus: ["syllabi", "canvas", "course"],
  office: ["hours", "officehours"],
  time: ["timezone", "schedule", "planning", "manage"],
  lab: ["labs", "laboratory", "practical"],
  clinical: ["placement", "rotation", "rotations", "fieldwork"],
  field: ["fieldwork", "site", "visit"],
  software: ["tool", "tools", "install", "setup", "licence", "license"],
  setup: ["install", "software", "configure", "set"],
  start: ["begin", "beginning", "before", "week", "first", "preparation"],
};

const WEIGHTS = {
  title: 10,
  tags: 6,
  benefit: 5,
  program: 5,
  whyHelps: 2,
  steps: 2,
  author: 3,
  bestTime: 1,
} as const;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(" ").filter(Boolean);
}

/** Levenshtein distance, bailing out as soon as it exceeds `max`. */
function withinEditDistance(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      best = Math.min(best, curr[j]);
    }
    if (best > max) return false;
    prev = curr;
  }
  return prev[b.length] <= max;
}

/** How well one query token matches one field word: 1 exact, 0.7 prefix, 0.45 fuzzy. */
function matchStrength(token: string, word: string): number {
  if (word === token) return 1;
  if (word.startsWith(token) && token.length >= 3) return 0.7;
  if (token.startsWith(word) && word.length >= 4) return 0.6;
  if (token.length >= 5 && withinEditDistance(token, word, 1)) return 0.45;
  return 0;
}

interface FieldIndex {
  words: Record<string, string[]>;
}

const indexCache = new WeakMap<Strategy, FieldIndex>();

function indexOf(s: Strategy): FieldIndex {
  const cached = indexCache.get(s);
  if (cached) return cached;
  const built: FieldIndex = {
    words: {
      title: tokenize(s.title),
      tags: tokenize(s.tags.join(" ")),
      benefit: tokenize(s.benefit),
      program: tokenize(`${shortProgram(s.program)} ${s.program}`),
      whyHelps: tokenize(s.whyHelps),
      steps: tokenize(s.steps.join(" ")),
      author: tokenize(s.author ?? "anonymous"),
      bestTime: tokenize(`${s.bestTime} ${s.effort ?? ""}`),
    },
  };
  indexCache.set(s, built);
  return built;
}

/** Query token plus its synonym expansions, each with a confidence factor. */
function expand(token: string): Array<{ word: string; factor: number }> {
  const out = [{ word: token, factor: 1 }];
  const related = SYNONYMS[token];
  if (related) out.push(...related.map((word) => ({ word, factor: 0.6 })));
  for (const [key, values] of Object.entries(SYNONYMS)) {
    if (values.includes(token) && key !== token) {
      out.push({ word: key, factor: 0.6 });
    }
  }
  return out;
}

export interface SearchHit {
  strategy: Strategy;
  score: number;
}

/**
 * Scores strategies against a free-text query. Every meaningful token must
 * match somewhere, so "canvas calendar" cannot be satisfied by "canvas" alone.
 */
export function searchStrategies(
  strategies: Strategy[],
  rawQuery: string,
): SearchHit[] {
  const tokens = tokenize(rawQuery).filter((t) => !STOP_WORDS.has(t));
  if (tokens.length === 0) {
    return strategies.map((strategy) => ({ strategy, score: 0 }));
  }

  const hits: SearchHit[] = [];

  for (const strategy of strategies) {
    const index = indexOf(strategy);
    let total = 0;
    let matchedTokens = 0;

    for (const token of tokens) {
      const variants = expand(token);
      let bestForToken = 0;

      for (const [field, weight] of Object.entries(WEIGHTS)) {
        const words = index.words[field] ?? [];
        for (const word of words) {
          for (const variant of variants) {
            const strength = matchStrength(variant.word, word) * variant.factor;
            if (strength > 0) {
              bestForToken = Math.max(bestForToken, strength * weight);
            }
          }
        }
      }

      if (bestForToken > 0) matchedTokens++;
      total += bestForToken;
    }

    // Require every token to land somewhere; a single stray word should not
    // pull in a card that matched only one of three terms.
    if (matchedTokens === tokens.length) {
      hits.push({ strategy, score: total });
    }
  }

  return hits.sort((a, b) => b.score - a.score);
}

/** Suggestions shown when a search returns nothing. */
export function suggestionsFor(
  strategies: Strategy[],
  rawQuery: string,
): Strategy[] {
  const tokens = tokenize(rawQuery).filter((t) => !STOP_WORDS.has(t));
  if (tokens.length === 0) return [];

  const scored = strategies
    .map((strategy) => {
      const index = indexOf(strategy);
      let best = 0;
      for (const token of tokens) {
        for (const variant of expand(token)) {
          for (const field of ["title", "tags", "benefit"] as const) {
            for (const word of index.words[field] ?? []) {
              best = Math.max(
                best,
                matchStrength(variant.word, word) * variant.factor,
              );
            }
          }
        }
      }
      return { strategy, best };
    })
    .filter((x) => x.best > 0)
    .sort((a, b) => b.best - a.best)
    .slice(0, 3);

  return scored.map((x) => x.strategy);
}
