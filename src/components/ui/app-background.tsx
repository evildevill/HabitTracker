import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../design/tokens";

type AppBackgroundProps = { children: ReactNode };
export function AppBackground({ children }: AppBackgroundProps) {
  return <View style={styles.root}>{children}</View>;
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
});
