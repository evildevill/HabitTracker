import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Appearance,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { X } from "lucide-react-native";
import { colors, monoFont, refreshPalette, surfaces } from "../design/tokens";
import type { Habit } from "../features/habits/types";
import { OnboardingScreen } from "../features/onboarding/onboarding-screen";
import { TodayScreen } from "../features/habits/today-screen";
import { HabitsScreen } from "../features/habits/habits-screen";
import { InsightsScreen } from "../features/insights/insights-screen";
import { SettingsScreen } from "../features/settings/settings-screen";
import { LegalScreen, type LegalDocument } from "../features/settings/legal-screen";
import { NotificationPermissionScreen } from "../features/notifications/notification-permission-screen";
import { NotificationSettingsScreen } from "../features/notifications/notification-settings-screen";
import { AppearanceScreen, type AppearanceMode } from "../features/settings/appearance-screen";
import { TabBar, type TabKey } from "../navigation/tab-bar";

export function AppShell() {
  const styles = createStyles();
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showNotificationOnboarding, setShowNotificationOnboarding] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showAppearanceSettings, setShowAppearanceSettings] = useState(false);
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode>("system");
  const [, setPaletteVersion] = useState(0);
  const systemScheme = useColorScheme();
  const [transitioning, setTransitioning] = useState(false);
  const [transitionDark, setTransitionDark] = useState(false);
  const transitionScale = useRef(new Animated.Value(0.001)).current;
  const transitionFade = useRef(new Animated.Value(1)).current;
  const transitionParticles = useRef(new Animated.Value(0)).current;
  const reduceMotion = useRef(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [legalDocument, setLegalDocument] = useState<LegalDocument | null>(null);

  const isDark = appearanceMode === "system" ? systemScheme === "dark" : appearanceMode === "dark";

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => { if (active) reduceMotion.current = enabled; }).catch(() => undefined);
    const motionSubscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) => { reduceMotion.current = enabled; });
    AsyncStorage.getItem("habit-tracker.appearance").then((saved) => {
      if (!active) return;
      if (saved === "light" || saved === "dark" || saved === "system") setAppearanceMode(saved);
    }).catch(() => undefined);
    return () => { active = false; motionSubscription.remove(); };
  }, []);

  useEffect(() => {
    refreshPalette(isDark);
    setPaletteVersion((version) => version + 1);
    Appearance.setColorScheme(appearanceMode === "system" ? null : appearanceMode);
  }, [appearanceMode, isDark]);

  const changeAppearance = (next: AppearanceMode) => {
    if (next === appearanceMode) { setShowAppearanceSettings(false); return; }
    const nextDark = next === "system" ? systemScheme === "dark" : next === "dark";
    void Haptics.selectionAsync().catch(() => undefined);
    setTransitionDark(nextDark);
    if (reduceMotion.current) {
      setAppearanceMode(next);
      void AsyncStorage.setItem("habit-tracker.appearance", next).catch(() => undefined);
      setShowAppearanceSettings(false);
      return;
    }
    setTransitioning(true);
    transitionScale.setValue(0.001);
    transitionParticles.setValue(0);
    transitionFade.setValue(1);
    const { width, height } = Dimensions.get("window");
    const reach = Math.sqrt(width * width + height * height) * 1.2;
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(transitionScale, { toValue: reach / 50, duration: 420, useNativeDriver: true }),
        Animated.timing(transitionParticles, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (!finished) return;
        setAppearanceMode(next);
        void AsyncStorage.setItem("habit-tracker.appearance", next).catch(() => undefined);
        setShowAppearanceSettings(false);
        Animated.timing(transitionFade, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => setTransitioning(false));
      });
    });
  };

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
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);

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
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={styles.safeArea}>
        {showOnboarding ? (
          <OnboardingScreen
            onComplete={(selectedHabits) => {
              setHabits(selectedHabits);
              setShowOnboarding(false);
              setShowNotificationOnboarding(true);
              setActiveTab("today");
            }}
          />
        ) : showNotificationOnboarding ? (
          <NotificationPermissionScreen onFinish={() => setShowNotificationOnboarding(false)} />
        ) : legalDocument ? (
          <LegalScreen document={legalDocument} onBack={() => setLegalDocument(null)} />
        ) : showAppearanceSettings ? (
          <AppearanceScreen mode={appearanceMode} onSelect={changeAppearance} onBack={() => setShowAppearanceSettings(false)} />
        ) : showNotificationSettings ? (
          <NotificationSettingsScreen onBack={() => setShowNotificationSettings(false)} />
        ) : activeTab === "today" ? (
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
          <SettingsScreen
            onOpenLegal={setLegalDocument}
            onOpenNotifications={() => setShowNotificationSettings(true)}
            onOpenAppearance={() => setShowAppearanceSettings(true)}
            onRestartOnboarding={() => {
              setHabits([]);
              setActiveTab("today");
              setLegalDocument(null);
              setShowNotificationOnboarding(false);
              setShowNotificationSettings(false);
              setShowOnboarding(true);
            }}
          />
        )}
        {!showOnboarding && !showNotificationOnboarding && !showNotificationSettings && !showAppearanceSettings && !legalDocument ? <TabBar activeTab={activeTab} onSelect={setActiveTab} /> : null}
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
          <KeyboardAvoidingView
            style={styles.keyboardAvoider}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
          <View style={styles.modalCard}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
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
            </ScrollView>
          </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      {transitioning ? (
        <View pointerEvents="none" style={styles.themeTransition}>
          <Animated.View style={[styles.themeBurst, { backgroundColor: transitionDark ? "#091C16" : "#F4F7F4", transform: [{ scale: transitionScale }], opacity: transitionFade }]} />
          {Array.from({ length: 24 }, (_, index) => {
            const angle = index * 2.399963229728653;
            const distance = 55 + ((index * 43) % 190);
            const travel = transitionParticles.interpolate({ inputRange: [0, 1], outputRange: [0, distance] });
            return <Animated.View key={index} style={[styles.themeParticle, { backgroundColor: index % 4 === 0 ? (transitionDark ? "#DCEB69" : "#B78B36") : (transitionDark ? "#9ECDB8" : "#164D3E"), opacity: transitionParticles.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0] }), transform: [{ translateX: Animated.multiply(travel, Math.cos(angle)) }, { translateY: Animated.multiply(travel, Math.sin(angle)) }, { scale: transitionParticles.interpolate({ inputRange: [0, 1], outputRange: [0.4, index % 5 === 0 ? 1.8 : 1] }) }] }]} />;
          })}
          <Animated.View style={[styles.themeSpark, { opacity: transitionFade, transform: [{ scale: transitionParticles.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1.7] }) }, { rotate: transitionParticles.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "75deg"] }) }] }]}><Text style={[styles.themeSparkText, { color: transitionDark ? "#DCEB69" : "#164D3E" }]}>✦</Text></Animated.View>
        </View>
      ) : null}
    </View>
  );
}

function createStyles() { return StyleSheet.create({
  themeTransition: { ...StyleSheet.absoluteFillObject, zIndex: 999, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  themeBurst: { width: 110, height: 110, borderRadius: 55, position: "absolute", top: "17%", right: "8%" },
  themeSpark: { position: "absolute", top: "18%", right: "12%", width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  themeSparkText: { fontSize: 34, fontWeight: "300" },
  themeParticle: { position: "absolute", top: "17%", right: "8%", width: 4, height: 4, borderRadius: 3 },
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
  keyboardAvoider: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  modalCard: {
    maxHeight: "92%",
    backgroundColor: colors.canvas,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 34,
    borderWidth: 1,
    borderColor: surfaces.border,
  },
  modalScrollContent: {
    paddingBottom: 2,
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
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
    fontFamily: monoFont,
  },
  modalTitle: {
    color: colors.ink,
    fontSize: 29,
    fontWeight: "700",
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
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 10,
    fontFamily: monoFont,
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
    fontWeight: "600",
  },
  createButton: {
    flex: 1.5,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.strongSurface,
  },
  createButtonDisabled: {
    opacity: 0.4,
  },
  createText: {
    color: colors.onStrong,
    fontSize: 13,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
}); }
