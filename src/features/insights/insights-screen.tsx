import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ArrowUpRight, ChartNoAxesColumnIncreasing, CircleCheck } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { GlassCard } from "../../components/ui/glass-card";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { color, colors, monoFont, roundedFont, surfaces } from "../../design/tokens";
import type { Habit } from "../habits/types";

type InsightsScreenProps = {
  habits: Habit[];
};

export function InsightsScreen({ habits }: InsightsScreenProps) {
  const completed = habits.filter((habit) => habit.completed).length;
  const percent = habits.length === 0 ? 0 : Math.round((completed / habits.length) * 100);

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topLine}>
          <View style={styles.topMark}><ChartNoAxesColumnIncreasing size={18} color={colors.brand} /></View>
          <Text style={styles.topLabel}>A CLEARER VIEW OF YOU</Text>
        </View>
        <View style={styles.heading}>
          <ScreenHeading
            eyebrow="Your progress"
            title="Insights"
            subtitle="A clearer view of your consistency."
          />
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureOrb} />
          <View style={styles.featureTop}>
            <View style={styles.featureIcon}><ChartNoAxesColumnIncreasing size={19} color={colors.citrus} strokeWidth={1.8} /></View>
            <Text style={styles.featureEyebrow}>TODAY, SO FAR</Text>
          </View>
          <Text style={styles.featureTitle}>Showing up is the win.</Text>
          <Text style={styles.featureBody}>Your consistency story begins with the choices you make today. No pressure to be perfect.</Text>
          <View style={styles.featureDivider} />
          <View style={styles.featureStatRow}>
            <View>
              <Text style={styles.featureStat}>{completed}<Text style={styles.featureStatMuted}> / {habits.length}</Text></Text>
              <Text style={styles.featureStatCaption}>habits completed</Text>
            </View>
            <View style={styles.featurePercent}>
              <Text style={styles.featurePercentText}>{percent}%</Text>
            </View>
          </View>
          <View style={styles.featureTrack}>
            <View style={[styles.featureFill, { width: percent + "%" }]} />
          </View>
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Your patterns</Text>
          <View style={styles.comingSoon}><Text style={styles.comingSoonText}>BUILDING</Text></View>
        </View>

        <GlassCard style={styles.emptyCard} shadow={false}>
          <View style={styles.emptyIcon}>
            <ChartNoAxesColumnIncreasing size={26} color={colors.brand} />
          </View>
          <Text style={styles.emptyTitle}>Your story is just beginning.</Text>
          <Text style={styles.emptyBody}>As you check in over time, this space will help you spot streaks, weekly patterns, and the habits that are becoming part of you.</Text>
          <View style={styles.emptyFoot}>
            <CircleCheck size={16} color={colors.brand} />
            <Text style={styles.emptyFootText}>One day at a time</Text>
            <ArrowUpRight size={15} color={colors.brand} />
          </View>
        </GlassCard>
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
    marginBottom: 23,
  },
  featureCard: {
    backgroundColor: colors.ink,
    borderRadius: 26,
    padding: 22,
    overflow: "hidden",
    marginBottom: 30,
  },
  featureOrb: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -80,
    top: -90,
    borderWidth: 1,
    borderColor: color("paper", 0.1),
    backgroundColor: color("brand", 0.12),
  },
  featureTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: color("paper", 0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  featureEyebrow: {
    color: colors.citrus,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: monoFont,
  },
  featureTitle: {
    color: colors.paper,
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: -0.8,
    lineHeight: 30,
    marginBottom: 8,
  },
  featureBody: {
    color: color("paper", 0.72),
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 310,
  },
  featureDivider: {
    height: 1,
    backgroundColor: color("paper", 0.13),
    marginVertical: 20,
  },
  featureStatRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  featureStat: {
    color: colors.paper,
    fontSize: 29,
    fontWeight: "700",
    letterSpacing: -0.7,
  },
  featureStatMuted: {
    color: color("paper", 0.45),
    fontSize: 17,
    fontWeight: "700",
  },
  featureStatCaption: {
    color: color("paper", 0.65),
    fontSize: 11,
    marginTop: 2,
  },
  featurePercent: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: color("paper", 0.1),
  },
  featurePercentText: {
    color: colors.citrus,
    fontSize: 12,
    fontWeight: "700",
  },
  featureTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: color("paper", 0.15),
    overflow: "hidden",
  },
  featureFill: {
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.citrus,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  comingSoon: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: color("sand", 0.35),
  },
  comingSoonText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: monoFont,
  },
  emptyCard: {
    paddingHorizontal: 22,
    paddingVertical: 25,
    gap: 12,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: color("mint", 0.16),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  emptyBody: {
    color: colors.secondary,
    fontSize: 13,
    lineHeight: 20,
  },
  emptyFoot: {
    borderTopWidth: 1,
    borderTopColor: surfaces.mutedBorder,
    paddingTop: 14,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyFootText: {
    flex: 1,
    color: colors.brand,
    fontSize: 11,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 90,
  },
});
