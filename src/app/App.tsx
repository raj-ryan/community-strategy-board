import { useMemo, useState } from "react";
import { X, Bookmark } from "lucide-react";
import {
  ALL_PROGRAMS,
  STRATEGIES,
  countsByChallenge,
  filterStrategies,
  seedCommentsFor,
  shortChallenge,
  shortProgram,
  suggestionsFor,
  type Comment,
  type CommentKind,
  type RankBasis,
  type Strategy,
} from "./data";
import { UW, R, TYPE, FONT_SANS } from "./uw";
import { StrategyCard } from "./components/StrategyCard";
import {
  DiscussionPanel,
  type CurrentUser,
} from "./components/DiscussionPanel";
import { FilterBar } from "./components/FilterBar";
import { TopStrategiesPage } from "./components/TopStrategiesPage";
import { AboutPage } from "./components/AboutPage";
import { Masthead, Footer, type View } from "./components/SiteChrome";
import { ShareModal } from "./components/ShareModal";

const USER: CurrentUser = {
  name: "You",
  program: "Human Centered Design & Engineering (MS)",
  year: "Year 1",
};

/** Shown before anything is filtered, so the first screen stays choosable. */
const PREVIEW_COUNT = 6;

export default function App() {
  const [view, setView] = useState<View>("board");

  const [challenge, setChallenge] = useState<string | null>(null);
  const [program, setProgram] = useState<string>(ALL_PROGRAMS);
  const [courseType, setCourseType] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [rankBasis, setRankBasis] = useState<RankBasis>("liked");
  const [showAll, setShowAll] = useState(false);

  const [strategies, setStrategies] = useState<Strategy[]>(STRATEGIES);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<number[]>([]);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [thanked, setThanked] = useState<Set<number>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [threads, setThreads] = useState<Record<number, Comment[]>>(() =>
    Object.fromEntries(STRATEGIES.map((s) => [s.id, seedCommentsFor(s.id)])),
  );

  const [discussId, setDiscussId] = useState<number | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const filtersActive =
    challenge !== null ||
    program !== ALL_PROGRAMS ||
    courseType !== null ||
    query.trim() !== "";

  const results = useMemo(
    () =>
      filterStrategies(
        { challenge, program, courseType, query, sort: "saved" },
        strategies,
      ),
    [challenge, program, courseType, query, strategies],
  );

  const programCounts = useMemo(() => {
    const pool = filterStrategies(
      { challenge, program: ALL_PROGRAMS, courseType, query, sort: "saved" },
      strategies,
    );
    const counts: Record<string, number> = {};
    for (const s of pool) counts[s.program] = (counts[s.program] ?? 0) + 1;
    return { counts, total: pool.length };
  }, [challenge, courseType, query, strategies]);

  const visible =
    filtersActive || showAll ? results : results.slice(0, PREVIEW_COUNT);
  const counts = useMemo(() => countsByChallenge(strategies), [strategies]);

  const commentCounts = useMemo(() => {
    const out: Record<number, number> = {};
    for (const [id, list] of Object.entries(threads)) {
      out[Number(id)] = list.reduce((n, c) => n + 1 + c.replies.length, 0);
    }
    return out;
  }, [threads]);

  const discussing =
    discussId === null
      ? null
      : (strategies.find((s) => s.id === discussId) ?? null);

  const discussThread = useMemo(() => {
    if (!discussing) return [];
    const add = (n: number, id: string) => n + (likedComments.has(id) ? 1 : 0);
    return (threads[discussing.id] ?? []).map((c) => ({
      ...c,
      likes: add(c.likes, c.id),
      replies: c.replies.map((r) => ({ ...r, likes: add(r.likes, r.id) })),
    }));
  }, [discussing, threads, likedComments]);

  const savedStrategies = saved
    .map((id) => strategies.find((s) => s.id === id))
    .filter((s): s is Strategy => Boolean(s));

  function toggle<T>(set: Set<T>, value: T) {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  }

  /** Keeps a counter consistent everywhere it is shown. */
  function bump(id: number, field: "likes" | "saves", delta: number) {
    setStrategies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: s[field] + delta } : s)),
    );
  }

  function toggleSave(id: number) {
    const isSaved = saved.includes(id);
    setSaved((prev) =>
      isSaved ? prev.filter((x) => x !== id) : [...prev, id],
    );
    bump(id, "saves", isSaved ? -1 : 1);
  }

  function toggleLike(id: number) {
    const isLiked = liked.has(id);
    setLiked((prev) => toggle(prev, id));
    bump(id, "likes", isLiked ? -1 : 1);
  }

  /** Used by the ranking page, My Quarter and a fresh submission. */
  function openStrategy(id: number) {
    setView("board");
    setShowAll(true);
    setFlipped((prev) => new Set(prev).add(id));
    requestAnimationFrame(() =>
      document
        .getElementById(`strategy-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  }

  function postComment(
    strategyId: number,
    input: { kind: CommentKind; body: string; anonymous: boolean },
  ) {
    const entry: Comment = {
      id: `own-${Date.now()}`,
      kind: input.kind,
      author: input.anonymous ? null : USER.name,
      program: shortProgram(USER.program),
      year: USER.year,
      when: "Just now",
      body: input.body,
      likes: 0,
      replies: [],
    };
    setThreads((prev) => ({
      ...prev,
      [strategyId]: [entry, ...(prev[strategyId] ?? [])],
    }));
  }

  function postReply(
    strategyId: number,
    commentId: string,
    body: string,
    anonymous: boolean,
  ) {
    setThreads((prev) => ({
      ...prev,
      [strategyId]: (prev[strategyId] ?? []).map((c) =>
        c.id !== commentId
          ? c
          : {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `own-${Date.now()}`,
                  author: anonymous ? null : USER.name,
                  program: shortProgram(USER.program),
                  year: USER.year,
                  when: "Just now",
                  body,
                  likes: 0,
                },
              ],
            },
      ),
    }));
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: UW.paper,
        fontFamily: FONT_SANS,
        color: UW.ink,
      }}
    >
      <GlobalStyle />
      <Masthead
        view={view}
        onView={setView}
        onShare={() => setShareOpen(true)}
      />

      {view === "about" && (
        <AboutPage
          onBack={() => setView("board")}
          onShare={() => setShareOpen(true)}
        />
      )}

      {view === "top" && (
        <TopStrategiesPage
          pool={strategies}
          basis={rankBasis}
          savedIds={saved}
          likedIds={[...liked]}
          onBasis={setRankBasis}
          onOpen={openStrategy}
        />
      )}

      {view === "board" && (
        <main className="mx-auto max-w-[1120px] px-6 py-8">
          <FilterBar
            challenge={challenge}
            program={program}
            courseType={courseType}
            query={query}
            counts={counts}
            programCounts={programCounts.counts}
            programTotal={programCounts.total}
            onChallenge={(c) => {
              setChallenge(c);
              setShowAll(false);
              setFlipped(new Set());
            }}
            onProgram={setProgram}
            onCourseType={setCourseType}
            onQuery={setQuery}
          />

          <p className="mt-8" style={{ ...TYPE.meta, color: UW.inkSubtle }}>
            {results.length} {results.length === 1 ? "strategy" : "strategies"}
            {challenge && ` for ${shortChallenge(challenge)}`}
            {program !== ALL_PROGRAMS && ` in ${shortProgram(program)}`}
            {query.trim() && ` matching “${query.trim()}”`}
          </p>

          {results.length === 0 ? (
            <EmptyState
              query={query}
              suggestions={suggestionsFor(strategies, query)}
              onOpen={openStrategy}
            />
          ) : (
            <>
              <div className="mt-4 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((s) => (
                  <div key={s.id} id={`strategy-${s.id}`} className="h-full">
                    <StrategyCard
                      strategy={s}
                      flipped={flipped.has(s.id)}
                      saved={saved.includes(s.id)}
                      liked={liked.has(s.id)}
                      thanked={thanked.has(s.id)}
                      commentCount={commentCounts[s.id] ?? 0}
                      onFlip={() => setFlipped((prev) => toggle(prev, s.id))}
                      onToggleSave={() => toggleSave(s.id)}
                      onToggleLike={() => toggleLike(s.id)}
                      onThank={() =>
                        setThanked((prev) => new Set(prev).add(s.id))
                      }
                      onDiscuss={() => setDiscussId(s.id)}
                    />
                  </div>
                ))}
              </div>

              {!filtersActive && !showAll && results.length > PREVIEW_COUNT && (
                <button
                  onClick={() => setShowAll(true)}
                  className="mx-auto mt-6 block transition-colors"
                  style={{
                    ...TYPE.chip,
                    fontWeight: 600,
                    padding: "11px 22px",
                    borderRadius: R.control,
                    color: UW.inkMid,
                    backgroundColor: UW.card,
                    border: `1px solid ${UW.line}`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = UW.band)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = UW.card)
                  }
                >
                  Show all {results.length} strategies
                </button>
              )}
            </>
          )}

          <MyQuarter
            saved={savedStrategies}
            onRemove={toggleSave}
            onOpen={openStrategy}
          />
        </main>
      )}

      <Footer onAbout={() => setView("about")} />

      {discussing && (
        <DiscussionPanel
          strategy={discussing}
          comments={discussThread}
          user={USER}
          onClose={() => setDiscussId(null)}
          onPost={(input) => postComment(discussing.id, input)}
          onReply={(commentId, body, anonymous) =>
            postReply(discussing.id, commentId, body, anonymous)
          }
          onLikeComment={(id) => setLikedComments((prev) => toggle(prev, id))}
        />
      )}

      {shareOpen && (
        <ShareModal
          nextId={Math.max(...strategies.map((s) => s.id)) + 1}
          onClose={() => setShareOpen(false)}
          onSubmit={(s) => {
            setStrategies((prev) => [s, ...prev]);
            setThreads((prev) => ({ ...prev, [s.id]: [] }));
          }}
          onOpenSubmission={openStrategy}
        />
      )}
    </div>
  );
}

// ── Pieces ────────────────────────────────────────────────────────────────────

function MyQuarter({
  saved,
  onRemove,
  onOpen,
}: {
  saved: Strategy[];
  onRemove: (id: number) => void;
  onOpen: (id: number) => void;
}) {
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2
          className="flex items-center gap-2"
          style={{ ...TYPE.sectionQuestion, color: UW.ink }}
        >
          <Bookmark size={17} style={{ color: UW.goldInk }} />
          My Quarter
        </h2>
        <p style={{ ...TYPE.meta, color: UW.inkSubtle }}>
          Strategies you want to try this quarter.
        </p>
      </div>

      {saved.length === 0 ? (
        <p
          className="mt-3 px-5 py-6"
          style={{
            ...TYPE.body,
            color: UW.inkSubtle,
            backgroundColor: UW.card,
            border: `1px dashed ${UW.line}`,
            borderRadius: R.card,
          }}
        >
          Nothing saved yet. Use the bookmark on any card.
        </p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {saved.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-3 py-2.5 pl-4 pr-2.5"
              style={{
                backgroundColor: UW.card,
                border: `1px solid ${UW.goldLine}`,
                borderRadius: R.card,
              }}
            >
              <button onClick={() => onOpen(s.id)} className="text-left">
                <span
                  className="block hover:underline"
                  style={{ ...TYPE.chip, fontWeight: 600, color: UW.ink }}
                >
                  {s.title}
                </span>
                <span
                  className="block"
                  style={{ ...TYPE.meta, color: UW.inkSubtle }}
                >
                  {shortProgram(s.program)}
                </span>
              </button>
              <button
                onClick={() => onRemove(s.id)}
                aria-label={`Remove ${s.title}`}
                style={{ color: UW.inkSubtle }}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EmptyState({
  query,
  suggestions,
  onOpen,
}: {
  query: string;
  suggestions: Strategy[];
  onOpen: (id: number) => void;
}) {
  return (
    <div
      className="mt-4 px-6 py-10"
      style={{
        backgroundColor: UW.card,
        border: `1px dashed ${UW.line}`,
        borderRadius: R.card,
      }}
    >
      <p style={{ ...TYPE.body, fontWeight: 600, color: UW.ink }}>
        Nothing matches{" "}
        {query.trim() ? `“${query.trim()}”` : "this combination"} yet.
      </p>
      {suggestions.length > 0 && (
        <>
          <p className="mt-1" style={{ ...TYPE.meta, color: UW.inkSubtle }}>
            The closest strategies on the board:
          </p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => onOpen(s.id)}
                  className="hover:underline"
                  style={{ ...TYPE.body, fontWeight: 600, color: UW.purple }}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @keyframes csbFade { from { opacity: 0 } to { opacity: 1 } }
      @keyframes csbSlideIn { from { transform: translateX(24px); opacity: .6 } to { transform: none; opacity: 1 } }
      @media (prefers-reduced-motion: reduce) {
        @keyframes csbSlideIn { from { opacity: 0 } to { opacity: 1 } }
      }
      ::selection { background: ${UW.purpleTint}; }
    `}</style>
  );
}
