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

import { Hospital, HospitalType } from "@/constants/kenya-hospitals";
import { useColors } from "@/hooks/useColors";
import { useFavorites } from "@/hooks/useFavorites";

interface HospitalCardProps {
  hospital: Hospital;
  distanceKm?: number;
}

const TYPE_COLORS: Record<HospitalType, { bg: string; text: string; label: string }> = {
  public: { bg: "#DBEAFE", text: "#1E40AF", label: "Public" },
  private: { bg: "#D1FAE5", text: "#065F46", label: "Private" },
  "faith-based": { bg: "#FEF3C7", text: "#92400E", label: "Faith-based" },
};

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  "Level 6": { bg: "#FEE2E2", text: "#991B1B" },
  "Level 5": { bg: "#FFEDD5", text: "#9A3412" },
  "Level 4": { bg: "#FEF9C3", text: "#713F12" },
  "Level 3": { bg: "#DCFCE7", text: "#14532D" },
  "Level 2": { bg: "#F0FDFA", text: "#134E4A" },
  "Level 1": { bg: "#F8FAFC", text: "#475569" },
};

export function HospitalCard({ hospital, distanceKm }: HospitalCardProps) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(hospital.id);
  const typeStyle = TYPE_COLORS[hospital.type];
  const levelStyle = LEVEL_COLORS[hospital.level] ?? LEVEL_COLORS["Level 1"];

  const handleCall = async () => {
    if (!hospital.phone) {
      Alert.alert("Contact Pending", "This hospital's contact is yet to be verified. Please report at rescueconnectkenya@gmail.com.");
      return;
    }
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const url = `tel:${hospital.phone.replace(/\D/g, "")}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert("Call " + hospital.name, "Dial: " + hospital.phone, [{ text: "OK" }]);
    }
  };

  const handleMaps = async () => {
    if (!hospital.coordinates) return;
    const { lat, lng } = hospital.coordinates;
    const query = encodeURIComponent(hospital.name + " " + hospital.county + " Kenya");
    const url = Platform.OS === "ios"
      ? `maps:?q=${query}&ll=${lat},${lng}`
      : `geo:${lat},${lng}?q=${query}`;
    const fallback = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const canOpen = await Linking.canOpenURL(url);
    Linking.openURL(canOpen ? url : fallback);
  };

  const onToggleFav = () =>
    toggleFavorite({
      id: hospital.id,
      type: "hospital",
      name: hospital.name,
      number: hospital.phone ?? "N/A",
      county: hospital.county,
      description: hospital.address,
    });

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.nameSect}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
            {hospital.name}
          </Text>
          <View style={styles.tags}>
            <View style={[styles.tag, { backgroundColor: levelStyle.bg }]}>
              <Text style={[styles.tagText, { color: levelStyle.text }]}>{hospital.level}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: typeStyle.bg }]}>
              <Text style={[styles.tagText, { color: typeStyle.text }]}>{typeStyle.label}</Text>
            </View>
            {hospital.isBloodBank && (
              <View style={[styles.tag, { backgroundColor: "#FFF1F2" }]}>
                <Text style={[styles.tagText, { color: "#BE123C" }]}>🩸 Blood</Text>
              </View>
            )}
            {hospital.isMentalHealth && (
              <View style={[styles.tag, { backgroundColor: "#ECFDF5" }]}>
                <Text style={[styles.tagText, { color: "#059669" }]}>🧠 Mental</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={onToggleFav} style={styles.favBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="star" size={18} color={fav ? "#F59E0B" : colors.mutedForeground} fill={fav ? "#F59E0B" : "none"} />
        </TouchableOpacity>
      </View>

      {/* Location row */}
      <View style={styles.metaRow}>
        <Feather name="map-pin" size={12} color={colors.mutedForeground} />
        <Text style={[styles.meta, { color: colors.mutedForeground }]} numberOfLines={1}>
          {hospital.address ?? hospital.county + " County"}
        </Text>
        {distanceKm !== undefined && (
          <Text style={[styles.distance, { color: "#0369A1" }]}>
            · {distanceKm.toFixed(1)} km
          </Text>
        )}
      </View>

      {/* Phone */}
      <View style={styles.metaRow}>
        <Feather name="phone" size={12} color={colors.mutedForeground} />
        <Text style={[styles.phone, { color: hospital.verified ? "#C8102E" : colors.mutedForeground }]}>
          {hospital.phone ?? "Contact pending verification"}
        </Text>
        {!hospital.verified && (
          <View style={[styles.tag, { backgroundColor: "#FFF7ED", marginLeft: 4 }]}>
            <Text style={[styles.tagText, { color: "#C2410C" }]}>Unverified</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#C8102E" }]}
          onPress={handleCall}
          activeOpacity={0.8}
        >
          <Feather name="phone" size={14} color="#fff" />
          <Text style={styles.actionBtnText}>Call</Text>
        </TouchableOpacity>
        {hospital.coordinates && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#0369A1" }]}
            onPress={handleMaps}
            activeOpacity={0.8}
          >
            <Feather name="navigation" size={14} color="#fff" />
            <Text style={styles.actionBtnText}>Directions</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  nameSect: { flex: 1, gap: 6 },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  tag: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  favBtn: { paddingTop: 2 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  meta: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  distance: { fontSize: 12, fontFamily: "Inter_600SemiBold", flexShrink: 0 },
  phone: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  actions: { flexDirection: "row", gap: 8, marginTop: 4 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
