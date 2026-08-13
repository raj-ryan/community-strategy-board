import {
  Heart,
  Bookmark,
  RotateCcw,
  MessageSquare,
  ArrowRight,
  Check,
} from "lucide-react";
import { contributorLine, type Strategy } from "../data";
import { UW, R, TYPE, FONT_SANS } from "../uw";

// One strategy, two sides.
//
// The front answers "is this for me?" — title, one sentence, who wrote it.
// Turning it over gives the only two things needed to act on it: the steps, and
// when to do them. What used to sit in an expanded view has been removed rather
// than relocated.

const FACE: React.CSSProperties = {
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
};

export function StrategyCard({
  strategy: s,
  flipped,
  saved,
  liked,
  thanked,
  commentCount,
  onFlip,
  onToggleSave,
  onToggleLike,
  onThank,
  onDiscuss,
}: {
  strategy: Strategy;
  flipped: boolean;
  saved: boolean;
  liked: boolean;
  thanked: boolean;
  commentCount: number;
  onFlip: () => void;
  onToggleSave: () => void;
  onToggleLike: () => void;
  onThank: () => void;
  onDiscuss: () => void;
}) {
  // The visible face sits in flow and sets the height; the hidden one is
  // absolute on top of it, so a longer back grows over the rows below instead
  // of resizing the whole row.
  const face = (isBack: boolean): React.CSSProperties => ({
    ...FACE,
    ...(flipped === isBack
      ? { position: "relative" }
      : { position: "absolute", inset: 0 }),
    backgroundColor: UW.card,
    border: `1px solid ${saved && !isBack ? UW.goldLine : UW.line}`,
    borderRadius: R.card,
    padding: 20,
    ...(isBack ? { transform: "rotateY(180deg)" } : null),
  });

  return (
    <div className="relative min-h-[290px] sm:h-full">
      <div
        className="sm:absolute sm:inset-x-0 sm:top-0"
        style={{
          perspective: 1600,
          minHeight: "100%",
          zIndex: flipped ? 20 : 1,
        }}
      >
        <div
          className="relative transition-transform duration-500 ease-out motion-reduce:duration-0"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "100%",
          }}
        >
          {/* ── Front ───────────────────────────────────────────────── */}
          <div
            aria-hidden={flipped}
            className="flex h-full min-h-[290px] flex-col"
            style={face(false)}
          >
            <div className="flex items-start justify-between gap-3">
              <p style={{ ...TYPE.label, color: UW.inkSubtle }}>
                {s.pending ? "In review" : s.tags[0]}
              </p>
              <button
                onClick={onToggleSave}
                aria-pressed={saved}
                aria-label={
                  saved ? "Remove from My Quarter" : "Save to My Quarter"
                }
                className="-mr-1 -mt-1 flex-shrink-0 p-1"
                style={{ color: saved ? UW.goldInk : UW.inkSubtle }}
              >
                <Bookmark
                  size={16}
                  fill={saved ? UW.gold : "none"}
                  strokeWidth={1.7}
                />
              </button>
            </div>

            <h3
              className="mt-2"
              style={{ ...TYPE.strategyTitle, color: UW.ink }}
            >
              {s.title}
            </h3>
            <p className="mt-2" style={{ ...TYPE.body, color: UW.inkMuted }}>
              {s.benefit}
            </p>

            <div className="mt-auto pt-4">
              <p style={{ ...TYPE.meta, color: UW.inkSubtle }}>
                {contributorLine(s)}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={onFlip}
                  tabIndex={flipped ? -1 : 0}
                  className="flex items-center gap-1.5 transition-colors"
                  style={{
                    ...TYPE.chip,
                    fontWeight: 600,
                    color: UW.purple,
                    border: `1px solid ${UW.purpleLine}`,
                    borderRadius: R.control,
                    padding: "7px 14px",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = UW.purpleTint)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  View strategy
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={onToggleLike}
                  aria-label={liked ? "Remove like" : "Like this strategy"}
                  className="ml-auto flex items-center gap-1.5"
                  style={{
                    ...TYPE.meta,
                    color: liked ? UW.purple : UW.inkSubtle,
                  }}
                >
                  <Heart
                    size={14}
                    fill={liked ? UW.purple : "none"}
                    strokeWidth={liked ? 0 : 1.6}
                  />
                  {s.likes}
                </button>
                <button
                  onClick={onDiscuss}
                  aria-label={`${commentCount} comments`}
                  className="flex items-center gap-1.5"
                  style={{ ...TYPE.meta, color: UW.inkSubtle }}
                >
                  <MessageSquare size={14} strokeWidth={1.6} />
                  {commentCount}
                </button>
              </div>
            </div>
          </div>

          {/* ── Back ────────────────────────────────────────────────── */}
          <div
            aria-hidden={!flipped}
            className="flex min-h-full flex-col"
            style={{
              ...face(true),
              boxShadow: flipped ? "0 8px 30px rgba(34,32,30,0.13)" : "none",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <p style={{ ...TYPE.label, color: UW.inkSubtle }}>
                How to use it
              </p>
              <button
                onClick={onFlip}
                tabIndex={flipped ? 0 : -1}
                aria-label="Back to the front of the card"
                className="-mr-1 -mt-1 flex-shrink-0 p-1"
                style={{ color: UW.inkSubtle }}
              >
                <RotateCcw size={15} strokeWidth={1.7} />
              </button>
            </div>

            <ol className="mt-3 flex flex-col gap-2.5">
              {s.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3"
                  style={{ ...TYPE.body, color: UW.ink }}
                >
                  <span
                    className="mt-px flex h-[21px] w-[21px] flex-shrink-0 items-center justify-center"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      borderRadius: 999,
                      backgroundColor: UW.purpleTint,
                      color: UW.purple,
                    }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="mt-auto pt-4">
              <div
                style={{
                  borderTop: `1px solid ${UW.lineSoft}`,
                  paddingTop: 14,
                }}
              >
                <p style={{ ...TYPE.label, color: UW.inkSubtle }}>
                  Best time to use it
                </p>
                <p
                  className="mt-1.5"
                  style={{ ...TYPE.body, color: UW.inkMuted }}
                >
                  {s.bestTime}
                  {s.effort && (
                    <span style={{ color: UW.inkSubtle }}> · {s.effort}</span>
                  )}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={onToggleSave}
                  tabIndex={flipped ? 0 : -1}
                  className="flex flex-1 items-center justify-center gap-2 transition-colors"
                  style={{
                    ...TYPE.chip,
                    fontWeight: 600,
                    padding: "11px 14px",
                    borderRadius: R.control,
                    backgroundColor: saved ? UW.goldTint : UW.purple,
                    color: saved ? UW.goldInk : UW.white,
                    border: `1px solid ${saved ? UW.goldLine : UW.purple}`,
                  }}
                >
                  {saved ? <Check size={15} /> : <Bookmark size={15} />}
                  {saved ? "Saved" : "Add to My Quarter"}
                </button>
                <button
                  onClick={onThank}
                  tabIndex={flipped ? 0 : -1}
                  aria-label={
                    thanked ? "Contributor thanked" : "Thank the contributor"
                  }
                  title={
                    thanked ? "Contributor thanked" : "Thank the contributor"
                  }
                  className="flex flex-shrink-0 items-center justify-center transition-colors"
                  style={{
                    width: 44,
                    borderRadius: R.control,
                    fontSize: 15,
                    backgroundColor: thanked ? UW.purpleTint : UW.card,
                    border: `1px solid ${thanked ? UW.purpleLine : UW.line}`,
                  }}
                >
                  🙏
                </button>
              </div>

              <button
                onClick={onDiscuss}
                tabIndex={flipped ? 0 : -1}
                className="mt-2 w-full transition-colors"
                style={{
                  ...TYPE.chip,
                  fontFamily: FONT_SANS,
                  fontWeight: 600,
                  padding: "10px 14px",
                  borderRadius: R.control,
                  color: UW.goldInk,
                  border: `1px solid ${UW.goldLine}`,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = UW.goldTint)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Ask a question / Add a comment
                {commentCount > 0 && (
                  <span style={{ fontWeight: 400 }}> · {commentCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
