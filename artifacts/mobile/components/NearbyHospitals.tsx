import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { KENYA_HOSPITALS } from "@/constants/kenya-hospitals";
import { useColors } from "@/hooks/useColors";
import { UserLocation, getDistanceKm } from "@/hooks/useLocation";
import { HospitalCard } from "./HospitalCard";

interface NearbyHospitalsProps {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  onRequestLocation: () => void;
}

export function NearbyHospitals({
  location,
  loading,
  error,
  onRequestLocation,
}: NearbyHospitalsProps) {
  const colors = useColors();

  const nearbyHospitals = location
    ? KENYA_HOSPITALS.filter((h) => h.coordinates)
        .map((h) => ({
          hospital: h,
          distance: getDistanceKm(
            location.lat,
            location.lng,
            h.coordinates!.lat,
            h.coordinates!.lng
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)
    : [];

  if (loading) {
    return (
      <View style={styles.stateBox}>
        <ActivityIndicator color={colors.primary} />
        <Text style={[styles.stateText, { color: colors.mutedForeground }]}>
          Getting your location...
        </Text>
      </View>
    );
  }

  if (error || !location) {
    return (
      <View style={[styles.stateBox, { backgroundColor: colors.muted, borderRadius: 14, marginHorizontal: 16 }]}>
        <Feather name="map-pin" size={24} color={colors.mutedForeground} />
        <Text style={[styles.stateText, { color: colors.foreground }]}>
          Enable location to find nearest hospitals
        </Text>
        <TouchableOpacity
          style={[styles.locBtn, { backgroundColor: colors.primary }]}
          onPress={onRequestLocation}
        >
          <Text style={styles.locBtnText}>Allow Location</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      {nearbyHospitals.map(({ hospital, distance }) => (
        <HospitalCard key={hospital.id} hospital={hospital} distanceKm={distance} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stateBox: {
    alignItems: "center",
    padding: 20,
    gap: 10,
    marginHorizontal: 16,
    borderRadius: 14,
  },
  stateText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  locBtn: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 4,
  },
  locBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
});
