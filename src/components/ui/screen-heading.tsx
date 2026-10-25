import { StyleSheet, Text, View } from "react-native";
import { colors, monoFont, roundedFont, typography } from "../../design/tokens";

type ScreenHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  count?: string;
};

export function ScreenHeading({ eyebrow, title, subtitle, count }: ScreenHeadingProps) {
  return (
    <View style={styles.container}>
      <View style={styles.eyebrowRow}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        {count ? (
          <View style={styles.countPill}>
            <Text style={styles.count}>{count}</Text>
          </View>
        ) : null}
      </View>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  eyebrowRow: {
    minHeight: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: colors.brand,
    fontSize: typography.eyebrow,
    fontWeight: "600",
    letterSpacing: 0.6,
    fontFamily: monoFont,
  },
  countPill: {
    backgroundColor: colors.paper,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  count: {
    color: colors.secondary,
    fontSize: typography.count,
    fontWeight: "700",
    fontFamily: monoFont,
  },
  title: {
    color: colors.ink,
    fontSize: typography.screenTitle,
    fontWeight: "700",
    letterSpacing: -0.8,
    lineHeight: 40,
    fontFamily: roundedFont,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    fontFamily: roundedFont,
  },
});
