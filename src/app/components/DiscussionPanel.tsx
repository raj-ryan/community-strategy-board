import { useEffect, useRef, useState } from "react";
import { X, CornerDownRight, Send, Heart } from "lucide-react";
import {
  contributorLine,
  shortProgram,
  type Comment,
  type CommentKind,
  type Reply,
  type Strategy,
} from "../data";
import { UW, R, TYPE, FONT_SANS } from "../uw";

export interface CurrentUser {
  name: string;
  program: string;
  year: string;
}

// A panel rather than a page or a two-column dialog: the strategy stays where
// it was, and the conversation slides in beside it. One list, one composer,
// one level of replies.

export function DiscussionPanel({
  strategy: s,
  comments,
  user,
  onClose,
  onPost,
  onReply,
  onLikeComment,
}: {
  strategy: Strategy;
  comments: Comment[];
  user: CurrentUser;
  onClose: () => void;
  onPost: (input: {
    kind: CommentKind;
    body: string;
    anonymous: boolean;
  }) => void;
  onReply: (commentId: string, body: string, anonymous: boolean) => void;
  onLikeComment: (id: string) => void;
}) {
  const [kind, setKind] = useState<CommentKind>("question");
  const [body, setBody] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const composer = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function submit() {
    const text = body.trim();
    if (!text) return;
    onPost({ kind, body: text, anonymous });
    setBody("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{
        backgroundColor: "rgba(34,32,30,0.32)",
        animation: "csbFade 160ms ease-out",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Discussion: ${s.title}`}
    >
      <div
        className="flex h-full w-full flex-col sm:max-w-[440px]"
        style={{
          backgroundColor: UW.paper,
          animation: "csbSlideIn 260ms cubic-bezier(.2,.75,.3,1)",
          boxShadow: "-12px 0 40px rgba(34,32,30,0.16)",
        }}
      >
        {/* Header */}
        <div
          className="flex flex-shrink-0 items-start justify-between gap-3 px-5 py-4"
          style={{
            borderBottom: `1px solid ${UW.line}`,
            backgroundColor: UW.card,
          }}
        >
          <div className="min-w-0">
            <p style={{ ...TYPE.label, color: UW.inkSubtle }}>Discussion</p>
            <h2
              className="mt-1"
              style={{ ...TYPE.strategyTitle, color: UW.ink }}
            >
              {s.title}
            </h2>
            <p className="mt-1" style={{ ...TYPE.meta, color: UW.inkSubtle }}>
              {contributorLine(s)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close discussion"
            className="-mr-1 -mt-1 flex-shrink-0 p-1"
            style={{ color: UW.inkMuted }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Thread */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {comments.length === 0 ? (
            <p
              className="px-4 py-8 text-center"
              style={{
                ...TYPE.body,
                color: UW.inkSubtle,
                backgroundColor: UW.card,
                border: `1px dashed ${UW.line}`,
                borderRadius: R.card,
              }}
            >
              No questions yet. Ask the first one, or say what happened when you
              tried it.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {comments.map((c) => (
                <li key={c.id}>
                  <CommentCard
                    comment={c}
                    replying={replyTo === c.id}
                    onLike={() => onLikeComment(c.id)}
                    onLikeReply={onLikeComment}
                    onToggleReply={() =>
                      setReplyTo(replyTo === c.id ? null : c.id)
                    }
                    onSubmitReply={(text) => {
                      onReply(c.id, text, anonymous);
                      setReplyTo(null);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Composer */}
        <div
          className="flex-shrink-0 px-5 py-4"
          style={{
            borderTop: `1px solid ${UW.line}`,
            backgroundColor: UW.card,
          }}
        >
          <div className="mb-2 flex gap-1.5">
            {(
              [
                ["question", "Ask a question"],
                ["experience", "Share what happened"],
              ] as Array<[CommentKind, string]>
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setKind(id)}
                aria-pressed={kind === id}
                className="flex-1 transition-colors"
                style={{
                  ...TYPE.meta,
                  fontWeight: 600,
                  padding: "7px 8px",
                  borderRadius: R.chip,
                  backgroundColor: kind === id ? UW.purple : "transparent",
                  color: kind === id ? UW.white : UW.inkMuted,
                  border: `1px solid ${kind === id ? UW.purple : UW.line}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <textarea
            ref={composer}
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
            }}
            placeholder={
              kind === "question"
                ? "What would you like to know before trying this?"
                : "Did it work in your courses?"
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              ...TYPE.body,
              fontFamily: FONT_SANS,
              color: UW.ink,
              backgroundColor: UW.paper,
              border: `1px solid ${UW.line}`,
              borderRadius: R.control,
              outline: "none",
              resize: "vertical",
            }}
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            <label
              className="flex cursor-pointer items-center gap-1.5"
              style={{ ...TYPE.meta, color: UW.inkSubtle }}
            >
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                style={{ accentColor: UW.purple }}
              />
              Post anonymously
            </label>
            <button
              onClick={submit}
              disabled={!body.trim()}
              className="flex items-center gap-1.5"
              style={{
                ...TYPE.meta,
                fontWeight: 600,
                padding: "9px 18px",
                borderRadius: R.control,
                backgroundColor: body.trim() ? UW.purple : UW.band,
                color: body.trim() ? UW.white : UW.inkSubtle,
                cursor: body.trim() ? "pointer" : "default",
              }}
            >
              <Send size={13} />
              Post
            </button>
          </div>
          <p className="mt-1.5" style={{ fontSize: 11, color: UW.inkSubtle }}>
            Posting as {anonymous ? "anonymous" : user.name} ·{" "}
            {shortProgram(user.program)}, {user.year}
          </p>
        </div>
      </div>
    </div>
  );
}

