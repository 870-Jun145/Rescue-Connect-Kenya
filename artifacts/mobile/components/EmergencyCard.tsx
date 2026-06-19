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

import { EmergencyContact, EmergencySector } from "@/constants/emergency";
import { useColors } from "@/hooks/useColors";
import { useFavorites } from "@/hooks/useFavorites";

const SECTOR_STYLE: Record<EmergencySector, { bg: string; fg: string; icon: string; label: string }> = {
  police: { bg: "#EFF6FF", fg: "#003DA5", icon: "shield", label: "Police" },
  ambulance: { bg: "#F0FDF4", fg: "#16A34A", icon: "activity", label: "Ambulance" },
  fire: { bg: "#FFF7ED", fg: "#EA580C", icon: "zap", label: "Fire" },
  rescue: { bg: "#F5F3FF", fg: "#7C3AED", icon: "anchor", label: "Rescue" },
  disaster: { bg: "#FEF2F2", fg: "#C8102E", icon: "alert-triangle", label: "Disaster" },
};

interface EmergencyCardProps {
  contact: EmergencyContact;
}

export function EmergencyCard({ contact }: EmergencyCardProps) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(contact.id);
  const style = SECTOR_STYLE[contact.sector];

  const handleCall = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    const url = `tel:${contact.number.replace(/\D/g, "")}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert("Call " + contact.name, "Dial: " + contact.number, [{ text: "OK" }]);
    }
  };

  const onToggleFav = () =>
    toggleFavorite({
      id: contact.id,
      type: "emergency",
      name: contact.name,
      number: contact.number,
      county: contact.county,
      description: contact.description,
    });

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: style.bg }]}>
        <Feather name={style.icon as any} size={22} color={style.fg} />
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
            {contact.name}
          </Text>
          {contact.isTollFree && (
            <View style={[styles.freeTag, { backgroundColor: "#DCFCE7" }]}>
              <Text style={[styles.freeText, { color: "#15803D" }]}>FREE</Text>
            </View>
          )}
        </View>
        <Text style={[styles.number, { color: style.fg }]}>{contact.number}</Text>
        <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
          {contact.description}
        </Text>
        <View style={styles.meta}>
          <Feather name="clock" size={11} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{contact.available}</Text>
          {contact.county && (
            <>
              <Feather name="map-pin" size={11} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{contact.county}</Text>
            </>
          )}
          {!contact.verified && (
            <View style={[styles.unverified, { backgroundColor: "#FFF7ED" }]}>
              <Text style={{ color: "#C2410C", fontSize: 10, fontFamily: "Inter_500Medium" }}>Unverified</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.rightCol}>
        <TouchableOpacity onPress={onToggleFav} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="star" size={16} color={fav ? "#F59E0B" : colors.mutedForeground} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.callBtn, { backgroundColor: style.fg }]}
          onPress={handleCall}
          activeOpacity={0.8}
        >
          <Feather name="phone" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: { flex: 1, gap: 3 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  freeTag: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    flexShrink: 0,
  },
  freeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  number: {
    fontSize: 19,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  desc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 16 },
  meta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2, flexWrap: "wrap" },
  metaText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  unverified: { borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  rightCol: { alignItems: "center", gap: 10, flexShrink: 0 },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
