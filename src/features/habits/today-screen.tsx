import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ArrowUpRight, Check, Circle, Sparkles } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { color, colors, surfaces } from "../../design/tokens";
import { HabitRow } from "./habit-row";
import type { Habit } from "./types";

type TodayScreenProps = { habits: Habit[]; onToggleHabit: (id: string) => void; onViewAll: () => void };

export function TodayScreen({ habits, onToggleHabit, onViewAll }: TodayScreenProps) {
  const completed = habits.filter((habit) => habit.completed).length;
  const total = habits.length;
  const progress = total === 0 ? 0 : completed / total;
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topLine}>
          <View style={styles.wordmark}><View style={styles.brandDot} /><Text style={styles.brandName}>little by little</Text></View>
          <View style={styles.dateStamp}><Text style={styles.dateDay}>{day}</Text><Text style={styles.dateNumber}>{date}</Text></View>
        </View>

        <View style={styles.heading}>
          <Text style={styles.greeting}>{greeting},</Text>
          <ScreenHeading eyebrow="A FRESH PAGE" title="Today." subtitle="Make today feel like your own." />
        </View>

        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>YOUR DAILY RHYTHM</Text>
              <Text style={styles.heroTitle}>{completed === total && total > 0 ? "You did it." : completed === 0 ? "Start where you are." : "Look at you go."}</Text>
              <Text style={styles.heroSubtitle}>{completed === total && total > 0 ? "Every promise, kept." : total - completed + " small " + (total - completed === 1 ? "promise" : "promises") + " left today."}</Text>
            </View>
            <View style={styles.ring}>
              <Text style={styles.ringPercent}>{Math.round(progress * 100)}<Text style={styles.ringUnit}>%</Text></Text>
              <Text style={styles.ringLabel}>DONE</Text>
            </View>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: (progress * 100) + "%" }]} /></View>
          <View style={styles.heroBottom}><Text style={styles.heroCount}>{String(completed).padStart(2, "0")} <Text style={styles.heroMuted}>/ {String(total).padStart(2, "0")} habits</Text></Text><Text style={styles.heroFootnote}>PROGRESS, NOT PERFECTION</Text></View>
          <View pointerEvents="none" style={styles.heroOrb} />
        </View>

        <View style={styles.sectionHeader}>
          <View><Text style={styles.sectionKicker}>THE LITTLE THINGS</Text><Text style={styles.sectionTitle}>Your habits</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel="View all habits" onPress={onViewAll} style={({ pressed }) => [styles.viewAll, pressed && styles.pressed]}>
            <Text style={styles.viewAllText}>All habits</Text><ArrowUpRight size={16} color={colors.brand} strokeWidth={2} />
          </Pressable>
        </View>

        {habits.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyMark}><Sparkles size={22} color={colors.brand} strokeWidth={1.7} /></View>
            <Text style={styles.emptyTitle}>Make room for a good thing.</Text>
            <Text style={styles.emptyBody}>Choose one small habit to begin. You can build from there.</Text>
            <Pressable onPress={onViewAll} style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}><Text style={styles.emptyButtonText}>Create your first habit</Text></Pressable>
          </View>
        ) : (
          <View style={styles.habitList}>
            {habits.slice(0, 5).map((habit, index) => (
              <View key={habit.id} style={styles.habitItem}>
                <Text style={[styles.index, habit.completed && styles.indexDone]}>{String(index + 1).padStart(2, "0")}</Text>
                <View style={styles.rowWrap}><HabitRow habit={habit} onToggle={onToggleHabit} compact /></View>
              </View>
            ))}
          </View>
        )}
        {habits.length > 5 ? <Pressable onPress={onViewAll} style={styles.more}><Text style={styles.moreText}>+ {habits.length - 5} more in your routine</Text></Pressable> : null}

        <View style={styles.note}><View style={styles.noteIcon}><Check size={15} color={colors.brand} strokeWidth={2.2} /></View><View style={styles.noteCopy}><Text style={styles.noteTitle}>Small steps still move you forward.</Text><Text style={styles.noteBody}>A gentle reminder: showing up is enough to begin.</Text></View></View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 30 },
  topLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 26 },
  wordmark: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandDot: { width: 11, height: 11, borderRadius: 4, backgroundColor: colors.brand, transform: [{ rotate: "45deg" }] },
  brandName: { color: colors.ink, fontSize: 13, fontWeight: "700", letterSpacing: -0.25 },
  dateStamp: { alignItems: "flex-end", gap: 2 },
  dateDay: { color: colors.secondary, fontSize: 10, fontWeight: "600", letterSpacing: 0.4 },
  dateNumber: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  heading: { marginBottom: 21, gap: 3 },
  greeting: { color: colors.secondary, fontSize: 13, fontWeight: "500" },
  hero: { backgroundColor: colors.brandDark, borderRadius: 25, padding: 20, marginBottom: 31, overflow: "hidden" },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 },
  heroCopy: { flex: 1, gap: 7 },
  heroEyebrow: { color: color("paper", 0.68), fontSize: 9, fontWeight: "700", letterSpacing: 1.3 },
  heroTitle: { color: colors.paper, fontSize: 24, fontWeight: "800", letterSpacing: -0.8, lineHeight: 29 },
  heroSubtitle: { color: color("paper", 0.72), fontSize: 12, lineHeight: 17 },
  ring: { width: 79, height: 79, borderRadius: 40, borderWidth: 1.5, borderColor: color("paper", 0.27), backgroundColor: color("paper", 0.07), alignItems: "center", justifyContent: "center" },
  ringPercent: { color: colors.paper, fontSize: 23, fontWeight: "800", letterSpacing: -1 },
  ringUnit: { fontSize: 12, fontWeight: "600" },
  ringLabel: { color: color("paper", 0.64), fontSize: 8, fontWeight: "700", letterSpacing: 1 },
  progressTrack: { height: 5, backgroundColor: color("paper", 0.16), borderRadius: 8, overflow: "hidden" },
  progressFill: { height: 5, backgroundColor: color("sand"), borderRadius: 8 },
  heroBottom: { marginTop: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  heroCount: { color: colors.paper, fontSize: 14, fontWeight: "800" },
  heroMuted: { color: color("paper", 0.63), fontSize: 11, fontWeight: "500" },
  heroFootnote: { color: color("paper", 0.58), fontSize: 8, fontWeight: "700", letterSpacing: 0.7 },
  heroOrb: { position: "absolute", width: 140, height: 140, borderRadius: 70, right: -76, top: -80, borderWidth: 1, borderColor: color("paper", 0.09) },
  sectionHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 },
  sectionKicker: { color: colors.secondary, fontSize: 9, fontWeight: "700", letterSpacing: 1.2, marginBottom: 5 },
  sectionTitle: { color: colors.ink, fontSize: 25, fontWeight: "800", letterSpacing: -0.9 },
  viewAll: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 6, paddingLeft: 8 },
  viewAllText: { color: colors.brand, fontSize: 12, fontWeight: "700" },
  pressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },
  habitList: { gap: 9 },
  habitItem: { flexDirection: "row", alignItems: "center", gap: 9 },
  index: { width: 20, color: color("secondary", 0.68), fontSize: 9, fontWeight: "700", letterSpacing: 0.2 },
  indexDone: { color: colors.brand },
  rowWrap: { flex: 1 },
  empty: { alignItems: "center", paddingHorizontal: 22, paddingVertical: 26, backgroundColor: color("paper", 0.72), borderRadius: 21, borderWidth: 1, borderColor: surfaces.border, gap: 10 },
  emptyMark: { width: 45, height: 45, borderRadius: 16, backgroundColor: color("brand", 0.1), alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: colors.ink, fontSize: 17, fontWeight: "750", textAlign: "center", letterSpacing: -0.4 },
  emptyBody: { color: colors.secondary, fontSize: 12, lineHeight: 18, textAlign: "center" },
  emptyButton: { backgroundColor: colors.brand, borderRadius: 12, minHeight: 42, paddingHorizontal: 17, alignItems: "center", justifyContent: "center", marginTop: 4 },
  emptyButtonText: { color: colors.paper, fontSize: 12, fontWeight: "700" },
  more: { alignItems: "center", paddingVertical: 14 },
  moreText: { color: colors.brand, fontSize: 12, fontWeight: "700" },
  note: { flexDirection: "row", alignItems: "center", gap: 11, borderTopWidth: 1, borderTopColor: surfaces.mutedBorder, marginTop: 23, paddingTop: 17 },
  noteIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: color("brand", 0.1), alignItems: "center", justifyContent: "center" },
  noteCopy: { flex: 1, gap: 3 },
  noteTitle: { color: colors.ink, fontSize: 11, fontWeight: "700" },
  noteBody: { color: colors.secondary, fontSize: 10, lineHeight: 15 },
  bottomSpacer: { height: 88 },
});
