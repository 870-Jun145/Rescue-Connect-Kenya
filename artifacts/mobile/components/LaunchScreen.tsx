import { Image } from "expo-image";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface LaunchScreenProps {
  onFinish: () => void;
  isReady: boolean;
}

export function LaunchScreen({ onFinish, isReady }: LaunchScreenProps) {
  const fadeOut = useRef(new Animated.Value(1)).current;
  const titleSlide = useRef(new Animated.Value(40)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const taglineSlide = useRef(new Animated.Value(30)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const sirenRed = useRef(new Animated.Value(0)).current;
  const sirenBlue = useRef(new Animated.Value(0)).current;

  // Siren flash loop
  useEffect(() => {
    const sirenLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sirenRed, { toValue: 0.35, duration: 200, useNativeDriver: true }),
        Animated.timing(sirenRed, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(sirenBlue, { toValue: 0.35, duration: 200, useNativeDriver: true }),
        Animated.timing(sirenBlue, { toValue: 0, duration: 200, useNativeDriver: true }),
      ])
    );
    sirenLoop.start();
    return () => sirenLoop.stop();
  }, []);

  // Entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleSlide, { toValue: 0, duration: 600, delay: 300, useNativeDriver: true }),
      Animated.timing(titleFade, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
      Animated.timing(taglineSlide, { toValue: 0, duration: 600, delay: 600, useNativeDriver: true }),
      Animated.timing(taglineFade, { toValue: 1, duration: 600, delay: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  // Fade out when app is ready
  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 800);
    return () => clearTimeout(timer);
  }, [isReady]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      {/* Background image */}
      <Image
        source={require("@/assets/images/splash-ambulance.png")}
        style={styles.bg}
        contentFit="cover"
        transition={0}
      />

      {/* Dark gradient overlay for readability */}
      <View style={styles.darkOverlay} />

      {/* Red siren flash */}
      <Animated.View style={[styles.sirenOverlay, { backgroundColor: "#C8102E", opacity: sirenRed }]} />

      {/* Blue siren flash */}
      <Animated.View style={[styles.sirenOverlay, { backgroundColor: "#003DA5", opacity: sirenBlue }]} />

      {/* Top section — branding */}
      <View style={styles.topContent}>
        {/* Kenya flag strip */}
        <View style={styles.flagStrip}>
          <View style={[styles.flagBand, { backgroundColor: "#006600" }]} />
          <View style={[styles.flagBand, { backgroundColor: "#fff" }]} />
          <View style={[styles.flagBand, { backgroundColor: "#C8102E" }]} />
          <View style={[styles.flagBand, { backgroundColor: "#fff" }]} />
          <View style={[styles.flagBand, { backgroundColor: "#006600" }]} />
        </View>

        {/* Title */}
        <Animated.View
          style={{
            opacity: titleFade,
            transform: [{ translateY: titleSlide }],
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <Text style={styles.emoji}>🚨</Text>
          <Text style={styles.title}>Rescue Connect</Text>
          <Text style={styles.titleKenya}>Kenya</Text>
        </Animated.View>
      </View>

      {/* Bottom — tagline */}
      <Animated.View
        style={[
          styles.bottomContent,
          { opacity: taglineFade, transform: [{ translateY: taglineSlide }] },
        ]}
      >
        <View style={styles.taglineContainer}>
          <View style={styles.taglineLine} />
          <Text style={styles.tagline}>Your trusted 24/7 emergency handler</Text>
          <View style={styles.taglineLine} />
        </View>
        <View style={styles.poweredRow}>
          <Text style={styles.poweredText}>🇰🇪 Serving all 47 counties</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "space-between",
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  sirenOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topContent: {
    alignItems: "center",
    paddingTop: Platform.OS === "web" ? 80 : 120,
    width: "100%",
  },
  flagStrip: {
    flexDirection: "row",
    width: 160,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  flagBand: {
    flex: 1,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  title: {
    fontSize: 38,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleKenya: {
    fontSize: 48,
    fontFamily: "Inter_700Bold",
    color: "#C8102E",
    textAlign: "center",
    letterSpacing: 4,
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    marginTop: -8,
  },
  bottomContent: {
    alignItems: "center",
    paddingBottom: Platform.OS === "web" ? 60 : 90,
    width: "100%",
    gap: 14,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
  },
  taglineLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.92)",
    textAlign: "center",
    letterSpacing: 0.4,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  poweredRow: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  poweredText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
  },
});
