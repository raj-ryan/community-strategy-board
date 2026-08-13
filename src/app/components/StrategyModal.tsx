import { useEffect, useRef, useState } from "react";
import {
  X, Heart, Bookmark, MessageSquare, CornerDownRight, Check,
  ThumbsUp, Trophy, Send,
} from "lucide-react";
import {
  contributorLine, keptPercent, rankOf, shortProgram, RANK_BASES,
  type Comment, type CommentKind, type RankBasis, type Reply, type Strategy,
} from "../data";
import { UW, FONT_SERIF, FONT_SANS } from "../uw";

export interface CurrentUser {
  name: string;
  program: string;
  year: string;
}

type Filter = "all" | "question" | "experience";

const OUTCOMES = [
  { id: "worked", label: "It worked for me" },
  { id: "adapted", label: "I adapted it" },
  { id: "did-not-fit", label: "It did not fit my courses" },
] as const;

export function StrategyModal({
  strategy: s,
  comments,
  saved,
  liked,
  thanked,
  rankBasis,
  pool,
  user,
  onClose,
  onToggleSave,
  onToggleLike,
  onThank,
  onPost,
  onReply,
  onLikeComment,
}: {
  strategy: Strategy;
  comments: Comment[];
  saved: boolean;
  liked: boolean;
  thanked: boolean;
  rankBasis: RankBasis;
  pool: Strategy[];
  user: CurrentUser;
  onClose: () => void;
  onToggleSave: () => void;
  onToggleLike: () => void;
  onThank: () => void;
  onPost: (input: {
    kind: CommentKind;
    body: string;
    outcome?: Comment["outcome"];
    anonymous: boolean;
  }) => void;
  onReply: (commentId: string, body: string, anonymous: boolean) => void;
  onLikeComment: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [kind, setKind] = useState<CommentKind>("question");
  const [outcome, setOutcome] = useState<Comment["outcome"]>("worked");
  const [body, setBody] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const shown = comments.filter(c => filter === "all" || c.kind === filter);
  const questions = comments.filter(c => c.kind === "question").length;
  const experiences = comments.length - questions;
  const total = comments.reduce((n, c) => n + 1 + c.replies.length, 0);
  const rank = s.pending ? 0 : rankOf(s.id, rankBasis, pool);
  const basis = RANK_BASES.find(b => b.id === rankBasis)!;

  function submit() {
    const text = body.trim();
    if (!text) return;
    onPost({
      kind,
      body: text,
      outcome: kind === "experience" ? outcome : undefined,
      anonymous,
    });
    setBody("");
    setFilter("all");
  }

  function startExperience(id: Comment["outcome"]) {
    setKind("experience");
    setOutcome(id);
    composerRef.current?.focus();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: "rgba(20,17,28,0.62)", animation: "csbFade 180ms ease-out" }}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={s.title}
    >
      <div
        className="flex h-full w-full max-w-[1140px] flex-col overflow-hidden bg-white sm:h-[min(88vh,900px)]"
        style={{
          borderTop: `4px solid ${UW.gold}`,
          boxShadow: "0 24px 70px rgba(0,0,0,0.4)",
          animation: "csbFlipIn 420ms cubic-bezier(.2,.75,.3,1)",
          transformOrigin: "center center",
        }}
      >
        {/* Title bar */}
        <div
          className="flex flex-shrink-0 items-start justify-between gap-4 px-5 py-3"
          style={{ backgroundColor: UW.purple }}
        >
          <div className="min-w-0">
            <p
              className="uppercase"
              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: UW.gold }}
            >
              Community Strategy Board
            </p>
            <p className="truncate" style={{ fontSize: 13, color: "#E3DCF0" }}>
              {s.tags.join(" · ")} · {shortProgram(s.program)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex flex-shrink-0 items-center gap-1.5 transition-opacity hover:opacity-70"
            style={{ color: UW.white, fontSize: 12, fontWeight: 600 }}
          >
            Close
            <X size={16} />
          </button>
        </div>

        {/* Two independent scroll panes side by side; below the breakpoint the
            dialog scrolls as one document instead, so the discussion is not
            squeezed into a few pixels. */}
        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_400px] lg:overflow-hidden">
          {/* ── Strategy ─────────────────────────────────────────────── */}
          <div className="p-6 lg:min-h-0 lg:overflow-y-auto">
            {rank > 0 && rank <= 10 && (
              <p
                className="mb-2 flex items-center gap-1.5 font-bold uppercase"
                style={{ fontSize: 10.5, letterSpacing: "0.07em", color: UW.goldInk }}
              >
                <Trophy size={12} />
                #{rank} most {basis.short.toLowerCase()} on the board
              </p>
            )}

            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontSize: 28,
                lineHeight: "34px",
                fontWeight: 600,
                color: UW.purple,
                letterSpacing: "-0.015em",
              }}
            >
              {s.title}
            </h2>
            <p className="mt-2" style={{ fontSize: 15, lineHeight: "23px", color: UW.inkMid }}>
              {s.benefit}
            </p>
            <p
              className="mt-3 pb-4"
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: UW.inkMuted,
                borderBottom: `1px solid ${UW.lineSoft}`,
              }}
            >
              {contributorLine(s)} · <span style={{ fontWeight: 400 }}>{s.relevanceNote}</span>
            </p>

            <Section label="Why this helps">
              <p style={{ fontSize: 14, lineHeight: "22px", color: UW.inkMid }}>{s.whyHelps}</p>
            </Section>

            <Section label="Try this">
              <ol className="flex flex-col gap-2.5">
                {s.steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3"
                    style={{ fontSize: 14, lineHeight: "22px", color: UW.inkMid }}
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center font-bold"
                      style={{ fontSize: 11, backgroundColor: UW.purple, color: UW.white }}
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Section>

            <Section label="Best time to use it">
              <p style={{ fontSize: 14, lineHeight: "22px", color: UW.inkMid }}>
                {s.bestTime}
                {s.effort && <span style={{ color: UW.inkSubtle }}> · {s.effort}</span>}
              </p>
            </Section>

            {/* Evidence, with the denominator kept visible */}
            <div
              className="mt-5 p-4"
              style={{ backgroundColor: UW.purpleTint, borderLeft: `3px solid ${UW.gold}` }}
            >
              <p
                className="mb-2 font-bold uppercase"
                style={{ fontSize: 10, letterSpacing: "0.09em", color: UW.goldInk }}
              >
                What the numbers mean
              </p>
              {s.pending ? (
                <p style={{ fontSize: 14, lineHeight: "22px", color: UW.inkMid }}>
                  This strategy has just been submitted and is with the review team. It has
                  no community data yet: likes, saves, and the still-using counts appear
                  once it is published and other students report back on it.
                </p>
              ) : (
                <>
                  <p style={{ fontSize: 14, lineHeight: "22px", color: UW.inkMid }}>
                    <strong>{s.likes}</strong> students liked this strategy and{" "}
                    <strong>{s.saves}</strong> saved it to their quarter.{" "}
                    <strong style={{ color: UW.purple }}>
                      {s.stillUsing} of {s.tried}
                    </strong>{" "}
                    who tried it reported still using it several weeks later (
                    {keptPercent(s)}%), which is the closest thing here to evidence that
                    it works rather than that it sounded good.
                  </p>
                  <div className="mt-3" style={{ height: 6, backgroundColor: UW.white }}>
                    <div
                      style={{
                        width: `${keptPercent(s)}%`,
                        height: "100%",
                        backgroundColor: UW.purple,
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={onToggleSave}
                className="flex items-center gap-2 font-semibold transition-colors"
                style={{
                  padding: "11px 20px",
                  fontSize: 13.5,
                  backgroundColor: saved ? UW.goldTint : UW.purple,
                  color: saved ? UW.goldInk : UW.white,
                  border: `1px solid ${saved ? UW.goldLine : UW.purple}`,
                }}
              >
                {saved ? <Check size={15} /> : <Bookmark size={15} />}
                {saved ? "Saved to My Quarter" : "Add to My Quarter"}
                <span style={{ fontWeight: 500, opacity: 0.75 }}>· {s.saves}</span>
              </button>
              <button
                onClick={onToggleLike}
                className="flex items-center gap-2 font-semibold transition-colors"
                style={{
                  padding: "11px 16px",
                  fontSize: 13,
                  backgroundColor: liked ? UW.purpleTint : UW.white,
                  color: liked ? UW.purple : UW.inkMid,
                  border: `1px solid ${liked ? UW.purpleLine : UW.line}`,
                }}
              >
                <Heart size={14} fill={liked ? UW.purple : "none"} strokeWidth={liked ? 0 : 1.7} />
                {liked ? "Liked" : "Like"} · {s.likes}
              </button>
              <button
                onClick={onThank}
                className="flex items-center gap-2 font-semibold transition-colors"
                style={{
                  padding: "11px 16px",
                  fontSize: 13,
                  backgroundColor: thanked ? UW.purpleTint : UW.white,
                  color: thanked ? UW.purple : UW.inkMid,
                  border: `1px solid ${thanked ? UW.purpleLine : UW.line}`,
                }}
              >
                {thanked ? <Check size={14} /> : <ThumbsUp size={14} />}
                {thanked ? "Contributor thanked" : "Thank contributor"}
              </button>
            </div>
          </div>

          {/* ── Discussion ───────────────────────────────────────────── */}
          <div
            className="flex flex-col lg:min-h-0"
            style={{ backgroundColor: UW.band, borderLeft: `1px solid ${UW.line}` }}
          >
            <div
              className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-3 lg:sticky lg:top-0"
              style={{ borderBottom: `1px solid ${UW.line}`, backgroundColor: UW.white }}
            >
              <h3
                className="flex items-center gap-2 font-semibold"
                style={{ fontFamily: FONT_SERIF, fontSize: 17, color: UW.purple }}
              >
                <MessageSquare size={15} />
                Discussion
                <span style={{ fontSize: 12, fontWeight: 600, color: UW.inkSubtle }}>
                  {total}
                </span>
              </h3>
              <div className="flex gap-1">
                {(
                  [
                    ["all", `All ${comments.length}`],
                    ["question", `Questions ${questions}`],
                    ["experience", `Experiences ${experiences}`],
                  ] as Array<[Filter, string]>
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setFilter(id)}
                    aria-pressed={filter === id}
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: "4px 7px",
                      backgroundColor: filter === id ? UW.purple : UW.white,
                      color: filter === id ? UW.white : UW.inkMuted,
                      border: `1px solid ${filter === id ? UW.purple : UW.line}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 py-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
              {shown.length === 0 ? (
                <p
                  className="mt-6 px-4 py-8 text-center"
                  style={{
                    fontSize: 13,
                    lineHeight: "20px",
                    color: UW.inkSubtle,
                    backgroundColor: UW.white,
                    border: `1px dashed ${UW.line}`,
                  }}
                >
                  {comments.length === 0
                    ? "No one has posted about this strategy yet. Ask the first question, or share what happened when you tried it."
                    : "Nothing in this view yet."}
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {shown.map(c => (
                    <li key={c.id}>
                      <CommentCard
                        comment={c}
                        onLike={() => onLikeComment(c.id)}
                        onReplyClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                        replying={replyTo === c.id}
                        onSubmitReply={text => {
                          onReply(c.id, text, anonymous);
                          setReplyTo(null);
                        }}
                        onLikeReply={onLikeComment}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Composer */}
            <div
              className="flex-shrink-0 px-4 py-3"
              style={{ borderTop: `1px solid ${UW.line}`, backgroundColor: UW.white }}
            >
              <p
                className="mb-2 font-bold uppercase"
                style={{ fontSize: 9.5, letterSpacing: "0.09em", color: UW.inkMuted }}
              >
                Did this work for you?
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {OUTCOMES.map(o => (
                  <button
                    key={o.id}
                    onClick={() => startExperience(o.id)}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "5px 9px",
                      backgroundColor:
                        kind === "experience" && outcome === o.id ? UW.purpleTint : UW.white,
                      color:
                        kind === "experience" && outcome === o.id ? UW.purple : UW.inkMid,
                      border: `1px solid ${
                        kind === "experience" && outcome === o.id ? UW.purpleLine : UW.line
                      }`,
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              <div className="mb-2 flex gap-1">
                {(
                  [
                    ["question", "Ask a question"],
                    ["experience", "Share an experience"],
                  ] as Array<[CommentKind, string]>
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setKind(id)}
                    aria-pressed={kind === id}
                    className="flex-1"
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: "6px 8px",
                      backgroundColor: kind === id ? UW.purple : UW.white,
                      color: kind === id ? UW.white : UW.inkMuted,
                      border: `1px solid ${kind === id ? UW.purple : UW.line}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <textarea
                ref={composerRef}
                value={body}
                onChange={e => setBody(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
                }}
                rows={3}
                placeholder={
                  kind === "question"
                    ? "Ask the contributor or other students something specific…"
                    : "What happened when you tried it in your courses?"
                }
                style={{
                  width: "100%",
                  padding: "9px 11px",
                  fontSize: 13,
                  lineHeight: "19px",
                  fontFamily: FONT_SANS,
                  border: `1px solid ${UW.line}`,
                  outline: "none",
                  resize: "vertical",
                  color: UW.ink,
                }}
              />

              <div className="mt-2 flex items-center justify-between gap-2">
                <label
                  className="flex cursor-pointer items-center gap-1.5"
                  style={{ fontSize: 11, color: UW.inkMuted }}
                >
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={e => setAnonymous(e.target.checked)}
                    style={{ accentColor: UW.purple }}
                  />
                  Post anonymously
                </label>
                <button
                  onClick={submit}
                  disabled={!body.trim()}
                  className="flex items-center gap-1.5 font-semibold"
                  style={{
                    fontSize: 12.5,
                    padding: "8px 16px",
                    backgroundColor: body.trim() ? UW.purple : UW.bandDeep,
                    color: body.trim() ? UW.white : UW.inkSubtle,
                    cursor: body.trim() ? "pointer" : "default",
                  }}
                >
                  <Send size={13} />
                  Post
                </button>
              </div>
              <p className="mt-1.5" style={{ fontSize: 10, color: UW.inkSubtle }}>
                Posting as{" "}
                {anonymous
                  ? `anonymous · ${shortProgram(user.program)}, ${user.year}`
                  : `${user.name} · ${shortProgram(user.program)}, ${user.year}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pieces ────────────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p
        className="mb-1.5 font-bold uppercase"
        style={{ fontSize: 10, letterSpacing: "0.09em", color: UW.goldInk }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function CommentCard({
  comment: c,
  onLike,
  onReplyClick,
  replying,
  onSubmitReply,
  onLikeReply,
}: {
  comment: Comment;
  onLike: () => void;
  onReplyClick: () => void;
  replying: boolean;
  onSubmitReply: (text: string) => void;
  onLikeReply: (id: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <div style={{ backgroundColor: UW.white, border: `1px solid ${UW.line}` }}>
      <div className="p-3">
        <Byline entry={c} kind={c.kind} outcome={c.outcome} />
        <p className="mt-2" style={{ fontSize: 12.5, lineHeight: "19px", color: UW.inkMid }}>
          {c.body}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <LikeButton count={c.likes} onClick={onLike} />
          <button
            onClick={onReplyClick}
            className="flex items-center gap-1"
            style={{ fontSize: 11, fontWeight: 600, color: UW.inkSubtle }}
          >
            <CornerDownRight size={11} />
            Reply
          </button>
        </div>
      </div>

      {c.replies.length > 0 && (
        <div style={{ borderTop: `1px solid ${UW.lineSoft}`, backgroundColor: UW.band }}>
          {c.replies.map(rep => (
            <div key={rep.id} className="px-3 py-2.5" style={{ borderLeft: `3px solid ${UW.purpleLine}` }}>
              <Byline entry={rep} />
              <p className="mt-1.5" style={{ fontSize: 12, lineHeight: "18px", color: UW.inkMid }}>
                {rep.body}
              </p>
              <div className="mt-1.5">
                <LikeButton count={rep.likes} onClick={() => onLikeReply(rep.id)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {replying && (
        <div className="p-3" style={{ borderTop: `1px solid ${UW.lineSoft}` }}>
          <textarea
            autoFocus
            rows={2}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Reply to this comment…"
            style={{
              width: "100%",
              padding: "7px 9px",
              fontSize: 12,
              fontFamily: FONT_SANS,
              border: `1px solid ${UW.line}`,
              outline: "none",
              resize: "vertical",
            }}
          />
          <div className="mt-1.5 flex justify-end">
            <button
              onClick={() => text.trim() && onSubmitReply(text.trim())}
              className="font-semibold"
              style={{
                fontSize: 11.5,
                padding: "6px 13px",
                backgroundColor: text.trim() ? UW.purple : UW.bandDeep,
                color: text.trim() ? UW.white : UW.inkSubtle,
              }}
            >
              Post reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Byline({
  entry,
  kind,
  outcome,
}: {
  entry: Reply;
  kind?: CommentKind;
  outcome?: Comment["outcome"];
}) {
  const initials = (entry.author ?? "A").slice(0, 1).toUpperCase();
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-6 w-6 flex-shrink-0 items-center justify-center font-bold"
        style={{
          fontSize: 10.5,
          backgroundColor: entry.isContributor ? UW.purple : UW.purpleTintDeep,
          color: entry.isContributor ? UW.white : UW.purple,
        }}
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate" style={{ fontSize: 11.5, fontWeight: 700, color: UW.ink }}>
          {entry.author ?? "Anonymous"}
          <span style={{ fontWeight: 500, color: UW.inkMuted }}>
            {" "}· {entry.program}, {entry.year}
          </span>
        </p>
        <p style={{ fontSize: 10, color: UW.inkSubtle }}>
          {entry.when}
          {entry.isContributor && (
            <span style={{ color: UW.goldInk, fontWeight: 700 }}> · Contributor</span>
          )}
        </p>
      </div>
      {kind && <KindTag kind={kind} outcome={outcome} />}
    </div>
  );
}

function KindTag({ kind, outcome }: { kind: CommentKind; outcome?: Comment["outcome"] }) {
  const isQ = kind === "question";
  const label = isQ
    ? "Question"
    : outcome === "did-not-fit"
      ? "Did not fit"
      : outcome === "adapted"
        ? "Adapted"
        : "Worked";
  return (
    <span
      className="flex-shrink-0 font-bold uppercase"
      style={{
        fontSize: 9,
        letterSpacing: "0.06em",
        padding: "2px 5px",
        backgroundColor: isQ ? UW.purpleTint : UW.goldTint,
        color: isQ ? UW.purple : UW.goldInk,
        border: `1px solid ${isQ ? UW.purpleLine : UW.goldLine}`,
      }}
    >
      {label}
    </span>
  );
}

function LikeButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1"
      style={{ fontSize: 11, fontWeight: 600, color: UW.inkSubtle }}
    >
      <Heart size={11} strokeWidth={1.7} />
      {count}
    </button>
  );
}
