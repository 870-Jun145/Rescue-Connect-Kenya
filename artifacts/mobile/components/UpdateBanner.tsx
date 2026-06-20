import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppUpdate } from "@/hooks/useAppUpdate";
import { useColors } from "@/hooks/useColors";

export function UpdateBanner() {
  const { isUpdateReady, applyUpdate } = useAppUpdate();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    if (isUpdateReady) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    }
  }, [isUpdateReady, slideAnim]);

  if (!isUpdateReady) return null;

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 4,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.left}>
          <Feather name="download-cloud" size={18} color="#fff" />
          <View>
            <Text style={styles.title}>Update Available</Text>
            <Text style={styles.sub}>
              A new version is ready · v{appVersion} installed
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.btn} onPress={applyUpdate}>
          <Text style={styles.btnText}>Restart & Update</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#006600",
    zIndex: 9999,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  title: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  sub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
  },
  btn: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#006600",
  },
});
