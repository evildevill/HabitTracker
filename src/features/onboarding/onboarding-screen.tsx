import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { ArrowLeft, ArrowRight, Check, Sun, Brain, Heart, Zap } from "lucide-react-native";
import type { ComponentType } from "react";
import { color, colors, surfaces } from "../../design/tokens";
import type { Habit, HabitIcon } from "../habits/types";

type Preset = {
  id: string;
  title: string;
  description: string;
  time: string;
  accent: "mint" | "citrus" | "coral" | "sky";
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  habits: Array<{ id: string; title: string; subtitle: string; icon: HabitIcon; accent: Habit["accent"] }>;
};

const PRESETS: Preset[] = [
  { id: "balanced", title: "A little balance", description: "A grounded start for everyday life.", time: "5 habits", accent: "mint", icon: Heart, habits: [
    { id: "water", title: "Drink water", subtitle: "Start hydrated · 8 glasses", icon: "water", accent: "sky" },
    { id: "move", title: "Move your body", subtitle: "A little movement counts", icon: "move", accent: "coral" },
    { id: "read", title: "Read a few pages", subtitle: "Make room for learning", icon: "read", accent: "brand" },
    { id: "walk", title: "Get outside", subtitle: "Fresh air and a short walk", icon: "walk", accent: "mint" },
    { id: "wind-down", title: "Evening reset", subtitle: "Slow down before sleep", icon: "windDown", accent: "sand" },
  ] },
  { id: "morning", title: "Gentle mornings", description: "Build a calmer first hour.", time: "3 habits", accent: "citrus", icon: Sun, habits: [
    { id: "morning-water", title: "Drink water", subtitle: "Begin the day hydrated", icon: "water", accent: "sky" },
    { id: "morning-move", title: "Stretch for 5 minutes", subtitle: "Wake up your body gently", icon: "move", accent: "mint" },
    { id: "morning-outside", title: "Get some daylight", subtitle: "Step outside for a moment", icon: "walk", accent: "citrus" },
  ] },
  { id: "focus", title: "Focus & learning", description: "Make space for meaningful progress.", time: "3 habits", accent: "sky", icon: Brain, habits: [
    { id: "focus-read", title: "Read a few pages", subtitle: "Learn a little every day", icon: "read", accent: "sky" },
    { id: "focus-walk", title: "Take a mindful break", subtitle: "Step away from the screen", icon: "walk", accent: "mint" },
    { id: "focus-wind-down", title: "Plan tomorrow", subtitle: "Close the day with clarity", icon: "windDown", accent: "brand" },
  ] },
  { id: "energy", title: "Move & recharge", description: "More energy, without the all-or-nothing.", time: "3 habits", accent: "coral", icon: Zap, habits: [
    { id: "energy-water", title: "Drink water", subtitle: "Keep water within reach", icon: "water", accent: "sky" },
    { id: "energy-move", title: "Move your body", subtitle: "Choose movement you enjoy", icon: "move", accent: "coral" },
    { id: "energy-sleep", title: "Wind down on time", subtitle: "Give rest a little space", icon: "windDown", accent: "sand" },
  ] },
];

