import { X, Bookmark, Info, LifeBuoy, Trophy } from "lucide-react";
import {
  RANK_BASES, keptPercent, rankAll, rankValue, shortProgram,
  type RankBasis, type Strategy,
} from "../data";
import { UW, FONT_SERIF } from "../uw";

export function MyQuarterPanel({
  saved,
  onRemove,
  onOpen,
  total,
}: {
  saved: Strategy[];
  onRemove: (id: number) => void;
  onOpen: (id: number) => void;
  total: number;
}) {
  return (
    <Panel>
      <PanelHeader icon={<Bookmark size={13} style={{ color: UW.gold }} />} title="My Quarter">
        <span style={{ fontSize: 11, fontWeight: 700, color: UW.gold }}>
          {saved.length} of {total}
        </span>
      </PanelHeader>

      <div className="p-4">
        <p style={{ fontSize: 12, lineHeight: "18px", color: UW.inkMuted }}>
          Strategies you want to try this quarter. Two or three is usually enough.
        </p>

        {saved.length === 0 ? (
          <p
            className="mt-3 px-3 py-4 text-center"
            style={{
              fontSize: 12,
              lineHeight: "18px",
              color: UW.inkSubtle,
              backgroundColor: UW.band,
              border: `1px dashed ${UW.line}`,
            }}
          >
            Nothing saved yet. Use the bookmark on a card, or{" "}
            <span style={{ fontWeight: 600 }}>Add to My Quarter</span> inside a strategy.
          </p>
        ) : (
          <ul className="mt-2 flex flex-col">
            {saved.map((s, i) => (
              <li
                key={s.id}
                className="flex items-start justify-between gap-2 py-2.5"
                style={{ borderTop: i > 0 ? `1px solid ${UW.lineSoft}` : "none" }}
              >
                <button onClick={() => onOpen(s.id)} className="min-w-0 flex-1 text-left">
                  <p
                    className="font-semibold leading-snug hover:underline"
                    style={{ fontSize: 12.5, color: UW.purple }}
                  >
                    {s.title}
                  </p>
                  <p className="mt-0.5" style={{ fontSize: 10.5, color: UW.inkSubtle }}>
                    {s.tags[0]} · {shortProgram(s.program)}
                  </p>
                </button>
                <button
                  onClick={() => onRemove(s.id)}
                  aria-label={`Remove ${s.title} from My Quarter`}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: UW.inkSubtle }}
                  onMouseEnter={e => (e.currentTarget.style.color = UW.purple)}
                  onMouseLeave={e => (e.currentTarget.style.color = UW.inkSubtle)}
                >
                  <X size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}

export function RankingPanel({
  basis,
  onBasis,
  onOpen,
  onSeeAll,
  pool,
}: {
  basis: RankBasis;
  onBasis: (b: RankBasis) => void;
  onOpen: (id: number) => void;
  onSeeAll: () => void;
  pool: Strategy[];
}) {
  const top = rankAll(basis, pool).slice(0, 5);
  const meta = RANK_BASES.find(b => b.id === basis)!;

  return (
    <Panel>
      <PanelHeader icon={<Trophy size={13} style={{ color: UW.gold }} />} title="Top strategies" />

      <div className="p-4">
        <div className="mb-3 flex">
          {RANK_BASES.map(b => (
            <button
              key={b.id}
              onClick={() => onBasis(b.id)}
              aria-pressed={basis === b.id}
              className="flex-1"
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                padding: "5px 4px",
                backgroundColor: basis === b.id ? UW.purple : UW.white,
                color: basis === b.id ? UW.white : UW.inkMuted,
                border: `1px solid ${basis === b.id ? UW.purple : UW.line}`,
                marginLeft: -1,
              }}
            >
              {b.short}
            </button>
          ))}
        </div>

        <ol className="flex flex-col">
          {top.map(({ rank, strategy }, i) => (
            <li
              key={strategy.id}
              className="flex items-start gap-2.5 py-2"
              style={{ borderTop: i > 0 ? `1px solid ${UW.lineSoft}` : "none" }}
            >
              <span
                className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center font-bold"
                style={{
                  fontSize: 11,
                  fontFamily: FONT_SERIF,
                  backgroundColor: rank <= 3 ? UW.purple : UW.purpleTint,
                  color: rank <= 3 ? UW.white : UW.purple,
                }}
              >
                {rank}
              </span>
              <button onClick={() => onOpen(strategy.id)} className="min-w-0 flex-1 text-left">
                <p
                  className="font-semibold leading-snug hover:underline"
                  style={{ fontSize: 12, color: UW.purple }}
                >
                  {strategy.title}
                </p>
                <p className="mt-0.5" style={{ fontSize: 10.5, color: UW.inkSubtle }}>
                  {rankValue(strategy, basis)} {meta.unit} ·{" "}
                  {keptPercent(strategy)}% still using it
                </p>
              </button>
            </li>
          ))}
        </ol>

        <p
          className="mt-3 pt-3"
          style={{
            fontSize: 10.5,
            lineHeight: "16px",
            color: UW.inkSubtle,
            borderTop: `1px solid ${UW.lineSoft}`,
          }}
        >
          {meta.explain}
        </p>
        <button
          onClick={onSeeAll}
          className="mt-2 font-semibold hover:underline"
          style={{ fontSize: 11.5, color: UW.purple }}
        >
          See the full ranking table →
        </button>
      </div>
    </Panel>
  );
}

export function SupportPanel() {
  return (
    <Panel>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <LifeBuoy size={13} style={{ color: UW.purple }} />
          <h2
            className="font-semibold"
            style={{ fontFamily: FONT_SERIF, fontSize: 15, color: UW.purple }}
          >
            When a strategy is not enough
          </h2>
        </div>
        <p className="mt-2" style={{ fontSize: 12, lineHeight: "18px", color: UW.inkMid }}>
          If a course has become unmanageable, speak with your graduate program adviser
          before a deadline passes. Extensions and incompletes are ordinary, and asking
          early gives more options than asking late.
        </p>
        <div className="mt-2.5 flex flex-col gap-1.5">
          {["Graduate program adviser", "International Student Services", "Counseling Center"].map(
            l => (
              <a
                key={l}
                href="#"
                className="hover:underline"
                style={{ fontSize: 12, fontWeight: 600, color: UW.purple }}
              >
                {l} →
              </a>
            ),
          )}
        </div>
      </div>
    </Panel>
  );
}

export function HowItWorksPanel() {
  const steps = [
    "Pick what you need help with.",
    "Open a strategy to see the steps and what other students said.",
    "Save two or three to My Quarter.",
  ];
  return (
    <Panel>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Info size={13} style={{ color: UW.purple }} />
          <h2
            className="font-semibold"
            style={{ fontFamily: FONT_SERIF, fontSize: 15, color: UW.purple }}
          >
            How this board works
          </h2>
        </div>
        <ol className="mt-2.5 flex flex-col gap-2">
          {steps.map((s, i) => (
            <li
              key={i}
              className="flex gap-2"
              style={{ fontSize: 12, lineHeight: "18px", color: UW.inkMid }}
            >
              <span
                className="mt-px flex h-[17px] w-[17px] flex-shrink-0 items-center justify-center font-bold"
                style={{ fontSize: 9.5, backgroundColor: UW.purpleTintDeep, color: UW.purple }}
              >
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        backgroundColor: UW.white,
        border: `1px solid ${UW.line}`,
        borderTop: `3px solid ${UW.gold}`,
      }}
    >
      {children}
    </section>
  );
}

function PanelHeader({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between gap-2 px-4 py-2.5"
      style={{ backgroundColor: UW.purple }}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h2
          className="font-semibold"
          style={{ fontFamily: FONT_SERIF, fontSize: 15, color: UW.white }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
