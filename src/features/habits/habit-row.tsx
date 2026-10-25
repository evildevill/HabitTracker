import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
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

  const handlePress = () => {
    const feedback = habit.completed
      ? Haptics.ImpactFeedbackStyle.Light
      : Haptics.ImpactFeedbackStyle.Medium;
    void Haptics.impactAsync(feedback).catch(() => undefined);
    onToggle(habit.id);
  };

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={habit.title}
      accessibilityHint={habit.completed ? "Mark this habit as not complete" : "Mark this habit as complete"}
      accessibilityState={{ checked: habit.completed }}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compactCard,
        habit.completed && styles.completedCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.accent, { backgroundColor: color(habit.accent, habit.completed ? 0.45 : 1) }]} />
      <View style={[
        styles.iconTile,
        {
          backgroundColor: color(habit.accent, habit.completed ? 0.08 : 0.13),
          borderColor: color(habit.accent, habit.completed ? 0.12 : 0.2),
        },
      ]}>
        <Icon size={21} color={color(habit.accent)} strokeWidth={1.9} />
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={[styles.title, habit.completed && styles.completedTitle]}>
          {habit.title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>{habit.subtitle}</Text>
      </View>
      <View style={[styles.check, habit.completed && styles.checked]}>
        {habit.completed ? <Check size={16} color={colors.paper} strokeWidth={2.8} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingLeft: 12,
    paddingRight: 15,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: surfaces.card,
    borderWidth: 1,
    borderColor: surfaces.border,
    overflow: "hidden",
  },
  compactCard: {
    minHeight: 72,
    borderRadius: 18,
  },
  completedCard: {
    backgroundColor: color("mint", 0.07),
    borderColor: color("brand", 0.12),
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 14,
    bottom: 14,
    width: 3,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  iconTile: {
    width: 46,
    height: 46,
    borderRadius: 15,
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
    fontWeight: "650",
    letterSpacing: -0.25,
  },
  completedTitle: {
    color: colors.secondary,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  check: {
    width: 27,
    height: 27,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: color("ink", 0.17),
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
});
