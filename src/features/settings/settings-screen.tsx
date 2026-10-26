import { AppText as Text } from "../../components/ui/app-text";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Bell, ChevronRight, CircleHelp, FileText, Moon, ShieldCheck, RotateCcw } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { BrandMark } from "../../components/ui/brand-mark";
import { GlassCard } from "../../components/ui/glass-card";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { color, colors, surfaces } from "../../design/tokens";
import type { LegalDocument } from "./legal-screen";

const items = [
  { icon: ShieldCheck, title: "Your data", subtitle: "Private by design, no account needed", status: "INFO" },
  { icon: CircleHelp, title: "Help & feedback", subtitle: "Questions, ideas, and support", status: "SOON" },
];

type SettingsScreenProps = {
  onRestartOnboarding: () => void;
  onOpenLegal: (document: LegalDocument) => void;
  onOpenNotifications: () => void;
  onOpenAppearance: () => void;
};

export function SettingsScreen({ onRestartOnboarding, onOpenLegal, onOpenNotifications, onOpenAppearance }: SettingsScreenProps) {
  const styles = createStyles();
  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <ScreenHeading eyebrow="PREFERENCES" title="Settings" subtitle="A few details to make this yours." />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileMark}><BrandMark size={44} /></View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileTitle}>Habit Tracker</Text>
            <Text style={styles.profileSubtitle}>Small steps. Real change.</Text>
          </View>
          <View style={styles.versionPill}><Text style={styles.versionText}>2.0</Text></View>
        </View>

        <Text style={styles.sectionLabel}>YOUR PREFERENCES</Text>
        <View style={styles.settingsList}>
          <Pressable accessibilityRole="button" accessibilityLabel="Appearance settings" onPress={onOpenAppearance} style={({ pressed }) => [styles.settingRow, pressed && styles.resetPressed]}>
            <View style={styles.settingIcon}><Moon size={18} color={colors.brand} strokeWidth={1.8} /></View>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Appearance</Text>
              <Text style={styles.settingSubtitle}>Light, dark, or follow your system</Text>
            </View>
            <ChevronRight size={16} color={color("secondary", 0.55)} />
          </Pressable>
          {items.map((item, index) => {
            const Icon = item.icon;
            const isData = item.title === "Your data";
            return (
              <Pressable
                key={item.title}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                onPress={() => {
                  if (isData) {
                    Alert.alert(
                      "Your data stays yours",
                      "Habit check-ins currently stay in the active app session and are cleared when you restart onboarding. Your appearance preference is saved on this device. No account is required.",
                      [{ text: "Got it", style: "default" }],
                    );
                    return;
                  }
                  void Linking.openURL("mailto:support@hackerwasii.com?subject=Habit%20Tracker%20Help%20%26%20Feedback").catch(() => {
                    Alert.alert("Can't open email", "Please email support@hackerwasii.com from your preferred mail app.");
                  });
                }}
                style={({ pressed }) => [
                  styles.settingRow,
                  index === items.length - 1 && styles.lastSettingRow,
                  pressed && styles.resetPressed,
                ]}
              >
                <View style={styles.settingIcon}><Icon size={18} color={colors.brand} strokeWidth={1.8} /></View>
                <View style={styles.settingCopy}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={16} color={color("secondary", 0.55)} />
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Manage notifications"
          onPress={onOpenNotifications}
          style={({ pressed }) => [styles.notificationRow, pressed && styles.resetPressed]}
        >
          <View style={styles.settingIcon}><Bell size={18} color={colors.brand} strokeWidth={1.8} /></View>
          <View style={styles.settingCopy}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingSubtitle}>Manage notification access and system settings</Text>
          </View>
          <ChevronRight size={16} color={color("secondary", 0.55)} />
        </Pressable>

        <Text style={[styles.sectionLabel, styles.startOverLabel]}>LEGAL & PRIVACY</Text>
        <View style={styles.settingsList}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Read Privacy Policy"
            onPress={() => onOpenLegal("privacy")}
            style={({ pressed }) => [styles.settingRow, pressed && styles.resetPressed]}
          >
            <View style={styles.settingIcon}><ShieldCheck size={18} color={colors.brand} strokeWidth={1.8} /></View>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingSubtitle}>How your information is handled</Text>
            </View>
            <ChevronRight size={16} color={color("secondary", 0.55)} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Read Terms of Service"
            onPress={() => onOpenLegal("terms")}
            style={({ pressed }) => [styles.settingRow, styles.lastSettingRow, pressed && styles.resetPressed]}
          >
            <View style={styles.settingIcon}><FileText size={18} color={colors.brand} strokeWidth={1.8} /></View>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Terms of Service</Text>
              <Text style={styles.settingSubtitle}>The terms for using Habit Tracker</Text>
            </View>
            <ChevronRight size={16} color={color("secondary", 0.55)} />
          </Pressable>
        </View>

        <Text style={[styles.sectionLabel, styles.startOverLabel]}>START OVER</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => Alert.alert(
            "Start from the beginning?",
            "This restarts onboarding and clears the habits currently in this session. It does not clear your phone cache or other app data.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Start over", style: "destructive", onPress: onRestartOnboarding },
            ],
          )}
          style={({ pressed }) => [styles.resetRow, pressed && styles.resetPressed]}
        >
          <View style={styles.resetIcon}><RotateCcw size={18} color={colors.coral} strokeWidth={1.9} /></View>
          <View style={styles.settingCopy}>
            <Text style={styles.settingTitle}>Restart onboarding</Text>
            <Text style={styles.settingSubtitle}>Choose your starter routines again</Text>
          </View>
          <ChevronRight size={16} color={color("secondary", 0.55)} />
        </Pressable>

        <GlassCard style={styles.noteCard}>
          <View style={styles.noteIcon}><ShieldCheck size={18} color={colors.brand} strokeWidth={1.8} /></View>
          <View style={styles.noteCopy}>
            <Text style={styles.noteTitle}>Your routine belongs to you.</Text>
            <Text style={styles.noteBody}>The essentials stay simple: no account, no pressure, and no noisy distractions.</Text>
          </View>
        </GlassCard>
        <Text style={styles.footer}>MADE FOR THE LONG GAME</Text>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppBackground>
  );
}

