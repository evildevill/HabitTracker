import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Bell, ChevronRight, CircleHelp, Moon, ShieldCheck, Smartphone } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { BrandMark } from "../../components/ui/brand-mark";
import { GlassCard } from "../../components/ui/glass-card";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { color, colors, monoFont, surfaces } from "../../design/tokens";

const items = [
  { icon: Bell, title: "Reminders", subtitle: "Choose when a habit nudges you", status: "NEXT" },
  { icon: Moon, title: "Appearance", subtitle: "A calm interface for every day", status: "NEXT" },
  { icon: ShieldCheck, title: "Your data", subtitle: "Private by design, no account needed", status: "PLANNED" },
  { icon: CircleHelp, title: "Help & feedback", subtitle: "Questions, ideas, and support", status: "NEXT" },
];

export function SettingsScreen() {
  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topLine}>
          <View style={styles.topMark}><Smartphone size={18} color={colors.brand} /></View>
          <Text style={styles.topLabel}>MAKE IT YOURS</Text>
        </View>
        <View style={styles.heading}>
          <ScreenHeading
            eyebrow="Your space"
            title="Settings"
            subtitle="Make your routine work for you."
          />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileMark}><BrandMark size={48} /></View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileTitle}>Habit Tracker</Text>
            <Text style={styles.profileSubtitle}>Small steps. Real change.</Text>
          </View>
          <View style={styles.versionPill}><Text style={styles.versionText}>V2</Text></View>
        </View>

        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.settingsList}>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.title} style={styles.settingRow}>
                <View style={styles.settingIcon}><Icon size={19} color={colors.brand} /></View>
                <View style={styles.settingCopy}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.statusPill}><Text style={styles.statusText}>{item.status}</Text></View>
                <ChevronRight size={16} color={color("secondary", 0.65)} />
              </View>
            );
          })}
        </View>

        <GlassCard style={styles.noteCard} shadow={false}>
          <View style={styles.noteMark}><ShieldCheck size={18} color={colors.brand} /></View>
          <View style={styles.noteCopy}>
            <Text style={styles.noteTitle}>Built around your life.</Text>
            <Text style={styles.noteBody}>No pressure, no noise. Just a thoughtful space to build habits that matter to you.</Text>
          </View>
        </GlassCard>
        <Text style={styles.footer}>MADE FOR THE LONG GAME</Text>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  topLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 26,
  },
  topMark: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: surfaces.border,
    alignItems: "center",
    justifyContent: "center",
  },
  topLabel: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: monoFont,
  },
  heading: {
    marginBottom: 24,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 17,
    borderRadius: 24,
    backgroundColor: colors.ink,
    marginBottom: 30,
  },
  profileMark: {
    borderRadius: 17,
    padding: 5,
    backgroundColor: color("paper", 0.1),
  },
  profileCopy: {
    flex: 1,
    gap: 5,
  },
  profileTitle: {
    color: colors.paper,
    fontSize: 16,
    fontWeight: "700",
  },
  profileSubtitle: {
    color: color("paper", 0.65),
    fontSize: 11,
  },
  versionPill: {
    backgroundColor: color("paper", 0.1),
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  versionText: {
    color: colors.citrus,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: monoFont,
    marginBottom: 12,
  },
  settingsList: {
    borderRadius: 24,
    backgroundColor: color("paper", 0.86),
    borderWidth: 1,
    borderColor: surfaces.border,
    overflow: "hidden",
  },
  settingRow: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: surfaces.mutedBorder,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: color("mint", 0.16),
    alignItems: "center",
    justifyContent: "center",
  },
  settingCopy: {
    flex: 1,
    gap: 4,
  },
  settingTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "700",
  },
  settingSubtitle: {
    color: colors.secondary,
    fontSize: 10,
    lineHeight: 15,
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: color("sand", 0.3),
  },
  statusText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.7,
    fontFamily: monoFont,
  },
  pressed: {
    opacity: 0.8,
  },
  noteCard: {
    flexDirection: "row",
    gap: 12,
    padding: 17,
    marginTop: 20,
  },
  noteMark: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: color("mint", 0.17),
    alignItems: "center",
    justifyContent: "center",
  },
  noteCopy: {
    flex: 1,
    gap: 5,
  },
  noteTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "700",
  },
  noteBody: {
    color: colors.secondary,
    fontSize: 11,
    lineHeight: 17,
  },
  footer: {
    textAlign: "center",
    color: color("secondary", 0.75),
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.7,
    fontFamily: monoFont,
    marginTop: 25,
  },
  bottomSpacer: {
    height: 90,
  },
});
