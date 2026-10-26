# Security Policy

Habit Tracker is a local-first Android/iOS application. Security reports are welcome, and we ask that potential vulnerabilities be disclosed privately so they can be assessed before details become public.

## Supported Versions

Security fixes are intended for the latest version available on [Google Play](https://play.google.com/store/apps/details?id=com.habittrackerwasiii.app) and the latest source on the `main` branch.

| Version | Security support |
| --- | --- |
| Latest Google Play release | Supported |
| Latest source on `main` | Supported for review and fixes |
| Older app releases | Upgrade to the latest release; fixes are not guaranteed to be backported |

The app version and the repository's `main` branch may not always represent the same release. Check the release notes and app version when describing a report.

## Reporting a Vulnerability

**Please do not publish suspected vulnerabilities in a public GitHub issue, pull request, discussion, or social post.**

Preferred reporting options:

1. If GitHub's **Report a vulnerability** feature is enabled for this repository, use the private reporting form under the repository's **Security** tab.
2. Otherwise, email **support@hackerwasii.com** with the subject `Security vulnerability report: Habit Tracker`.

Include, where possible:

- A concise description and potential impact.
- The affected app version, device, operating system, and relevant environment.
- Reproduction steps or a minimal proof of concept.
- Any logs or screenshots needed to verify the issue. Remove personal information, authentication material, and other secrets first.
- Whether the issue appears to affect the released app, the source on `main`, or both.

Please avoid accessing, modifying, or deleting anyone else's data, disrupting services, or testing beyond what is necessary to demonstrate the issue. Do not include real user data in a report.

## Response and Disclosure

- We aim to acknowledge a report within **7 calendar days**.
- We aim to provide an initial assessment or status update within **14 calendar days** of acknowledgement.
- Investigation and remediation timelines depend on severity, reproducibility, platform constraints, and release requirements. If a report is accepted, we will work toward a fix and coordinate disclosure with the reporter where practical.
- If a report is declined, we will explain the reason where we can. A report may be closed if it is not reproducible, falls outside the project's scope, or does not demonstrate a security impact.
- Please allow reasonable time for investigation and a fix before public disclosure. We will credit reporters in release notes or an advisory when appropriate and with their consent.

These are response goals, not a guarantee of resolution by a specific date. Habit Tracker does not currently advertise a bug bounty program.

## Scope

Examples of in-scope issues include:

- A vulnerability in the app that exposes or corrupts locally stored habit data beyond the user's expected control.
- Unintended collection or transmission of user data, or a privacy boundary failure.
- Insecure handling of secrets, permissions, local files, or notification-related functionality.
- A dependency or platform integration vulnerability that demonstrably affects Habit Tracker.

General bugs without a security impact, feature requests, unsupported-device issues, and vulnerabilities in third-party services that do not affect Habit Tracker are generally out of scope. If uncertain, report the concern privately and we will assess it.

## License

The repository is distributed under the proprietary terms in [LICENSE](LICENSE). This security policy does not grant permission to use, modify, or redistribute the source code.
