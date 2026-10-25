import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedSplashScreen } from "./src/components/ui/animated-splash-screen";

const SPLASH_DURATION_MS = 1750;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timeout);
  }, []);

  if (showSplash) {
    return <AnimatedSplashScreen />;
  }

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>Hello World</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F7F5",
  },
  title: {
    color: "#0E1B17",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
});
