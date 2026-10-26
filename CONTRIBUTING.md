# Contributing to Habit Tracker

Thank you for your interest in improving Habit Tracker! Contributions such as bug reports, accessibility improvements, documentation fixes, and carefully scoped pull requests are welcome.

Before contributing, please read this guide and the repository's [README](README.md).

## Project principles

Please keep contributions aligned with the project's goals:

- **TypeScript first.** Use TypeScript for application code; do not introduce JavaScript source files for app features.
- **Local-first and privacy-minded.** Do not add analytics, advertising, tracking, account requirements, or network transmission of habit data without prior discussion and explicit maintainer approval.
- **Keep the design consistent.** Follow the existing visual system in [DESIGN.md](DESIGN.md), including its tokens, spacing, typography, and interaction patterns.
- **Small, focused changes.** Prefer a narrowly scoped pull request that is easy to review and test.
- **Accessible and resilient UI.** Use meaningful accessibility labels, respect safe areas, and consider loading, empty, error, and reduced-motion states where relevant.

## Before you start

1. Check existing [issues](https://github.com/evildevill/Habbittracker-v2/issues) and pull requests to avoid duplicating work.
2. For substantial changes, open an issue first to discuss the proposed approach and confirm it fits the project's direction.
3. Do not include secrets, credentials, signing keys, personal data, generated build output, or unrelated formatting changes in a contribution.

## Development setup

### Requirements

- A supported Node.js version for the Expo SDK used by this repository.
- [pnpm](https://pnpm.io/) using the version declared in `package.json`.
- [Git](https://git-scm.com/).
- [Expo Go](https://expo.dev/go) for compatible device testing, or the relevant native development tools if your change requires them.

### Install and run

```bash
git clone https://github.com/evildevill/Habbittracker-v2.git
cd Habbittracker-v2
pnpm install --frozen-lockfile
pnpm start
```

Use the QR code to open the app in a compatible Expo Go environment. Platform-specific commands are documented in the README and may require additional local tooling.

## Make a change

Create a branch from the latest `main` branch. Use a descriptive name, for example:

```bash
git switch main
git pull --ff-only
git switch -c fix/describe-the-bug
# or: git switch -c feat/describe-the-feature
```

Keep each pull request focused on one feature or fix. Follow the patterns already used in the surrounding files rather than introducing a new library or architecture without discussing it first.

### Code expectations

- Keep application code in TypeScript and use the existing formatting and naming conventions.
- Reuse existing components, design tokens, and utilities where practical.
- Avoid adding dependencies unless they solve a clear need; explain new dependencies in the pull request.
- Handle asynchronous operations and errors deliberately.
- Do not silently change privacy behavior, data retention, app permissions, or platform configuration.
- Update documentation when behavior, setup, configuration, or user-facing features change.
- Never commit generated secrets, local environment files, signing material, or private user data.

## Run checks before opening a pull request

At minimum, run the project's TypeScript check:

```bash
pnpm typecheck
```

Also test the affected feature in the app when possible. For UI or platform changes, include the platform and device/emulator details in your pull request and test relevant screen sizes, safe areas, and light/dark appearance where applicable.

If a check cannot be run locally, say so in the pull request rather than reporting it as passed. GitHub Actions must pass before a change is ready to merge, unless the maintainer explicitly documents an exception.

## Open a pull request

1. Push your branch to your fork or the repository, depending on your access.
2. Open a pull request targeting `main`.
3. Give it a clear title, such as `fix: make legal section paragraphs optional` or `docs: clarify local development setup`.
4. Describe **what changed**, **why it changed**, and any user-visible impact.
5. Link related issues using GitHub keywords such as `Closes #123` when appropriate.
6. Include testing performed and any testing that remains outstanding.
7. Add screenshots or a short recording for meaningful visual changes, where useful.
8. Keep the pull request focused and respond constructively to review feedback.

The maintainer may request changes, ask for additional tests, or close contributions that do not fit the project's goals. Please do not treat a pull request as accepted until it has been reviewed and merged.

## Reporting bugs and requesting features

Use the repository's GitHub Issues page. Include a clear title, steps to reproduce, expected behavior, actual behavior, and relevant device, OS, Expo, and app version details. Remove personal information from screenshots and logs.

For security vulnerabilities, **do not publish exploit details in a public issue**. Follow the private reporting guidance in [SECURITY.md](SECURITY.md).

## Community expectations

Be respectful, constructive, and welcoming. Critique ideas and code rather than people. Harassment, discrimination, personal attacks, and sharing another person's private information are not acceptable. The maintainer may moderate discussions and contributions to keep the project safe and productive.

## Licensing and contribution terms

**This repository uses a proprietary, source-available license. It is not an open-source project.** Viewing the code does not grant permission to modify, redistribute, publish derivative works, or reuse it in another project. See [LICENSE](LICENSE) for the terms.

Please open an issue or discussion to propose a change before doing substantial work. Obtain written approval from the maintainer before assuming a proposed change will be accepted. Do not submit copied code or assets unless their licenses permit the intended use.

Submitting a pull request does not, by itself, grant the project or other users a license to use your contribution, and it does not guarantee that the contribution will be merged. Before any contribution can be incorporated, the maintainer may require a written contributor license agreement, copyright assignment, or other explicit written agreement granting the necessary rights. Do not assume that submitting a PR waives your rights or automatically transfers them.

Thank you for helping improve Habit Tracker while respecting the project's licensing terms.
