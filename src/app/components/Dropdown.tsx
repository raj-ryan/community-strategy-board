import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { UW, CONTROL_BOX, TYPE, FONT_SANS } from "../uw";

// One dropdown for both filters.
//
// The course type used to be a native select, which meant the operating system
// drew its menu — a black panel next to the board's own white one. Both now
// use this, so the trigger and the menu match whichever filter you open.

export interface Option {
  value: string;
  label: string;
  count?: number;
}

export interface OptionGroup {
  label?: string;
  options: Option[];
}

export function Dropdown({
  value,
  defaultValue,
  groups,
  onChange,
  ariaLabel,
  searchable = false,
  searchPlaceholder = "Search",
  panelWidth = 240,
  footer,
}: {
  value: string;
  /** The "everything" option; the trigger reads as unset while it is chosen. */
  defaultValue: string;
  groups: OptionGroup[];
  onChange: (value: string) => void;
  ariaLabel: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  panelWidth?: number;
  footer?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        options: g.options.filter(
          (o) =>
            o.label.toLowerCase().includes(q) ||
            (g.label ?? "").toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.options.length > 0);
  }, [groups, query]);

  const flat = useMemo(() => shown.flatMap((g) => g.options), [shown]);

  const selected = groups
    .flatMap((g) => g.options)
    .find((o) => o.value === value);
  const isSet = value !== defaultValue;

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function choose(v: string) {
    onChange(v);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(
        flat.length - 1,
        Math.max(0, active + (e.key === "ArrowDown" ? 1 : -1)),
      );
      setActive(next);
      list.current
        ?.querySelector(`[data-index="${next}"]`)
        ?.scrollIntoView({ block: "nearest" });
      return;
    }
    if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      choose(flat[active].value);
    }
  }

  return (
    <div ref={root} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onKeyDown={!searchable ? onKeyDown : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex items-center gap-2 transition-colors"
        style={{
          ...CONTROL_BOX,
          fontWeight: isSet ? 600 : CONTROL_BOX.fontWeight,
          backgroundColor: UW.card,
          color: isSet ? UW.purple : UW.inkMid,
          border: `1px solid ${isSet ? UW.purpleLine : UW.line}`,
        }}
      >
        <span className="flex-1 truncate text-left">
          {selected?.label ?? defaultValue}
        </span>
        {isSet && (
          <span
            role="button"
            tabIndex={0}
            aria-label={`Clear ${ariaLabel}`}
            onClick={(e) => {
              e.stopPropagation();
              onChange(defaultValue);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onChange(defaultValue);
              }
            }}
            style={{ display: "flex" }}
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
          className="absolute left-0 z-30 mt-1.5 flex flex-col overflow-hidden"
          style={{
            width: panelWidth,
            maxWidth: "calc(100vw - 48px)",
            backgroundColor: UW.card,
            border: `1px solid ${UW.line}`,
            borderRadius: 12,
            boxShadow: "0 12px 32px rgba(34,32,30,0.14)",
          }}
        >
          {searchable && (
            <div
              className="flex items-center gap-2 px-3 py-2.5"
              style={{ borderBottom: `1px solid ${UW.lineSoft}` }}
            >
              <Search size={14} style={{ color: UW.inkSubtle }} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                style={{
                  flex: 1,
                  minWidth: 0,
                  ...TYPE.meta,
                  fontSize: 13,
                  fontFamily: FONT_SANS,
                  border: "none",
                  outline: "none",
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
          )}

          <div
            ref={list}
            role="listbox"
            className="csb-rail overflow-y-auto py-1"
            style={{ maxHeight: 300 }}
          >
            {flat.length === 0 ? (
              <p
                className="px-3 py-6 text-center"
                style={{ ...TYPE.meta, color: UW.inkSubtle }}
              >
                Nothing matches “{query}”.
              </p>
            ) : (
              shown.map((group, gi) => (
                <div key={group.label ?? gi}>
                  {group.label && (
                    <p
                      className="sticky top-0 px-3 py-1.5"
                      style={{
                        ...TYPE.label,
                        fontSize: 9.5,
                        color: UW.inkSubtle,
                        backgroundColor: UW.band,
                      }}
                    >
                      {group.label}
                    </p>
                  )}
                  {group.options.map((o) => {
                    const index = flat.indexOf(o);
                    return (
                      <button
                        key={o.value}
                        role="option"
                        aria-selected={o.value === value}
                        data-index={index}
                        onMouseEnter={() => setActive(index)}
                        onClick={() => choose(o.value)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left"
                        style={{
                          ...TYPE.chip,
                          fontSize: 13,
                          fontWeight: o.value === value ? 600 : 500,
                          color: o.count === 0 ? UW.inkSubtle : UW.ink,
                          backgroundColor:
                            active === index ? UW.purpleTint : "transparent",
                        }}
                      >
                        <span className="flex-1 truncate">{o.label}</span>
                        {o.count !== undefined && (
                          <span style={{ ...TYPE.meta, color: UW.inkSubtle }}>
                            {o.count}
                          </span>
                        )}
                        {o.value === value && (
                          <Check size={13} style={{ color: UW.purple }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {footer && (
            <p
              className="px-3 py-2"
              style={{
                ...TYPE.meta,
                fontSize: 11,
                color: UW.inkSubtle,
                borderTop: `1px solid ${UW.lineSoft}`,
                backgroundColor: UW.band,
              }}
            >
              {footer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
