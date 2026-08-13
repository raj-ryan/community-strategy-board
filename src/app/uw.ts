// Warm paper, UW purple, one typeface.
//
// The board reads as a quiet notebook rather than a dashboard: an off-white
// page, white cards with soft edges, hairline warm-grey rules, and colour only
// where something is chosen or actionable.

export const UW = {
  purple: "#39275B",
  purpleDark: "#2B1D46",
  purpleTint: "#F2EFF6",
  purpleLine: "#D8D0E4",

  gold: "#C79900",
  goldTint: "#FBF3DF",
  goldLine: "#E7D49B",
  goldInk: "#7A5C00",

  paper: "#FAF8F5",
  card: "#FFFFFF",
  band: "#F4F1EC",

  line: "#E6E1D9",
  lineSoft: "#F0ECE5",

  ink: "#22201E",
  inkMid: "#4A4744",
  inkMuted: "#6E6A65",
  inkSubtle: "#96918B",
  white: "#FFFFFF",
} as const;

/** Corner radii. Cards are softer than controls, controls softer than chips. */
export const R = {
  card: 14,
  control: 10,
  chip: 999,
} as const;

export const FONT_SANS = "'Noto Sans', system-ui, -apple-system, sans-serif";

/**
 * The two filter dropdowns are a native select and a custom popover trigger.
 * They only look like one control if every box property comes from here.
 */
export const CONTROL_BOX = {
  width: 210,
  // An explicit height: a native select and a button resolve line-height
  // slightly differently, which left them a pixel apart.
  height: 40,
  padding: "9px 12px",
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "20px",
  fontFamily: FONT_SANS,
  outline: "none",
} as const;

/** The board's type scale, applied as-is rather than improvised per component. */
export const TYPE = {
  boardTitle: { fontSize: 32, fontWeight: 700, lineHeight: "40px" },
  boardDescription: { fontSize: 16, fontWeight: 400, lineHeight: "24px" },
  sectionQuestion: { fontSize: 20, fontWeight: 600, lineHeight: "28px" },
  chip: { fontSize: 14, fontWeight: 500, lineHeight: "20px" },
  strategyTitle: { fontSize: 18, fontWeight: 700, lineHeight: "24px" },
  body: { fontSize: 14, fontWeight: 400, lineHeight: "21px" },
  meta: { fontSize: 12, fontWeight: 500, lineHeight: "18px" },
  label: {
    fontSize: 11,
    fontWeight: 600,
    lineHeight: "16px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
} as const;
