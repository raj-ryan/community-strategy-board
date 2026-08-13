import { Heart, MessageSquare, Bookmark } from "lucide-react";
import {
  RANK_BASES, keptPercent, rankAll, shortProgram,
  type RankBasis, type Strategy,
} from "../data";
import { UW, FONT_SERIF } from "../uw";

// A ranking table rather than a single leaderboard score.
//
// The concept test showed the two measures are not interchangeable: one
// participant read likes as the signal, the other trusted continued use and
// wanted the denominator visible. So all three columns are always shown, and
// the chosen measure is only what the table is sorted by.

export function RankingTable({
  pool,
  basis,
  onBasis,
  savedIds,
  likedIds,
  commentCounts,
  onOpen,
}: {
  pool: Strategy[];
  basis: RankBasis;
  onBasis: (b: RankBasis) => void;
  savedIds: number[];
  likedIds: number[];
  commentCounts: Record<number, number>;
  onOpen: (id: number) => void;
}) {
  const rows = rankAll(basis, pool);
  const meta = RANK_BASES.find(b => b.id === basis)!;

  return (
    <div style={{ border: `1px solid ${UW.line}`, backgroundColor: UW.white }}>
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        style={{ borderBottom: `1px solid ${UW.line}` }}
      >
        <div>
          <h2
            className="font-semibold"
            style={{ fontFamily: FONT_SERIF, fontSize: 19, color: UW.purple }}
          >
            Ranked by {meta.label.toLowerCase()}
          </h2>
          <p className="mt-0.5" style={{ fontSize: 12, color: UW.inkMuted }}>
            {meta.explain}
          </p>
        </div>
        <div className="flex">
          {RANK_BASES.map(b => (
            <button
              key={b.id}
              onClick={() => onBasis(b.id)}
              aria-pressed={basis === b.id}
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                padding: "7px 12px",
                marginLeft: -1,
                backgroundColor: basis === b.id ? UW.purple : UW.white,
                color: basis === b.id ? UW.white : UW.inkMuted,
                border: `1px solid ${basis === b.id ? UW.purple : UW.line}`,
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ backgroundColor: UW.band }}>
              <Th style={{ width: 44, textAlign: "center" }}>#</Th>
              <Th>Strategy</Th>
              <Th style={{ width: 150 }}>Program</Th>
              <Th style={{ width: 70, textAlign: "right" }} active={basis === "tried"}>
                Tried
              </Th>
              <Th style={{ width: 150, textAlign: "right" }} active={basis === "kept"}>
                Still using
              </Th>
              <Th style={{ width: 70, textAlign: "right" }} active={basis === "liked"}>
                Likes
              </Th>
              <Th style={{ width: 60, textAlign: "right" }}>Replies</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ rank, strategy: s }) => (
              <tr
                key={s.id}
                className="cursor-pointer transition-colors hover:bg-[#F2EFF6]"
                onClick={() => onOpen(s.id)}
                style={{ borderTop: `1px solid ${UW.lineSoft}` }}
              >
                <Td style={{ textAlign: "center" }}>
                  <span
                    className="inline-flex h-[22px] w-[22px] items-center justify-center font-bold"
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: 11,
                      backgroundColor: rank <= 3 ? UW.purple : "transparent",
                      color: rank <= 3 ? UW.white : UW.inkMuted,
                    }}
                  >
                    {rank}
                  </span>
                </Td>
                <Td>
                  <span className="flex items-center gap-1.5">
                    {savedIds.includes(s.id) && (
                      <Bookmark size={11} fill={UW.gold} style={{ color: UW.goldInk }} />
                    )}
                    <span style={{ fontWeight: 600, color: UW.purple }}>{s.title}</span>
                  </span>
                  <span style={{ display: "block", fontSize: 11.5, color: UW.inkSubtle }}>
                    {s.tags.join(" · ")}
                  </span>
                </Td>
                <Td style={{ fontSize: 12, color: UW.inkMuted }}>{shortProgram(s.program)}</Td>
                <Td style={{ textAlign: "right" }}>{s.tried}</Td>
                <Td style={{ textAlign: "right" }}>
                  <span style={{ fontWeight: 700, color: UW.purple }}>{s.stillUsing}</span>
                  <span style={{ color: UW.inkSubtle }}> of {s.tried}</span>
                  <span
                    className="ml-2 inline-block align-middle"
                    style={{ width: 40, height: 4, backgroundColor: UW.bandDeep }}
                  >
                    <span
                      style={{
                        display: "block",
                        width: `${keptPercent(s)}%`,
                        height: "100%",
                        backgroundColor: UW.purple,
                      }}
                    />
                  </span>
                </Td>
                <Td style={{ textAlign: "right" }}>
                  <span className="inline-flex items-center gap-1">
                    <Heart
                      size={11}
                      fill={likedIds.includes(s.id) ? UW.purple : "none"}
                      strokeWidth={likedIds.includes(s.id) ? 0 : 1.6}
                      style={{ color: UW.purple }}
                    />
                    {s.likes + (likedIds.includes(s.id) ? 1 : 0)}
                  </span>
                </Td>
                <Td style={{ textAlign: "right", color: UW.inkMuted }}>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare size={11} />
                    {commentCounts[s.id] ?? 0}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="px-4 py-10 text-center" style={{ fontSize: 13, color: UW.inkMuted }}>
          No strategies match the current filters.
        </p>
      )}
    </div>
  );
}

function Th({
  children,
  style,
  active,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  active?: boolean;
}) {
  return (
    <th
      className="font-bold uppercase"
      style={{
        fontSize: 9.5,
        letterSpacing: "0.08em",
        color: active ? UW.purple : UW.inkMuted,
        padding: "8px 10px",
        textAlign: "left",
        borderBottom: active ? `2px solid ${UW.gold}` : "none",
        ...style,
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: "9px 10px", fontSize: 13, color: UW.inkMid, ...style }}>{children}</td>
  );
}
