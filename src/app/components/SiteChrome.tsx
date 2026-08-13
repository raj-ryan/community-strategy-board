import { PenLine, ChevronRight } from "lucide-react";
import { UW, FONT_SERIF } from "../uw";

export type View = "board" | "about";

const UTILITY_LINKS = ["MyUW", "Canvas", "Libraries", "Directories"];

export function Masthead({
  view,
  onView,
  onShare,
}: {
  view: View;
  onView: (v: View) => void;
  onShare: () => void;
}) {
  return (
    <header>
      <div style={{ backgroundColor: UW.purple }}>
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-2">
          <Wordmark />
          <nav className="hidden items-center gap-5 md:flex">
            {UTILITY_LINKS.map(l => (
              <a
                key={l}
                href="#"
                className="transition-opacity hover:opacity-70"
                style={{ fontSize: 11.5, color: "#D9D2E6" }}
              >
                {l}
              </a>
            ))}
            <span
              className="pl-5"
              style={{ fontSize: 11.5, color: "#B9AED0", borderLeft: "1px solid rgba(255,255,255,0.2)" }}
            >
              Signed in with UW NetID
            </span>
          </nav>
        </div>
      </div>

      <div style={{ height: 3, backgroundColor: UW.gold }} />

      <div style={{ backgroundColor: UW.white, borderBottom: `1px solid ${UW.line}` }}>
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 pb-0 pt-4">
          <div>
            <p
              className="font-bold uppercase"
              style={{ fontSize: 10, letterSpacing: "0.13em", color: UW.goldInk }}
            >
              Graduate Student Experience
            </p>
            <h1
              className="mt-0.5"
              style={{
                fontFamily: FONT_SERIF,
                fontSize: 27,
                lineHeight: "33px",
                fontWeight: 600,
                color: UW.purple,
                letterSpacing: "-0.015em",
              }}
            >
              Community Strategy Board
            </h1>
          </div>
          <button
            onClick={onShare}
            className="flex flex-shrink-0 items-center gap-2 transition-colors hover:brightness-110"
            style={{
              backgroundColor: UW.purple,
              color: UW.white,
              fontSize: 12.5,
              fontWeight: 700,
              padding: "9px 16px",
            }}
          >
            <PenLine size={13} />
            Share a strategy
          </button>
        </div>

        <div className="mx-auto max-w-[1600px] px-6">
          <nav className="mt-3 flex items-center gap-6">
            {(
              [
                ["board", "Strategy Board"],
                ["about", "About"],
              ] as Array<[View, string]>
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => onView(id)}
                className="pb-2.5 transition-colors"
                style={{
                  fontSize: 13,
                  fontWeight: view === id ? 700 : 500,
                  color: view === id ? UW.purple : UW.inkMuted,
                  borderBottom: `3px solid ${view === id ? UW.gold : "transparent"}`,
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div style={{ backgroundColor: UW.band, borderBottom: `1px solid ${UW.line}` }}>
        <div
          className="mx-auto flex max-w-[1600px] items-center gap-1.5 px-6 py-2"
          style={{ fontSize: 11.5, color: UW.inkMuted }}
        >
          <a href="#" className="hover:underline">UW Home</a>
          <ChevronRight size={11} style={{ color: UW.gray }} />
          <a href="#" className="hover:underline">Graduate Student Experience</a>
          <ChevronRight size={11} style={{ color: UW.gray }} />
          {view === "about" ? (
            <>
              <button onClick={() => {}} className="hover:underline">Community Strategy Board</button>
              <ChevronRight size={11} style={{ color: UW.gray }} />
              <span style={{ color: UW.ink, fontWeight: 600 }}>About</span>
            </>
          ) : (
            <span style={{ color: UW.ink, fontWeight: 600 }}>Community Strategy Board</span>
          )}
        </div>
      </div>
    </header>
  );
}

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex flex-shrink-0 items-center justify-center font-bold"
        style={{
          width: small ? 24 : 22,
          height: small ? 24 : 22,
          fontFamily: FONT_SERIF,
          fontSize: small ? 17 : 16,
          lineHeight: 1,
          color: UW.purple,
          backgroundColor: UW.white,
        }}
      >
        W
      </span>
      <span
        className="uppercase"
        style={{
          fontFamily: FONT_SERIF,
          fontSize: 13,
          letterSpacing: "0.11em",
          color: UW.white,
        }}
      >
        University <span className="lowercase italic">of</span> Washington
      </span>
    </div>
  );
}

export function Footer({ onShare, onAbout }: { onShare: () => void; onAbout: () => void }) {
  return (
    <footer className="mt-14">
      <div
        style={{
          backgroundColor: UW.purpleTint,
          borderTop: `1px solid ${UW.purpleLine}`,
          borderBottom: `3px solid ${UW.gold}`,
        }}
      >
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-6 px-6 py-8">
          <div className="max-w-2xl">
            <h2
              style={{ fontFamily: FONT_SERIF, fontSize: 21, fontWeight: 600, color: UW.purple }}
            >
              Finished a quarter? Write down the thing you wish you had known.
            </h2>
            <p className="mt-1.5" style={{ fontSize: 13.5, lineHeight: "21px", color: UW.inkMid }}>
              One strategy, three steps, five minutes. Every submission is reviewed by the
              team before it is published, and you may post anonymously.
            </p>
          </div>
          <button
            onClick={onShare}
            className="flex flex-shrink-0 items-center gap-2 transition-colors hover:brightness-110"
            style={{
              backgroundColor: UW.purple,
              color: UW.white,
              fontSize: 13,
              fontWeight: 700,
              padding: "11px 20px",
            }}
          >
            <PenLine size={14} />
            Share a strategy
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: UW.purple, color: "#D9D2E6" }}>
        <div className="mx-auto max-w-[1600px] px-6 py-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Wordmark small />
              <p className="mt-3" style={{ fontSize: 12, lineHeight: "19px" }}>
                A student-led project of the Graduate Student Experience initiative.
                Seattle, Washington.
              </p>
            </div>
            <Column
              title="This board"
              items={[
                { label: "About the board", onClick: onAbout },
                { label: "What the numbers mean", onClick: onAbout },
                { label: "Contribute a strategy", onClick: onShare },
              ]}
            />
            <Column
              title="Student support"
              items={[
                { label: "International Student Services" },
                { label: "Graduate student advising" },
                { label: "Counseling Center" },
                { label: "Disability Resources for Students" },
              ]}
            />
            <Column
              title="Course systems"
              items={[
                { label: "Canvas help" },
                { label: "UW IT service center" },
                { label: "Academic calendar" },
              ]}
            />
          </div>

          <div
            className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.18)", fontSize: 11 }}
          >
            <p>© {new Date().getFullYear()} University of Washington · Seattle</p>
            <div className="flex flex-wrap gap-5">
              {["Privacy", "Terms", "Accessibility", "Report a concern"].map(l => (
                <a key={l} href="#" className="hover:underline">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Column({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; onClick?: () => void }>;
}) {
  return (
    <div>
      <p
        className="font-bold uppercase"
        style={{ fontSize: 10, letterSpacing: "0.12em", color: UW.white }}
      >
        {title}
      </p>
      <ul className="mt-2.5 flex flex-col gap-1.5">
        {items.map(i => (
          <li key={i.label}>
            <button
              onClick={i.onClick}
              className="text-left hover:underline"
              style={{ fontSize: 12 }}
            >
              {i.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
