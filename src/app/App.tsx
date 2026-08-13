import { useMemo, useState } from "react";
import { Search, X, LayoutGrid, ListOrdered, Info } from "lucide-react";
import {
  ALL_PROGRAMS, SORTS, STRATEGIES, boardStats, countsByChallenge,
  filterStrategies, seedCommentsFor, shortChallenge, suggestionsFor,
  type Comment, type CommentKind, type RankBasis, type SortId, type Strategy,
} from "./data";
import { UW, FONT_SANS, FONT_SERIF } from "./uw";
import { StrategyCard } from "./components/StrategyCard";
import { StrategyModal, type CurrentUser } from "./components/StrategyModal";
import { FilterBar } from "./components/FilterBar";
import { RankingTable } from "./components/RankingTable";
import { AboutPage } from "./components/AboutPage";
import { Masthead, Footer, type View } from "./components/SiteChrome";
import {
  MyQuarterPanel, RankingPanel, SupportPanel, HowItWorksPanel,
} from "./components/Sidebar";
import { ShareModal } from "./components/ShareModal";

// The signed-in student. Comments and contributions are attributed to this
// person unless they choose to post anonymously.
const USER: CurrentUser = {
  name: "You",
  program: "Human Centered Design & Engineering (MS)",
  year: "Year 1",
};

/** Cards shown before the board is filtered, so the first screen is choosable. */
const PREVIEW_COUNT = 9;

