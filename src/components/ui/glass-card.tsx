import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { colors, geometry, surfaces } from "../../design/tokens";

type GlassCardProps = {
  children: ReactNode;
  style?: ViewStyle;
  shadow?: boolean;
};

export function GlassCard({ children, style, shadow = true }: GlassCardProps) {
  const styles = createStyles();
  return (
    <View style={[styles.card, shadow ? styles.shadow : styles.noShadow, style]}>
      {children}
    </View>
  );
}

function createStyles() { return StyleSheet.create({
  card: {
    borderRadius: geometry.glassCardRadius,
    backgroundColor: surfaces.card,
    borderWidth: 1,
    borderColor: surfaces.border,
    overflow: "hidden",
  },
  shadow: {
    shadowColor: colors.ink,
    shadowOpacity: 0.055,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 2,
  },
  noShadow: {
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
}); }
