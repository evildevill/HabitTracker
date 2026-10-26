import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CalendarDays, ChartNoAxesColumnIncreasing, CircleCheck, SlidersHorizontal } from "lucide-react-native";
import type { ComponentType } from "react";
import { color, colors, geometry, roundedFont, surfaces } from "../design/tokens";

export type TabKey = "today" | "habits" | "insights" | "settings";

type TabDefinition = {
  key: TabKey;
  label: string;
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
};

const tabs: TabDefinition[] = [
  { key: "today", label: "Today", icon: CalendarDays },
  { key: "habits", label: "Habits", icon: CircleCheck },
  { key: "insights", label: "Insights", icon: ChartNoAxesColumnIncreasing },
  { key: "settings", label: "Settings", icon: SlidersHorizontal },
];

type TabBarProps = {
  activeTab: TabKey;
  onSelect: (tab: TabKey) => void;
};

export function TabBar({ activeTab, onSelect }: TabBarProps) {
  const styles = createStyles();
  return (
    <View style={styles.positioner}>
      <View style={styles.dock}>
        {tabs.map((tab) => {
          const selected = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected }}
              onPress={() => {
                if (!selected) void Haptics.selectionAsync().catch(() => undefined);
                onSelect(tab.key);
              }}
              style={({ pressed }) => [
                styles.tab,
                { width: selected ? geometry.selectedTabWidth : geometry.unselectedTabWidth },
                selected && styles.selectedTab,
                pressed && styles.pressed,
              ]}
            >
              <Icon
                size={18}
                color={selected ? colors.onStrong : colors.secondary}
                strokeWidth={1.8}
              />
              {selected ? <Text style={styles.selectedLabel}>{tab.label}</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles() { return StyleSheet.create({
  positioner: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 8,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 7,
    borderRadius: 21,
    backgroundColor: color("paper", 0.94),
    borderWidth: 1,
    borderColor: surfaces.border,
    shadowColor: colors.ink,
    shadowOpacity: 0.09,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  tab: {
    height: geometry.tabHeight,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    overflow: "hidden",
  },
  selectedTab: {
    backgroundColor: colors.strongSurface,
  },
  selectedLabel: {
    color: colors.onStrong,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: roundedFont,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.975 }],
  },
}); }