function createStyles() { return StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 },
  heading: { marginBottom: 25 },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 13, padding: 16, borderRadius: 22, backgroundColor: colors.strongSurface, marginBottom: 30 },
  profileMark: { borderRadius: 16, padding: 5, backgroundColor: color("paper", 0.1) },
  profileCopy: { flex: 1, gap: 4 },
  profileTitle: { color: colors.onStrong, fontSize: 15, fontWeight: "700", letterSpacing: -0.2 },
  profileSubtitle: { color: color("paper", 0.65), fontSize: 11 },
  versionPill: { backgroundColor: color("paper", 0.1), borderRadius: 999, paddingHorizontal: 9, paddingVertical: 6 },
  versionText: { color: colors.citrus, fontSize: 10, fontWeight: "700" },
  sectionLabel: { color: colors.secondary, fontSize: 10, fontWeight: "700", letterSpacing: 0.65, marginBottom: 11 },
  startOverLabel: { marginTop: 24 },
  settingsList: { borderRadius: 22, backgroundColor: color("paper", 0.92), borderWidth: 1, borderColor: surfaces.border, overflow: "hidden" },
  settingRow: { minHeight: 75, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: surfaces.mutedBorder },
  lastSettingRow: { borderBottomWidth: 0 },
  settingIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: color("mint", 0.16), alignItems: "center", justifyContent: "center" },
  settingCopy: { flex: 1, gap: 4 },
  settingTitle: { color: colors.ink, fontSize: 13, fontWeight: "600" },
  settingSubtitle: { color: colors.secondary, fontSize: 10, lineHeight: 15 },
  statusPill: { paddingHorizontal: 7, paddingVertical: 5, borderRadius: 8, backgroundColor: color("sand", 0.28) },
  statusText: { color: colors.secondary, fontSize: 9, fontWeight: "700", letterSpacing: 0.3 },
  notificationRow: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 20, backgroundColor: color("paper", 0.92), borderWidth: 1, borderColor: surfaces.border, marginTop: 13 },
  resetRow: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 20, backgroundColor: color("paper", 0.92), borderWidth: 1, borderColor: surfaces.border, marginBottom: 20 },
  resetIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: color("coral", 0.12), alignItems: "center", justifyContent: "center" },
  resetPressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  noteCard: { flexDirection: "row", gap: 12, padding: 16, marginTop: 19, borderRadius: 20 },
  noteIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: color("mint", 0.17), alignItems: "center", justifyContent: "center" },
  noteCopy: { flex: 1, gap: 5 },
  noteTitle: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  noteBody: { color: colors.secondary, fontSize: 11, lineHeight: 17 },
  footer: { textAlign: "center", color: color("secondary", 0.75), fontSize: 9, fontWeight: "700", letterSpacing: 0.7, marginTop: 25 },
  bottomSpacer: { height: 92 },
}); }
