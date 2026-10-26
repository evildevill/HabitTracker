import { AppText as Text } from "../../components/ui/app-text";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ArrowLeft, CheckCircle2, LockKeyhole, Scale } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { color, colors, monoFont, roundedFont, surfaces } from "../../design/tokens";

export type LegalDocument = "privacy" | "terms";

type LegalScreenProps = {
  document: LegalDocument;
  onBack: () => void;
};

type LegalSection = { title: string; paragraphs?: string[]; bullets?: string[] };

const privacySections: LegalSection[] = [
  {
    title: "Our promise",
    paragraphs: [
      "Habit Tracker is designed to work offline and without an account. The app does not collect, upload, sell, or share your personal information with WasiiLabs or with third parties.",
      "Your habits and check-ins exist only in the app's active session in memory. In the current version, they are not saved to a remote server or permanently stored by the app. If the app session ends or the app is restarted, this session data may be lost.",
    ],
  },
  {
    title: "Information the app uses",
    paragraphs: [
      "The app uses the habit names and completion states you choose to display your routine while the app is open. These values are held in local application state for the active session.",
      "The app does not ask you to create an account and does not request personal details such as your name, phone number, or location. The current app configuration declares no Android permissions.",
    ],
  },
  {
    title: "Network access, analytics, and advertising",
    paragraphs: [
      "The current app code does not include an app-controlled backend, analytics SDK, advertising SDK, tracking technology, or network service for sending your habit information. The app is intended to work offline.",
      "Your device's operating system, app store, or distribution platform may independently process technical information under its own policies. Such processing is outside the app's control and is not data collected by Habit Tracker itself.",
    ],
  },
  {
    title: "Storage and your choices",
    paragraphs: [
      "Because habit data is held in memory for the active session, you can remove it from the current session by using the app's restart onboarding action. Closing or restarting the app can also end the session and discard that data.",
      "The current version does not provide cloud sync, account recovery, or a data export feature. Do not rely on this version as the only record of information you need to keep.",
    ],
  },
  {
    title: "Children and sensitive information",
    paragraphs: [
      "Habit Tracker is a general-purpose routine tool, not a service designed to collect personal information from children. Please do not enter sensitive personal information into habit names or other text fields.",
    ],
  },
  {
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy when the app changes. The latest version available inside the app will describe the practices applicable to that version. If future releases introduce storage, analytics, accounts, or online services, this policy should be updated to explain those changes before they are used.",
    ],
  },
];

const termsSections: LegalSection[] = [
  {
    title: "Agreement to these terms",
    paragraphs: [
      "These Terms of Service govern your use of Habit Tracker, provided by WasiiLabs. By using the app, you agree to these terms. If you do not agree, please stop using the app.",
    ],
  },
  {
    title: "What the app does",
    paragraphs: [
      "Habit Tracker helps you create a simple routine and mark habits as complete during an app session. The current version keeps this information in app memory and is designed to work offline. It does not currently provide account sign-in, cloud sync, reminders, or permanent habit history.",
    ],
  },
  {
    title: "Use the app responsibly",
    bullets: [
      "Use the app only for lawful purposes and do not attempt to disrupt, reverse engineer, or interfere with its operation except where applicable law permits.",
      "You are responsible for the habit names and other content you enter.",
      "Do not use the app as your only record of important information. Session data may be lost when the app closes or restarts.",
      "Do not rely on the app for medical advice, diagnosis, treatment, or emergency decisions. It is a general habit-building tool, not a healthcare service.",
    ],
  },
  {
    title: "Availability and changes",
    paragraphs: [
      "We may improve, change, suspend, or discontinue features as the app develops. We do not promise that every feature will always be available or that session data can be recovered after the app closes.",
    ],
  },
  {
    title: "Intellectual property",
    paragraphs: [
      "The app's original design, branding, and software are owned by or licensed to WasiiLabs and are protected by applicable intellectual property laws. These terms do not transfer ownership to you. You may use the app for its intended personal purpose, subject to these terms and applicable law.",
    ],
  },
  {
    title: "Disclaimer and limitation",
    paragraphs: [
      "The app is provided on an “as available” basis to the extent permitted by law. We make no guarantee that it will be uninterrupted, error-free, or suitable for every purpose.",
      "To the extent permitted by applicable law, WasiiLabs will not be liable for indirect, incidental, special, or consequential loss arising from use of the app, including loss of session data. Nothing in these terms excludes rights or liability that cannot legally be excluded.",
    ],
  },
  {
    title: "Updates to these terms",
    paragraphs: [
      "We may revise these terms as the app changes. Updated terms will be made available in the app. Your continued use after an update takes effect indicates acceptance of the revised terms, to the extent permitted by law.",
    ],
  },
];

function LegalSectionView({ section, index }: { section: LegalSection; index: number }) {
  const styles = createStyles();
  return (
    <View style={styles.section} key={section.title}>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</Text>
        <Text accessibilityRole="header" style={styles.sectionTitle}>{section.title}</Text>
      </View>
      {section.paragraphs?.map((paragraph, paragraphIndex) => (
        <Text key={paragraphIndex} style={styles.paragraph}>{paragraph}</Text>
      ))}
      {section.bullets?.map((bullet, bulletIndex) => (
        <View key={bulletIndex} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ))}
    </View>
  );
}

