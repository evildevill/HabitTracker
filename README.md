# Habit Tracker

A clean TypeScript / Expo rebuild with a deliberate, premium design system.

## Current foundation

- Preserves the animated splash screen and its reduced-motion behavior.
- Implements a custom floating four-tab dock: Today, Habits, Insights, and Settings.
- Adds the first Today dashboard with an interactive daily progress ring and habit check-ins.
- Adds a habit list and a working add-habit dialog.
- Shares the exact normalized RGB values documented in `DESIGN.md` through `src/design/tokens.ts`.
- Uses TypeScript for all runtime app code.

## Run locally

    pnpm install
    pnpm start

Type-check with:

    pnpm typecheck

## Current scope

Habit check-ins and newly added habits are held in React state for the active app session. Durable on-device persistence, reminders, and historical insights are not implemented yet. The next core milestone should add a tested local repository/storage layer before expanding analytics or notifications.

See `DESIGN.md` for the visual source of truth and implementation notes.