function CommentCard({
  comment: c,
  replying,
  onLike,
  onLikeReply,
  onToggleReply,
  onSubmitReply,
}: {
  comment: Comment;
  replying: boolean;
  onLike: () => void;
  onLikeReply: (id: string) => void;
  onToggleReply: () => void;
  onSubmitReply: (text: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <div
      style={{
        backgroundColor: UW.card,
        border: `1px solid ${UW.line}`,
        borderRadius: R.card,
        overflow: "hidden",
      }}
    >
      <div className="p-4">
        <Byline entry={c} kind={c.kind} />
        <p className="mt-2" style={{ ...TYPE.body, color: UW.ink }}>
          {c.body}
        </p>
        <div className="mt-2.5 flex items-center gap-4">
          <LikeButton count={c.likes} onClick={onLike} />
          <button
            onClick={onToggleReply}
            className="flex items-center gap-1.5"
            style={{ ...TYPE.meta, color: UW.inkSubtle }}
          >
            <CornerDownRight size={12} />
            Reply
          </button>
        </div>
      </div>

      {c.replies.map((r) => (
        <div
          key={r.id}
          className="px-4 py-3"
          style={{
            borderTop: `1px solid ${UW.lineSoft}`,
            backgroundColor: UW.band,
          }}
        >
          <Byline entry={r} />
          <p className="mt-1.5" style={{ ...TYPE.body, color: UW.inkMid }}>
            {r.body}
          </p>
          <div className="mt-1.5">
            <LikeButton count={r.likes} onClick={() => onLikeReply(r.id)} />
          </div>
        </div>
      ))}

      {replying && (
        <div className="p-4" style={{ borderTop: `1px solid ${UW.lineSoft}` }}>
          <textarea
            autoFocus
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Reply…"
            style={{
              width: "100%",
              padding: "8px 10px",
              ...TYPE.body,
              fontFamily: FONT_SANS,
              border: `1px solid ${UW.line}`,
              borderRadius: R.control,
              outline: "none",
              resize: "vertical",
            }}
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => text.trim() && onSubmitReply(text.trim())}
              style={{
                ...TYPE.meta,
                fontWeight: 600,
                padding: "7px 14px",
                borderRadius: R.control,
                backgroundColor: text.trim() ? UW.purple : UW.band,
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

function Byline({ entry, kind }: { entry: Reply; kind?: CommentKind }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <p style={{ ...TYPE.meta, color: UW.ink }}>
        <span style={{ fontWeight: 700 }}>{entry.author ?? "Anonymous"}</span>
        <span style={{ color: UW.inkSubtle }}>
          {" "}
          · {entry.program}, {entry.year} · {entry.when}
        </span>
        {entry.isContributor && (
          <span style={{ color: UW.goldInk, fontWeight: 600 }}>
            {" "}
            · contributor
          </span>
        )}
      </p>
      {kind === "question" && (
        <span
          className="flex-shrink-0"
          style={{ ...TYPE.label, fontSize: 9.5, color: UW.purple }}
        >
          Question
        </span>
      )}
    </div>
  );
}

function LikeButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5"
      style={{ ...TYPE.meta, color: UW.inkSubtle }}
    >
      <Heart size={12} strokeWidth={1.7} />
      {count}
    </button>
  );
}