export function LegalScreen({ document, onBack }: LegalScreenProps) {
  const styles = createStyles();
  const isPrivacy = document === "privacy";
  const sections = isPrivacy ? privacySections : termsSections;
  const Icon = isPrivacy ? LockKeyhole : Scale;
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  const updated = "October 25, 2026";

  return (
    <AppBackground>
      <View style={styles.root}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to settings"
            onPress={onBack}
            hitSlop={10}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <ArrowLeft size={19} color={colors.ink} strokeWidth={1.9} />
          </Pressable>
          <Text style={styles.topLabel}>WASIILABS · LEGAL</Text>
          <View style={styles.topSpacer} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}><Icon size={22} color={colors.brand} strokeWidth={1.8} /></View>
            <Text style={styles.eyebrow}>{isPrivacy ? "YOUR DATA, YOUR CHOICE" : "CLEAR AND SIMPLE"}</Text>
            <Text accessibilityRole="header" style={styles.title}>{title}</Text>
            <Text style={styles.intro}>
              {isPrivacy
                ? "A straightforward explanation of what Habit Tracker does and, just as importantly, what it does not do."
                : "The simple rules for using Habit Tracker, a lightweight tool for building everyday routines."}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>LAST UPDATED</Text>
              <Text style={styles.metaDate}>{updated}</Text>
            </View>
          </View>

          {isPrivacy ? (
            <View style={styles.promiseCard}>
              <CheckCircle2 size={19} color={colors.brand} strokeWidth={2} />
              <View style={styles.promiseCopy}>
                <Text style={styles.promiseTitle}>Offline by design</Text>
                <Text style={styles.promiseBody}>No account. No app-controlled data collection. No habit data sent to our servers.</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.sections}>
            {sections.map((section, index) => <LegalSectionView key={section.title} section={section} index={index} />)}
          </View>

          <View style={styles.contactCard}>
            <Text style={styles.contactEyebrow}>NEED TO REACH US?</Text>
            <Text style={styles.contactTitle}>Contact WasiiLabs</Text>
            <Text style={styles.contactBody}>Questions about this {isPrivacy ? "policy" : "agreement"}? Reach out using any of the addresses below.</Text>
            {["hi@wasii.dev", "legal@wasii.dev", "legal@hackerwasii.com", "hi@hackerwasii.com"].map((email) => (
              <Text key={email} selectable style={styles.email}>{email}</Text>
            ))}
          </View>
          <Text style={styles.footer}>HABIT TRACKER · WASIILABS</Text>
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </AppBackground>
  );
}

function createStyles() { return StyleSheet.create({
  root: { flex: 1 },
  topBar: { minHeight: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 20, gap: 12 },
  backButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: color("paper", 0.94), borderWidth: 1, borderColor: surfaces.border, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  topLabel: { color: colors.secondary, fontFamily: monoFont, fontSize: 10, fontWeight: "700", letterSpacing: 1.1 },
  topSpacer: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 28 },
  heroCard: { borderRadius: 26, padding: 21, backgroundColor: colors.strongSurface, marginBottom: 16 },
  heroIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: color("mint", 0.16), alignItems: "center", justifyContent: "center", marginBottom: 19 },
  eyebrow: { color: colors.citrus, fontFamily: monoFont, fontSize: 9, fontWeight: "700", letterSpacing: 1.15, marginBottom: 9 },
  title: { color: colors.onStrong, fontFamily: roundedFont, fontSize: 31, fontWeight: "700", letterSpacing: -0.8, marginBottom: 10 },
  intro: { color: color("paper", 0.78), fontSize: 13, lineHeight: 20 },
  metaRow: { borderTopWidth: 1, borderTopColor: color("paper", 0.14), marginTop: 20, paddingTop: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  metaText: { color: color("paper", 0.55), fontFamily: monoFont, fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
  metaDate: { color: colors.onStrong, fontSize: 11, fontWeight: "600" },
  promiseCard: { flexDirection: "row", alignItems: "flex-start", gap: 11, borderRadius: 19, padding: 16, backgroundColor: color("mint", 0.14), borderWidth: 1, borderColor: color("brand", 0.12), marginBottom: 24 },
  promiseCopy: { flex: 1, gap: 5 },
  promiseTitle: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  promiseBody: { color: colors.secondary, fontSize: 11, lineHeight: 17 },
  sections: { gap: 2 },
  section: { paddingVertical: 19, borderBottomWidth: 1, borderBottomColor: surfaces.mutedBorder },
  sectionHeading: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  sectionNumber: { color: colors.brand, fontFamily: monoFont, fontSize: 10, fontWeight: "700", paddingTop: 3 },
  sectionTitle: { flex: 1, color: colors.ink, fontFamily: roundedFont, fontSize: 17, fontWeight: "700", letterSpacing: -0.2 },
  paragraph: { color: colors.secondary, fontSize: 12, lineHeight: 19, marginBottom: 10 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 },
  bulletDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.brand, marginTop: 7 },
  bulletText: { flex: 1, color: colors.secondary, fontSize: 12, lineHeight: 19 },
  contactCard: { borderRadius: 22, backgroundColor: color("paper", 0.94), borderWidth: 1, borderColor: surfaces.border, padding: 18, marginTop: 22 },
  contactEyebrow: { color: colors.brand, fontFamily: monoFont, fontSize: 9, fontWeight: "700", letterSpacing: 1.1, marginBottom: 8 },
  contactTitle: { color: colors.ink, fontFamily: roundedFont, fontSize: 20, fontWeight: "700", letterSpacing: -0.4, marginBottom: 7 },
  contactBody: { color: colors.secondary, fontSize: 11, lineHeight: 17, marginBottom: 13 },
  email: { color: colors.brand, fontSize: 12, lineHeight: 23, fontWeight: "600" },
  footer: { color: color("secondary", 0.75), textAlign: "center", fontFamily: monoFont, fontSize: 9, fontWeight: "700", letterSpacing: 0.9, marginTop: 22 },
  bottomSpacer: { height: 34 },
}); }
