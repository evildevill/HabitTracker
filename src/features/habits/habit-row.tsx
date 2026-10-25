import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  BookOpen,
  Check,
  Droplets,
  Dumbbell,
  Footprints,
  Moon,
} from "lucide-react-native";
import type { ComponentType } from "react";
import type { Habit } from "./types";
import { color, colors, geometry, surfaces } from "../../design/tokens";

const iconByHabit = {
  water: Droplets,
  move: Dumbbell,
  read: BookOpen,
  walk: Footprints,
  windDown: Moon,
} satisfies Record<Habit["icon"], ComponentType<{ size?: number; color?: string; strokeWidth?: number }>>;

type HabitRowProps = {
  habit: Habit;
  onToggle: (id: string) => void;
  compact?: boolean;
};

export function HabitRow({ habit, onToggle, compact = false }: HabitRowProps) {
  const Icon = iconByHabit[habit.icon];

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={habit.title}
      accessibilityState={{ checked: habit.completed }}
      onPress={() => onToggle(habit.id)}
      style={({ pressed }) => [
        styles.row,
        compact && styles.compactRow,
        habit.completed && styles.completedRow,
        pressed && styles.pressed,
      ]}
    >
      <View style={[
        styles.iconTile,
        {
          backgroundColor: color(habit.accent, 0.14),
          borderColor: color(habit.accent, 0.25),
        },
      ]}>
        <Icon size={22} color={color(habit.accent)} strokeWidth={2.2} />
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={[styles.title, habit.completed && styles.completedTitle]}>
          {habit.title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>{habit.subtitle}</Text>
      </View>
      <View style={[
        styles.check,
        habit.completed && styles.checked,
      ]}>
        {habit.completed ? <Check size={17} color={colors.ink} strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: surfaces.card,
    borderWidth: 1,
    borderColor: surfaces.border,
  },
  compactRow: {
    minHeight: 74,
    borderRadius: 20,
  },
  completedRow: {
    backgroundColor: color("paper", 0.72),
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.985 }],
  },
  iconTile: {
    width: geometry.habitIcon,
    height: geometry.habitIcon,
    borderRadius: geometry.habitIcon * 0.28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    gap: 5,
  },
  title: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.25,
    fontFamily: "sans-serif-rounded",
  },
  completedTitle: {
    color: colors.secondary,
    textDecorationLine: "line-through",
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: color("ink", 0.17),
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: colors.citrus,
    borderColor: colors.citrus,
  },
});
