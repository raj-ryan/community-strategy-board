import { useState } from "react";
import { ChevronDown, PenLine, ArrowLeft, Mail } from "lucide-react";
import { boardStats, PROGRAM_GROUPS, RANK_BASES, STRATEGIES } from "../data";
import { UW } from "../uw";

const SECTIONS = [
  { id: "what", label: "What this board is" },
  { id: "use", label: "How to use it" },
  { id: "ranking", label: "How ranking works" },
  { id: "review", label: "How strategies are reviewed" },
  { id: "privacy", label: "Names, anonymity and privacy" },
  { id: "faq", label: "Questions students ask" },
  { id: "contact", label: "Contact the team" },
];

const FAQ = [
  {
    q: "Do I need to sign in?",
    a: "No. Anyone with a UW NetID can read the whole board without signing in. You are asked to sign in only when you save a strategy, like one, post in a discussion, or contribute your own, because those actions are attached to a person.",
  },
  {
    q: "Is this an official University policy page?",
    a: "No. Everything here is practical advice written by graduate students about how they handled course systems. Where a strategy touches on a formal process, such as extensions or incompletes, speak to your graduate program adviser, whose guidance takes precedence.",
  },
  {
    q: "Why does the board ask what I need help with before showing strategies?",
    a: "Concept testing found that a wall of cards makes choosing harder, and that students arrive with a specific problem rather than a general interest in organisation. Choosing a difficulty first narrows the board to the strategies other students used for that problem.",
  },
  {
    q: "A strategy did not work for me. Is that useful to post?",
    a: "Very. A strategy that failed in a clinical placement or a studio is exactly the context the next student needs. Use Share an experience and mark it as did not fit, and say briefly what your courses looked like.",
  },
  {
    q: "Can I contribute before I have finished a quarter?",
    a: "You can, but most people find they have something worth writing near the end of their first quarter. There is no expectation to contribute, and no reminder will chase you.",
  },
  {
    q: "Who can see my program and year?",
    a: "Everyone reading the board. Program and year are shown on every card and comment because students told us they judge relevance by academic context. Your name is optional; your program and year are not.",
  },
];