type OnboardingProps = { onComplete: (habits: Habit[]) => void };
export function OnboardingScreen({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>(["balanced"]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;
  const rise = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(0)).current;
  const artScale = useRef(new Animated.Value(1)).current;
  const stepRef = useRef(step);
  const swipeResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 32 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.25,
    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dx) < 55 || Math.abs(gesture.dx) < Math.abs(gesture.dy) * 1.25) return;
      if (gesture.dx < 0 && stepRef.current < 2 && !(stepRef.current === 1 && selected.length === 0)) {
        void Haptics.selectionAsync().catch(() => undefined);
        setStep((current) => Math.min(2, current + 1));
      } else if (gesture.dx > 0 && stepRef.current > 0) {
        void Haptics.selectionAsync().catch(() => undefined);
        setStep((current) => Math.max(0, current - 1));
      }
    },
  })).current;
  stepRef.current = step;

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => { if (active) setReduceMotion(value); }).catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => { active = false; subscription.remove(); };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      fade.setValue(1);
      rise.setValue(0);
      slide.setValue(0);
      artScale.setValue(1);
      progress.setValue(step / 2);
      return;
    }
    fade.setValue(0);
    rise.setValue(12);
    slide.setValue(18);
    artScale.setValue(0.96);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.spring(rise, { toValue: 0, speed: 18, bounciness: 3, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, speed: 16, bounciness: 2, useNativeDriver: true }),
      Animated.spring(artScale, { toValue: 1, speed: 15, bounciness: 4, useNativeDriver: true }),
      Animated.spring(progress, { toValue: step / 2, speed: 18, bounciness: 0, useNativeDriver: false }),
    ]).start();
  }, [step, reduceMotion, fade, rise, slide, artScale, progress]);

  const togglePreset = (id: string) => {
    void Haptics.selectionAsync().catch(() => undefined);
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };
  const finish = () => {
    const chosen = PRESETS.filter((preset) => selected.includes(preset.id));
    const deduped = new Map<string, Habit>();
    chosen.forEach((preset) => preset.habits.forEach((habit) => {
      deduped.set(habit.title.trim().toLowerCase(), { ...habit, completed: false });
    }));
    const result = Array.from(deduped.values());
    if (result.length === 0) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    onComplete(result);
  };
  const next = () => {
    void Haptics.selectionAsync().catch(() => undefined);
    setStep((current) => Math.min(2, current + 1));
  };
  const back = () => setStep((current) => Math.max(0, current - 1));

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={styles.topWash} />
      <View style={styles.header}>
        <View style={styles.brandRow}><View style={styles.brandMark}><Check size={19} color={colors.citrus} strokeWidth={3} /></View><Text style={styles.brandName}>HABIT TRACKER</Text></View>
        <Text style={styles.stepLabel}>{step === 0 ? "A SMALL BEGINNING" : step === 1 ? "MAKE IT YOURS" : "READY WHEN YOU ARE"}</Text>
        <View style={styles.progressTrack}><Animated.View style={[styles.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["12%", "100%"] }) }]} /></View>
      </View>

      <Animated.View {...swipeResponder.panHandlers} style={[styles.main, { opacity: fade, transform: [{ translateY: rise }, { translateX: slide }] }]}>
        {step === 0 ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Animated.View style={[styles.introArt, { transform: [{ scale: artScale }] }]}>
              <View style={styles.artSun} />
              <View style={styles.artLeafOne} /><View style={styles.artLeafTwo} />
              <View style={styles.artNote}><Text style={styles.artNoteTop}>YOUR NEXT CHAPTER</Text><Text style={styles.artNoteTitle}>Small steps.{ "\n" }Real change.</Text><View style={styles.artLine} /><Text style={styles.artNoteFoot}>ONE DAY AT A TIME</Text></View>
              <View style={styles.artStamp}><Check size={18} color={colors.ink} strokeWidth={2.8} /></View>
            </Animated.View>
            <Text style={styles.kicker}>A ROUTINE THAT FITS YOU</Text>
            <Text accessibilityRole="header" style={styles.title}>Become who you want to be, one little habit at a time.</Text>
            <Text style={styles.body}>No streak pressure. No perfect days required. Just a few small things that matter to you.</Text>
            <View style={styles.promiseRow}><View style={styles.promiseDot}><Check size={13} color={colors.brand} strokeWidth={2.8} /></View><Text style={styles.promiseText}>Start with a ready-made routine, then make it yours.</Text></View>
          </ScrollView>
        ) : step === 1 ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.kicker}>CHOOSE YOUR STARTING POINT</Text>
            <Text accessibilityRole="header" style={styles.title}>What would you like more of?</Text>
            <Text style={styles.body}>Pick one or mix a few. Every routine is editable later.</Text>
            <View style={styles.presetList}>
              {PRESETS.map((preset, index) => {
                const Icon = preset.icon;
                const active = selected.includes(preset.id);
                return (
                  <Pressable key={preset.id} accessibilityRole="checkbox" accessibilityState={{ checked: active }} onPress={() => togglePreset(preset.id)} style={({ pressed }) => [styles.preset, active && styles.presetActive, pressed && styles.presetPressed]}>
                    <View style={[styles.presetIcon, { backgroundColor: color(preset.accent, 0.22) }]}><Icon size={22} color={colors.ink} strokeWidth={1.8} /></View>
                    <View style={styles.presetCopy}><View style={styles.presetTitleRow}><Text style={styles.presetTitle}>{preset.title}</Text><Text style={styles.presetCount}>{preset.time}</Text></View><Text style={styles.presetDescription}>{preset.description}</Text><View style={styles.previewRow}>{preset.habits.slice(0, 3).map((habit) => <View key={habit.id} style={styles.previewChip}><Text style={styles.previewText}>{habit.title}</Text></View>)}</View></View>
                    <View style={[styles.selector, active && styles.selectorActive]}>{active ? <Check size={14} color={colors.paper} strokeWidth={2.7} /> : null}</View>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.selectionHint}>{selected.length === 0 ? "Choose at least one routine to continue." : selected.length + (selected.length === 1 ? " routine selected" : " routines selected") + " · You can change these anytime."}</Text>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Animated.View style={[styles.finishArt, { transform: [{ scale: artScale }] }]}>
              <View style={styles.finishHalo} />
              <View style={styles.finishCard}><Text style={styles.finishEyebrow}>YOUR FIRST DAY</Text><Text style={styles.finishBig}>{new Set(PRESETS.filter((preset) => selected.includes(preset.id)).flatMap((preset) => preset.habits.map((habit) => habit.title.trim().toLowerCase()))).size}</Text><Text style={styles.finishCaption}>little habits to begin with</Text><View style={styles.finishDivider} />{PRESETS.filter((preset) => selected.includes(preset.id)).map((preset) => <View key={preset.id} style={styles.finishPreset}><View style={[styles.finishDot, { backgroundColor: colors[preset.accent] }]} /><Text style={styles.finishPresetName}>{preset.title}</Text><Text style={styles.finishPresetCount}>{preset.habits.length}</Text></View>)}</View>
            </Animated.View>
            <Text style={styles.kicker}>NOT A NEW YOU. JUST A NEXT STEP.</Text>
            <Text accessibilityRole="header" style={styles.title}>Your routine, your pace.</Text>
            <Text style={styles.body}>Your habits will be waiting on your Today screen. You can change, remove, or add to them whenever life changes.</Text>
            <View style={styles.promiseRow}><View style={styles.promiseDot}><Check size={13} color={colors.brand} strokeWidth={2.8} /></View><Text style={styles.promiseText}>Consistency is built gently, not all at once.</Text></View>
          </ScrollView>
        )}
      </Animated.View>

      <View style={styles.footer}>
        {step > 0 ? <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={back} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><ArrowLeft size={19} color={colors.ink} /><Text style={styles.backText}>Back</Text></Pressable> : <View style={styles.backPlaceholder} />}
        <Pressable accessibilityRole="button" disabled={step === 1 && selected.length === 0} onPress={step === 2 ? finish : next} style={({ pressed }) => [styles.primaryButton, step === 1 && selected.length === 0 && styles.disabledButton, pressed && styles.pressed]}>
          <Text style={styles.primaryText}>{step === 0 ? "Build my routine" : step === 1 ? "Continue" : "Let's begin"}</Text><ArrowRight size={18} color={colors.paper} strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas, paddingTop: 12 },
  topWash: { position: "absolute", top: -100, right: -95, width: 290, height: 290, borderRadius: 145, backgroundColor: color("mint", 0.12) },
  header: { paddingHorizontal: 24, paddingTop: 9, paddingBottom: 18, gap: 17 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" },
  brandName: { color: colors.ink, fontSize: 12, fontWeight: "900", letterSpacing: 1.6 },
  stepLabel: { color: colors.brand, fontSize: 9, fontWeight: "800", letterSpacing: 1.7 },
  progressTrack: { height: 3, borderRadius: 3, backgroundColor: color("ink", 0.08), overflow: "hidden" },
  progressFill: { height: 3, borderRadius: 3, backgroundColor: colors.brand },
  main: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 18 },
  introArt: { height: 222, marginBottom: 27, alignItems: "center", justifyContent: "center" },
  artSun: { position: "absolute", width: 184, height: 184, borderRadius: 92, backgroundColor: color("citrus", 0.48), top: 16, left: 20 },
  artLeafOne: { position: "absolute", width: 55, height: 95, borderTopLeftRadius: 50, borderBottomRightRadius: 50, backgroundColor: color("mint", 0.75), top: 0, right: 42, transform: [{ rotate: "22deg" }] },
  artLeafTwo: { position: "absolute", width: 34, height: 65, borderTopLeftRadius: 40, borderBottomRightRadius: 40, backgroundColor: color("brand", 0.28), top: 42, right: 15, transform: [{ rotate: "43deg" }] },
  artNote: { width: "82%", minHeight: 171, padding: 19, borderRadius: 18, backgroundColor: colors.ink, transform: [{ rotate: "-3deg" }], justifyContent: "center", shadowColor: colors.ink, shadowOpacity: 0.13, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  artNoteTop: { color: colors.citrus, fontSize: 8, fontWeight: "800", letterSpacing: 1.7, marginBottom: 11 },
  artNoteTitle: { color: colors.paper, fontSize: 29, fontWeight: "800", letterSpacing: -1.1, lineHeight: 31 },
  artLine: { height: 1, backgroundColor: color("paper", 0.22), marginTop: 13, marginBottom: 8 },
  artNoteFoot: { color: color("paper", 0.65), fontSize: 8, fontWeight: "700", letterSpacing: 1.2 },
  artStamp: { position: "absolute", bottom: 14, right: 28, width: 43, height: 43, borderRadius: 14, backgroundColor: colors.citrus, alignItems: "center", justifyContent: "center", transform: [{ rotate: "8deg" }] },
  kicker: { color: colors.brand, fontSize: 9, fontWeight: "800", letterSpacing: 1.4, marginBottom: 10 },
  title: { color: colors.ink, fontSize: 31, fontWeight: "800", letterSpacing: -1.15, lineHeight: 36, marginBottom: 12 },
  body: { color: colors.secondary, fontSize: 14, lineHeight: 22, marginBottom: 18 },
  promiseRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2 },
  promiseDot: { width: 24, height: 24, borderRadius: 8, backgroundColor: color("mint", 0.27), alignItems: "center", justifyContent: "center" },
  promiseText: { flex: 1, color: colors.ink, fontSize: 11, lineHeight: 17, fontWeight: "600" },
  presetList: { gap: 11, marginTop: 21 },
  preset: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 13, borderRadius: 19, backgroundColor: color("paper", 0.82), borderWidth: 1, borderColor: surfaces.border },
  presetActive: { borderColor: colors.brand, backgroundColor: colors.paper, shadowColor: colors.brand, shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  presetPressed: { transform: [{ scale: 0.985 }], opacity: 0.9 },
  presetIcon: { width: 43, height: 43, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  presetCopy: { flex: 1, gap: 5 },
  presetTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5 },
  presetTitle: { color: colors.ink, fontSize: 14, fontWeight: "700", letterSpacing: -0.25, flexShrink: 1 },
  presetCount: { color: colors.secondary, fontSize: 9, fontWeight: "700" },
  presetDescription: { color: colors.secondary, fontSize: 11, lineHeight: 16 },
  previewRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 3 },
  previewChip: { backgroundColor: color("ink", 0.045), borderRadius: 7, paddingHorizontal: 7, paddingVertical: 4 },
  previewText: { color: colors.secondary, fontSize: 9, fontWeight: "600" },
  selector: { width: 23, height: 23, borderRadius: 8, borderWidth: 1.4, borderColor: color("ink", 0.19), alignItems: "center", justifyContent: "center", marginTop: 2 },
  selectorActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  selectionHint: { color: colors.secondary, fontSize: 10, marginTop: 15, textAlign: "center" },
  finishArt: { height: 285, alignItems: "center", justifyContent: "center", marginBottom: 17 },
  finishHalo: { position: "absolute", width: 245, height: 245, borderRadius: 123, backgroundColor: color("mint", 0.24) },
  finishCard: { width: "90%", borderRadius: 23, backgroundColor: colors.paper, padding: 20, borderWidth: 1, borderColor: surfaces.border, shadowColor: colors.ink, shadowOpacity: 0.07, shadowRadius: 16, shadowOffset: { width: 0, height: 7 }, elevation: 2 },
  finishEyebrow: { color: colors.brand, fontSize: 8, fontWeight: "800", letterSpacing: 1.4 },
  finishBig: { color: colors.ink, fontSize: 51, lineHeight: 58, fontWeight: "800", letterSpacing: -2 },
  finishCaption: { color: colors.secondary, fontSize: 11, marginTop: -2 },
  finishDivider: { height: 1, backgroundColor: surfaces.border, marginVertical: 14 },
  finishPreset: { flexDirection: "row", alignItems: "center", gap: 9, paddingVertical: 5 },
  finishDot: { width: 9, height: 9, borderRadius: 3 },
  finishPresetName: { color: colors.ink, fontSize: 11, fontWeight: "600", flex: 1 },
  finishPresetCount: { color: colors.secondary, fontSize: 10, fontWeight: "700" },
  footer: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 16, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: color("canvas", 0.96), borderTopWidth: 1, borderTopColor: surfaces.mutedBorder },
  backPlaceholder: { width: 74 },
  backButton: { height: 52, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", gap: 6 },
  backText: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  primaryButton: { flex: 1, minHeight: 52, borderRadius: 16, paddingHorizontal: 19, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.ink },
  primaryText: { color: colors.paper, fontSize: 13, fontWeight: "700" },
  disabledButton: { opacity: 0.35 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
});
