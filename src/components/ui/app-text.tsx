import type { ComponentProps } from "react";
import { Text as NativeText } from "react-native";

type AppTextProps = ComponentProps<typeof NativeText>;

export function AppText({ style, ...props }: AppTextProps) {
  return (
    <NativeText
      {...props}
      style={[style, { fontFamily: "SuperWaffles" }]}
    />
  );
}
