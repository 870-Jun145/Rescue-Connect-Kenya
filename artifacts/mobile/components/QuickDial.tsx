import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const QUICK_DIALS = [
  { label: "Police", number: "999", icon: "shield", bg: "#003DA5", light: "#EFF6FF" },
  { label: "Ambulance", number: "1199", icon: "activity", bg: "#16A34A", light: "#F0FDF4" },
  { label: "Fire", number: "020 2222181", icon: "zap", bg: "#EA580C", light: "#FFF7ED" },
  { label: "Red Cross", number: "1199", icon: "heart", bg: "#C8102E", light: "#FEF2F2" },
];

export function QuickDial() {
  const handleCall = async (number: string, label: string) => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const url = `tel:${number.replace(/\D/g, "")}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert(label, `Dial: ${number}`, [{ text: "OK" }]);
    }
  };

  return (
    <View style={styles.row}>
      {QUICK_DIALS.map((d) => (
        <TouchableOpacity
          key={d.label}
          style={[styles.btn, { backgroundColor: d.light }]}
          onPress={() => handleCall(d.number, d.label)}
          activeOpacity={0.75}
        >
          <View style={[styles.iconCircle, { backgroundColor: d.bg }]}>
            <Feather name={d.icon as any} size={18} color="#fff" />
          </View>
          <Text style={[styles.label, { color: d.bg }]}>{d.label}</Text>
          <Text style={[styles.number, { color: d.bg }]}>{d.number}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  btn: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
    gap: 4,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  number: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
});
