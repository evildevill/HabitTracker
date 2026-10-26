import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ArrowLeft, Check, ChevronRight, Monitor, Moon, Sun } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { color, colors, surfaces } from "../../design/tokens";

export type AppearanceMode = "system" | "light" | "dark";
type Props = { mode: AppearanceMode; onSelect: (mode: AppearanceMode) => void; onBack: () => void };

const options: Array<{ id: AppearanceMode; title: string; subtitle: string; icon: typeof Sun }> = [
  { id: "system", title: "System", subtitle: "Match your device appearance", icon: Monitor },
  { id: "light", title: "Light", subtitle: "Bright, calm, and clear", icon: Sun },
  { id: "dark", title: "Dark", subtitle: "A softer view for low light", icon: Moon },
];

export function AppearanceScreen({ mode, onSelect, onBack }: Props) {
  const styles = createStyles();
  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to settings" onPress={onBack} style={styles.back}>
          <ArrowLeft size={18} color={colors.ink} /><Text style={styles.backText}>Settings</Text>
        </Pressable>
        <ScreenHeading eyebrow="MAKE IT YOURS" title="Appearance" subtitle="A little more comfortable, at any time of day." />
        <View style={styles.preview}>
          <View style={styles.previewHeader}>
            <View style={styles.previewMark}><View style={styles.previewDot} /></View>
            <View style={styles.previewHeaderCopy}><Text style={styles.previewEyebrow}>YOUR DAY, YOUR PACE</Text><Text style={styles.previewTitle}>Small steps.</Text></View>
            <View style={styles.previewSun}><Sun size={17} color={colors.citrus} /></View>
          </View>
          <View style={styles.previewProgress}><View style={styles.previewProgressFill} /></View>
          <View style={styles.previewFooter}><Text style={styles.previewFooterText}>TODAY'S RHYTHM</Text><Text style={styles.previewPercent}>2 of 4</Text></View>
        </View>
        <Text style={styles.sectionLabel}>CHOOSE YOUR LOOK</Text>
        <View style={styles.options}>
          {options.map((option) => {
            const Icon = option.icon;
            const selected = mode === option.id;
            return (
              <Pressable key={option.id} accessibilityRole="radio" accessibilityState={{ selected }} onPress={() => onSelect(option.id)} style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}>
                <View style={[styles.optionIcon, selected && styles.optionIconSelected]}><Icon size={20} color={selected ? colors.onStrong : colors.brand} strokeWidth={1.8} /></View>
                <View style={styles.optionCopy}><Text style={styles.optionTitle}>{option.title}</Text><Text style={styles.optionSubtitle}>{option.subtitle}</Text></View>
                <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <Check size={13} color={colors.onStrong} strokeWidth={3} /> : null}</View>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.note}>
          <View style={styles.noteIcon}><Moon size={17} color={colors.brand} /></View>
          <View style={styles.noteCopy}><Text style={styles.noteTitle}>A seamless change</Text><Text style={styles.noteBody}>Switching themes uses a soft expanding transition inspired by Noor Al-Qalb. Your choice is saved on this device.</Text></View>
          <ChevronRight size={15} color={color("secondary", 0.5)} />
        </View>
      </ScrollView>
    </AppBackground>
  );
}

function createStyles() { return StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 34 },
  back: { flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start", paddingVertical: 8, paddingRight: 14, marginBottom: 14 },
  backText: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  preview: { borderRadius: 25, backgroundColor: colors.strongSurface, padding: 19, marginTop: 25, marginBottom: 29, overflow: "hidden" },
  previewHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  previewMark: { width: 43, height: 43, borderRadius: 15, backgroundColor: color("paper", 0.12), alignItems: "center", justifyContent: "center" },
  previewDot: { width: 13, height: 13, borderRadius: 5, backgroundColor: colors.citrus, transform: [{ rotate: "45deg" }] },
  previewHeaderCopy: { flex: 1, gap: 4 },
  previewEyebrow: { color: color("paper", 0.62), fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  previewTitle: { color: colors.onStrong, fontSize: 23, fontWeight: "800", letterSpacing: -0.5 },
  previewSun: { width: 36, height: 36, borderRadius: 13, backgroundColor: color("paper", 0.12), alignItems: "center", justifyContent: "center" },
  previewProgress: { height: 6, borderRadius: 99, backgroundColor: color("paper", 0.17), overflow: "hidden", marginTop: 25 },
  previewProgressFill: { width: "50%", height: "100%", borderRadius: 99, backgroundColor: colors.citrus },
  previewFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  previewFooterText: { color: color("paper", 0.65), fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
  previewPercent: { color: colors.onStrong, fontSize: 10, fontWeight: "700" },
  sectionLabel: { color: colors.secondary, fontSize: 10, fontWeight: "800", letterSpacing: 0.9, marginBottom: 12 },
  options: { gap: 10 },
  option: { flexDirection: "row", alignItems: "center", gap: 12, padding: 13, borderRadius: 20, backgroundColor: color("paper", 0.9), borderWidth: 1, borderColor: surfaces.border, minHeight: 77 },
  optionSelected: { borderColor: color("brand", 0.65), backgroundColor: color("mint", 0.12) },
  optionIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: color("mint", 0.15), alignItems: "center", justifyContent: "center" },
  optionIconSelected: { backgroundColor: colors.strongSurface },
  optionCopy: { flex: 1, gap: 4 },
  optionTitle: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  optionSubtitle: { color: colors.secondary, fontSize: 10, lineHeight: 15 },
  radio: { width: 23, height: 23, borderRadius: 12, borderWidth: 1.5, borderColor: color("secondary", 0.35), alignItems: "center", justifyContent: "center" },
  radioSelected: { backgroundColor: colors.brand, borderColor: colors.brand },
  note: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 19, backgroundColor: color("mint", 0.1), borderWidth: 1, borderColor: color("brand", 0.1), marginTop: 20 },
  noteIcon: { width: 35, height: 35, borderRadius: 12, backgroundColor: color("mint", 0.2), alignItems: "center", justifyContent: "center" },
  noteCopy: { flex: 1, gap: 4 },
  noteTitle: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  noteBody: { color: colors.secondary, fontSize: 10, lineHeight: 15 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
}); }
