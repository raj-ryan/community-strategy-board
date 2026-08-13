import { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  Search,
  CalendarClock,
  Megaphone,
  BookOpen,
  BellRing,
  Users,
  MessagesSquare,
  CalendarCheck,
} from "lucide-react";
import { CHALLENGES, COURSE_TYPES, shortChallenge } from "../data";
import { ProgramPicker } from "./ProgramPicker";
import { UW, FONT_SANS } from "../uw";

// Search first, categories as shortcuts.
//
// The seven difficulties are the problems students described most often, not a
// taxonomy that covers everything on the board — the same way a map app offers
// petrol and coffee as chips while expecting most people to type what they
// actually want. So search is the primary control and the chips sit under it,
// small enough to ignore.

const META: Record<string, { icon: typeof CalendarClock }> = {
  [CHALLENGES[0]]: { icon: CalendarClock },
  [CHALLENGES[1]]: { icon: Megaphone },
  [CHALLENGES[2]]: { icon: BookOpen },
  [CHALLENGES[3]]: { icon: BellRing },
  [CHALLENGES[4]]: { icon: Users },
  [CHALLENGES[5]]: { icon: MessagesSquare },
  [CHALLENGES[6]]: { icon: CalendarCheck },
};

export function FilterBar({
  challenge,
  program,
  courseType,
  query,
  counts,
  programCounts,
  programTotal,
  onChallenge,
  onProgram,
  onCourseType,
  onQuery,
  onClear,
  anyActive,
}: {
  challenge: string | null;
  program: string;
  courseType: string | null;
  query: string;
  counts: Record<string, number>;
  programCounts: Record<string, number>;
  programTotal: number;
  onChallenge: (c: string | null) => void;
  onProgram: (p: string) => void;
  onCourseType: (ct: string | null) => void;
  onQuery: (q: string) => void;
  onClear: () => void;
  anyActive: boolean;
}) {
  return (
    <section
      className="flex flex-col gap-2.5 p-3"
      style={{
        border: `1px solid ${UW.line}`,
        borderTop: `3px solid ${UW.purple}`,
        backgroundColor: UW.white,
      }}
    >
      {/* Search and the two narrowing controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex min-w-[240px] flex-1 items-center gap-2"
          style={{
            border: `1px solid ${query ? UW.purple : UW.line}`,
            padding: "7px 11px",
          }}
        >
          <Search
            size={15}
            style={{ color: query ? UW.purple : UW.inkSubtle }}
          />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search strategies — a tool, a problem, or how you would describe it"
            aria-label="Search strategies"
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: 13.5,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontFamily: FONT_SANS,
              color: UW.ink,
            }}
          />
          {query && (
            <button onClick={() => onQuery("")} aria-label="Clear search">
              <X size={13} style={{ color: UW.inkSubtle }} />
            </button>
          )}
        </div>

        <ProgramPicker
          program={program}
          counts={programCounts}
          totalCount={programTotal}
          onChange={onProgram}
        />

        <select
          value={courseType ?? ""}
          onChange={(e) => onCourseType(e.target.value || null)}
          aria-label="Course type"
          style={{
            fontSize: 12.5,
            padding: "7px 8px",
            fontFamily: FONT_SANS,
            backgroundColor: UW.white,
            color: courseType ? UW.purple : UW.inkMid,
            fontWeight: courseType ? 700 : 500,
            border: `1px solid ${courseType ? UW.purple : UW.line}`,
            outline: "none",
          }}
        >
          <option value="">Any course type</option>
          {COURSE_TYPES.map((ct) => (
            <option key={ct} value={ct}>
              {ct}
            </option>
          ))}
        </select>
      </div>

      {/* Shortcuts, on one line */}
      <div className="flex items-center gap-2">
        <span
          className="flex-shrink-0 font-bold uppercase"
          style={{ fontSize: 9, letterSpacing: "0.1em", color: UW.inkSubtle }}
        >
          Common problems
        </span>

        <ChipRail>
          {CHALLENGES.map((c) => (
            <Chip
              key={c}
              challenge={c}
              count={counts[c] ?? 0}
              active={challenge === c}
              onClick={() => onChallenge(challenge === c ? null : c)}
            />
          ))}
        </ChipRail>

        {anyActive && (
          <button
            onClick={onClear}
            className="flex flex-shrink-0 items-center gap-1 hover:underline"
            style={{ fontSize: 11.5, fontWeight: 600, color: UW.purple }}
          >
            <X size={11} />
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
}

/**
 * Keeps the shortcuts on one line at any width. Fades mark the edge that has
 * more behind it, and a vertical wheel scrolls sideways so a mouse without a
 * horizontal wheel is not stuck.
 */
function ChipRail({ children }: { children: React.ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth;
    // When the rail stops overflowing — a wider window, or a filter that
    // shortens it — the browser clamps scrollLeft without firing a scroll
    // event, so the fades have to be cleared here rather than inferred.
    if (overflow <= 4) {
      setEdges({ left: false, right: false });
      return;
    }
    const left = Math.min(el.scrollLeft, overflow);
    setEdges({ left: left > 4, right: left < overflow - 4 });
  }, []);

  useEffect(() => {
    measure();
    const el = rail.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div className="relative min-w-0 flex-1">
      <div
        ref={rail}
        className="csb-rail flex items-center gap-1.5 overflow-x-auto"
        style={{ scrollbarWidth: "none", scrollSnapType: "x proximity" }}
        onScroll={measure}
        onWheel={(e) => {
          const el = rail.current;
          if (!el || el.scrollWidth <= el.clientWidth) return;
          if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
          el.scrollLeft += e.deltaY;
        }}
      >
        {children}
      </div>

      {edges.left && <Fade side="left" />}
      {edges.right && <Fade side="right" />}
    </div>
  );
}

function Fade({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0"
      style={{
        [side]: 0,
        width: 28,
        background: `linear-gradient(to ${side === "left" ? "right" : "left"}, ${
          UW.white
        }, rgba(255,255,255,0))`,
      }}
    />
  );
}

function Chip({
  challenge,
  count,
  active,
  onClick,
}: {
  challenge: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const { icon: Icon } = META[challenge];

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      title={challenge}
      className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap transition-colors"
      style={{
        padding: "4px 9px",
        scrollSnapAlign: "start",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: active ? 700 : 500,
        backgroundColor: active ? UW.purple : UW.white,
        color: active ? UW.white : UW.inkMid,
        border: `1px solid ${active ? UW.purple : UW.line}`,
      }}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.backgroundColor = UW.purpleTint;
        e.currentTarget.style.borderColor = UW.purpleLine;
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.backgroundColor = UW.white;
        e.currentTarget.style.borderColor = UW.line;
      }}
    >
      <Icon
        size={12}
        strokeWidth={2}
        style={{ color: active ? UW.gold : UW.purple }}
      />
      {shortChallenge(challenge)}
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: active ? UW.gold : UW.inkSubtle,
        }}
      >
        {count}
      </span>
    </button>
  );
}
