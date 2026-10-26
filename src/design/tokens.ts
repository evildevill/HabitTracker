import { Platform } from "react-native";

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
  strongSurface: [0.035, 0.23, 0.19],
  onStrong: [0.985, 0.989, 0.982],
} as const;

const DARK_RGB = {
  canvas: [0.055, 0.059, 0.067],
  paper: [0.105, 0.11, 0.122],
  ink: [0.96, 0.965, 0.975],
  secondary: [0.68, 0.70, 0.74],
  brand: [0.36, 0.62, 0.98],
  brandDark: [0.16, 0.38, 0.78],
  mint: [0.20, 0.29, 0.40],
  citrus: [0.98, 0.80, 0.34],
  coral: [1.0, 0.49, 0.42],
  sky: [0.42, 0.66, 0.98],
  sand: [0.66, 0.61, 0.52],
  strongSurface: [0.20, 0.39, 0.75],
  onStrong: [1.0, 1.0, 1.0],
} as const;

export type ColorToken = keyof typeof RGB;
let darkMode = false;
export function setPaletteMode(dark: boolean): void { darkMode = dark; }
export function color(token: ColorToken, opacity = 1): string {
  const [red, green, blue] = (darkMode ? DARK_RGB[token] : RGB[token]);
  return "rgba(" + Math.round(red * 255) + ", " + Math.round(green * 255) + ", " + Math.round(blue * 255) + ", " + opacity + ")";
}
function makeColors() {
  return Object.fromEntries((Object.keys(RGB) as ColorToken[]).map((token) => [token, color(token)])) as Record<ColorToken, string>;
}
export let colors = makeColors();
export let surfaces = {
  card: color("paper", 0.94),
  border: color("ink", 0.08),
  mutedBorder: color("ink", 0.06),
  subtleInk: color("ink", 0.04),
} as const;
export function refreshPalette(dark: boolean): void {
  darkMode = dark;
  colors = makeColors();
  surfaces = {
    card: color("paper", 0.94),
    border: color("ink", 0.16),
    mutedBorder: color("ink", 0.10),
    subtleInk: color("ink", 0.04),
  };
}
export const typography = {
  eyebrow: 11, screenTitle: 36, screenSubtitle: 15, count: 12,
  searchIcon: 15, emptyStateIcon: 32, emptyStateTitle: 19, emptyStateBody: 13, wordmark: 29,
} as const;
export const geometry = {
  brandMark: 42, searchFieldHeight: 50, searchFieldRadius: 17, habitIcon: 54,
  glassCardRadius: 26, emptyStateRadius: 24, selectedTabWidth: 104,
  unselectedTabWidth: 43, tabHeight: 44, tabDockRadius: 24,
} as const;
export const systemFont = Platform.select({ ios: "System", android: "sans-serif", default: "System" });
export const roundedFont = Platform.select({ ios: "Avenir Next", android: "sans-serif-rounded", default: "sans-serif" });
export const monoFont = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });
