// University of Washington web color palette.
// Primary: PMS 273 / #39275B. Secondary: PMS 117 gold, black, gray, white.
// Gold is used for accents and rules only — at small text sizes it is replaced
// by goldInk, which clears WCAG AA on white.

export const UW = {
  purple: "#39275B",
  purpleDark: "#2B1D46",
  purpleMid: "#4B3775",
  purpleTint: "#F2EFF6",
  purpleTintDeep: "#E4DEEE",
  purpleLine: "#CFC6DF",

  gold: "#C79900",
  goldTint: "#FBF4E0",
  goldLine: "#E8D08A",
  goldInk: "#7A5C00",

  black: "#000000",
  ink: "#1C1A22",
  inkMid: "#3D3A45",
  inkMuted: "#5F5B69",
  inkSubtle: "#767281",

  gray: "#A0A0A0",
  line: "#DCDAE0",
  lineSoft: "#E9E7ED",
  band: "#F5F4F7",
  bandDeep: "#EDEBF1",
  white: "#FFFFFF",
} as const;

export const FONT_SANS =
  "'Encode Sans', 'Open Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const FONT_SERIF =
  "'Adobe Garamond Pro', Garamond, Georgia, 'Times New Roman', serif";
