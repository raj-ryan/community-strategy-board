import {
  X,
  CalendarClock,
  Megaphone,
  BookOpen,
  BellRing,
  Users,
  MessagesSquare,
  CalendarCheck,
  Check,
} from "lucide-react";
import { CHALLENGES, COURSE_TYPES, shortChallenge } from "../data";
import { ProgramPicker } from "./ProgramPicker";
import { UW, FONT_SANS, FONT_SERIF } from "../uw";

// Compact filter bar: the difficulty you are facing, then the two narrowing
// controls. Programs live behind a searchable popover rather than a rail,
// because scanning thirty of them sideways is slower than typing three letters.
//
// The difficulties are tiles rather than a word cloud. A cloud sizes words by
// frequency, which would tell a student that other people's problems are more
// important than theirs, gives uneven click targets, and reads as decoration on
// a University page. Tiles carry the same information — an icon to find it by,
// the problem in the student's own words, and how many strategies wait behind
// it — in a shape that is scannable and the same size for everyone.

const META: Record<string, { icon: typeof CalendarClock; blurb: string }> = {
  [CHALLENGES[0]]: { icon: CalendarClock, blurb: "Due dates you never saw" },
  [CHALLENGES[1]]: { icon: Megaphone, blurb: "Updates posted somewhere else" },
  [CHALLENGES[2]]: { icon: BookOpen, blurb: "Files scattered across courses" },
  [CHALLENGES[3]]: { icon: BellRing, blurb: "Alerts you stopped reading" },
  [CHALLENGES[4]]: { icon: Users, blurb: "Three chats, no decisions" },
  [CHALLENGES[5]]: {
    icon: MessagesSquare,
    blurb: "What counts as normal contact",
  },
  [CHALLENGES[6]]: { icon: CalendarCheck, blurb: "Work due before week one" },
};

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
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2.5">
            <h2
              className="font-semibold"
              style={{ fontFamily: FONT_SERIF, fontSize: 19, color: UW.purple }}
            >
              What do you need help with?
            </h2>
            <p style={{ fontSize: 12, color: UW.inkMuted }}>
              Pick one. The board narrows to what other students used for it.
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-3">
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

        <div className="mt-3 grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7">
          {CHALLENGES.map((c) => (
            <ChallengeTile
              key={c}
              challenge={c}
              count={counts[c] ?? 0}
              active={challenge === c}
              onClick={() => onChallenge(challenge === c ? null : c)}
            />
          ))}
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

function ChallengeTile({
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
  const { icon: Icon, blurb } = META[challenge];

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      title={challenge}
      className="group flex flex-col text-left transition-all"
      style={{
        padding: "9px 11px 10px",
        backgroundColor: active ? UW.purple : UW.white,
        border: `1px solid ${active ? UW.purple : UW.line}`,
        borderTop: `3px solid ${active ? UW.gold : UW.line}`,
        boxShadow: active ? "0 2px 10px rgba(57,39,91,0.22)" : "none",
      }}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.borderColor = UW.purpleLine;
        e.currentTarget.style.borderTopColor = UW.gold;
        e.currentTarget.style.backgroundColor = UW.purpleTint;
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.borderColor = UW.line;
        e.currentTarget.style.borderTopColor = UW.line;
        e.currentTarget.style.backgroundColor = UW.white;
      }}
    >
      <span className="flex w-full items-center justify-between">
        <Icon
          size={16}
          strokeWidth={1.9}
          style={{ color: active ? UW.gold : UW.purple }}
        />
        <span className="flex items-center gap-1">
          {active && <Check size={11} style={{ color: UW.gold }} />}
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 15,
              fontWeight: 600,
              color: active ? UW.white : UW.purple,
            }}
          >
            {count}
          </span>
        </span>
      </span>

      <span
        className="mt-1.5 font-bold"
        style={{ fontSize: 13, color: active ? UW.white : UW.ink }}
      >
        {shortChallenge(challenge)}
      </span>
      <span
        className="mt-0.5"
        style={{
          fontSize: 10.5,
          lineHeight: "14px",
          color: active ? "#D9D2E6" : UW.inkSubtle,
        }}
      >
        {blurb}
      </span>
    </button>
  );
}
