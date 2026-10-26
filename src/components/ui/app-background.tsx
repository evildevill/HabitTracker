import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { color, colors } from "../../design/tokens";

type AppBackgroundProps = { children: ReactNode };
export function AppBackground({ children }: AppBackgroundProps) {
  const styles = createStyles();
  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.canvas }]} />
      <LinearGradient
        pointerEvents="none"
        colors={[color("brand", 0.075), "rgba(0, 0, 0, 0)", color("paper", 0.5)]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}
function createStyles() { return StyleSheet.create({ root: { flex: 1, backgroundColor: colors.canvas } }); }
