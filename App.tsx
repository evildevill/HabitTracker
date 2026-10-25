import { useEffect, useState } from "react";
import { AnimatedSplashScreen } from "./src/components/ui/animated-splash-screen";
import { AppShell } from "./src/app/app-shell";

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

  return <AppShell />;
}
