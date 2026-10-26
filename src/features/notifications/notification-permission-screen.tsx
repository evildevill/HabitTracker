import { AppText as Text } from "../../components/ui";
import { AppText as Text as NativeText } from "../../components/ui";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import { BellRing, CalendarCheck2, Check, ChevronRight, Clock3, ShieldCheck, Sparkles } from "lucide-react-native";
import { color, colors, surfaces } from "../../design/tokens";
import { getNotificationPermission, requestNotificationPermission } from "./notification-permissions";

type Props = { onFinish: () => void };

export function NotificationPermissionScreen({ onFinish }: Props) {
  const styles = createStyles();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getNotificationPermission().catch(() => undefined);
  }, []);

  const enable = async () => {
    if (busy) return;
    setBusy(true);
    void Haptics.selectionAsync().catch(() => undefined);
    try {
      const permission = await requestNotificationPermission();
      if (permission.granted) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
        onFinish();
      } else if (!permission.canAskAgain) {
        Alert.alert(
          "Notifications are turned off",
          "You can enable them any time in your phone's Settings.",
          [
            { text: "Not now", style: "cancel", onPress: onFinish },
            { text: "Open Settings", onPress: () => { void Linking.openSettings(); } },
          ],
        );
      } else {
        onFinish();
      }
    } catch {
      Alert.alert("Couldn't check notifications", "You can change notification access later in Settings.", [
        { text: "Continue", onPress: onFinish },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.brandMark}><Check size={19} color={colors.citrus} strokeWidth={3} /></View>
          <Text style={styles.brandName}>HABIT TRACKER</Text>
          <View style={styles.stepPill}><Text style={styles.stepText}>ONE LAST THING</Text></View>
        </View>

        <View style={styles.hero}>
          <View style={styles.orbitOuter} />
          <View style={styles.orbitInner} />
          <View style={styles.bellBack}><BellRing size={42} color={colors.onStrong} strokeWidth={1.7} /></View>
          <View style={styles.sparkleOne}><Sparkles size={19} color={colors.ink} strokeWidth={2} /></View>
          <View style={styles.sparkleTwo}><Check size={15} color={colors.ink} strokeWidth={3} /></View>
          <View style={styles.heroCaption}><Text style={styles.heroCaptionText}>A GENTLE NUDGE, WHEN IT MATTERS</Text></View>
        </View>

        <Text style={styles.kicker}>MAKE SPACE FOR YOUR HABITS</Text>
        <Text accessibilityRole="header" style={styles.title}>A little reminder. A lot of momentum.</Text>
        <Text style={styles.body}>Let Habit Tracker send gentle reminders so the small promises you make to yourself are easier to keep.</Text>

        <View style={styles.benefits}>
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}><Clock3 size={18} color={colors.brand} strokeWidth={1.9} /></View>
            <View style={styles.benefitCopy}><Text style={styles.benefitTitle}>On your time</Text><Text style={styles.benefitText}>Choose a moment that fits your day.</Text></View>
            <ChevronRight size={16} color={color("secondary", 0.55)} />
          </View>
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}><CalendarCheck2 size={18} color={colors.brand} strokeWidth={1.9} /></View>
            <View style={styles.benefitCopy}><Text style={styles.benefitTitle}>Keep your rhythm</Text><Text style={styles.benefitText}>A quiet nudge, never a guilt trip.</Text></View>
            <ChevronRight size={16} color={color("secondary", 0.55)} />
          </View>
          <View style={[styles.benefitRow, styles.lastBenefit]}>
            <View style={styles.benefitIcon}><ShieldCheck size={18} color={colors.brand} strokeWidth={1.9} /></View>
            <View style={styles.benefitCopy}><Text style={styles.benefitTitle}>Always your choice</Text><Text style={styles.benefitText}>Change notification access any time.</Text></View>
            <ChevronRight size={16} color={color("secondary", 0.55)} />
          </View>
        </View>
        <View style={styles.privacyNote}><ShieldCheck size={15} color={colors.brand} /><Text style={styles.privacyText}>Nothing is sent until you choose to allow notifications. You can skip this and decide later.</Text></View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable accessibilityRole="button" onPress={() => { void Haptics.selectionAsync().catch(() => undefined); onFinish(); }} style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => void enable()} disabled={busy} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, busy && styles.busy]}>
          {busy ? <ActivityIndicator color={colors.paper} /> : <><Text style={styles.primaryText}>Allow notifications</Text><ChevronRight size={18} color={colors.paper} strokeWidth={2.3} /></>}
        </Pressable>
        <Text style={styles.footerHint}>You can change this later in Settings.</Text>
      </View>
    </View>
  );
}

