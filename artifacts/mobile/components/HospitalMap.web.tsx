import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export function HospitalMap() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top + 20 },
      ]}
    >
      <Feather name="map" size={64} color={colors.primary} />
      <Text style={[styles.title, { color: colors.foreground }]}>Hospital Map</Text>
      <Text style={[styles.sub, { color: colors.mutedForeground }]}>
        The interactive map with 80+ hospital pins is available in the{" "}
        <Text style={{ fontFamily: "Inter_600SemiBold" }}>Android APK</Text>.{"\n"}
        Tap below to view Kenya on Google Maps.
      </Text>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.primary }]}
        onPress={() =>
          Linking.openURL("https://www.google.com/maps/@0.0236,37.9062,7z")
        }
      >
        <Feather name="external-link" size={16} color="#fff" />
        <Text style={styles.btnText}>Open Google Maps — Kenya</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 18 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  btnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
