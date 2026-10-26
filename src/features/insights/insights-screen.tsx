import { AppText as Text } from "../../components/ui/app-text";
import { AppText as Text as NativeText } from "../../components/ui";
import { ScrollView, StyleSheet, View } from "react-native";
import { ChartNoAxesColumnIncreasing, CircleCheck, Clock3 } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { GlassCard } from "../../components/ui/glass-card";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { color, colors, surfaces } from "../../design/tokens";
import type { Habit } from "../habits/types";

type InsightsScreenProps = { habits: Habit[] };

export function InsightsScreen({ habits }: InsightsScreenProps) {
  const styles = createStyles();
  const completed = habits.filter((habit) => habit.completed).length;
  const percent = habits.length === 0 ? 0 : Math.round((completed / habits.length) * 100);

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <ScreenHeading eyebrow="YOUR PROGRESS" title="Insights" subtitle="Notice the effort you're putting in." />
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}><ChartNoAxesColumnIncreasing size={18} color={colors.brand} strokeWidth={1.9} /></View>
            <Text style={styles.summaryEyebrow}>TODAY AT A GLANCE</Text>
          </View>
          <Text style={styles.summaryTitle}>{percent === 100 && habits.length > 0 ? "You showed up for yourself." : "Showing up is progress."}</Text>
          <Text style={styles.summaryBody}>You have completed {completed} of {habits.length} habits today. Keep your focus on the next small action.</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{completed}<Text style={styles.statMuted}>/{habits.length}</Text></Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{percent}%</Text>
              <Text style={styles.statLabel}>Today's progress</Text>
            </View>
          </View>
          <View style={styles.track}><View style={[styles.fill, { width: percent + "%" }]} /></View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your patterns</Text>
          <View style={styles.soonPill}><Text style={styles.soonText}>COMING LATER</Text></View>
        </View>

        <GlassCard style={styles.futureCard}>
          <View style={styles.futureIcon}><Clock3 size={21} color={colors.brand} strokeWidth={1.8} /></View>
          <Text style={styles.futureTitle}>A clearer picture takes time</Text>
          <Text style={styles.futureBody}>Weekly consistency, streaks, and trends will become more useful as you build a longer history. For now, this view only shows today's check-ins—no made-up statistics.</Text>
          <View style={styles.futureFooter}>
            <CircleCheck size={16} color={colors.brand} strokeWidth={1.9} />
            <Text style={styles.futureFooterText}>Your progress starts with today</Text>
          </View>
        </GlassCard>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppBackground>
  );
}

function createStyles() { return StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 },
  heading: { marginBottom: 25 },
  summaryCard: { borderRadius: 23, padding: 20, backgroundColor: colors.strongSurface, marginBottom: 30, gap: 12 },
  summaryTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  summaryIcon: { width: 37, height: 37, borderRadius: 13, backgroundColor: color("paper", 0.1), alignItems: "center", justifyContent: "center" },
  summaryEyebrow: { color: colors.citrus, fontSize: 10, fontWeight: "700", letterSpacing: 0.7 },
  summaryTitle: { color: colors.onStrong, fontSize: 23, fontWeight: "700", letterSpacing: -0.7, lineHeight: 29, marginTop: 3 },
  summaryBody: { color: color("paper", 0.72), fontSize: 12, lineHeight: 18 },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 7 },
  statBlock: { gap: 4 },
  statValue: { color: colors.onStrong, fontSize: 25, fontWeight: "700", letterSpacing: -0.6 },
  statMuted: { color: color("paper", 0.5), fontSize: 16, fontWeight: "600" },
  statLabel: { color: color("paper", 0.66), fontSize: 11 },
  statDivider: { width: 1, height: 38, backgroundColor: color("paper", 0.16) },
  track: { height: 6, borderRadius: 99, backgroundColor: color("paper", 0.14), overflow: "hidden", marginTop: 4 },
  fill: { height: 6, borderRadius: 99, backgroundColor: colors.citrus },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 13 },
  sectionTitle: { color: colors.ink, fontSize: 21, fontWeight: "700", letterSpacing: -0.5 },
  soonPill: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 999, backgroundColor: color("sand", 0.3) },
  soonText: { color: colors.secondary, fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
  futureCard: { padding: 20, borderRadius: 22, gap: 12 },
  futureIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: color("mint", 0.17), alignItems: "center", justifyContent: "center" },
  futureTitle: { color: colors.ink, fontSize: 17, fontWeight: "700", letterSpacing: -0.3 },
  futureBody: { color: colors.secondary, fontSize: 12, lineHeight: 19 },
  futureFooter: { flexDirection: "row", alignItems: "center", gap: 8, borderTopWidth: 1, borderTopColor: surfaces.mutedBorder, paddingTop: 14, marginTop: 3 },
  futureFooterText: { color: colors.brand, fontSize: 11, fontWeight: "600" },
  bottomSpacer: { height: 92 },
}); }
