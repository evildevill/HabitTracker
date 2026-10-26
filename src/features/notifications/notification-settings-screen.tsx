import { AppText as Text } from "../../components/ui/app-text";
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { BellRing, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, ShieldCheck } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { color, colors, surfaces } from "../../design/tokens";
import { getNotificationPermission, requestNotificationPermission } from "./notification-permissions";

type Props = { onBack: () => void };

export function NotificationSettingsScreen({ onBack }: Props) {
  const styles = createStyles();
  const [granted, setGranted] = useState(false);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const permission = await getNotificationPermission();
      setGranted(permission.granted);
      setCanAskAgain(permission.canAskAgain);
    } catch {
      setGranted(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  const managePermission = async () => {
    if (!granted && canAskAgain) {
      try {
        const permission = await requestNotificationPermission();
        setGranted(permission.granted);
        setCanAskAgain(permission.canAskAgain);
        if (permission.granted) return;
      } catch {
        // Continue to system settings when the permission API cannot complete.
      }
    }
    await Linking.openSettings();
  };

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to settings" onPress={onBack} style={styles.back}>
          <ChevronLeft size={18} color={colors.ink} /><Text style={styles.backText}>Settings</Text>
        </Pressable>
        <ScreenHeading eyebrow="YOUR PREFERENCES" title="Notifications" subtitle="Choose how Habit Tracker can help you stay consistent." />

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}><BellRing size={26} color={colors.citrus} strokeWidth={1.8} /></View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Gentle reminders</Text>
            <Text style={styles.heroBody}>Notifications are optional. Your habits remain yours whether you turn them on or not.</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>PERMISSION STATUS</Text>
        <View style={styles.statusCard}>
          <View style={[styles.statusIcon, granted ? styles.statusIconOn : styles.statusIconOff]}>
            {granted ? <CheckCircle2 size={21} color={colors.brand} /> : <BellRing size={21} color={colors.secondary} />}
          </View>
          <View style={styles.statusCopy}>
            <Text style={styles.statusTitle}>{loading ? "Checking permission…" : granted ? "Notifications are allowed" : "Notifications are off"}</Text>
            <Text style={styles.statusBody}>{loading ? "Checking your phone's current settings." : granted ? "Your phone allows Habit Tracker to send notifications." : canAskAgain ? "Allow access if you'd like reminders on your device." : "Access was denied. Open system settings to change it."}</Text>
          </View>
          <View style={[styles.statusPill, granted && styles.statusPillOn]}><Text style={[styles.statusPillText, granted && styles.statusPillTextOn]}>{loading ? "CHECKING" : granted ? "ON" : "OFF"}</Text></View>
        </View>

        <Pressable accessibilityRole="button" onPress={() => void managePermission()} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <View style={styles.actionIcon}><ShieldCheck size={18} color={colors.paper} /></View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>{granted ? "Manage system settings" : "Enable notifications"}</Text>
            <Text style={styles.actionBody}>{granted ? "Change alerts, sounds, and lock-screen display." : "Choose whether this app can send notifications."}</Text>
          </View>
          <ExternalLink size={16} color={colors.secondary} />
        </Pressable>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your choice stays in your hands.</Text>
          <Text style={styles.infoBody}>Android and iOS control notification access. You can turn it off, change sounds, or adjust how notifications appear in your phone's system settings.</Text>
          <View style={styles.infoDivider} />
          <View style={styles.infoFoot}><ShieldCheck size={16} color={colors.brand} /><Text style={styles.infoFootText}>No account needed. No pressure to opt in.</Text></View>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppBackground>
  );
}

function createStyles() { return StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  back: { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start", paddingVertical: 8, paddingRight: 14, marginBottom: 13 },
  backText: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  heroCard: { flexDirection: "row", gap: 13, padding: 17, borderRadius: 22, backgroundColor: colors.strongSurface, marginTop: 23, marginBottom: 27 },
  heroIcon: { width: 47, height: 47, borderRadius: 16, backgroundColor: color("paper", 0.12), alignItems: "center", justifyContent: "center" },
  heroCopy: { flex: 1, gap: 5 },
  heroTitle: { color: colors.onStrong, fontSize: 14, fontWeight: "800" },
  heroBody: { color: color("paper", 0.72), fontSize: 11, lineHeight: 17 },
  sectionLabel: { color: colors.secondary, fontSize: 10, fontWeight: "800", letterSpacing: 0.8, marginBottom: 11 },
  statusCard: { flexDirection: "row", alignItems: "center", gap: 11, padding: 13, borderRadius: 21, backgroundColor: color("paper", 0.92), borderWidth: 1, borderColor: surfaces.border, marginBottom: 13 },
  statusIcon: { width: 43, height: 43, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  statusIconOn: { backgroundColor: color("mint", 0.22) },
  statusIconOff: { backgroundColor: color("sand", 0.27) },
  statusCopy: { flex: 1, gap: 4 },
  statusTitle: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  statusBody: { color: colors.secondary, fontSize: 10, lineHeight: 15 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: color("sand", 0.28) },
  statusPillOn: { backgroundColor: color("mint", 0.2) },
  statusPillText: { color: colors.secondary, fontSize: 9, fontWeight: "800", letterSpacing: 0.4 },
  statusPillTextOn: { color: colors.brandDark },
  action: { flexDirection: "row", alignItems: "center", gap: 11, padding: 14, borderRadius: 20, backgroundColor: colors.paper, borderWidth: 1, borderColor: surfaces.border },
  actionIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: colors.strongSurface, alignItems: "center", justifyContent: "center" },
  actionCopy: { flex: 1, gap: 4 },
  actionTitle: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  actionBody: { color: colors.secondary, fontSize: 10, lineHeight: 15 },
  infoCard: { padding: 16, borderRadius: 21, backgroundColor: color("mint", 0.12), borderWidth: 1, borderColor: color("brand", 0.1), marginTop: 20 },
  infoTitle: { color: colors.ink, fontSize: 13, fontWeight: "800", marginBottom: 7 },
  infoBody: { color: colors.secondary, fontSize: 11, lineHeight: 17 },
  infoDivider: { height: 1, backgroundColor: color("brand", 0.12), marginVertical: 13 },
  infoFoot: { flexDirection: "row", alignItems: "center", gap: 7 },
  infoFootText: { color: colors.brandDark, fontSize: 10, fontWeight: "700" },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  bottomSpacer: { height: 92 },
}); }
