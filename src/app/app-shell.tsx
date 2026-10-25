import { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { X } from "lucide-react-native";
import { colors, surfaces } from "../design/tokens";
import { initialHabits, type Habit } from "../features/habits/types";
import { TodayScreen } from "../features/habits/today-screen";
import { HabitsScreen } from "../features/habits/habits-screen";
import { InsightsScreen } from "../features/insights/insights-screen";
import { SettingsScreen } from "../features/settings/settings-screen";
import { TabBar, type TabKey } from "../navigation/tab-bar";

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");

  const toggleHabit = (id: string) => {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const addHabit = () => {
    const title = newHabitTitle.trim();
    if (!title) return;

    setHabits((current) => [
      ...current,
      {
        id: "custom-" + Date.now().toString(),
        title,
        subtitle: "Anytime · Daily",
        icon: "read",
        accent: "brand",
        completed: false,
      },
    ]);
    setNewHabitTitle("");
    setAddModalVisible(false);
    setActiveTab("habits");
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {activeTab === "today" ? (
          <TodayScreen
            habits={habits}
            onToggleHabit={toggleHabit}
            onViewAll={() => setActiveTab("habits")}
          />
        ) : activeTab === "habits" ? (
          <HabitsScreen
            habits={habits}
            onToggleHabit={toggleHabit}
            onAddHabit={() => setAddModalVisible(true)}
          />
        ) : activeTab === "insights" ? (
          <InsightsScreen habits={habits} />
        ) : (
          <SettingsScreen />
        )}
        <TabBar activeTab={activeTab} onSelect={setActiveTab} />
      </SafeAreaView>

      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityLabel="Close add habit dialog"
            accessibilityRole="button"
            onPress={() => setAddModalVisible(false)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeadingCopy}>
                <Text style={styles.modalEyebrow}>START SMALL</Text>
                <Text accessibilityRole="header" style={styles.modalTitle}>A new habit</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() => setAddModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={18} color={colors.ink} />
              </Pressable>
            </View>
            <Text style={styles.fieldLabel}>WHAT WOULD YOU LIKE TO PRACTICE?</Text>
            <TextInput
              value={newHabitTitle}
              onChangeText={setNewHabitTitle}
              placeholder="e.g. Stretch for five minutes"
              placeholderTextColor={colors.secondary}
              returnKeyType="done"
              onSubmitEditing={addHabit}
              maxLength={60}
              style={styles.input}
              accessibilityLabel="New habit name"
            />
            <Text style={styles.helperText}>Keep it simple enough to do on an ordinary day.</Text>
            <View style={styles.modalActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setAddModalVisible(false)}
                style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !newHabitTitle.trim() }}
                disabled={!newHabitTitle.trim()}
                onPress={addHabit}
                style={({ pressed }) => [
                  styles.createButton,
                  !newHabitTitle.trim() && styles.createButtonDisabled,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.createText}>Create habit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  safeArea: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(9, 20, 16, 0.42)",
  },
  modalCard: {
    backgroundColor: colors.canvas,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 34,
    borderWidth: 1,
    borderColor: surfaces.border,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  modalHeadingCopy: {
    gap: 7,
  },
  modalEyebrow: {
    color: colors.brand,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    fontFamily: "monospace",
  },
  modalTitle: {
    color: colors.ink,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: surfaces.border,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 10,
    fontFamily: "monospace",
  },
  input: {
    height: 54,
    borderRadius: 17,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: surfaces.border,
    paddingHorizontal: 15,
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600",
  },
  helperText: {
    color: colors.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 26,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: surfaces.border,
  },
  cancelText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800",
  },
  createButton: {
    flex: 1.5,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
  },
  createButtonDisabled: {
    opacity: 0.4,
  },
  createText: {
    color: colors.paper,
    fontSize: 13,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.8,
  },
});
