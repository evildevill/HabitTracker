import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { geometry, surfaces } from "../../design/tokens";

type GlassCardProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function GlassCard({ children, style }: GlassCardProps) {
  const styles = createStyles();
  return (
    <View style={[styles.card, style]}>
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
}); }
