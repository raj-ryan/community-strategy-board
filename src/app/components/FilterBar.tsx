import { Search, X } from "lucide-react";
import {
  ALL_PROGRAMS,
  CHALLENGES,
  COURSE_TYPES,
  shortChallenge,
} from "../data";
import { ProgramPicker } from "./ProgramPicker";
import { UW, R, TYPE, CONTROL_BOX, FONT_SANS } from "../uw";

// One question, one row of answers, and two quiet dropdowns.
//
// The chips are the problems students named most often, not a full taxonomy, so
// search sits above them for everything they do not cover.

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
}) {
  return (
    <section>
      <div
        className="flex items-center gap-2.5 px-4"
        style={{
          backgroundColor: UW.card,
          border: `1px solid ${query ? UW.purpleLine : UW.line}`,
          borderRadius: R.control,
        }}
      >
        <Search size={16} style={{ color: query ? UW.purple : UW.inkSubtle }} />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search for a tool, a problem, or how you would describe it"
          aria-label="Search strategies"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "12px 0",
            ...TYPE.boardDescription,
            fontSize: 15,
            fontFamily: FONT_SANS,
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            color: UW.ink,
          }}
        />
        {query && (
          <button onClick={() => onQuery("")} aria-label="Clear search">
            <X size={15} style={{ color: UW.inkSubtle }} />
          </button>
        )}
      </div>

      <h2 className="mt-7" style={{ ...TYPE.sectionQuestion, color: UW.ink }}>
        What&rsquo;s hardest right now?
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {CHALLENGES.map((c) => {
          const active = challenge === c;
          return (
            <button
              key={c}
              onClick={() => onChallenge(active ? null : c)}
              aria-pressed={active}
              title={c}
              className="transition-colors"
              style={{
                ...TYPE.chip,
                fontWeight: active ? 600 : 500,
                padding: "8px 15px",
                borderRadius: R.chip,
                backgroundColor: active ? UW.purple : UW.card,
                color: active ? UW.white : UW.inkMid,
                border: `1px solid ${active ? UW.purple : UW.line}`,
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = UW.band;
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = UW.card;
              }}
            >
              {shortChallenge(c)}
              <span
                style={{
                  fontWeight: 400,
                  color: active ? UW.goldLine : UW.inkSubtle,
                }}
              >
                {"  "}
                {counts[c] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
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
            ...CONTROL_BOX,
            fontWeight: courseType ? 600 : CONTROL_BOX.fontWeight,
            backgroundColor: UW.card,
            color: courseType ? UW.purple : UW.inkMid,
            border: `1px solid ${courseType ? UW.purpleLine : UW.line}`,
          }}
        >
          <option value="">All course types</option>
          {COURSE_TYPES.map((ct) => (
            <option key={ct} value={ct}>
              {ct}
            </option>
          ))}
        </select>

        {(challenge || courseType || program !== ALL_PROGRAMS || query) && (
          <button
            onClick={() => {
              onChallenge(null);
              onCourseType(null);
              onProgram(ALL_PROGRAMS);
              onQuery("");
            }}
            className="flex items-center gap-1.5 hover:underline"
            style={{ ...TYPE.meta, color: UW.inkMuted }}
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>
    </section>
  );
}
