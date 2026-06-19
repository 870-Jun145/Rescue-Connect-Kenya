import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  Alert,
  Animated,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function SOSButton() {
  const scale = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = async () => {
    pulse();
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    const url = "tel:999";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert(
        "🚨 EMERGENCY",
        "Call 999 or 112 immediately.\n\nThese lines work on all networks, including when you have no airtime.",
        [{ text: "OK", style: "destructive" }]
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.sosWrap, { transform: [{ scale }] }]}>
        <TouchableOpacity style={styles.sos} onPress={handlePress} activeOpacity={0.85}>
          <Feather name="alert-circle" size={32} color="#fff" />
          <Text style={styles.sosText}>SOS</Text>
          <Text style={styles.sosSubtext}>Tap to call 999</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.hint}>Works even with no airtime · 112 also available</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", paddingVertical: 8 },
  sosWrap: {
    shadowColor: "#C8102E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  sos: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#C8102E",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderWidth: 5,
    borderColor: "#FF4444",
  },
  sosText: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: 4,
  },
  sosSubtext: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  hint: {
    marginTop: 12,
    fontSize: 12,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
