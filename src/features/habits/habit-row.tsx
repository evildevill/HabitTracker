import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { BookOpen, Check, Droplets, Dumbbell, Footprints, Moon } from "lucide-react-native";
import type { ComponentType } from "react";
import type { Habit } from "./types";
import { color, colors, surfaces } from "../../design/tokens";

const iconByHabit = {
  water: Droplets, move: Dumbbell, read: BookOpen, walk: Footprints, windDown: Moon,
} satisfies Record<Habit["icon"], ComponentType<{ size?: number; color?: string; strokeWidth?: number }>>;
type HabitRowProps = { habit: Habit; onToggle: (id: string) => void; compact?: boolean };

export function HabitRow({ habit, onToggle, compact = false }: HabitRowProps) {
  const Icon = iconByHabit[habit.icon];
  const handlePress = () => {
    void Haptics.impactAsync(habit.completed ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    onToggle(habit.id);
  };
  return (
    <Pressable accessibilityRole="checkbox" accessibilityLabel={habit.title}
      accessibilityHint={habit.completed ? "Mark this habit as not complete" : "Mark this habit as complete"}
      accessibilityState={{ checked: habit.completed }} onPress={handlePress}
      style={({ pressed }) => [styles.row, compact && styles.compactRow, habit.completed && styles.doneRow, pressed && styles.pressed]}>
      <View style={[styles.iconTile, { backgroundColor: color(habit.accent, 0.13) }]}>
        <Icon size={21} color={color(habit.accent === "brand" ? "brand" : habit.accent)} strokeWidth={1.8} />
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={[styles.title, habit.completed && styles.doneTitle]}>{habit.title}</Text>
        <Text numberOfLines={1} style={styles.subtitle}>{habit.subtitle}</Text>
      </View>
      <View style={[styles.check, habit.completed && styles.checked]}>
        {habit.completed ? <Check size={16} color={colors.paper} strokeWidth={2.7} /> : null}
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  row: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: 13, paddingHorizontal: 13, paddingVertical: 12, borderRadius: 17, backgroundColor: surfaces.card, borderWidth: 1, borderColor: surfaces.border },
  compactRow: { minHeight: 70, borderRadius: 16, backgroundColor: color("paper", 0.83) },
  doneRow: { backgroundColor: color("brand", 0.055), borderColor: color("brand", 0.13) },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  iconTile: { width: 43, height: 43, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, gap: 5 },
  title: { color: colors.ink, fontSize: 14, fontWeight: "650", letterSpacing: -0.2 },
  doneTitle: { color: colors.secondary },
  subtitle: { color: colors.secondary, fontSize: 11, fontWeight: "400", lineHeight: 15 },
  check: { width: 27, height: 27, borderRadius: 9, borderWidth: 1.5, borderColor: color("brand", 0.32), backgroundColor: colors.paper, alignItems: "center", justifyContent: "center" },
  checked: { backgroundColor: colors.brand, borderColor: colors.brand },
});
