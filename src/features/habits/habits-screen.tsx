import { AppText as Text } from "../../components/ui/app-text";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Plus, ListChecks } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { color, colors, surfaces } from "../../design/tokens";
import { HabitRow } from "./habit-row";
import type { Habit } from "./types";

type HabitsScreenProps = {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onAddHabit: () => void;
};

export function HabitsScreen({ habits, onToggleHabit, onAddHabit }: HabitsScreenProps) {
  const styles = createStyles();
  const completed = habits.filter((habit) => habit.completed).length;
  const percent = habits.length === 0 ? 0 : Math.round((completed / habits.length) * 100);

  const handleAdd = () => {
    void Haptics.selectionAsync().catch(() => undefined);
    onAddHabit();
  };

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <ScreenHeading eyebrow="YOUR ROUTINE" title="Habits" subtitle="Small actions. A stronger routine." count={String(habits.length)} />
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}><ListChecks size={18} color={colors.brand} strokeWidth={1.9} /></View>
            <Text style={styles.summaryLabel}>TODAY'S PROGRESS</Text>
            <View style={styles.summarySpacer} />
            <Text style={styles.summaryPercent}>{percent}%</Text>
          </View>
          <Text style={styles.summaryTitle}>{completed} of {habits.length} complete</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: percent + "%" }]} />
          </View>
          <Text style={styles.summaryBody}>
            {habits.length === 0 ? "Add your first habit and make it your own." : completed === habits.length ? "You've checked in on every habit today." : "There's no rush. Take the next small step."}
          </Text>
        </View>

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.listTitle}>Your routine</Text>
            <Text style={styles.listSubtitle}>Tap a card when you've done it</Text>
          </View>
          <Text style={styles.listCount}>{habits.length} {habits.length === 1 ? "habit" : "habits"}</Text>
        </View>

        <View style={styles.list}>
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} onToggle={onToggleHabit} />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add a habit"
          onPress={handleAdd}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <View style={styles.addIcon}><Plus size={20} color={colors.paper} strokeWidth={2.2} /></View>
          <View style={styles.addCopy}>
            <Text style={styles.addTitle}>Add a habit</Text>
            <Text style={styles.addSubtitle}>Make space for one more good thing.</Text>
          </View>
          <View style={styles.addArrow}><Plus size={18} color={colors.brand} strokeWidth={2} /></View>
        </Pressable>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppBackground>
  );
}

function createStyles() { return StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28 },
  heading: { marginBottom: 24 },
  summaryCard: { padding: 18, borderRadius: 22, backgroundColor: color("paper", 0.94), borderWidth: 1, borderColor: surfaces.border, marginBottom: 29, gap: 12 },
  summaryTop: { flexDirection: "row", alignItems: "center", gap: 9 },
  summaryIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: color("mint", 0.18), alignItems: "center", justifyContent: "center" },
  summaryLabel: { color: colors.secondary, fontSize: 10, fontWeight: "700", letterSpacing: 0.7 },
  summarySpacer: { flex: 1 },
  summaryPercent: { color: colors.brand, fontSize: 16, fontWeight: "700" },
  summaryTitle: { color: colors.ink, fontSize: 19, fontWeight: "700", letterSpacing: -0.45 },
  track: { height: 6, borderRadius: 99, backgroundColor: color("brand", 0.1), overflow: "hidden" },
  fill: { height: 6, borderRadius: 99, backgroundColor: colors.brand },
  summaryBody: { color: colors.secondary, fontSize: 12, lineHeight: 17 },
  listHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 },
  listTitle: { color: colors.ink, fontSize: 21, fontWeight: "700", letterSpacing: -0.5 },
  listSubtitle: { color: colors.secondary, fontSize: 12, marginTop: 4 },
  listCount: { color: colors.secondary, fontSize: 12, fontWeight: "600", paddingBottom: 2 },
  list: { gap: 9 },
  addButton: { minHeight: 76, marginTop: 15, paddingHorizontal: 13, paddingVertical: 12, borderRadius: 20, backgroundColor: color("mint", 0.1), borderWidth: 1, borderColor: color("brand", 0.15), flexDirection: "row", alignItems: "center", gap: 12 },
  addIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: colors.strongSurface, alignItems: "center", justifyContent: "center" },
  addCopy: { flex: 1, gap: 4 },
  addTitle: { color: colors.ink, fontSize: 14, fontWeight: "700", letterSpacing: -0.15 },
  addSubtitle: { color: colors.secondary, fontSize: 11, lineHeight: 16 },
  addArrow: { width: 31, height: 31, borderRadius: 11, backgroundColor: color("paper", 0.85), alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  bottomSpacer: { height: 92 },
}); }
