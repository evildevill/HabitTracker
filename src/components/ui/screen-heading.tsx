import { StyleSheet, Text, View } from "react-native";
import { color, colors, typography } from "../../design/tokens";

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
        <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>
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
    fontWeight: "900",
    letterSpacing: 2,
    fontFamily: "monospace",
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
    fontFamily: "monospace",
  },
  title: {
    color: colors.ink,
    fontSize: typography.screenTitle,
    fontWeight: "900",
    letterSpacing: -1.3,
    lineHeight: 42,
    fontFamily: "sans-serif-rounded",
  },
  subtitle: {
    color: colors.secondary,
    fontSize: typography.screenSubtitle,
    fontWeight: "500",
    lineHeight: 23,
    fontFamily: "sans-serif-rounded",
  },
});