function createStyles() { return StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 24, paddingTop: 17, paddingBottom: 14, flexGrow: 1 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.strongSurface, alignItems: "center", justifyContent: "center" },
  brandName: { color: colors.ink, fontSize: 11, fontWeight: "900", letterSpacing: 1.3, flex: 1 },
  stepPill: { paddingHorizontal: 9, paddingVertical: 7, borderRadius: 9, backgroundColor: color("mint", 0.22) },
  stepText: { color: colors.brandDark, fontSize: 8, fontWeight: "800", letterSpacing: 0.7 },
  hero: { height: 210, marginTop: 13, marginBottom: 18, alignItems: "center", justifyContent: "center" },
  orbitOuter: { position: "absolute", width: 182, height: 182, borderRadius: 91, backgroundColor: color("citrus", 0.48), borderWidth: 1, borderColor: color("ink", 0.04) },
  orbitInner: { position: "absolute", width: 144, height: 144, borderRadius: 72, backgroundColor: color("mint", 0.4), borderWidth: 1, borderColor: color("paper", 0.7) },
  bellBack: { width: 100, height: 100, borderRadius: 34, backgroundColor: colors.strongSurface, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-7deg" }] },
  sparkleOne: { position: "absolute", top: 37, right: "22%", width: 38, height: 38, borderRadius: 13, backgroundColor: colors.citrus, alignItems: "center", justifyContent: "center", transform: [{ rotate: "9deg" }] },
  sparkleTwo: { position: "absolute", bottom: 28, left: "22%", width: 31, height: 31, borderRadius: 11, backgroundColor: colors.paper, borderWidth: 1, borderColor: surfaces.border, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-9deg" }] },
  heroCaption: { position: "absolute", bottom: 0, backgroundColor: colors.paper, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: surfaces.border },
  heroCaptionText: { color: colors.secondary, fontSize: 8, fontWeight: "800", letterSpacing: 1.1 },
  kicker: { color: colors.brand, fontSize: 9, fontWeight: "800", letterSpacing: 1.3, marginBottom: 9 },
  title: { color: colors.ink, fontSize: 31, fontWeight: "800", letterSpacing: -1.1, lineHeight: 36, marginBottom: 10 },
  body: { color: colors.secondary, fontSize: 13, lineHeight: 21, marginBottom: 16 },
  benefits: { borderRadius: 21, backgroundColor: color("paper", 0.92), borderWidth: 1, borderColor: surfaces.border, overflow: "hidden" },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: 12, paddingVertical: 13, minHeight: 68, borderBottomWidth: 1, borderBottomColor: surfaces.mutedBorder },
  lastBenefit: { borderBottomWidth: 0 },
  benefitIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: color("mint", 0.18), alignItems: "center", justifyContent: "center" },
  benefitCopy: { flex: 1, gap: 3 },
  benefitTitle: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  benefitText: { color: colors.secondary, fontSize: 10, lineHeight: 15 },
  privacyNote: { flexDirection: "row", gap: 8, alignItems: "flex-start", marginTop: 14, paddingHorizontal: 2 },
  privacyText: { flex: 1, color: colors.secondary, fontSize: 10, lineHeight: 15 },
  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 14, gap: 9, borderTopWidth: 1, borderTopColor: color("ink", 0.06), backgroundColor: color("canvas", 0.97) },
  skipButton: { height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  skipText: { color: colors.secondary, fontSize: 13, fontWeight: "700" },
  primaryButton: { height: 54, borderRadius: 17, backgroundColor: colors.strongSurface, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  primaryText: { color: colors.onStrong, fontSize: 13, fontWeight: "700" },
  busy: { opacity: 0.75 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  footerHint: { color: color("secondary", 0.8), fontSize: 10, textAlign: "center" },
}); }
