import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Plus, SlidersHorizontal } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { colors, surfaces } from "../../design/tokens";
import { HabitRow } from "./habit-row";
import type { Habit } from "./types";

type HabitsScreenProps = {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onAddHabit: () => void;
};

export function HabitsScreen({ habits, onToggleHabit, onAddHabit }: HabitsScreenProps) {
  const completed = habits.filter((habit) => habit.completed).length;

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topLine}>
          <View style={styles.topMark}><SlidersHorizontal size={18} color={colors.brand} /></View>
          <Text style={styles.topLabel}>YOUR PERSONAL ROUTINE</Text>
        </View>
        <View style={styles.heading}>
          <ScreenHeading
            eyebrow="THE DAILY PRACTICE"
            title="Habits"
            subtitle="Make the good things easier to repeat."
            count={String(habits.length).padStart(2, "0")}
          />
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryLabel}>TODAY'S CHECK-IN</Text>
            <Text style={styles.summaryTitle}>{completed} of {habits.length} complete</Text>
            <Text style={styles.summaryBody}>Every check is a vote for the person you're becoming.</Text>
          </View>
          <View style={styles.summaryMark}>
            <Text style={styles.summaryNumber}>{habits.length === 0 ? "—" : Math.round((completed / habits.length) * 100) + "%"}</Text>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Your routine</Text>
          <Text style={styles.listCount}>{habits.length} HABITS</Text>
        </View>
        <View style={styles.list}>
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} onToggle={onToggleHabit} />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onAddHabit}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <View style={styles.addIcon}><Plus size={19} color={colors.paper} strokeWidth={2.5} /></View>
          <View style={styles.addCopy}>
            <Text style={styles.addTitle}>Add a habit</Text>
            <Text style={styles.addSubtitle}>Start with one small, repeatable action.</Text>
          </View>
          <Plus size={19} color={colors.brand} />
        </Pressable>
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
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    fontFamily: "monospace",
  },
  heading: {
    marginBottom: 22,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderRadius: 24,
    backgroundColor: colors.ink,
    padding: 20,
    marginBottom: 28,
  },
  summaryCopy: {
    flex: 1,
    gap: 7,
  },
  summaryLabel: {
    color: colors.citrus,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    fontFamily: "monospace",
  },
  summaryTitle: {
    color: colors.paper,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  summaryBody: {
    color: color("paper", 0.7),
    fontSize: 11,
    lineHeight: 16,
  },
  summaryMark: {
    width: 64,
    height: 64,
    borderRadius: 21,
    backgroundColor: color("paper", 0.09),
    borderWidth: 1,
    borderColor: color("paper", 0.12),
    alignItems: "center",
    justifyContent: "center",
  },
  summaryNumber: {
    color: colors.citrus,
    fontSize: 15,
    fontWeight: "900",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  listTitle: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  listCount: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    fontFamily: "monospace",
  },
  list: {
    gap: 10,
  },
  addButton: {
    minHeight: 78,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 22,
    backgroundColor: color("mint", 0.13),
    borderWidth: 1,
    borderColor: color("brand", 0.13),
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  addIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  addCopy: {
    flex: 1,
    gap: 4,
  },
  addTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900",
  },
  addSubtitle: {
    color: colors.secondary,
    fontSize: 11,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  bottomSpacer: {
    height: 90,
  },
});
