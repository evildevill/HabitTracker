import { Platform } from "react-native";

// A quiet lilac palette: warm paper, ink-like plum, and one decisive violet.
export const RGB = {
  canvas: [0.973, 0.965, 0.988],
  paper: [1, 0.998, 1],
  ink: [0.16, 0.12, 0.24],
  secondary: [0.47, 0.43, 0.55],
  brand: [0.43, 0.31, 0.78],
  brandDark: [0.25, 0.18, 0.49],
  mint: [0.68, 0.84, 0.77],
  citrus: [0.94, 0.86, 0.55],
  coral: [0.91, 0.55, 0.59],
  sky: [0.58, 0.72, 0.9],
  sand: [0.89, 0.82, 0.92],
} as const;

export type ColorToken = keyof typeof RGB;
export function color(token: ColorToken, opacity = 1): string {
  const [red, green, blue] = RGB[token];
  return "rgba(" + Math.round(red * 255) + ", " + Math.round(green * 255) + ", " + Math.round(blue * 255) + ", " + opacity + ")";
}
export const colors = Object.fromEntries((Object.keys(RGB) as ColorToken[]).map((token) => [token, color(token)])) as Record<ColorToken, string>;
export const surfaces = {
  card: color("paper", 0.98),
  border: color("ink", 0.075),
  mutedBorder: color("ink", 0.055),
  subtleInk: color("ink", 0.035),
} as const;
export const typography = {
  eyebrow: 10, screenTitle: 38, screenSubtitle: 15, count: 13,
  searchIcon: 15, emptyStateIcon: 32, emptyStateTitle: 19, emptyStateBody: 14, wordmark: 29,
} as const;
export const geometry = {
  brandMark: 42, searchFieldHeight: 50, searchFieldRadius: 17, habitIcon: 54,
  glassCardRadius: 22, emptyStateRadius: 24, selectedTabWidth: 104,
  unselectedTabWidth: 43, tabHeight: 44, tabDockRadius: 24,
} as const;
export const systemFont = Platform.select({ ios: "System", android: "sans-serif", default: "System" });
export const roundedFont = systemFont;
export const monoFont = systemFont;