export function AboutPage({
  onBack,
  onShare,
}: {
  onBack: () => void;
  onShare: () => void;
}) {
  const stats = boardStats(STRATEGIES);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 font-semibold hover:underline"
        style={{ fontSize: 12.5, color: UW.purple }}
      >
        <ArrowLeft size={13} />
        Back to the strategy board
      </button>

      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* In-page navigation */}
        <nav className="lg:sticky lg:top-6 lg:self-start">
          <p
            className="mb-2 font-bold uppercase"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.1em",
              color: UW.inkMuted,
            }}
          >
            On this page
          </p>
          <ul style={{ borderLeft: `2px solid ${UW.line}` }}>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block py-1.5 pl-3 transition-colors hover:text-[#39275B]"
                  style={{ fontSize: 12.5, color: UW.inkMid }}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <p
            className="font-bold uppercase"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.13em",
              color: UW.goldInk,
            }}
          >
            About
          </p>
          <h1
            className="mt-1"
            style={{
              fontSize: 34,
              lineHeight: "40px",
              fontWeight: 600,
              color: UW.purple,
              letterSpacing: "-0.015em",
            }}
          >
            The Community Strategy Board
          </h1>
          <p
            className="mt-3 max-w-2xl"
            style={{ fontSize: 15, lineHeight: "24px", color: UW.inkMid }}
          >
            A peer-contributed collection of practical strategies for navigating
            course systems at the University of Washington, written by graduate
            students for the students arriving after them.
          </p>

          <dl
            className="mt-6 grid gap-px sm:grid-cols-4"
            style={{ backgroundColor: UW.line }}
          >
            <Stat value={stats.strategies} label="Strategies" />
            <Stat value={stats.programs} label="Programs covered" />
            <Stat value={stats.tried.toLocaleString()} label="Times tried" />
            <Stat value={`${stats.keptPct}%`} label="Kept using" />
          </dl>

          <Section id="what" title="What this board is">
            <p>
              Course information at UW is distributed across Canvas, email,
              syllabi, and whatever system each instructor prefers. Nothing
              about that is unusual, but it means every course has to be learned
              twice: once for its content, and once for how it communicates.
              Students who did their previous degree in a different educational
              culture carry the heaviest version of that second task.
            </p>
            <p>
              This board collects what other graduate students worked out. Each
              card is one specific action, not general advice: not “be
              organised”, but “export the Canvas calendar”, “ask how deadline
              changes get announced”, “download the readings in week 1”.
            </p>
            <p>
              It is designed to be opened from Canvas rather than remembered as
              a separate website, and to be readable without signing in.
            </p>
          </Section>

          <Section id="use" title="How to use it">
            <ol className="flex flex-col gap-3">
              {[
                [
                  "Start with the difficulty, not the tool.",
                  "Choose what you need help with and the board narrows to the strategies other students used for that problem.",
                ],
                [
                  "Check whether the contributor's context resembles yours.",
                  "Every card shows the program and year of the person who wrote it, and the course types where it worked.",
                ],
                [
                  "Open the strategy and read the discussion.",
                  "Comments are where you find out whether it survives a clinical rotation, a studio, or a 40-person seminar.",
                ],
                [
                  "Save two or three to My Quarter.",
                  "Saving twenty is the same as saving none.",
                ],
                [
                  "Come back at the end of the quarter.",
                  "Contribute one strategy, or one comment on a strategy you tried. It is optional and it is not chased.",
                ],
              ].map(([title, body], i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center font-bold"
                    style={{
                      fontSize: 11,
                      backgroundColor: UW.purple,
                      color: UW.white,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span>
                    <strong style={{ color: UW.ink }}>{title}</strong> {body}
                  </span>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="ranking" title="How ranking works">
            <p>
              There is no single score. Concept testing found that students
              disagree about which measure to trust, so the board keeps them
              separate and always names the one it is sorting by. You can switch
              between them anywhere a ranking appears.
            </p>
            <ul className="my-3 flex flex-col gap-2">
              {RANK_BASES.map((b) => (
                <li
                  key={b.id}
                  className="flex gap-3 p-3"
                  style={{
                    backgroundColor: UW.band,
                    borderLeft: `3px solid ${UW.gold}`,
                  }}
                >
                  <strong style={{ minWidth: 110, color: UW.purple }}>
                    {b.label}
                  </strong>
                  <span>{b.explain}</span>
                </li>
              ))}
            </ul>
            <p>
              Rankings apply to strategies, never to students. There is no
              contributor leaderboard, no points, and no public recognition
              attached to a name, because participants in our concept test
              described that kind of visibility as uncomfortable rather than
              motivating.
            </p>
          </Section>

          <Section id="review" title="How strategies are reviewed">
            <p>
              Every submission is reviewed by the team before it is published.
              Your strategy appears on your own board immediately, marked{" "}
              <strong>In review</strong>, and once it is approved it is
              published to everyone. Reviews are usually completed within a few
              working days.
            </p>
            <p>
              Review means checking the wording is clear, combining duplicates,
              and asking for more detail where a step is hard to follow. We do
              not rewrite your experience or reject a strategy for being unusual
              — a strategy that only works in a clinical placement or a studio
              is worth publishing precisely because it is specific.
            </p>
            <p>
              A submission that names an individual instructor, shares another
              student's work, or gives advice that would breach academic
              integrity is returned rather than published. Anything posted in a
              discussion can be reported for review from within the thread.
            </p>
          </Section>

          <Section id="privacy" title="Names, anonymity and privacy">
            <p>
              Every strategy and every comment shows a program and a year,
              because that is how readers judge whether advice applies to them.
              Your name is optional: you can post as yourself or anonymously,
              and you can choose differently each time.
            </p>
            <p>
              Anonymous posts still show program and year. Nothing on this board
              is shared with instructors, and nothing you save to My Quarter is
              visible to anyone else.
            </p>
          </Section>

          <Section id="faq" title="Questions students ask">
            <div style={{ border: `1px solid ${UW.line}` }}>
              {FAQ.map((item, i) => (
                <div
                  key={i}
                  style={{ borderTop: i > 0 ? `1px solid ${UW.line}` : "none" }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F5F4F7]"
                    style={{ fontSize: 14, fontWeight: 600, color: UW.purple }}
                  >
                    {item.q}
                    <ChevronDown
                      size={15}
                      style={{
                        flexShrink: 0,
                        transition: "transform 160ms",
                        transform: openFaq === i ? "rotate(180deg)" : "none",
                      }}
                    />
                  </button>
                  {openFaq === i && (
                    <p
                      className="px-4 pb-4"
                      style={{
                        fontSize: 13.5,
                        lineHeight: "21px",
                        color: UW.inkMid,
                      }}
                    >
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>

          <Section id="contact" title="Contact the team">
            <p>
              The board is maintained by graduate students in the Graduate
              Student Experience initiative. It currently covers{" "}
              {stats.programs} programs across {PROGRAM_GROUPS.length} schools
              and colleges, and grows when students contribute.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={onShare}
                className="flex items-center gap-2 font-semibold"
                style={{
                  padding: "11px 20px",
                  fontSize: 13,
                  backgroundColor: UW.purple,
                  color: UW.white,
                }}
              >
                <PenLine size={14} />
                Share a strategy
              </button>
              <a
                href="mailto:strategyboard@uw.edu"
                className="flex items-center gap-2 font-semibold"
                style={{
                  padding: "11px 20px",
                  fontSize: 13,
                  color: UW.purple,
                  border: `1px solid ${UW.purple}`,
                }}
              >
                <Mail size={14} />
                strategyboard@uw.edu
              </a>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-9 scroll-mt-6">
      <h2
        className="pb-2 font-semibold"
        style={{
          fontSize: 22,
          color: UW.purple,
          borderBottom: `2px solid ${UW.purple}`,
        }}
      >
        {title}
      </h2>
      <div
        className="mt-3 flex max-w-3xl flex-col gap-3"
        style={{ fontSize: 14, lineHeight: "22px", color: UW.inkMid }}
      >
        {children}
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="px-4 py-3" style={{ backgroundColor: UW.white }}>
      <dd
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: UW.purple,
        }}
      >
        {value}
      </dd>
      <dt
        className="mt-0.5 font-bold uppercase"
        style={{ fontSize: 9.5, letterSpacing: "0.08em", color: UW.inkMuted }}
      >
        {label}
      </dt>
    </div>
  );
}
