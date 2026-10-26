# Habit Tracker

[![Google Play](https://img.shields.io/badge/Google_Play-Get_the_app-414141?logo=googleplay&logoColor=white)](https://play.google.com/store/apps/details?id=com.habittrackerwasiii.app)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Built with Expo](https://img.shields.io/badge/Built_with-Expo-4630EB?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-typed-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A calm, privacy-minded habit tracker built with **React Native, Expo, and TypeScript**. Habit Tracker is designed around small daily actions, a focused interface, and useful feedback without requiring an account.

**Get it on Google Play:** [Habit Tracker](https://play.google.com/store/apps/details?id=com.habittrackerwasiii.app)

> **Project status:** Active development. The app includes onboarding, daily habit check-ins, a habit list, local check-in insights, appearance preferences, and notification-permission settings. Some data, including the habit list, is not yet persisted across app restarts.

## Highlights

- **Today dashboard** — see your daily routine and completion progress, then check habits off as you go.
- **Starter-habit onboarding** — choose preset routines and review the habits you want to begin with.
- **Habit list** — view your routine and add custom habits.
- **Insights** — explore check-in activity over 7, 30, or 90 days, active days, average check-ins on active days, your strongest habit, weekday patterns, and habits that may need attention.
- **Appearance preferences** — switch between light and dark appearance.
- **Notification controls** — review notification access and open system settings to manage permissions.
- **Thoughtful interactions** — haptic feedback, an animated launch screen, and safe-area-aware layouts.
- **Privacy-minded by design** — no app account or cloud sync is required by the current implementation.

## Screens

| Screen | What it does |
| --- | --- |
| **Today** | Daily progress and habit check-ins |
| **Habits** | Review the current routine and add habits |
| **Insights** | Visualize recorded check-ins and explore patterns |
| **Settings** | Appearance, notification access, legal information, help, and onboarding reset |

The app uses a four-tab navigation bar: Today, Habits, Insights, and Settings.

## Technology

| Technology | Role |
| --- | --- |
| [Expo](https://expo.dev/) | React Native development and native app tooling |
| [React Native](https://reactnative.dev/) | Cross-platform application UI |
| [TypeScript](https://www.typescriptlang.org/) | Strictly typed application code |
| [React Native SVG](https://github.com/software-mansion/react-native-svg) | Custom vector-based charts in Insights |
| [Lucide React Native](https://lucide.dev/) | Consistent interface icons |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | On-device storage for selected preferences and check-in history |
| [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) | Notification permission and system-settings integration |
| [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) | Tactile interaction feedback |
| [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context) | Safe-area-aware screen layout |
| [EAS Build](https://docs.expo.dev/build/introduction/) | Cloud build configuration for release artifacts |

The exact dependency versions are maintained in `package.json`. Install dependencies with pnpm to use the project's pinned package-manager setup.

## Getting started

### Requirements

- Node.js compatible with the selected Expo SDK
- [pnpm](https://pnpm.io/)
- Expo Go for supported device testing, or an Android/iOS development environment for native builds

### Install

```bash
git clone https://github.com/evildevill/Habbittracker-v2.git
cd Habbittracker-v2
pnpm install
```

### Start the development server

```bash
pnpm start
```

Then scan the QR code with Expo Go, or use the terminal shortcuts below when the corresponding platform is configured.

```bash
pnpm android
pnpm ios
pnpm web
```

Platform commands depend on the required local SDKs and development environment. Expo Go support may differ from a custom development or production build.

## Available scripts

| Command | Description |
| --- | --- |
| `pnpm start` | Start the Expo development server |
| `pnpm android` | Start Expo with the Android target |
| `pnpm ios` | Start Expo with the iOS target |
| `pnpm web` | Start Expo for web |
| `pnpm typecheck` | Run TypeScript without emitting build output |

Run the type checker before submitting changes:

```bash
pnpm typecheck
```

## Project structure

```text
.
├── App.tsx                         # App entry and animated splash handoff
├── index.ts                        # Expo root registration
├── app.json                        # Expo app configuration
├── eas.json                        # EAS build and submit profiles
├── DESIGN.md                       # Visual design reference and implementation notes
└── src/
    ├── app/
    │   └── app-shell.tsx            # App state, screen routing, and local history
    ├── components/
    │   └── ui/                      # Shared UI components
    ├── design/
    │   └── tokens.ts                # Shared colors, surfaces, and design tokens
    ├── features/
    │   ├── habits/                  # Today screen, habit list, rows, and types
    │   ├── insights/                # Check-in charts and habit patterns
    │   ├── onboarding/              # Starter routine selection
    │   ├── notifications/           # Notification permission and settings screens
    │   └── settings/                # Preferences, legal content, and settings
    └── navigation/
        └── tab-bar.tsx              # Main four-tab navigation
```

The directory map shows the main application areas, not every file in the repository.

## Data storage and privacy

Habit Tracker does not currently require an account. The current implementation stores selected preferences and recorded completion events locally on the device. The Insights screen uses recorded completion events rather than inventing missing history.

**Important current limitation:** the active habit list and its current completion state are held in app state and are not yet reliably restored after a full app restart. Onboarding selections therefore may need to be made again after restarting. Check-in history and appearance preferences use AsyncStorage, but the app does not yet provide a complete persistent habit repository, export/import, or cloud synchronization.

Because historical records are based on check-ins that were actually recorded, the app avoids presenting streaks or missed-day rates as authoritative metrics when it does not have a complete daily record.

For details about how the app handles data, use the Privacy Policy in the app. Do not interpret “privacy-minded” or “local-first” as a claim that every piece of app state is already persisted.

## Design principles

The visual direction is documented in [`DESIGN.md`](./DESIGN.md). The app favors:

- A restrained green-tinted canvas, paper surfaces, and clear text hierarchy
- Reusable design tokens and shared UI components
- Functional Lucide icons and accessible controls
- Reduced-motion-aware launch animation
- Clear empty states and honest, history-based insights
- No unnecessary account requirement or cloud dependency

When changing a shared color, component, or interaction, update the implementation and its documentation together. Treat the source code as authoritative when a design note and the current UI differ.

## Android and release builds

Expo app configuration lives in `app.json`, while build profiles are defined in `eas.json`. The production EAS profile is configured to create an Android App Bundle (`.aab`) and increment the app version code.

For a production build, see the [Expo EAS Build documentation](https://docs.expo.dev/build/introduction/). Before release:

1. Run `pnpm typecheck`.
2. Build a fresh release artifact.
3. Test the app on real Android and iOS devices where available.
4. Check portrait and landscape layouts, system-bar insets, keyboard behavior, notification permission flows, and large-screen layouts.
5. Review Google Play Console pre-launch reports and Android compatibility warnings against the exact artifact being uploaded.

A configured build profile does not by itself mean that a release has been built, tested, or published.

## Contributing

Changes should be focused, typed, and consistent with the existing design system.

1. Create a feature or fix branch.
2. Install dependencies with `pnpm install`.
3. Make the change in TypeScript.
4. Run `pnpm typecheck` and test the affected flow on a device or simulator.
5. Update `DESIGN.md` or this README if the documented behavior or project setup changes.
6. Open a pull request with a concise summary and validation notes.

Please avoid claiming a flow is tested unless the relevant check was actually run.

## License

This repository is **source-available under a proprietary, all-rights-reserved license**. You may view the source for personal evaluation, but you may not modify, redistribute, publish derivative works, or use the code in another project without prior written permission from Waseem Akram / WasiiLabs. Where written permission is granted, attribution and copyright notices must be retained unless that permission says otherwise.

This is **not an open-source license**. If you want to contribute, read [CONTRIBUTING.md](CONTRIBUTING.md) and obtain maintainer approval before submitting work. See [`LICENSE`](./LICENSE) for the full terms. Copyright © 2026 Waseem Akram / WasiiLabs.
