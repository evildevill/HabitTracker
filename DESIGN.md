# Habit Tracker — Design System

This document defines the visual design reference for the Habit Tracker rebuild. It adapts the copied design reference to Habit Tracker terminology and product concepts. The color, typography, geometry, and motion values below are preserved exactly from the reference; they are design specifications for the rebuild, not a claim that the current Habit Tracker code already implements them.

When implementation begins, keep this document aligned with the actual source. If a value is changed in code, update this file in the same change. Do not invent additional global tokens from view-specific styles.

## Source of truth

For the rebuild, the intended source of truth should be the Habit Tracker design-system implementation and the feature screens that consume it. Suggested locations:

- Shared theme and reusable components: `src/design/theme.ts` and `src/design/tokens.ts`
- App shell and primary navigation: `src/navigation/`
- App entry and initial loading experience: `App.tsx` and the relevant app-shell component
- Habit tracking screens: `src/features/habits/`
- Insights and history screens: `src/features/insights/`
- Prayer tracking screens, if retained in the rebuilt product: `src/features/prayer/`

These paths describe the intended organization for the rebuild. Adjust them to match the final codebase rather than treating them as existing files.

## 1. Theme colors

Keep the original normalized RGB components as the design reference. Do not convert them to hex values.

| Token | Exact value |
|---|---|
| `canvas` | `Color(red: 0.955, green: 0.968, blue: 0.958)` |
| `paper` | `Color(red: 0.985, green: 0.989, blue: 0.982)` |
| `ink` | `Color(red: 0.055, green: 0.105, blue: 0.09)` |
| `secondary` | `Color(red: 0.31, green: 0.38, blue: 0.35)` |
| `brand` | `Color(red: 0.055, green: 0.49, blue: 0.40)` |
| `brandDark` | `Color(red: 0.035, green: 0.23, blue: 0.19)` |
| `mint` | `Color(red: 0.39, green: 0.78, blue: 0.67)` |
| `citrus` | `Color(red: 0.86, green: 0.93, blue: 0.28)` |
| `coral` | `Color(red: 0.94, green: 0.43, blue: 0.31)` |
| `sky` | `Color(red: 0.34, green: 0.62, blue: 0.78)` |
| `sand` | `Color(red: 0.91, green: 0.82, blue: 0.61)` |
| `card` | `paper.opacity(0.94)` |
| `border` | `ink.opacity(0.08)` |

The hero gradient uses `colors: [ink, brandDark]`, `startPoint: .topLeading`, and `endPoint: .bottomTrailing`.

### Background

The Habit Tracker background component uses `canvas` as its base and layers a `LinearGradient` with colors `[accent.opacity(0.075), .clear, paper.opacity(0.5)]`, from `.topTrailing` to `.bottomLeading`. Its default accent is `brand`; the background extends to the screen edges.

## 2. Typography

These exact values are the typography reference for shared UI. Feature screens may use additional local styles; do not treat these as a universal type scale unless the implementation centralizes them.

| Component / element | Exact font configuration | Other text styling |
|---|---|---|
| Screen-heading eyebrow | size `11`, weight `.black`, design `.monospaced` | `tracking(2)`; uppercase; brand color |
| Screen-heading title | size `36`, weight `.black`, design `.rounded` | `tracking(-1.3)`; ink color |
| Screen-heading subtitle | size `15`, weight `.medium`, design `.rounded` | `lineSpacing(3)`; secondary color |
| Screen-heading count | size `12`, weight `.bold`, design `.monospaced` | horizontal padding `11`, vertical padding `7`; paper capsule |
| Search-field symbol | size `15`, weight `.semibold` | secondary color |
| Search-field input | size `15`, weight `.medium`, design `.rounded` | character capitalization, autocorrection disabled, search submit label |
| Empty-state symbol | size `32`, weight `.medium` | brand color |
| Empty-state title | size `19`, weight `.bold`, design `.rounded` | centered; ink color |
| Empty-state description | size `13`, weight `.medium`, design `.rounded` | centered; secondary color |
| Empty-state action | size `13`, weight `.bold`, design `.rounded` | white text |
| Habit initials / short code | size `size * 0.21`, weight `.black`, design `.monospaced` | `minimumScaleFactor(0.72)` |
| Habit category icon | size `size * 0.34`, weight `.bold` | hierarchical symbol rendering |
| Brand-mark fallback symbol | size `size * 0.42`, weight `.black` | SF Symbol `checkmark.circle.fill`; citrus foreground |

