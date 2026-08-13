import { PenLine } from "lucide-react";
import { UW, R, TYPE } from "../uw";

export type View = "board" | "top" | "about";

const NAV: Array<[View, string]> = [
  ["board", "Strategy Board"],
  ["top", "Top strategies"],
  ["about", "About"],
];

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
    <header style={{ backgroundColor: UW.paper }}>
      <div style={{ backgroundColor: UW.purple }}>
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-2">
          <span
            className="uppercase"
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "0.14em",
              color: UW.white,
            }}
          >
            University of Washington
          </span>
          <span style={{ fontSize: 11.5, color: "#C9BFDC" }}>
            Graduate Student Experience
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-6 pt-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 style={{ ...TYPE.boardTitle, color: UW.ink }}>
              Community Strategy Board
            </h1>
            <p
              className="mt-1"
              style={{ ...TYPE.boardDescription, color: UW.inkMuted }}
            >
              Strategies shared by students who have navigated these courses
              before you.
            </p>
          </div>
          <button
            onClick={onShare}
            className="flex flex-shrink-0 items-center gap-2 transition-colors"
            style={{
              ...TYPE.chip,
              fontWeight: 600,
              padding: "10px 16px",
              borderRadius: R.control,
              color: UW.ink,
              backgroundColor: UW.card,
              border: `1px solid ${UW.line}`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = UW.band)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = UW.card)
            }
          >
            <PenLine size={14} />
            Share a strategy
          </button>
        </div>

        <nav
          className="mt-6 flex gap-6"
          style={{ borderBottom: `1px solid ${UW.line}` }}
        >
          {NAV.map(([id, label]) => (
            <button
              key={id}
              onClick={() => onView(id)}
              className="pb-2.5 transition-colors"
              style={{
                ...TYPE.chip,
                fontWeight: view === id ? 700 : 500,
                color: view === id ? UW.ink : UW.inkMuted,
                borderBottom: `2px solid ${view === id ? UW.purple : "transparent"}`,
                marginBottom: -1,
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer({ onAbout }: { onAbout: () => void }) {
  return (
    <footer className="mx-auto mt-16 max-w-[1120px] px-6 pb-10">
      <div
        className="flex flex-wrap items-center justify-between gap-3 pt-5"
        style={{
          borderTop: `1px solid ${UW.line}`,
          ...TYPE.meta,
          color: UW.inkSubtle,
        }}
      >
        <p>
          A student-led project of the Graduate Student Experience initiative ·
          University of Washington
        </p>
        <button
          onClick={onAbout}
          className="hover:underline"
          style={{ color: UW.inkMuted }}
        >
          About this board
        </button>
      </div>
    </footer>
  );
}
