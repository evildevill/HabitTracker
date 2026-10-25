import type { ColorToken } from "../../design/tokens";

export type HabitIcon = "water" | "move" | "read" | "walk" | "windDown";

export type Habit = {
  id: string;
  title: string;
  subtitle: string;
  icon: HabitIcon;
  accent: ColorToken;
  completed: boolean;
};

export const initialHabits: Habit[] = [
  { id: "water", title: "Drink water", subtitle: "Start hydrated · 8 glasses", icon: "water", accent: "sky", completed: false },
  { id: "move", title: "Move your body", subtitle: "A little movement counts", icon: "move", accent: "coral", completed: false },
  { id: "read", title: "Read a few pages", subtitle: "Make room for learning", icon: "read", accent: "brand", completed: false },
  { id: "walk", title: "Get outside", subtitle: "Fresh air and a short walk", icon: "walk", accent: "mint", completed: false },
  { id: "wind-down", title: "Evening reset", subtitle: "Slow down before sleep", icon: "windDown", accent: "sand", completed: false },
];