## 3. Geometry and surfaces

| Component | Exact value |
|---|---|
| Brand mark default size | `42` |
| Brand-mark fallback background radius | `size * 0.24`, continuous |
| Brand-mark outer clipping radius | `size * 0.23`, continuous |
| Empty-state stack spacing | `13` |
| Empty-state vertical padding | `38` |
| Empty-state horizontal padding | `24` |
| Empty-state card | `glassCard(cornerRadius: 24, shadow: false)` |
| Empty-state button horizontal padding | `18` |
| Empty-state button height | `42` |
| Search-field HStack spacing | `11` |
| Search-field horizontal padding | `15` |
| Search-field height | `50` |
| Search-field corner radius | `17`, continuous |
| Search-field border | border token, line width `1` |
| Screen-heading VStack spacing | `8` |
| Habit icon / monogram default size | `54` |
| Habit tile corner radius | `size * 0.28`, continuous |
| Habit monogram fill / outline | `accent.opacity(0.14)` / `accent.opacity(0.25)`; outline width `1` |
| Habit icon fill / outline | `accent.opacity(0.12)` / `accent.opacity(0.22)`; outline width `1` |
| Glass-card default corner radius | `26` |
| Glass-card default shadow flag | `true` |
| Glass-card surface | card token inside a continuous rounded rectangle |
| Glass-card outline | border token, line width `1` |
| Glass-card enabled shadow | `ink.opacity(0.055)`, radius `18`, y `9` |
| Glass-card disabled shadow | clear color, radius `0`, y `0` |
| Button pressed scale | `0.975` |
| Button pressed opacity | `0.86` |
| Button press animation | `.spring(response: 0.24, dampingFraction: 0.78)` |

## 4. Brand and reusable components

### HabitTrackerBrandMark(size:)

Displays the Habit Tracker brand mark. If a bundled logo asset is unavailable, use a rounded rectangle filled with the ink token and a `checkmark.circle.fill` symbol in the citrus token. Scale the logo to fit and clip it to a continuous rounded rectangle. Its accessibility label is `Habit Tracker`.

### HabitTrackerSearchField(text:placeholder:)

Uses `magnifyingglass` and conditionally displays `xmark.circle.fill` when the bound text is non-empty. The clear action empties the binding and has the accessibility label `Clear search`. The text field uses character capitalization, disables autocorrection, and sets the search submit label.

### ScreenHeading(eyebrow:title:subtitle:count:)

Displays an uppercased monospaced eyebrow, rounded title, subtitle, and optional formatted count inside a paper capsule. Use the typography and padding values defined above.

### HabitMonogram(title:accent:size:)

Displays a short habit label or initials in a rounded-rectangle tile. The default accent is the brand token and the default size is `54`. Hide decorative duplicate text from accessibility when the parent already announces the habit name.

### HabitCategoryIcon(category:accent:size:)

Displays the symbol associated with a habit category. Use a consistent, explicit mapping in the implementation and document the exact mapping here once it exists. Do not guess category-to-symbol mappings from this document.

### SearchEmptyState(query:onClear:)

Shows a search symbol, a message in the form `No matches for “<query>”`, the explanation `Try a different keyword or clear the search to see everything again.`, and a `Clear search` action. Use the exact typography, padding, and card values above.

### Other shared UI helpers

