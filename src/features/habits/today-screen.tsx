import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ArrowRight, CheckCircle2, Target } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { BrandMark } from "../../components/ui/brand-mark";
import { GlassCard } from "../../components/ui/glass-card";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { color, colors, surfaces } from "../../design/tokens";
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
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <View style={styles.brandLockup}>
            <BrandMark size={36} />
            <View style={styles.brandCopy}>
              <Text style={styles.brandName}>Habit Tracker</Text>
              <Text style={styles.brandCaption}>Build a life that feels good.</Text>
            </View>
          </View>
          <Text style={styles.date}>{todayLabel}</Text>
        </View>

        <View style={styles.heading}>
          <ScreenHeading eyebrow="YOUR DAILY CHECK-IN" title="Today" subtitle="Make a little room for what matters." />
        </View>

        <GlassCard style={styles.progressCard} shadow={false}>
          <View style={styles.progressTop}>
            <View style={styles.progressLabelWrap}>
              <View style={styles.progressIcon}>
                <Target size={17} color={colors.brand} strokeWidth={1.9} />
              </View>
              <View style={styles.progressCopy}>
                <Text style={styles.progressTitle}>Daily progress</Text>
                <Text style={styles.progressSubtitle}>
                  {completed === total && total > 0 ? "Everything checked off. Nice work." : "Every small action counts."}
                </Text>
              </View>
            </View>
            <Text style={styles.percent}>{Math.round(progress * 100)}%</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: (progress * 100) + "%" }]} />
          </View>
          <View style={styles.progressBottom}>
            <Text style={styles.progressCount}><Text style={styles.progressCountStrong}>{completed}</Text> of {total} habits complete</Text>
            <Text style={styles.remaining}>{Math.max(total - completed, 0)} left</Text>
          </View>
        </GlassCard>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Your habits</Text>
            <Text style={styles.sectionSubtitle}>One check-in at a time</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View all habits"
            onPress={onViewAll}
            style={({ pressed }) => [styles.viewAll, pressed && styles.pressed]}
          >
            <Text style={styles.viewAllText}>See all</Text>
            <ArrowRight size={16} color={colors.brand} strokeWidth={1.8} />
          </Pressable>
        </View>

        <View style={styles.habitList}>
          {habits.length === 0 ? (
            <GlassCard style={styles.emptyCard} shadow={false}>
              <View style={styles.emptyIcon}><CheckCircle2 size={25} color={colors.brand} strokeWidth={1.8} /></View>
              <Text style={styles.emptyTitle}>Start with one small habit</Text>
              <Text style={styles.emptyBody}>Choose something simple you can return to every day.</Text>
              <Pressable onPress={onViewAll} style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}>
                <Text style={styles.emptyButtonText}>Create your first habit</Text>
              </Pressable>
            </GlassCard>
          ) : habits.slice(0, 5).map((habit) => (
            <HabitRow key={habit.id} habit={habit} onToggle={onToggleHabit} compact />
          ))}
        </View>

        {habits.length > 5 ? (
          <Pressable onPress={onViewAll} style={({ pressed }) => [styles.moreHabits, pressed && styles.pressed]}>
            <Text style={styles.moreHabitsText}>View {habits.length - 5} more habits</Text>
            <ArrowRight size={15} color={colors.brand} />
          </Pressable>
        ) : null}

        <View style={styles.footerNote}>
          <View style={styles.footerIcon}><CheckCircle2 size={17} color={colors.brand} strokeWidth={1.8} /></View>
          <View style={styles.footerCopy}>
            <Text style={styles.footerTitle}>Consistency, not perfection.</Text>
            <Text style={styles.footerBody}>If today gets messy, you can begin again tomorrow.</Text>
          </View>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 30 },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandCopy: { gap: 3 },
  brandName: { color: colors.ink, fontSize: 13, fontWeight: "700", letterSpacing: -0.2 },
  brandCaption: { color: colors.secondary, fontSize: 11, fontWeight: "400" },
  date: { color: colors.secondary, fontSize: 11, fontWeight: "600" },
  heading: { marginBottom: 22 },
  progressCard: { padding: 18, borderRadius: 22, marginBottom: 30, gap: 16 },
  progressTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  progressLabelWrap: { flexDirection: "row", alignItems: "center", gap: 11, flex: 1 },
  progressIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: color("mint", 0.18), alignItems: "center", justifyContent: "center" },
  progressCopy: { flex: 1, gap: 4 },
  progressTitle: { color: colors.ink, fontSize: 14, fontWeight: "700", letterSpacing: -0.2 },
  progressSubtitle: { color: colors.secondary, fontSize: 11, lineHeight: 16 },
  percent: { color: colors.brand, fontSize: 21, fontWeight: "700", letterSpacing: -0.6 },
  track: { height: 7, borderRadius: 99, backgroundColor: color("brand", 0.1), overflow: "hidden" },
  fill: { height: 7, borderRadius: 99, backgroundColor: colors.brand },
  progressBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progressCount: { color: colors.secondary, fontSize: 12 },
  progressCountStrong: { color: colors.ink, fontWeight: "700" },
  remaining: { color: colors.secondary, fontSize: 11, fontWeight: "500" },
  sectionHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { color: colors.ink, fontSize: 21, fontWeight: "700", letterSpacing: -0.55 },
  sectionSubtitle: { color: colors.secondary, fontSize: 12, marginTop: 4 },
  viewAll: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 7, paddingLeft: 8 },
  viewAllText: { color: colors.brand, fontSize: 12, fontWeight: "600" },
  pressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },
  habitList: { gap: 9 },
  emptyCard: { alignItems: "center", paddingHorizontal: 24, paddingVertical: 27, gap: 10 },
  emptyIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: color("mint", 0.16), alignItems: "center", justifyContent: "center", marginBottom: 2 },
  emptyTitle: { color: colors.ink, fontSize: 17, fontWeight: "700", textAlign: "center", letterSpacing: -0.3 },
  emptyBody: { color: colors.secondary, fontSize: 13, lineHeight: 19, textAlign: "center" },
  emptyButton: { backgroundColor: colors.ink, borderRadius: 13, minHeight: 42, paddingHorizontal: 17, alignItems: "center", justifyContent: "center", marginTop: 6 },
  emptyButtonText: { color: colors.paper, fontSize: 12, fontWeight: "600" },
  moreHabits: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 15 },
  moreHabitsText: { color: colors.brand, fontSize: 12, fontWeight: "600" },
  footerNote: { flexDirection: "row", alignItems: "center", gap: 11, borderTopWidth: 1, borderTopColor: surfaces.mutedBorder, marginTop: 19, paddingTop: 17, paddingHorizontal: 2 },
  footerIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: color("mint", 0.16), alignItems: "center", justifyContent: "center" },
  footerCopy: { flex: 1, gap: 4 },
  footerTitle: { color: colors.ink, fontSize: 12, fontWeight: "600" },
  footerBody: { color: colors.secondary, fontSize: 11, lineHeight: 16 },
  bottomSpacer: { height: 92 },
});