export default function App() {
  const [view, setView] = useState<View>("board");
  const [layout, setLayout] = useState<"cards" | "table">("cards");

  const [challenge, setChallenge] = useState<string | null>(null);
  const [program, setProgram] = useState<string>(ALL_PROGRAMS);
  const [courseType, setCourseType] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("kept");
  const [rankBasis, setRankBasis] = useState<RankBasis>("kept");
  const [showAll, setShowAll] = useState(false);

  const [strategies, setStrategies] = useState<Strategy[]>(STRATEGIES);
  const [saved, setSaved] = useState<number[]>([]);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [thanked, setThanked] = useState<Set<number>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [threads, setThreads] = useState<Record<number, Comment[]>>(() =>
    Object.fromEntries(STRATEGIES.map(s => [s.id, seedCommentsFor(s.id)])),
  );

  const [openId, setOpenId] = useState<number | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const filtersActive =
    challenge !== null || program !== ALL_PROGRAMS || courseType !== null || query.trim() !== "";

  const results = useMemo(
    () => filterStrategies({ challenge, program, courseType, query, sort }, strategies),
    [challenge, program, courseType, query, sort, strategies],
  );

  const visible = filtersActive || showAll ? results : results.slice(0, PREVIEW_COUNT);
  const stats = useMemo(() => boardStats(strategies), [strategies]);
  const counts = useMemo(() => countsByChallenge(strategies), [strategies]);

  const commentCounts = useMemo(() => {
    const out: Record<number, number> = {};
    for (const [id, list] of Object.entries(threads)) {
      out[Number(id)] = list.reduce((n, c) => n + 1 + c.replies.length, 0);
    }
    return out;
  }, [threads]);

  const open = openId === null ? null : strategies.find(s => s.id === openId) ?? null;

  /** Applies the viewer's own comment likes on top of the stored counts. */
  const openThread = useMemo(() => {
    if (!open) return [];
    const bump = (n: number, id: string) => n + (likedComments.has(id) ? 1 : 0);
    return (threads[open.id] ?? []).map(c => ({
      ...c,
      likes: bump(c.likes, c.id),
      replies: c.replies.map(r => ({ ...r, likes: bump(r.likes, r.id) })),
    }));
  }, [open, threads, likedComments]);

  function toggle<T>(set: Set<T>, value: T) {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  }

  function clearFilters() {
    setChallenge(null);
    setProgram(ALL_PROGRAMS);
    setCourseType(null);
    setQuery("");
  }

  function toggleSave(id: number) {
    setSaved(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }

  function postComment(
    strategyId: number,
    input: { kind: CommentKind; body: string; outcome?: Comment["outcome"]; anonymous: boolean },
  ) {
    const entry: Comment = {
      id: `own-${Date.now()}`,
      kind: input.kind,
      outcome: input.outcome,
      author: input.anonymous ? null : USER.name,
      program: USER.program.replace(/\s*\([^)]*\)\s*$/, ""),
      year: USER.year,
      when: "Just now",
      body: input.body,
      likes: 0,
      replies: [],
    };
    setThreads(prev => ({ ...prev, [strategyId]: [entry, ...(prev[strategyId] ?? [])] }));
  }

  function postReply(strategyId: number, commentId: string, body: string, anonymous: boolean) {
    setThreads(prev => ({
      ...prev,
      [strategyId]: (prev[strategyId] ?? []).map(c =>
        c.id !== commentId
          ? c
          : {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `own-${Date.now()}`,
                  author: anonymous ? null : USER.name,
                  program: USER.program.replace(/\s*\([^)]*\)\s*$/, ""),
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

  function addStrategy(s: Strategy) {
    setStrategies(prev => [s, ...prev]);
    setThreads(prev => ({ ...prev, [s.id]: [] }));
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: UW.white, fontFamily: FONT_SANS, color: UW.ink }}
    >
      <GlobalStyle />
      <Masthead view={view} onView={setView} onShare={() => setShareOpen(true)} />

      {view === "about" ? (
        <AboutPage onBack={() => setView("board")} onShare={() => setShareOpen(true)} />
      ) : (
        <>
          {/* Compact introduction */}
          <div style={{ backgroundColor: UW.band, borderBottom: `1px solid ${UW.line}` }}>
            <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-6 py-3">
              <p style={{ fontSize: 13.5, lineHeight: "20px", color: UW.inkMid, maxWidth: 680 }}>
                Practical strategies for UW course systems, written by graduate students who
                have already worked them out.{" "}
                <button
                  onClick={() => setView("about")}
                  className="font-semibold hover:underline"
                  style={{ color: UW.purple }}
                >
                  How this works
                </button>
              </p>
              <dl
                className="flex flex-wrap items-center gap-x-5 gap-y-1"
                style={{ fontSize: 12, color: UW.inkMuted }}
              >
                <Fact value={stats.strategies} label="strategies" />
                <Fact value={stats.programs} label="programs" />
                <Fact value={stats.tried.toLocaleString()} label="times tried" />
                <Fact value={`${stats.keptPct}%`} label="kept using" />
              </dl>
            </div>
          </div>

          <div className="mx-auto max-w-[1280px] px-6 py-6">
            <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
              <main className="min-w-0">
                <FilterBar
                  challenge={challenge}
                  program={program}
                  courseType={courseType}
                  counts={counts}
                  onChallenge={c => {
                    setChallenge(c);
                    setShowAll(false);
                  }}
                  onProgram={setProgram}
                  onCourseType={setCourseType}
                  onClear={clearFilters}
                  anyActive={filtersActive}
                />

                {/* Results toolbar */}
                <div
                  className="mt-5 flex flex-wrap items-center justify-between gap-3 pb-2.5"
                  style={{ borderBottom: `2px solid ${UW.purple}` }}
                >
                  <p style={{ fontSize: 13, color: UW.inkMid }}>
                    <span style={{ fontWeight: 700, color: UW.purple }}>{results.length}</span>{" "}
                    {results.length === 1 ? "strategy" : "strategies"}
                    {challenge && (
                      <>
                        {" "}for <strong>{shortChallenge(challenge)}</strong>
                      </>
                    )}
                    {program !== ALL_PROGRAMS && (
                      <>
                        {" "}in <strong>{program}</strong>
                      </>
                    )}
                    {query.trim() && (
                      <>
                        {" "}matching <strong>“{query.trim()}”</strong>
                      </>
                    )}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      className="flex items-center gap-2"
                      style={{ border: `1px solid ${UW.line}`, padding: "5px 9px" }}
                    >
                      <Search size={13} style={{ color: UW.inkSubtle }} />
                      <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search strategies"
                        aria-label="Search strategies"
                        style={{
                          fontSize: 12.5,
                          border: "none",
                          outline: "none",
                          width: 168,
                          backgroundColor: "transparent",
                          fontFamily: FONT_SANS,
                        }}
                      />
                      {query && (
                        <button onClick={() => setQuery("")} aria-label="Clear search">
                          <X size={12} style={{ color: UW.inkSubtle }} />
                        </button>
                      )}
                    </div>

                    <select
                      value={sort}
                      onChange={e => setSort(e.target.value as SortId)}
                      aria-label="Sort strategies"
                      style={{
                        fontSize: 12.5,
                        padding: "6px 8px",
                        border: `1px solid ${UW.line}`,
                        backgroundColor: UW.white,
                        color: UW.ink,
                        fontFamily: FONT_SANS,
                        outline: "none",
                      }}
                    >
                      {SORTS.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>

                    <div className="flex">
                      {(
                        [
                          ["cards", <LayoutGrid key="g" size={13} />, "Card view"],
                          ["table", <ListOrdered key="l" size={13} />, "Ranking table"],
                        ] as Array<["cards" | "table", React.ReactNode, string]>
                      ).map(([id, icon, label]) => (
                        <button
                          key={id}
                          onClick={() => setLayout(id)}
                          aria-label={label}
                          aria-pressed={layout === id}
                          className="flex items-center justify-center"
                          style={{
                            padding: "7px 10px",
                            marginLeft: -1,
                            backgroundColor: layout === id ? UW.purple : UW.white,
                            color: layout === id ? UW.white : UW.inkMuted,
                            border: `1px solid ${layout === id ? UW.purple : UW.line}`,
                          }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                {results.length === 0 ? (
                  <EmptyState
                    query={query}
                    suggestions={suggestionsFor(strategies, query)}
                    onClear={clearFilters}
                    onOpen={setOpenId}
                  />
                ) : layout === "table" ? (
                  <div className="mt-5">
                    <RankingTable
                      pool={results}
                      basis={rankBasis}
                      onBasis={setRankBasis}
                      savedIds={saved}
                      likedIds={[...liked]}
                      commentCounts={commentCounts}
                      onOpen={setOpenId}
                    />
                  </div>
                ) : (
                  <>
                    <div className="mt-5 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {visible.map(s => (
                        <StrategyCard
                          key={s.id}
                          strategy={s}
                          saved={saved.includes(s.id)}
                          liked={liked.has(s.id)}
                          commentCount={commentCounts[s.id] ?? 0}
                          rankBasis={rankBasis}
                          onOpen={() => setOpenId(s.id)}
                          onToggleSave={() => toggleSave(s.id)}
                          onToggleLike={() => setLiked(prev => toggle(prev, s.id))}
                        />
                      ))}
                    </div>

                    {!filtersActive && !showAll && results.length > PREVIEW_COUNT && (
                      <div
                        className="mt-5 flex flex-wrap items-center justify-between gap-3 p-4"
                        style={{ backgroundColor: UW.band, border: `1px solid ${UW.line}` }}
                      >
                        <p
                          className="flex items-center gap-2"
                          style={{ fontSize: 13, color: UW.inkMid }}
                        >
                          <Info size={14} style={{ color: UW.purple }} />
                          Showing the {PREVIEW_COUNT} strategies most students kept using.
                          Choose what you need help with to narrow the board.
                        </p>
                        <button
                          onClick={() => setShowAll(true)}
                          className="font-semibold"
                          style={{
                            fontSize: 12.5,
                            padding: "8px 16px",
                            color: UW.purple,
                            border: `1px solid ${UW.purple}`,
                          }}
                        >
                          Show all {results.length} strategies
                        </button>
                      </div>
                    )}
                  </>
                )}
              </main>

              <aside className="flex flex-col gap-4 lg:sticky lg:top-5">
                <MyQuarterPanel
                  saved={saved
                    .map(id => strategies.find(s => s.id === id))
                    .filter((s): s is Strategy => Boolean(s))}
                  total={stats.strategies}
                  onRemove={toggleSave}
                  onOpen={setOpenId}
                />
                <RankingPanel
                  pool={strategies}
                  basis={rankBasis}
                  onBasis={setRankBasis}
                  onOpen={setOpenId}
                  onSeeAll={() => {
                    setLayout("table");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
                <HowItWorksPanel />
                <SupportPanel />
              </aside>
            </div>
          </div>
        </>
      )}

      <Footer onShare={() => setShareOpen(true)} onAbout={() => setView("about")} />

      {open && (
        <StrategyModal
          strategy={open}
          comments={openThread}
          saved={saved.includes(open.id)}
          liked={liked.has(open.id)}
          thanked={thanked.has(open.id)}
          rankBasis={rankBasis}
          user={USER}
          onClose={() => setOpenId(null)}
          onToggleSave={() => toggleSave(open.id)}
          onToggleLike={() => setLiked(prev => toggle(prev, open.id))}
          onThank={() => setThanked(prev => new Set(prev).add(open.id))}
          onPost={input => postComment(open.id, input)}
          onReply={(commentId, body, anonymous) =>
            postReply(open.id, commentId, body, anonymous)
          }
          onLikeComment={id => setLikedComments(prev => toggle(prev, id))}
        />
      )}

      {shareOpen && (
        <ShareModal
          nextId={Math.max(...strategies.map(s => s.id)) + 1}
          onClose={() => setShareOpen(false)}
          onSubmit={addStrategy}
          onOpenSubmission={setOpenId}
        />
      )}
    </div>
  );
}

// ── Pieces ────────────────────────────────────────────────────────────────────

function Fact({ value, label }: { value: string | number; label: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <dd style={{ fontFamily: FONT_SERIF, fontSize: 17, fontWeight: 600, color: UW.purple }}>
        {value}
      </dd>
      <dt>{label}</dt>
    </span>
  );
}

function EmptyState({
  query,
  suggestions,
  onClear,
  onOpen,
}: {
  query: string;
  suggestions: Strategy[];
  onClear: () => void;
  onOpen: (id: number) => void;
}) {
  return (
    <div
      className="mt-5 px-6 py-12 text-center"
      style={{ backgroundColor: UW.band, border: `1px dashed ${UW.line}` }}
    >
      <p style={{ fontSize: 15, fontWeight: 600, color: UW.ink }}>
        Nothing matches {query.trim() ? `“${query.trim()}”` : "this combination"} yet.
      </p>

      {suggestions.length > 0 ? (
        <>
          <p className="mt-1" style={{ fontSize: 13, color: UW.inkMuted }}>
            The closest strategies on the board:
          </p>
          <ul className="mx-auto mt-3 flex max-w-md flex-col gap-1.5">
            {suggestions.map(s => (
              <li key={s.id}>
                <button
                  onClick={() => onOpen(s.id)}
                  className="w-full px-3 py-2 text-left font-semibold hover:underline"
                  style={{
                    fontSize: 13,
                    color: UW.purple,
                    backgroundColor: UW.white,
                    border: `1px solid ${UW.line}`,
                  }}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-1" style={{ fontSize: 13, color: UW.inkMuted }}>
          Try a different word, or clear the filters and browse by what you need help with.
        </p>
      )}

      <button
        onClick={onClear}
        className="mt-5 font-semibold"
        style={{ padding: "9px 18px", fontSize: 12.5, color: UW.white, backgroundColor: UW.purple }}
      >
        Clear all filters
      </button>
    </div>
  );
}

/** Keyframes and one scrollbar rule that Tailwind utilities cannot express. */
function GlobalStyle() {
  return (
    <style>{`
      @keyframes csbFade { from { opacity: 0 } to { opacity: 1 } }
      @keyframes csbFlipIn {
        from { opacity: 0; transform: perspective(1800px) rotateY(-78deg) scale(.9); }
        60%  { opacity: 1; }
        to   { opacity: 1; transform: perspective(1800px) rotateY(0deg) scale(1); }
      }
      @media (prefers-reduced-motion: reduce) {
        @keyframes csbFlipIn { from { opacity: 0 } to { opacity: 1 } }
      }
      .csb-rail::-webkit-scrollbar { display: none; }
    `}</style>
  );
}
