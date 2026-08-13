import {
  Heart,
  MessageSquare,
  Bookmark,
  ArrowRight,
  Trophy,
} from "lucide-react";
import {
  contributorLine,
  keptPercent,
  badgeFor,
  type RankBasis,
  type Strategy,
} from "../data";
import { UW, FONT_SERIF } from "../uw";

// The card answers one question only: is this useful for me? Steps, evidence
// and discussion live in the expanded view, which opens when the card is turned
// over.

export function StrategyCard({
  strategy: s,
  saved,
  liked,
  commentCount,
  rankBasis,
  onOpen,
  onToggleSave,
  onToggleLike,
}: {
  strategy: Strategy;
  saved: boolean;
  liked: boolean;
  commentCount: number;
  rankBasis: RankBasis;
  onOpen: () => void;
  onToggleSave: () => void;
  onToggleLike: () => void;
}) {
  const pct = keptPercent(s);
  const badge = s.pending ? null : badgeFor(s, rankBasis);

  return (
    <article
      className="flex h-full flex-col bg-white transition-shadow hover:shadow-[0_2px_14px_rgba(28,26,34,0.10)]"
      style={{
        border: `1px solid ${UW.line}`,
        borderTop: `3px solid ${saved ? UW.gold : UW.purple}`,
      }}
    >
      <div className="flex flex-1 flex-col p-4">
        {/* Rank badge / pending state */}
        {(badge || s.pending) && (
          <p
            className="mb-2 flex items-center gap-1.5 font-bold uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.07em",
              color: s.pending ? UW.inkSubtle : UW.goldInk,
            }}
          >
            {s.pending ? (
              "Awaiting moderator review"
            ) : (
              <>
                <Trophy size={11} />
                {badge!.text}
              </>
            )}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          {s.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="font-semibold uppercase"
              style={{
                fontSize: 9.5,
                letterSpacing: "0.05em",
                padding: "3px 6px",
                backgroundColor: UW.purpleTint,
                color: UW.purple,
                border: `1px solid ${UW.purpleLine}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h3
          className="mt-2.5 font-semibold"
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 19,
            lineHeight: "25px",
            color: UW.purple,
            letterSpacing: "-0.01em",
          }}
        >
          {s.title}
        </h3>
        <p
          className="mt-1.5"
          style={{ fontSize: 13.5, lineHeight: "20px", color: UW.inkMid }}
        >
          {s.benefit}
        </p>

        <div className="mt-auto pt-3">
          <p style={{ fontSize: 11.5, fontWeight: 600, color: UW.inkMuted }}>
            {contributorLine(s)}
          </p>

          {/* Community evidence. Likes and continued use are deliberately not
              merged into one number. A newly contributed strategy has neither
              yet, and says so rather than showing 1 of 1. */}
          {s.pending ? (
            <p
              className="mt-2.5 pt-2.5"
              style={{
                fontSize: 11,
                color: UW.inkSubtle,
                borderTop: `1px solid ${UW.lineSoft}`,
              }}
            >
              No community data yet — counts appear once other students try it.
            </p>
          ) : (
            <>
              <div
                className="mt-2.5 flex items-center gap-2.5 pt-2.5"
                style={{
                  fontSize: 11.5,
                  color: UW.inkSubtle,
                  borderTop: `1px solid ${UW.lineSoft}`,
                }}
              >
                <button
                  onClick={onToggleLike}
                  aria-label={liked ? "Remove like" : "Like this strategy"}
                  className="flex items-center gap-1"
                  style={{
                    color: liked ? UW.purple : UW.inkSubtle,
                    fontWeight: 600,
                  }}
                >
                  <Heart
                    size={12}
                    fill={liked ? UW.purple : "none"}
                    strokeWidth={liked ? 0 : 1.6}
                  />
                  {s.likes + (liked ? 1 : 0)}
                </button>
                <span>{s.tried} tried</span>
                <span style={{ fontWeight: 700, color: UW.purple }}>
                  {s.stillUsing} still using
                </span>
              </div>

              <div
                className="mt-2"
                title={`${s.stillUsing} of ${s.tried} students`}
              >
                <div style={{ height: 4, backgroundColor: UW.bandDeep }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      backgroundColor: UW.purple,
                    }}
                  />
                </div>
                <p
                  className="mt-1"
                  style={{ fontSize: 10, color: UW.inkSubtle }}
                >
                  {s.stillUsing} of {s.tried} kept using it after several weeks
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex items-stretch"
        style={{ borderTop: `1px solid ${UW.lineSoft}` }}
      >
        <button
          onClick={onOpen}
          className="flex flex-1 items-center justify-center gap-1.5 transition-colors"
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: UW.purple,
            backgroundColor: "transparent",
            padding: "10px 8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = UW.purple;
            e.currentTarget.style.color = UW.white;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = UW.purple;
          }}
        >
          View strategy
          <ArrowRight size={13} />
        </button>

        <button
          onClick={onOpen}
          aria-label={`Open discussion, ${commentCount} comments`}
          className="flex items-center justify-center gap-1.5 transition-colors hover:bg-[#F2EFF6]"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: commentCount ? UW.inkMid : UW.inkSubtle,
            padding: "10px 12px",
            borderLeft: `1px solid ${UW.lineSoft}`,
          }}
        >
          <MessageSquare size={13} />
          {commentCount}
        </button>

        <button
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? "Remove from My Quarter" : "Save to My Quarter"}
          className="flex items-center justify-center transition-colors"
          style={{
            padding: "10px 12px",
            borderLeft: `1px solid ${UW.lineSoft}`,
            backgroundColor: saved ? UW.goldTint : "transparent",
            color: saved ? UW.goldInk : UW.inkSubtle,
          }}
        >
          <Bookmark
            size={14}
            fill={saved ? UW.gold : "none"}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </article>
  );
}
