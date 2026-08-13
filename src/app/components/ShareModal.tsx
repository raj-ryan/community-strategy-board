import { useState } from "react";
import { X, Check, AlertCircle } from "lucide-react";
import {
  CHALLENGES,
  COURSE_TYPES,
  PROGRAM_GROUPS,
  shortChallenge,
  type Strategy,
} from "../data";
import { UW, FONT_SANS } from "../uw";

// Contribution form.
//
// A submission becomes a real card on the board immediately, flagged as in
// review, so the contributor can see what they made rather than reading a
// confirmation message and having to trust it.

interface FormState {
  title: string;
  benefit: string;
  challenge: string;
  whyHelps: string;
  steps: [string, string, string];
  bestTime: string;
  name: string;
  anonymous: boolean;
  program: string;
  year: string;
  courseType: string;
  acrossPrograms: boolean;
}

const EMPTY: FormState = {
  title: "",
  benefit: "",
  challenge: "",
  whyHelps: "",
  steps: ["", "", ""],
  bestTime: "",
  name: "",
  anonymous: false,
  program: "",
  year: "",
  courseType: "",
  acrossPrograms: false,
};

export function ShareModal({
  nextId,
  onClose,
  onSubmit,
  onOpenSubmission,
}: {
  nextId: number;
  onClose: () => void;
  onSubmit: (s: Strategy) => void;
  onOpenSubmission: (id: number) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<string[]>([]);
  const [submittedId, setSubmittedId] = useState<number | null>(null);

  const set = (u: Partial<FormState>) => setForm((prev) => ({ ...prev, ...u }));

  function validate(): string[] {
    const missing: string[] = [];
    if (!form.title.trim()) missing.push("a strategy title");
    if (!form.benefit.trim()) missing.push("a one-sentence explanation");
    if (!form.challenge) missing.push("the problem it solves");
    if (!form.steps[0].trim()) missing.push("at least one step");
    if (!form.program) missing.push("your program");
    if (!form.year) missing.push("your year");
    return missing;
  }

  function submit() {
    const missing = validate();
    setErrors(missing);
    if (missing.length) return;

    const courseTypes = form.acrossPrograms
      ? ["Useful across programs", form.courseType].filter(Boolean)
      : [form.courseType || "Useful across programs"];

    const strategy: Strategy = {
      id: nextId,
      title: form.title.trim(),
      benefit: form.benefit.trim(),
      tags: [
        shortChallenge(form.challenge),
        form.courseType || "Student contributed",
      ],
      author: form.anonymous ? null : form.name.trim() || "You",
      year: form.year,
      program: form.program,
      relevanceNote: form.acrossPrograms
        ? "Useful across programs"
        : form.courseType || "Shared by a student",
      courseTypes,
      challenges: [form.challenge],
      likes: 0,
      saves: 0,
      tried: 1,
      stillUsing: 1,
      whyHelps:
        form.whyHelps.trim() ||
        "Shared by a student in this program based on their own experience.",
      steps: form.steps.map((s) => s.trim()).filter(Boolean),
      bestTime: form.bestTime.trim() || "Shared without a specific timing.",
      pending: true,
    };

    onSubmit(strategy);
    setSubmittedId(strategy.id);
  }

  if (submittedId !== null) {
    return (
      <Overlay onClose={onClose}>
        <div className="py-6 text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center"
            style={{ backgroundColor: UW.purple }}
          >
            <Check size={22} style={{ color: UW.gold }} />
          </div>
          <h2
            className="mb-2 font-semibold"
            style={{ fontSize: 24, color: UW.purple }}
          >
            Your strategy is on the board
          </h2>
          <p
            className="mx-auto max-w-sm"
            style={{ fontSize: 14, lineHeight: "22px", color: UW.inkMid }}
          >
            It is visible to you now and marked as in review. The team will
            check the wording and look for duplicates, and once it is approved
            it will be published to everyone.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => {
                onOpenSubmission(submittedId);
                onClose();
              }}
              className="font-semibold"
              style={{
                padding: "11px 22px",
                fontSize: 13,
                backgroundColor: UW.purple,
                color: UW.white,
              }}
            >
              View your strategy
            </button>
            <button
              onClick={onClose}
              className="font-semibold"
              style={{
                padding: "11px 22px",
                fontSize: 13,
                color: UW.purple,
                border: `1px solid ${UW.purple}`,
              }}
            >
              Back to the board
            </button>
          </div>
        </div>
      </Overlay>
    );
  }

  const input: React.CSSProperties = {
    width: "100%",
    padding: "8px 11px",
    fontSize: 13.5,
    fontFamily: FONT_SANS,
    border: `1px solid ${UW.line}`,
    backgroundColor: UW.white,
    color: UW.ink,
    outline: "none",
  };

  return (
    <Overlay onClose={onClose}>
      <div
        className="mb-5 flex items-start justify-between gap-4 pb-4"
        style={{ borderBottom: `1px solid ${UW.line}` }}
      >
        <div>
          <p
            className="font-bold uppercase"
            style={{ fontSize: 10, letterSpacing: "0.13em", color: UW.goldInk }}
          >
            Community Strategy Board
          </p>
          <h2
            className="mt-1 font-semibold"
            style={{ fontSize: 25, color: UW.purple }}
          >
            Share a strategy
          </h2>
          <p className="mt-1" style={{ fontSize: 12.5, color: UW.inkMuted }}>
            One specific action that worked in your courses. Five minutes is
            enough.
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ color: UW.inkSubtle }}
          className="mt-1"
          onMouseEnter={(e) => (e.currentTarget.style.color = UW.purple)}
          onMouseLeave={(e) => (e.currentTarget.style.color = UW.inkSubtle)}
        >
          <X size={18} />
        </button>
      </div>

      {errors.length > 0 && (
        <div
          className="mb-4 flex gap-2 p-3"
          style={{
            backgroundColor: "#FBEDED",
            border: "1px solid #E4BDBD",
            color: "#7A1F1F",
          }}
        >
          <AlertCircle size={15} className="mt-px flex-shrink-0" />
          <p style={{ fontSize: 12.5, lineHeight: "19px" }}>
            Still needed: {errors.join(", ")}.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Field label="Strategy title" required>
          <input
            style={input}
            value={form.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="e.g. Export the Canvas calendar"
          />
        </Field>

        <Field label="One-sentence explanation" required>
          <input
            style={input}
            value={form.benefit}
            onChange={(e) => set({ benefit: e.target.value })}
            placeholder="What does someone get out of doing this?"
          />
        </Field>

        <Field label="Which problem does it solve?" required>
          <select
            style={input}
            value={form.challenge}
            onChange={(e) => set({ challenge: e.target.value })}
          >
            <option value="">Select a problem</option>
            {CHALLENGES.map((c) => (
              <option key={c} value={c}>
                {shortChallenge(c)} — {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Why it helps (optional)">
          <textarea
            rows={2}
            style={{ ...input, resize: "vertical" }}
            value={form.whyHelps}
            onChange={(e) => set({ whyHelps: e.target.value })}
            placeholder="What goes wrong without it?"
          />
        </Field>

        <Field label="Steps (up to three)" required>
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center font-bold"
                  style={{
                    fontSize: 11,
                    backgroundColor: UW.purpleTint,
                    color: UW.purple,
                  }}
                >
                  {i + 1}
                </span>
                <input
                  style={input}
                  value={form.steps[i]}
                  onChange={(e) => {
                    const steps = [...form.steps] as FormState["steps"];
                    steps[i] = e.target.value;
                    set({ steps });
                  }}
                  placeholder={
                    i === 0
                      ? "First step"
                      : i === 1
                        ? "Second step (optional)"
                        : "Third step (optional)"
                  }
                />
              </div>
            ))}
          </div>
        </Field>

        <Field label="Best time to use it (optional)">
          <input
            style={input}
            value={form.bestTime}
            onChange={(e) => set({ bestTime: e.target.value })}
            placeholder="e.g. Week 1, before the first assignment"
          />
        </Field>

        <div className="flex flex-wrap items-end gap-3">
          <Field label="Your name" className="min-w-[180px] flex-1">
            <input
              style={{
                ...input,
                backgroundColor: form.anonymous ? UW.band : UW.white,
                color: form.anonymous ? UW.inkSubtle : UW.ink,
              }}
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              disabled={form.anonymous}
              placeholder="First name"
            />
          </Field>
          <label
            className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 pb-2"
            style={{ fontSize: 12.5, color: UW.inkMid }}
          >
            <input
              type="checkbox"
              checked={form.anonymous}
              onChange={(e) => set({ anonymous: e.target.checked })}
              style={{ accentColor: UW.purple }}
            />
            Post anonymously
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Field label="Program" required className="min-w-[220px] flex-[2]">
            <select
              style={input}
              value={form.program}
              onChange={(e) => set({ program: e.target.value })}
            >
              <option value="">Select your program</option>
              {PROGRAM_GROUPS.map((g) => (
                <optgroup key={g.school} label={g.school}>
                  {g.programs.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label="Year" required className="min-w-[120px] flex-1">
            <select
              style={input}
              value={form.year}
              onChange={(e) => set({ year: e.target.value })}
            >
              <option value="">Select</option>
              {["Year 1", "Year 2", "Year 3+"].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <Field
            label="Course type where it worked"
            className="min-w-[200px] flex-1"
          >
            <select
              style={input}
              value={form.courseType}
              onChange={(e) => set({ courseType: e.target.value })}
            >
              <option value="">Select type</option>
              {COURSE_TYPES.filter((ct) => ct !== "Useful across programs").map(
                (ct) => (
                  <option key={ct}>{ct}</option>
                ),
              )}
            </select>
          </Field>
          <label
            className="flex flex-shrink-0 cursor-pointer items-center gap-2 pb-2"
            style={{ fontSize: 12.5, color: UW.inkMid }}
          >
            <input
              type="checkbox"
              checked={form.acrossPrograms}
              onChange={(e) => set({ acrossPrograms: e.target.checked })}
              style={{ accentColor: UW.purple }}
            />
            Useful across programs
          </label>
        </div>

        <p
          style={{
            padding: "11px 13px",
            fontSize: 12,
            lineHeight: "18px",
            backgroundColor: UW.purpleTint,
            borderLeft: `3px solid ${UW.gold}`,
            color: UW.inkMid,
          }}
        >
          Every submission is reviewed by the team before it is published. We
          may clarify wording, combine duplicates, or ask you for more detail.
          Please do not name an individual instructor.
        </p>

        <div className="flex gap-2">
          <button
            onClick={submit}
            className="flex-1 font-semibold"
            style={{
              padding: "12px 0",
              fontSize: 13.5,
              backgroundColor: UW.purple,
              color: UW.white,
            }}
          >
            Submit strategy
          </button>
          <button
            onClick={onClose}
            className="font-semibold"
            style={{
              padding: "12px 22px",
              fontSize: 13.5,
              color: UW.purple,
              border: `1px solid ${UW.purple}`,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:p-6"
      style={{
        backgroundColor: "rgba(20,17,28,0.6)",
        animation: "csbFade 180ms ease-out",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="my-auto w-full max-w-xl"
        style={{
          backgroundColor: UW.white,
          borderTop: `4px solid ${UW.gold}`,
          padding: 26,
          boxShadow: "0 12px 48px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
  required,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        className="font-bold uppercase"
        style={{ fontSize: 10, letterSpacing: "0.08em", color: UW.inkMuted }}
      >
        {label}
        {required && <span style={{ color: UW.goldInk }}> *</span>}
      </label>
      {children}
    </div>
  );
}