- `glassCard(cornerRadius:shadow:)` applies the shared card surface, border, and optional shadow.
- `listReveal()` uses `.scrollTransition(.animated.threshold(.visible(0.15)))`; non-identity phases use opacity `0.72` and y-offset `8`.
- `statusBarShield(color:)` defaults to the canvas token.
- `BackToTopScrollView` defaults threshold to `180`. Its visible button is `48 × 48`, uses corner radius `15`, and appears when the measured offset is less than negative threshold. Its reveal transition combines scale `0.82` anchored at `.bottomTrailing` with opacity.
- The custom back button uses `arrow.left`, font size `14` / weight `.black`, frame `38 × 38`, rounded-rectangle radius `12`, and a white background with opacity `0.96`.

## 5. Habit Tracker navigation

The rebuilt app should use product-specific navigation labels rather than course and learning labels from the original reference. The following is the proposed navigation mapping for the Habit Tracker experience:

| Section | Purpose | Suggested symbol | Accent token |
|---|---|---|---|
| Today | Today's habits and completion progress | `sun.max.fill` | `citrus` |
| Habits | Create, edit, and organize habits | `checkmark.circle.fill` | `mint` |
| Insights | Streaks, consistency, and habit history | `chart.bar.xaxis` | `coral` |
| Prayer | Prayer tracking, if included in the product scope | `moon.stars.fill` | `sky` |
| Settings | Preferences, reminders, and appearance | `gearshape.fill` | `sand` |

These labels and symbols are Habit Tracker product guidance, not a record of an already implemented navigation dock. Confirm the final information architecture before implementing it.

### Floating navigation dock reference

If the app uses a floating dock, the copied reference values are:

- HStack spacing: `5`
- Selected symbol and label gap: `7`; unselected gap: `0`
- Symbol font: size `16`, weight `.black`
- Selected tab frame: width `104`, height `44`
- Unselected tab frame: width `43`, height `44`
- Selected rounded rectangle radius: `15`, continuous
- Selected background: ink token
- Selected label font: size `12`, weight `.bold`, design `.rounded`
- Outer padding: `8`
- Dock background: `Color.white.opacity(0.94)`, continuous rounded rectangle radius `24`
- Dock border: border token, line width `1`
- Dock shadow: `ink.opacity(0.14)`, radius `22`, y `10`
- Horizontal padding: `16`; top padding: `5`; bottom padding: `3`
- Selected-tab animation: `.spring(response: 0.42, dampingFraction: 0.78)`
- Swipe selection animation: `.snappy(duration: 0.32)`, skipped when Reduce Motion is enabled
- Drag gesture minimum distance: `18`; horizontal/vertical dominance ratio: `1.35`; selection threshold: `82`; max dock offset: `24`; edge-back reservation: `44`
- Selection feedback: selection haptic when the selected section changes
- Selected symbols may use a bounce effect, provided Reduce Motion is respected

These values are reference values. Implement only interactions that fit the chosen React Native / Expo navigation architecture.

## 6. Launch screen and motion

The animated Habit Tracker launch experience is implemented in `src/components/ui/animated-splash-screen.tsx` and is mounted by `App.js`. It adapts the layered-card reveal used in the Acadora and Noor Al-Qalb iOS apps to React Native / Expo.

### Exact visual specification

