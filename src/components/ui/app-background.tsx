import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../design/tokens";

type AppBackgroundProps = { children: ReactNode };
export function AppBackground({ children }: AppBackgroundProps) {
  const styles = createStyles();
  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.canvas }]} />
      {children}
    </View>
  );
}
function createStyles() { return StyleSheet.create({ root: { flex: 1, backgroundColor: colors.canvas } }); }
