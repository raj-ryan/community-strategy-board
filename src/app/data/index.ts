import { STRATEGIES, type Strategy } from "./strategies";
import { ALL_PROGRAMS, CHALLENGES } from "./programs";
import { searchStrategies } from "./search";

export * from "./programs";
export * from "./strategies";
export * from "./comments";
export * from "./search";

// ── Ranking ───────────────────────────────────────────────────────────────────
//
// The concept test found that the two participants trusted different numbers:
// one read popularity as the signal, the other read continued use. So the board
// never combines them into a single opaque score. A ranking always states which
// measure produced it, and the denominator stays visible.

export const RANK_BASES = [
  {
    id: "liked",
    label: "Most liked",
    short: "Liked",
    column: "Likes",
    unit: "likes",
    explain:
      "Ranked by how many students liked the strategy. A like records interest, and is the quickest signal students give.",
  },
  {
    id: "saved",
    label: "Most saved",
    short: "Saved",
    column: "Saves",
    unit: "saves",
    explain:
      "Ranked by how many students saved the strategy to My Quarter, which means they intended to actually use it.",
  },
] as const;

export type RankBasis = (typeof RANK_BASES)[number]["id"];

export function rankValue(s: Strategy, basis: RankBasis): number {
  return basis === "saved" ? s.saves : s.likes;
}

export function keptPercent(s: Strategy): number {
  return Math.round((s.stillUsing / s.tried) * 100);
}

// Every ranking helper takes the live pool, because likes and saves change as
// the person using the board likes and saves things.
export function rankAll(basis: RankBasis, pool: Strategy[] = STRATEGIES) {
  return [...pool]
    .filter((s) => !s.pending)
    .sort((a, b) => rankValue(b, basis) - rankValue(a, basis))
    .map((strategy, i) => ({ rank: i + 1, strategy }));
}

/** Board-wide rank of one strategy on one measure, 1-based. */
export function rankOf(
  id: number,
  basis: RankBasis,
  pool: Strategy[] = STRATEGIES,
): number {
  return rankAll(basis, pool).findIndex((r) => r.strategy.id === id) + 1;
}

/** Rank within a single challenge, used for the badge on a card. */
export function rankInChallenge(
  s: Strategy,
  challenge: string,
  basis: RankBasis,
  pool: Strategy[] = STRATEGIES,
): number {
  const within = pool.filter(
    (x) => !x.pending && x.challenges.includes(challenge),
  );
  return (
    [...within]
      .sort((a, b) => rankValue(b, basis) - rankValue(a, basis))
      .findIndex((x) => x.id === s.id) + 1
  );
}

/**
 * The single strongest badge to show on a card: a top-three placing, preferring
 * the board-wide ranking and falling back to the strategy's main challenge.
 */
export function badgeFor(
  s: Strategy,
  basis: RankBasis,
  pool: Strategy[] = STRATEGIES,
): { text: string; strong: boolean } | null {
  const overall = rankOf(s.id, basis, pool);
  const basisLabel = RANK_BASES.find(
    (b) => b.id === basis,
  )!.short.toLowerCase();
  if (overall > 0 && overall <= 3) {
    return {
      text: `#${overall} most ${basisLabel} on the board`,
      strong: true,
    };
  }
  for (const challenge of s.challenges) {
    if (rankInChallenge(s, challenge, basis, pool) === 1) {
      return {
        text: `#1 most ${basisLabel} · ${shortChallenge(challenge)}`,
        strong: false,
      };
    }
  }
  return null;
}

/** "I keep missing deadlines" → "Deadlines" */
export function shortChallenge(challenge: string): string {
  const map: Record<string, string> = {
    [CHALLENGES[0]]: "Deadlines",
    [CHALLENGES[1]]: "Announcements",
    [CHALLENGES[2]]: "Readings",
    [CHALLENGES[3]]: "Notifications",
    [CHALLENGES[4]]: "Group work",
    [CHALLENGES[5]]: "Communication",
    [CHALLENGES[6]]: "Before classes",
  };
  return map[challenge] ?? challenge;
}

// ── Filtering ─────────────────────────────────────────────────────────────────

export type SortId = RankBasis | "relevance" | "az";

export const SORTS: Array<{ id: SortId; label: string }> = [
  { id: "liked", label: "Most liked" },
  { id: "saved", label: "Most saved" },
  { id: "az", label: "A to Z" },
];

export interface Filters {
  challenge: string | null;
  program: string;
  courseType: string | null;
  query: string;
  sort: SortId;
}

export function filterStrategies(
  f: Filters,
  pool: Strategy[] = STRATEGIES,
): Strategy[] {
  const narrowed = pool.filter((s) => {
    if (f.challenge && !s.challenges.includes(f.challenge)) return false;
    if (f.program !== ALL_PROGRAMS && s.program !== f.program) return false;
    if (f.courseType && !s.courseTypes.includes(f.courseType)) return false;
    return true;
  });

  if (f.query.trim()) {
    // Relevance order wins while a query is active; an explicit A-Z choice is
    // still honoured because that is a deliberate reordering.
    const hits = searchStrategies(narrowed, f.query);
    const ordered = hits.map((h) => h.strategy);
    return f.sort === "az"
      ? [...ordered].sort((a, b) => a.title.localeCompare(b.title))
      : ordered;
  }

  const sorted = [...narrowed];
  if (f.sort === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));
  else
    sorted.sort(
      (a, b) =>
        rankValue(b, f.sort as RankBasis) - rankValue(a, f.sort as RankBasis),
    );
  return sorted;
}

export function countsByChallenge(pool: Strategy[] = STRATEGIES) {
  return Object.fromEntries(
    CHALLENGES.map((c) => [
      c,
      pool.filter((s) => s.challenges.includes(c)).length,
    ]),
  ) as Record<string, number>;
}

export function boardStats(pool: Strategy[] = STRATEGIES) {
  const tried = pool.reduce((n, s) => n + s.tried, 0);
  const stillUsing = pool.reduce((n, s) => n + s.stillUsing, 0);
  return {
    strategies: pool.length,
    tried,
    stillUsing,
    keptPct: tried ? Math.round((stillUsing / tried) * 100) : 0,
    programs: new Set(pool.map((s) => s.program)).size,
  };
}