- Root background: `canvas` token, with a `LinearGradient` using `[brand.opacity(0.075), clear, paper.opacity(0.5)]` from top-trailing to bottom-leading.
- Main composition frame: `210 × 210`.
- Brand mark: `96 × 96`; ink fill; `23` corner radius; citrus `CheckCircle2` mark; citrus underline `28 × 3`.
- Layer cards: `148 × 172`; corner radius `30`; left rotation changes from `-2deg` to `-10deg`, right from `2deg` to `9deg`; their horizontal offsets settle at `-22` and `22`.
- Left card fill: `coral.opacity(0.13)`; right card fill: `sky.opacity(0.16)`. Card glyphs and rules use the `ink` token at the opacities defined in source.
- Main wordmark: `HABIT TRACKER`; size `29`; weight `900`; rounded system font; letter spacing `7`; ink color.
- Supporting tagline: `SMALL STEPS. REAL CHANGE.`; size `9`; weight `900`; monospaced font; letter spacing `2.4`; brand color.
- Composition / wordmark / signal stack gap: `34`.
- Signal bars: seven capsules; HStack gap `5`; active middle capsule width `20`, all others `5`; source heights animate between `4` and `4 + (index % 3) * 4`.
- Signal labels cycle through `SHOW UP`, `STAY STEADY`, and `KEEP GOING` at `390ms` intervals.
- All rendered colors are sourced from the normalized RGB tokens in this document. The React Native implementation converts those tokens to the runtime color representation; it does not introduce a separate hex palette.

### Motion and accessibility

- Brand reveal uses a native-driver spring; initial scale changes from `0.72` to `1`, and rotation changes from `-8deg` to `0deg`.
- Wordmark opacity and vertical offset animate from `0` / `14` to `1` / `0` over `650ms`, after a `120ms` delay, with cubic ease-out.
- Signal bars use a repeating `550ms` ease-in-out phase, staggered by `70ms` per bar.
- The splash is visible for `1750ms` before the app continues, matching the reveal's timing.
- When Reduce Motion is enabled, the reveal is shown in its final state, signal bars stop animating, and the cycling status label is replaced with `BUILDING CONSISTENCY`.
- The splash content is grouped for assistive technology with the label `Habit Tracker is opening`.
- Do not add colors, type styles, or motion values to the splash unless they are documented here and sourced from the design system.

For Expo, use React Native animation primitives and platform font fallbacks. Do not copy SwiftUI APIs literally into JavaScript or TypeScript.

## 7. Icons

Use the icon library already selected for the Expo implementation consistently. Habit-related icons should communicate completion, consistency, time, reminders, categories, and progress. Use the exact icon identifier from the implementation when documenting a component; do not substitute icons based only on this document. Prayer-specific icons should only appear if prayer tracking remains in scope.

## 8. Accessibility

The implementation should preserve these behaviors where the corresponding UI exists:

- Brand mark accessibility label: `Habit Tracker`.
- Search clear control accessibility label: `Clear search`.
- Decorative habit monograms should not duplicate spoken labels when the parent already announces the habit name.
- Empty states should group their children appropriately for screen readers.
- Navigation controls should expose their section title and selected state.
- Back button accessibility label: `Back to <label>`.
- Back-to-top button label: `Back to top`; hint: `Returns to the beginning of this screen`.
- Launch content should be grouped and labelled `Habit Tracker is opening` if a custom animated splash is used.
- Respect the platform's Reduce Motion setting for dock, screen transition, and splash animations.
- Habit completion controls must expose the habit name, completion state, and an accessible action; do not rely on color alone to communicate completion.

## 9. Rules for keeping this document exact

1. Do not add hex values calculated from normalized RGB components.
2. Do not publish a global spacing, radius, typography, or animation scale unless that scale exists in source code.
3. When a component's value is view-specific, document it under that component or identify the exact source file; do not describe it as a universal app rule.
4. Before documenting an icon, color, animation, or dimension as implemented, verify the literal source expression.
5. If a style is provided by platform defaults and the code does not set it, say that it is not explicitly specified rather than guessing.
6. Keep proposed design guidance clearly distinguished from values verified in source.
7. Update this document in the same change when a documented implementation value changes.
8. Keep the design compatible with the Expo SDK and React Native versions actually selected for the rebuild; do not copy SwiftUI-only APIs into the app.

## Scope

This document is for the Habit Tracker rebuild. It replaces course, lecture, and learning terminology from the original reference with Habit Tracker concepts. The shared visual values above are retained from the original design reference and should be verified against the final Habit Tracker implementation as it is built.
