import { useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  ALL_PROGRAMS, CHALLENGES, COURSE_TYPES, PROGRAM_GROUPS, shortChallenge,
} from "../data";
import { UW, FONT_SANS } from "../uw";

// Compact filter bar.
//
// Programs used to occupy four wrapped rows of chips. With thirty programs on
// the board that is most of a screen, so they now sit in one horizontal rail
// grouped by school, and the challenge chips keep the vertical space.

export function FilterBar({
  challenge,
  program,
  courseType,
  counts,
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
  onChallenge: (c: string | null) => void;
  onProgram: (p: string) => void;
  onCourseType: (ct: string | null) => void;
  onClear: () => void;
  anyActive: boolean;
}) {
  const rail = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) =>
    rail.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  return (
    <section style={{ border: `1px solid ${UW.line}`, borderTop: `3px solid ${UW.purple}` }}>
      {/* Challenge */}
      <div className="bg-white px-4 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold" style={{ fontSize: 14, color: UW.ink }}>
            What do you need help with?
          </h2>
          <div className="flex items-center gap-3">
            <label
              className="flex items-center gap-1.5"
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
                onChange={e => onCourseType(e.target.value || null)}
                style={{
                  fontSize: 12,
                  padding: "4px 6px",
                  fontFamily: FONT_SANS,
                  backgroundColor: UW.white,
                  color: UW.ink,
                  border: `1px solid ${courseType ? UW.purple : UW.line}`,
                  outline: "none",
                }}
              >
                <option value="">Any</option>
                {COURSE_TYPES.map(ct => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </label>
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
          {CHALLENGES.map(c => {
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

      {/* Program rail + course type */}
      <div
        className="flex flex-wrap items-center gap-3 px-4 py-2.5"
        style={{ backgroundColor: UW.band, borderTop: `1px solid ${UW.line}` }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span
            className="hidden flex-shrink-0 font-bold uppercase sm:block"
            style={{ fontSize: 9.5, letterSpacing: "0.1em", color: UW.inkMuted }}
          >
            Program
          </span>
          <RailButton dir={-1} onClick={() => scroll(-1)} />
          <div
            ref={rail}
            className="csb-rail flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth: "none", scrollSnapType: "x proximity" }}
          >
            <Pill
              label={ALL_PROGRAMS}
              active={program === ALL_PROGRAMS}
              onClick={() => onProgram(ALL_PROGRAMS)}
            />
            {PROGRAM_GROUPS.map(g => (
              <div key={g.school} className="flex flex-shrink-0 items-center gap-1.5">
                <span
                  className="flex-shrink-0 whitespace-nowrap font-bold uppercase"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.08em",
                    color: UW.inkSubtle,
                    paddingLeft: 6,
                    borderLeft: `1px solid ${UW.line}`,
                  }}
                  title={g.school}
                >
                  {g.short}
                </span>
                {g.programs.map(p => (
                  <Pill
                    key={p}
                    label={p}
                    active={program === p}
                    onClick={() => onProgram(program === p ? ALL_PROGRAMS : p)}
                  />
                ))}
              </div>
            ))}
          </div>
          <RailButton dir={1} onClick={() => scroll(1)} />
        </div>
      </div>
    </section>
  );
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="flex-shrink-0 whitespace-nowrap transition-colors"
      style={{
        padding: "5px 10px",
        fontSize: 11.5,
        fontWeight: active ? 700 : 500,
        backgroundColor: active ? UW.purple : UW.white,
        color: active ? UW.white : UW.inkMid,
        border: `1px solid ${active ? UW.purple : UW.line}`,
        scrollSnapAlign: "start",
      }}
    >
      {label}
    </button>
  );
}

function RailButton({ dir, onClick }: { dir: -1 | 1; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === -1 ? "Scroll programs left" : "Scroll programs right"}
      className="flex h-[26px] w-[22px] flex-shrink-0 items-center justify-center transition-colors hover:bg-white"
      style={{ border: `1px solid ${UW.line}`, color: UW.inkMuted, backgroundColor: UW.white }}
    >
      {dir === -1 ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
    </button>
  );
}
