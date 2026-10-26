import { AppText as Text } from "./";
import { StyleSheet, Text as NativeText, View } from "react-native";
import { color, colors, monoFont, roundedFont, typography } from "../../design/tokens";

type ScreenHeadingProps = { eyebrow: string; title: string; subtitle: string; count?: string };
export function ScreenHeading({ eyebrow, title, subtitle, count }: ScreenHeadingProps) {
  const styles = createStyles();
  return (
    <View style={styles.container}>
      <View style={styles.eyebrowRow}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        {count ? <View style={styles.countPill}><Text style={styles.count}>{count}</Text></View> : null}
      </View>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}
function createStyles() { return StyleSheet.create({
  container: { gap: 7 },
  eyebrowRow: { minHeight: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: colors.brand, fontSize: typography.eyebrow, fontWeight: "700", letterSpacing: 1.5, fontFamily: monoFont },
  countPill: { backgroundColor: color("brand", 0.09), borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  count: { color: colors.brand, fontSize: typography.count, fontWeight: "700", fontFamily: monoFont },
  title: { color: colors.ink, fontSize: typography.screenTitle, fontWeight: "800", letterSpacing: -1.7, lineHeight: 43, fontFamily: roundedFont },
  subtitle: { color: colors.secondary, fontSize: 14, fontWeight: "400", lineHeight: 21, fontFamily: roundedFont },
}); }
