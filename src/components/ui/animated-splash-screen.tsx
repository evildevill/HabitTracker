import { AppText as Text } from "./";
import { AppText as Text as NativeText } from "./";
import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { CalendarCheck2, CheckCircle2, Flame } from "lucide-react-native";

// Keep the normalized RGB values aligned with the root DESIGN.md.
// React Native renders colors as 8-bit channels, so conversion happens only at runtime;
// no separately rounded hex palette is introduced.
const unitRGB = (red: number, green: number, blue: number, opacity = 1): string =>
  `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)}, ${opacity})`;

const RGB = {
  canvas: [0.955, 0.968, 0.958],
  paper: [0.985, 0.989, 0.982],
  ink: [0.055, 0.105, 0.09],
  secondary: [0.31, 0.38, 0.35],
  brand: [0.055, 0.49, 0.40],
  brandDark: [0.035, 0.23, 0.19],
  mint: [0.39, 0.78, 0.67],
  citrus: [0.86, 0.93, 0.28],
  coral: [0.94, 0.43, 0.31],
  sky: [0.34, 0.62, 0.78],
  sand: [0.91, 0.82, 0.61],
} as const;

type ColorToken = keyof typeof RGB;

const color = (token: ColorToken, opacity = 1): string => {
  const [red, green, blue] = RGB[token];
  return unitRGB(red, green, blue, opacity);
};

const palette = Object.fromEntries(
  (Object.keys(RGB) as ColorToken[]).map((token) => [token, color(token)])
) as Record<ColorToken, string>;

const SIGNAL_LABELS = ["SHOW UP", "STAY STEADY", "KEEP GOING"] as const;
type SignalIndex = 0 | 1 | 2;

const roundedFont = Platform.select({
  ios: "System",
  android: "sans-serif",
  default: "System",
});

const monoFont = Platform.select({
  ios: "System",
  android: "sans-serif",
  default: "monospace",
});

