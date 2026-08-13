import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { ALL_PROGRAMS, PROGRAM_GROUPS } from "../data";
import { UW, CONTROL_BOX, FONT_SANS } from "../uw";

// Thirty programs is too many to scan in a horizontal rail — finding one meant
// dragging sideways past everything else. This is a searchable popover: type a
// few letters, or scroll a vertical list grouped by school.
//
// Counts reflect the other filters that are already applied, so a program that
// has nothing for the chosen difficulty reads as empty before you select it.

export function ProgramPicker({
  program,
  counts,
  totalCount,
  onChange,
}: {
  program: string;
  counts: Record<string, number>;
  totalCount: number;
  onChange: (program: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Flat list of what is currently visible, so keyboard selection and the
  // rendered rows can never disagree.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROGRAM_GROUPS.map((g) => ({
      ...g,
      programs: g.programs.filter(
        (p) =>
          !q ||
          p.toLowerCase().includes(q) ||
          g.school.toLowerCase().includes(q) ||
          g.short.toLowerCase().includes(q),
      ),
    })).filter((g) => g.programs.length > 0);
  }, [query]);

  const flat = useMemo(
    () => [
      ...(ALL_PROGRAMS.toLowerCase().includes(query.trim().toLowerCase())
        ? [ALL_PROGRAMS]
        : []),
      ...groups.flatMap((g) => g.programs),
    ],
    [groups, query],
  );

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function choose(p: string) {
    onChange(p);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(
        flat.length - 1,
        Math.max(0, active + (e.key === "ArrowDown" ? 1 : -1)),
      );
      setActive(next);
      listRef.current
        ?.querySelector(`[data-index="${next}"]`)
        ?.scrollIntoView({ block: "nearest" });
      return;
    }
    if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      choose(flat[active]);
    }
  }

  const selected = program !== ALL_PROGRAMS;

  return (
    <div ref={root} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 transition-colors"
        style={{
          ...CONTROL_BOX,
          fontWeight: selected ? 600 : CONTROL_BOX.fontWeight,
          backgroundColor: UW.card,
          color: selected ? UW.purple : UW.inkMid,
          border: `1px solid ${selected ? UW.purpleLine : UW.line}`,
        }}
      >
        <span className="flex-1 truncate text-left">{program}</span>
        {selected && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear program filter"
            onClick={(e) => {
              e.stopPropagation();
              onChange(ALL_PROGRAMS);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onChange(ALL_PROGRAMS);
              }
            }}
            style={{ display: "flex", opacity: 0.85 }}
          >
            <X size={13} />
          </span>
        )}
        <ChevronDown
          size={15}
          style={{
            transition: "transform 150ms",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 z-30 mt-1 flex flex-col"
          style={{
            width: 340,
            maxWidth: "calc(100vw - 48px)",
            backgroundColor: UW.white,
            border: `1px solid ${UW.line}`,
            borderTop: `3px solid ${UW.gold}`,
            boxShadow: "0 12px 32px rgba(28,26,34,0.18)",
          }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ borderBottom: `1px solid ${UW.line}` }}
          >
            <Search size={13} style={{ color: UW.inkSubtle }} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search programs or schools"
              aria-label="Search programs"
              style={{
                flex: 1,
                fontSize: 12.5,
                border: "none",
                outline: "none",
                fontFamily: FONT_SANS,
                backgroundColor: "transparent",
                color: UW.ink,
              }}
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X size={12} style={{ color: UW.inkSubtle }} />
              </button>
            )}
          </div>

          <div
            ref={listRef}
            role="listbox"
            className="overflow-y-auto"
            style={{ maxHeight: 320 }}
          >
            {flat.length === 0 ? (
              <p
                className="px-3 py-6 text-center"
                style={{ fontSize: 12.5, color: UW.inkSubtle }}
              >
                No program matches “{query}”.
              </p>
            ) : (
              <>
                {flat[0] === ALL_PROGRAMS && (
                  <Row
                    label={ALL_PROGRAMS}
                    count={totalCount}
                    index={0}
                    active={active === 0}
                    selected={program === ALL_PROGRAMS}
                    onHover={setActive}
                    onSelect={() => choose(ALL_PROGRAMS)}
                    emphasis
                  />
                )}
                {groups.map((g) => (
                  <div key={g.school}>
                    <p
                      className="sticky top-0 px-3 py-1.5 font-bold uppercase"
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.09em",
                        color: UW.inkMuted,
                        backgroundColor: UW.band,
                        borderTop: `1px solid ${UW.lineSoft}`,
                        borderBottom: `1px solid ${UW.lineSoft}`,
                      }}
                    >
                      {g.school}
                    </p>
                    {g.programs.map((p) => {
                      const index = flat.indexOf(p);
                      return (
                        <Row
                          key={p}
                          label={p}
                          count={counts[p] ?? 0}
                          index={index}
                          active={active === index}
                          selected={program === p}
                          onHover={setActive}
                          onSelect={() => choose(p)}
                        />
                      );
                    })}
                  </div>
                ))}
              </>
            )}
          </div>

          <p
            className="px-3 py-2"
            style={{
              fontSize: 10.5,
              color: UW.inkSubtle,
              borderTop: `1px solid ${UW.line}`,
              backgroundColor: UW.band,
            }}
          >
            {PROGRAM_GROUPS.flatMap((g) => g.programs).length} programs across{" "}
            {PROGRAM_GROUPS.length} schools and colleges. Counts follow the
            filters you have already set.
          </p>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  count,
  index,
  active,
  selected,
  onHover,
  onSelect,
  emphasis = false,
}: {
  label: string;
  count: number;
  index: number;
  active: boolean;
  selected: boolean;
  onHover: (i: number) => void;
  onSelect: () => void;
  emphasis?: boolean;
}) {
  const empty = count === 0;
  return (
    <button
      role="option"
      aria-selected={selected}
      data-index={index}
      onMouseEnter={() => onHover(index)}
      onClick={onSelect}
      className="flex w-full items-center gap-2 px-3 py-1.5 text-left"
      style={{
        fontSize: 12.5,
        fontWeight: selected || emphasis ? 700 : 500,
        color: empty ? UW.inkSubtle : UW.ink,
        backgroundColor: active ? UW.purpleTint : UW.white,
        borderLeft: `3px solid ${selected ? UW.gold : "transparent"}`,
      }}
    >
      <span className="flex-1 truncate">{label}</span>
      <span style={{ fontSize: 10.5, fontWeight: 600, color: UW.inkSubtle }}>
        {count}
      </span>
      {selected && <Check size={12} style={{ color: UW.purple }} />}
    </button>
  );
}
