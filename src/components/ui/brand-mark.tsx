import { StyleSheet, View } from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import { color, colors, geometry } from "../../design/tokens";

type BrandMarkProps = {
  size?: number;
};

export function BrandMark({ size = geometry.brandMark }: BrandMarkProps) {
  const styles = createStyles();
  return (
    <View
      accessibilityLabel="Habit Tracker"
      style={[
        styles.mark,
        {
          width: size,
          height: size,
          borderRadius: size * 0.23,
        },
      ]}
    >
      <CheckCircle2
        size={size * 0.42}
        color={colors.citrus}
        strokeWidth={3}
      />
      <View
        style={{
          width: size * (28 / 42),
          height: size * (3 / 42),
          borderRadius: 999,
          backgroundColor: color("citrus", 0.8),
          marginTop: size * 0.04,
        }}
      />
    </View>
  );
}

function createStyles() { return StyleSheet.create({
  mark: {
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
}); }
