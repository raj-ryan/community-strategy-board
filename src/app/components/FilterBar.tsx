import { X } from "lucide-react";
import { CHALLENGES, COURSE_TYPES, shortChallenge } from "../data";
import { ProgramPicker } from "./ProgramPicker";
import { UW, FONT_SANS } from "../uw";

// Compact filter bar: the difficulty you are facing, then the two narrowing
// controls. Programs live behind a searchable popover rather than a rail,
// because scanning thirty of them sideways is slower than typing three letters.

export function FilterBar({
  challenge,
  program,
  courseType,
  counts,
  programCounts,
  programTotal,
  onChallenge,
  onProgram,
  onCourseType,
  onClear,
  anyActive,
}: {
  challenge: string | null;
  program: string;
  courseType: string | null;
  counts: Record<string, number>;
  programCounts: Record<string, number>;
  programTotal: number;
  onChallenge: (c: string | null) => void;
  onProgram: (p: string) => void;
  onCourseType: (ct: string | null) => void;
  onClear: () => void;
  anyActive: boolean;
}) {
  return (
    <section
      style={{
        border: `1px solid ${UW.line}`,
        borderTop: `3px solid ${UW.purple}`,
      }}
    >
      {/* Challenge */}
      <div className="bg-white px-4 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold" style={{ fontSize: 14, color: UW.ink }}>
            What do you need help with?
          </h2>
          <div className="flex items-center gap-3">
            {anyActive && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 hover:underline"
                style={{ fontSize: 11.5, fontWeight: 600, color: UW.purple }}
              >
                <X size={11} />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {CHALLENGES.map((c) => {
            const active = challenge === c;
            return (
              <button
                key={c}
                onClick={() => onChallenge(active ? null : c)}
                aria-pressed={active}
                className="flex items-center gap-1.5 transition-colors"
                style={{
                  padding: "6px 11px",
                  fontSize: 12.5,
                  fontWeight: active ? 700 : 500,
                  backgroundColor: active ? UW.purple : UW.white,
                  color: active ? UW.white : UW.inkMid,
                  border: `1px solid ${active ? UW.purple : UW.line}`,
                  borderLeft: `3px solid ${active ? UW.gold : UW.line}`,
                }}
              >
                {shortChallenge(c)}
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: active ? UW.gold : UW.inkSubtle,
                  }}
                >
                  {counts[c] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Program and course type */}
      <div
        className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5"
        style={{ backgroundColor: UW.band, borderTop: `1px solid ${UW.line}` }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex-shrink-0 font-bold uppercase"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.1em",
              color: UW.inkMuted,
            }}
          >
            Program
          </span>
          <ProgramPicker
            program={program}
            counts={programCounts}
            totalCount={programTotal}
            onChange={onProgram}
          />
        </div>

        <label
          className="flex items-center gap-2"
          style={{ fontSize: 11, color: UW.inkMuted }}
        >
          <span
            className="font-bold uppercase"
            style={{ fontSize: 9.5, letterSpacing: "0.1em" }}
          >
            Course type
          </span>
          <select
            value={courseType ?? ""}
            onChange={(e) => onCourseType(e.target.value || null)}
            style={{
              fontSize: 12.5,
              padding: "6px 8px",
              fontFamily: FONT_SANS,
              backgroundColor: UW.white,
              color: UW.ink,
              border: `1px solid ${courseType ? UW.purple : UW.line}`,
              outline: "none",
            }}
          >
            <option value="">Any</option>
            {COURSE_TYPES.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
