import { Heart, Bookmark } from "lucide-react";
import {
  RANK_BASES,
  rankAll,
  shortProgram,
  type RankBasis,
  type Strategy,
} from "../data";
import { UW, R, TYPE } from "../uw";

// Ranking has its own page so the board itself stays about finding one card.
// Two measures, never merged, each one saying plainly what it counts.

export function TopStrategiesPage({
  pool,
  basis,
  savedIds,
  likedIds,
  onBasis,
  onOpen,
}: {
  pool: Strategy[];
  basis: RankBasis;
  savedIds: number[];
  likedIds: number[];
  onBasis: (b: RankBasis) => void;
  onOpen: (id: number) => void;
}) {
  const rows = rankAll(basis, pool);
  const meta = RANK_BASES.find((b) => b.id === basis)!;

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-8">
      <h2 style={{ ...TYPE.sectionQuestion, color: UW.ink }}>Top strategies</h2>
      <p
        className="mt-1 max-w-2xl"
        style={{ ...TYPE.body, color: UW.inkMuted }}
      >
        {meta.explain}
      </p>

      <div className="mt-5 flex gap-1.5">
        {RANK_BASES.map((b) => (
          <button
            key={b.id}
            onClick={() => onBasis(b.id)}
            aria-pressed={basis === b.id}
            style={{
              ...TYPE.chip,
              fontWeight: basis === b.id ? 600 : 500,
              padding: "8px 16px",
              borderRadius: R.chip,
              backgroundColor: basis === b.id ? UW.purple : UW.card,
              color: basis === b.id ? UW.white : UW.inkMid,
              border: `1px solid ${basis === b.id ? UW.purple : UW.line}`,
            }}
          >
            {b.label}
          </button>
        ))}
      </div>

      <ol className="mt-6 flex flex-col">
        {rows.map(({ rank, strategy: s }) => (
          <li key={s.id}>
            <button
              onClick={() => onOpen(s.id)}
              className="flex w-full items-baseline gap-4 py-3.5 text-left transition-colors"
              style={{ borderTop: `1px solid ${UW.line}` }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = UW.band)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <span
                className="flex-shrink-0 text-right"
                style={{
                  width: 26,
                  fontSize: 15,
                  fontWeight: rank <= 3 ? 700 : 400,
                  color: rank <= 3 ? UW.purple : UW.inkSubtle,
                }}
              >
                {rank}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className="flex items-center gap-2"
                  style={{ ...TYPE.strategyTitle, fontSize: 16, color: UW.ink }}
                >
                  {savedIds.includes(s.id) && (
                    <Bookmark
                      size={12}
                      fill={UW.gold}
                      style={{ color: UW.goldInk }}
                    />
                  )}
                  {s.title}
                </span>
                <span
                  className="mt-0.5 block"
                  style={{ ...TYPE.meta, color: UW.inkSubtle }}
                >
                  {shortProgram(s.program)} · {s.tags.join(" · ")}
                </span>
              </span>

              <span
                className="flex flex-shrink-0 items-center gap-4"
                style={{ ...TYPE.meta, color: UW.inkMuted }}
              >
                <span className="flex items-center gap-1.5">
                  <Heart
                    size={13}
                    fill={likedIds.includes(s.id) ? UW.purple : "none"}
                    strokeWidth={likedIds.includes(s.id) ? 0 : 1.6}
                    style={{ color: UW.purple }}
                  />
                  {s.likes}
                </span>
                <span className="flex items-center gap-1.5">
                  <Bookmark size={13} strokeWidth={1.6} />
                  {s.saves}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <p
        className="mt-6 pt-5"
        style={{
          ...TYPE.meta,
          color: UW.inkSubtle,
          borderTop: `1px solid ${UW.line}`,
        }}
      >
        Strategies are ranked here, students are not. There is no contributor
        leaderboard, and nothing you save is visible to anyone else.
      </p>
    </div>
  );
}