export function AnimatedSplashScreen(): JSX.Element {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [signalIndex, setSignalIndex] = useState<SignalIndex>(0);
  const reveal = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkOffset = useRef(new Animated.Value(14)).current;
  const signalValues = useRef<Animated.Value[]>(
    Array.from({ length: 7 }, () => new Animated.Value(0))
  ).current;
  const signalLoops = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(Boolean(enabled));
      })
      .catch(() => { if (mounted) setReduceMotion(false); });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => setReduceMotion(Boolean(enabled))
    );
    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    signalLoops.current.forEach((animation) => animation?.stop());
    signalLoops.current = [];

    if (reduceMotion) {
      reveal.setValue(1);
      wordmarkOpacity.setValue(1);
      wordmarkOffset.setValue(0);
      signalValues.forEach((value) => value.setValue(1));
      setSignalIndex(0);
      return undefined;
    }

    Animated.spring(reveal, {
      toValue: 1,
      speed: 10,
      bounciness: 5,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(wordmarkOpacity, {
        toValue: 1,
        duration: 650,
        delay: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(wordmarkOffset, {
        toValue: 0,
        duration: 650,
        delay: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    signalValues.forEach((value, index) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 550,
            delay: index * 70,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 550,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      signalLoops.current[index] = loop;
      loop.start();
    });

    const labelTimer = setInterval(
      () => setSignalIndex((current) => ((current + 1) % SIGNAL_LABELS.length) as SignalIndex),
      390
    );

    return () => {
      clearInterval(labelTimer);
      signalLoops.current.forEach((animation) => animation?.stop());
    };
  }, [
    reduceMotion,
    reveal,
    signalValues,
    wordmarkOffset,
    wordmarkOpacity,
  ]);

  const revealScale = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [0.72, 1],
  });
  const revealRotation = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: ["-8deg", "0deg"],
  });
  const cardOpacity = reveal.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 0.8, 1],
  });
  const leftCardX = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });
  const rightCardX = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });
  const cardRotation = (from: string, to: string) =>
    reveal.interpolate({ inputRange: [0, 1], outputRange: [from, to] });

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Habit Tracker is opening"
      style={styles.container}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.canvas }]} />
      </View>

      <View style={styles.content}>
        <View accessible={false} style={styles.composition}>
          <Animated.View
            style={[
              styles.paperCard,
              styles.leftCard,
              {
                opacity: cardOpacity,
                transform: [
                  { translateX: leftCardX },
                  { rotate: cardRotation("-2deg", "-10deg") },
                ],
              },
            ]}
          >
            <View style={styles.cardGlyph}>
              <Flame size={20} color={color("ink", 0.2)} strokeWidth={2.5} />
            </View>
            <View style={styles.cardLines}>
              <View style={[styles.line, { width: 58, backgroundColor: color("ink", 0.1) }]} />
              <View style={[styles.line, { width: 83, backgroundColor: color("ink", 0.07) }]} />
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.paperCard,
              styles.rightCard,
              {
                opacity: cardOpacity,
                transform: [
                  { translateX: rightCardX },
                  { rotate: cardRotation("2deg", "9deg") },
                ],
              },
            ]}
          >
            <View style={styles.cardGlyph}>
              <CalendarCheck2 size={20} color={unitRGB(0.055, 0.105, 0.09, 0.2)} strokeWidth={2.2} />
            </View>
            <View style={styles.cardLines}>
              <View style={[styles.line, { width: 58, backgroundColor: unitRGB(0.055, 0.105, 0.09, 0.1) }]} />
              <View style={[styles.line, { width: 83, backgroundColor: unitRGB(0.055, 0.105, 0.09, 0.07) }]} />
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.brandMark,
              {
                opacity: cardOpacity,
                transform: [{ scale: revealScale }, { rotate: revealRotation }],
              },
            ]}
          >
            <CheckCircle2 size={42} color={palette.citrus} strokeWidth={3} />
            <View style={styles.brandUnderline} />
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.wordmarkBlock,
            {
              opacity: wordmarkOpacity,
              transform: [{ translateY: wordmarkOffset }],
            },
          ]}
        >
          <Text style={styles.wordmark}>HABIT TRACKER</Text>
          <Text style={styles.tagline}>SMALL STEPS. REAL CHANGE.</Text>
        </Animated.View>

        <View style={styles.signalBlock}>
          <View style={styles.signalBars}>
            {signalValues.map((value, index) => {
              const targetScale = (4 + (index % 3) * 4) / 12;
              const scaleY = value.interpolate({
                inputRange: [0, 1],
                outputRange: [4 / 12, targetScale],
              });
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.signalBar,
                    {
                      width: index === 3 ? 20 : 5,
                      backgroundColor: index === 3 ? palette.citrus : palette.brand,
                      transform: [{ scaleY }],
                    },
                  ]}
                />
              );
            })}
          </View>
          <Text style={styles.signalLabel}>
            {reduceMotion ? "BUILDING CONSISTENCY" : SIGNAL_LABELS[signalIndex]}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.canvas,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 34,
    paddingHorizontal: 24,
  },
  composition: {
    width: 210,
    height: 210,
    alignItems: "center",
    justifyContent: "center",
  },
  paperCard: {
    position: "absolute",
    width: 148,
    height: 172,
    borderRadius: 30,
    overflow: "hidden",
  },
  leftCard: {
    backgroundColor: color("coral", 0.13),
  },
  rightCard: {
    backgroundColor: color("sky", 0.16),
  },
  cardGlyph: {
    position: "absolute",
    top: 18,
    right: 18,
  },
  cardLines: {
    position: "absolute",
    left: 18,
    bottom: 18,
    gap: 7,
  },
  line: {
    height: 5,
    borderRadius: 999,
  },
  brandMark: {
    width: 96,
    height: 96,
    borderRadius: 23,
    backgroundColor: palette.ink,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  brandUnderline: {
    width: 28,
    height: 3,
    borderRadius: 999,
    backgroundColor: palette.citrus,
    opacity: 0.8,
  },
  wordmarkBlock: {
    alignItems: "center",
    gap: 10,
  },
  wordmark: {
    color: palette.ink,
    fontFamily: roundedFont,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 2.8,
    textAlign: "center",
  },
  tagline: {
    color: palette.brand,
    fontFamily: monoFont,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.1,
    textAlign: "center",
  },
  signalBlock: {
    alignItems: "center",
    gap: 10,
    minHeight: 32,
  },
  signalBars: {
    height: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  signalBar: {
    height: 12,
    borderRadius: 999,
  },
  signalLabel: {
    color: palette.secondary,
    fontFamily: monoFont,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textAlign: "center",
  },
});
