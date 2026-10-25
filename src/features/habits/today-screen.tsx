import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";
import { AppBackground } from "../../components/ui/app-background";
import { BrandMark } from "../../components/ui/brand-mark";
import { GlassCard } from "../../components/ui/glass-card";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { color, colors, geometry, surfaces } from "../../design/tokens";
import { HabitRow } from "./habit-row";
import type { Habit } from "./types";

type TodayScreenProps = {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onViewAll: () => void;
};

export function TodayScreen({ habits, onToggleHabit, onViewAll }: TodayScreenProps) {
  const completed = habits.filter((habit) => habit.completed).length;
  const total = habits.length;
  const progress = total === 0 ? 0 : completed / total;
  const circumference = 2 * Math.PI * 39;
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).toUpperCase();

  return (
    <AppBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.brandRow}>
          <View style={styles.brandLockup}>
            <BrandMark size={38} />
            <View style={styles.brandCopy}>
              <Text style={styles.brandName}>HABIT TRACKER</Text>
              <Text style={styles.brandCaption}>A BETTER DAY, BY DESIGN</Text>
            </View>
          </View>
          <View style={styles.datePill}>
            <View style={styles.dateDot} />
            <Text style={styles.datePillText}>TODAY</Text>
          </View>
        </View>

        <View style={styles.headingWrap}>
          <ScreenHeading
            eyebrow={todayLabel}
            title="Make it count."
            subtitle="Small promises. Kept daily."
          />
        </View>

        <View style={styles.hero}>
          <View pointerEvents="none" style={styles.heroOrb} />
          <View pointerEvents="none" style={styles.heroOrbSmall} />
          <View style={styles.heroTop}>
            <View style={styles.heroLabelWrap}>
              <Text style={styles.heroEyebrow}>DAILY MOMENTUM</Text>
              <Text style={styles.heroTitle}>Your daily rhythm</Text>
            </View>
            <View style={styles.heroSparkle}>
              <Sparkles size={17} color={colors.citrus} />
            </View>
          </View>
          <View style={styles.heroBottom}>
            <View style={styles.progressCopy}>
              <Text style={styles.progressCount}>{completed}<Text style={styles.progressSlash}> / {total}</Text></Text>
              <Text style={styles.progressLabel}>habits completed</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: (progress * 100) + "%" }]} />
              </View>
              <Text style={styles.progressHint}>
                {completed === 0
                  ? "Start small. Build from here."
                  : completed === total
                    ? "You showed up for yourself."
                    : "You're building something good."}
              </Text>
            </View>
            <View style={styles.ringWrap}>
              <Svg width={96} height={96} viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r="39" fill="none" stroke={color("paper", 0.16)} strokeWidth="7" />
                <Circle
                  cx="50"
                  cy="50"
                  r="39"
                  fill="none"
                  stroke={colors.citrus}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={String(circumference)}
                  strokeDashoffset={String(circumference * (1 - progress))}
                  rotation="-90"
                  origin="50, 50"
                />
              </Svg>
              <View style={styles.ringCenter}>
                <Text style={styles.ringPercent}>{Math.round(progress * 100)}%</Text>
                <Text style={styles.ringLabel}>DONE</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>SHOW UP FOR YOURSELF</Text>
            <Text style={styles.sectionTitle}>Your habits</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View all habits"
            onPress={onViewAll}
            style={({ pressed }) => [styles.viewAllButton, pressed && styles.pressed]}
          >
            <Text style={styles.viewAllText}>VIEW ALL</Text>
            <ArrowUpRight size={15} color={colors.brand} />
          </Pressable>
        </View>

        <View style={styles.habitList}>
          {habits.length === 0 ? (
            <GlassCard style={styles.emptyCard} shadow={false}>
              <CheckCircle2 size={30} color={colors.brand} />
              <Text style={styles.emptyTitle}>Make your first promise</Text>
              <Text style={styles.emptyBody}>Add one small habit you want to make part of your day.</Text>
              <Pressable onPress={onViewAll} style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Create a habit</Text>
              </Pressable>
            </GlassCard>
          ) : habits.slice(0, 4).map((habit) => (
            <HabitRow key={habit.id} habit={habit} onToggle={onToggleHabit} compact />
          ))}
        </View>

        {habits.length > 4 ? (
          <Pressable onPress={onViewAll} style={styles.moreHabits}>
            <Text style={styles.moreHabitsText}>+ {habits.length - 4} more in your routine</Text>
            <ArrowUpRight size={15} color={colors.brand} />
          </Pressable>
        ) : null}

        <View style={styles.footerNote}>
          <View style={styles.footerIcon}>
            <Sparkles size={17} color={colors.brand} />
          </View>
          <View style={styles.footerCopy}>
            <Text style={styles.footerTitle}>Progress over perfection.</Text>
            <Text style={styles.footerBody}>Miss a moment? You can always begin again.</Text>
          </View>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  brandLockup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandCopy: {
    gap: 4,
  },
  brandName: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  brandCaption: {
    color: colors.secondary,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.4,
    fontFamily: "monospace",
  },
  datePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: surfaces.border,
    backgroundColor: color("paper", 0.82),
  },
  dateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brand,
  },
  datePillText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    fontFamily: "monospace",
  },
  headingWrap: {
    marginBottom: 22,
  },
  hero: {
    minHeight: 220,
    borderRadius: geometry.glassCardRadius,
    backgroundColor: colors.brandDark,
    overflow: "hidden",
    padding: 22,
    marginBottom: 29,
  },
  heroOrb: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    right: -78,
    top: -88,
    backgroundColor: color("mint", 0.1),
  },
  heroOrbSmall: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    right: 12,
    bottom: -78,
    borderWidth: 1,
    borderColor: color("paper", 0.1),
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroLabelWrap: {
    gap: 7,
  },
  heroEyebrow: {
    color: colors.citrus,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    fontFamily: "monospace",
  },
  heroTitle: {
    color: colors.paper,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.4,
    fontFamily: "sans-serif-rounded",
  },
  heroSparkle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color("paper", 0.1),
    borderWidth: 1,
    borderColor: color("paper", 0.12),
  },
  heroBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 21,
  },
  progressCopy: {
    flex: 1,
    gap: 5,
  },
  progressCount: {
    color: colors.paper,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.2,
    lineHeight: 38,
    fontFamily: "sans-serif-rounded",
  },
  progressSlash: {
    color: color("paper", 0.55),
    fontSize: 19,
    fontWeight: "700",
  },
  progressLabel: {
    color: color("paper", 0.72),
    fontSize: 12,
    fontWeight: "600",
  },
  progressTrack: {
    height: 5,
    maxWidth: 150,
    borderRadius: 999,
    backgroundColor: color("paper", 0.16),
    overflow: "hidden",
    marginTop: 7,
  },
  progressFill: {
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.citrus,
  },
  progressHint: {
    color: color("paper", 0.7),
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },
  ringWrap: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  ringPercent: {
    color: colors.paper,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  ringLabel: {
    color: color("paper", 0.6),
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.3,
    fontFamily: "monospace",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionEyebrow: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,
    fontFamily: "monospace",
    marginBottom: 5,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: -0.7,
    fontFamily: "sans-serif-rounded",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  viewAllText: {
    color: colors.brand,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    fontFamily: "monospace",
  },
  pressed: {
    opacity: 0.78,
  },
  habitList: {
    gap: 10,
  },
  emptyCard: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 12,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyBody: {
    color: colors.secondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: colors.ink,
    borderRadius: 15,
    height: 42,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  emptyButtonText: {
    color: colors.paper,
    fontSize: 13,
    fontWeight: "800",
  },
  moreHabits: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 15,
  },
  moreHabitsText: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: "800",
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: surfaces.mutedBorder,
    marginTop: 18,
    paddingTop: 18,
    paddingHorizontal: 2,
  },
  footerIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: color("mint", 0.16),
    alignItems: "center",
    justifyContent: "center",
  },
  footerCopy: {
    flex: 1,
    gap: 4,
  },
  footerTitle: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  footerBody: {
    color: colors.secondary,
    fontSize: 11,
  },
  bottomSpacer: {
    height: 90,
  },
});
