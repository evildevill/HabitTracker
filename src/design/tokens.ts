import { Platform } from "react-native";

// Exact normalized RGB values carried forward from DESIGN.md.
// Convert to React Native rgba strings at the rendering boundary; do not add a second hex palette.
export const RGB = {
  canvas: [0.955, 0.968, 0.958],
  paper: [0.985, 0.989, 0.982],
  ink: [0.055, 0.105, 0.09],
  secondary: [0.31, 0.38, 0.35],
  brand: [0.055, 0.49, 0.40],
  brandDark: [0.035, 0.23, 0.19],
  mint: [0.39, 0.78, 0.67],
  citrus: [0.86, 0.93, 0.28],
  coral: [0.94, 0.43, 0.31],
  sky: [0.34, 0.62, 0.78],
  sand: [0.91, 0.82, 0.61],
} as const;

export type ColorToken = keyof typeof RGB;

export function color(token: ColorToken, opacity = 1): string {
  const [red, green, blue] = RGB[token];
  return "rgba(" +
    Math.round(red * 255) + ", " +
    Math.round(green * 255) + ", " +
    Math.round(blue * 255) + ", " +
    opacity + ")";
}

export const colors = Object.fromEntries(
  (Object.keys(RGB) as ColorToken[]).map((token) => [token, color(token)])
) as Record<ColorToken, string>;

export const surfaces = {
  card: color("paper", 0.94),
  border: color("ink", 0.08),
  mutedBorder: color("ink", 0.06),
  subtleInk: color("ink", 0.04),
} as const;

export const typography = {
  eyebrow: 11,
  screenTitle: 36,
  screenSubtitle: 15,
  count: 12,
  searchIcon: 15,
  emptyStateIcon: 32,
  emptyStateTitle: 19,
  emptyStateBody: 13,
  wordmark: 29,
} as const;

export const geometry = {
  brandMark: 42,
  searchFieldHeight: 50,
  searchFieldRadius: 17,
  habitIcon: 54,
  glassCardRadius: 26,
  emptyStateRadius: 24,
  selectedTabWidth: 104,
  unselectedTabWidth: 43,
  tabHeight: 44,
  tabDockRadius: 24,
} as const;

export const systemFont = Platform.select({ ios: "System", android: "sans-serif", default: "System" });
export const roundedFont = systemFont;
export const monoFont = systemFont;
