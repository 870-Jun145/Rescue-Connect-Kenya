import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KENYA_HOSPITALS, Hospital } from "@/constants/kenya-hospitals";
import { useColors } from "@/hooks/useColors";
import { useLocation } from "@/hooks/useLocation";

const KENYA_CENTER: Region = {
  latitude: 0.0236,
  longitude: 37.9062,
  latitudeDelta: 8.5,
  longitudeDelta: 8.5,
};

const HOSPITAL_TYPE_COLORS: Record<string, string> = {
  public: "#006600",
  private: "#003DA5",
  "faith-based": "#8B4513",
};

const LEVEL_PRIORITY: Record<string, number> = {
  "Level 6": 6, "Level 5": 5, "Level 4": 4,
  "Level 3": 3, "Level 2": 2, "Level 1": 1,
};

type FilterType = "all" | "public" | "private" | "faith-based" | "bloodbank" | "mentalhealth";

const FILTERS: { key: FilterType; label: string; icon: string }[] = [
  { key: "all",          label: "All",    icon: "map-pin"  },
  { key: "public",       label: "Public", icon: "home"     },
  { key: "private",      label: "Private",icon: "briefcase"},
  { key: "faith-based",  label: "Faith",  icon: "heart"    },
  { key: "bloodbank",    label: "Blood",  icon: "droplet"  },
  { key: "mentalhealth", label: "Mental", icon: "smile"    },
];

function HospitalDetailModal({
  hospital,
  onClose,
}: {
  hospital: Hospital | null;
  onClose: () => void;
}) {
  const colors = useColors();
  if (!hospital) return null;

  const openDirections = () => {
    if (!hospital.coordinates) return;
    const { lat, lng } = hospital.coordinates;
    const label = encodeURIComponent(hospital.name);
    const url =
      Platform.OS === "ios"
        ? `maps://?q=${label}&ll=${lat},${lng}`
        : `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
    Linking.openURL(url).catch(() =>
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`)
    );
  };

  const callPhone = () => {
    if (hospital.phone) Linking.openURL(`tel:${hospital.phone.replace(/\s/g, "")}`);
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
          <View
            style={[
              styles.modalTypeBadge,
              { backgroundColor: HOSPITAL_TYPE_COLORS[hospital.type] ?? "#888" },
            ]}
          />
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Text style={[styles.modalName, { color: colors.foreground }]}>
                  {hospital.name}
                </Text>
                {!hospital.verified && (
                  <View style={[styles.unverifiedBadge, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.unverifiedText, { color: colors.mutedForeground }]}>
                      Unverified
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.modalMeta}>
                <View style={[styles.metaBadge, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{hospital.level}</Text>
                </View>
                <View style={[styles.metaBadge, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{hospital.type}</Text>
                </View>
                {hospital.isBloodBank && (
                  <View style={[styles.metaBadge, { backgroundColor: "#FEE2E2" }]}>
                    <Text style={[styles.metaText, { color: "#991B1B" }]}>🩸 Blood Bank</Text>
                  </View>
                )}
                {hospital.isMentalHealth && (
                  <View style={[styles.metaBadge, { backgroundColor: "#EDE9FE" }]}>
                    <Text style={[styles.metaText, { color: "#5B21B6" }]}>🧠 Mental Health</Text>
                  </View>
                )}
              </View>
              {hospital.address && (
                <View style={styles.infoRow}>
                  <Feather name="map-pin" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.infoText, { color: colors.mutedForeground }]}>{hospital.address}</Text>
                </View>
              )}
              {hospital.phone ? (
                <View style={styles.infoRow}>
                  <Feather name="phone" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.infoText, { color: colors.foreground }]}>{hospital.phone}</Text>
                </View>
              ) : (
                <View style={styles.infoRow}>
                  <Feather name="phone-off" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                    Contact pending verification
                  </Text>
                </View>
              )}
              {hospital.email && (
                <View style={styles.infoRow}>
                  <Feather name="mail" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.infoText, { color: colors.mutedForeground }]}>{hospital.email}</Text>
                </View>
              )}
              {hospital.specialties && hospital.specialties.length > 0 && (
                <View style={styles.specialtiesWrap}>
                  {hospital.specialties.map((s) => (
                    <View key={s} style={[styles.specialtyChip, { backgroundColor: colors.muted }]}>
                      <Text style={[styles.specialtyText, { color: colors.foreground }]}>{s}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
          <View style={[styles.modalActions, { borderTopColor: colors.border }]}>
            {hospital.phone && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#006600" }]}
                onPress={callPhone}
              >
                <Feather name="phone" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Call</Text>
              </TouchableOpacity>
            )}
            {hospital.coordinates && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#003DA5" }]}
                onPress={openDirections}
              >
                <Feather name="navigation" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Directions</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.muted }]}
              onPress={onClose}
            >
              <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function HospitalMap() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { location, loading, requestLocation } = useLocation();
  const mapRef = useRef<MapView>(null);
  const [selected, setSelected] = useState<Hospital | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const hospitals = useMemo(() => {
    const base = KENYA_HOSPITALS.filter((h) => h.coordinates);
    switch (filter) {
      case "public":       return base.filter((h) => h.type === "public");
      case "private":      return base.filter((h) => h.type === "private");
      case "faith-based":  return base.filter((h) => h.type === "faith-based");
      case "bloodbank":    return base.filter((h) => h.isBloodBank);
      case "mentalhealth": return base.filter((h) => h.isMentalHealth);
      default:             return base;
    }
  }, [filter]);

  const goToMyLocation = useCallback(() => {
    if (location) {
      mapRef.current?.animateToRegion(
        { latitude: location.lat, longitude: location.lng, latitudeDelta: 0.08, longitudeDelta: 0.08 },
        600
      );
    } else {
      requestLocation();
    }
  }, [location, requestLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={KENYA_CENTER}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsScale
        loadingEnabled
        loadingIndicatorColor="#C8102E"
        loadingBackgroundColor={colors.background}
      >
        {hospitals.map((h) => (
          <Marker
            key={h.id}
            coordinate={{ latitude: h.coordinates!.lat, longitude: h.coordinates!.lng }}
            pinColor={h.verified ? (HOSPITAL_TYPE_COLORS[h.type] ?? "#C8102E") : "#94A3B8"}
            onPress={() => setSelected(h)}
            zIndex={LEVEL_PRIORITY[h.level] ?? 1}
          >
            <Callout tooltip={false} onPress={() => setSelected(h)}>
              <View style={styles.callout}>
                <Text style={styles.calloutName} numberOfLines={2}>{h.name}</Text>
                <Text style={styles.calloutSub}>{h.level} · {h.county}</Text>
                <Text style={styles.calloutTap}>Tap for details →</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Header */}
      <View style={[styles.headerBar, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <View style={styles.headerFlagStrip}>
          <View style={[styles.flagBand, { backgroundColor: "#006600" }]} />
          <View style={[styles.flagBand, { backgroundColor: "#fff" }]} />
          <View style={[styles.flagBand, { backgroundColor: "#C8102E" }]} />
          <View style={[styles.flagBand, { backgroundColor: "#fff" }]} />
          <View style={[styles.flagBand, { backgroundColor: "#006600" }]} />
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>🗺️ Hospital Map</Text>
          <Text style={styles.headerCount}>{hospitals.length} shown</Text>
        </View>
      </View>

      {/* Filter chips */}
      <View style={[styles.filterBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, { backgroundColor: active ? colors.primary : colors.muted, borderColor: active ? colors.primary : colors.border }]}
                onPress={() => setFilter(f.key)}
              >
                <Feather name={f.icon as any} size={12} color={active ? "#fff" : colors.mutedForeground} />
                <Text style={[styles.filterText, { color: active ? "#fff" : colors.mutedForeground }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* My location FAB */}
      <TouchableOpacity
        style={[styles.locationFab, { backgroundColor: colors.card, borderColor: colors.border, bottom: insets.bottom + 100 }]}
        onPress={goToMyLocation}
      >
        {loading
          ? <ActivityIndicator size="small" color={colors.primary} />
          : <Feather name="crosshair" size={22} color={colors.primary} />}
      </TouchableOpacity>

      {/* Legend */}
      <View style={[styles.legend, { backgroundColor: colors.card, borderColor: colors.border, bottom: insets.bottom + 100 }]}>
        {[
          { color: "#006600", label: "Public" },
          { color: "#003DA5", label: "Private" },
          { color: "#8B4513", label: "Faith" },
          { color: "#94A3B8", label: "Unverified" },
        ].map(({ color, label }) => (
          <View key={label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>{label}</Text>
          </View>
        ))}
      </View>

      <HospitalDetailModal hospital={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  headerBar: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 10, zIndex: 10 },
  headerFlagStrip: { flexDirection: "row", height: 4, width: 120, borderRadius: 2, overflow: "hidden", marginBottom: 6 },
  flagBand: { flex: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  headerCount: { fontSize: 12, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.8)", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  filterBar: { position: "absolute", top: 88, left: 0, right: 0, borderBottomWidth: 1, zIndex: 10 },
  filterScroll: { paddingHorizontal: 12, paddingVertical: 8, gap: 8, flexDirection: "row" },
  filterChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  locationFab: { position: "absolute", right: 16, width: 46, height: 46, borderRadius: 23, borderWidth: 1, alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  legend: { position: "absolute", left: 16, borderRadius: 10, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 10, gap: 4, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  callout: { width: 180, padding: 10, borderRadius: 8 },
  calloutName: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#111", marginBottom: 2 },
  calloutSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#555", marginBottom: 4 },
  calloutTap: { fontSize: 11, fontFamily: "Inter_500Medium", color: "#C8102E" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, maxHeight: "75%", paddingBottom: 30 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 4 },
  modalTypeBadge: { height: 3, marginHorizontal: 20, borderRadius: 2, marginBottom: 12 },
  modalHeader: { paddingHorizontal: 20, paddingBottom: 12 },
  modalTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 8 },
  modalName: { flex: 1, fontSize: 17, fontFamily: "Inter_700Bold", lineHeight: 24 },
  unverifiedBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginTop: 2 },
  unverifiedText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  modalMeta: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  metaBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  metaText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  infoText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  specialtiesWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  specialtyChip: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  specialtyText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  modalActions: { flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1, flexWrap: "wrap" },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 12, flex: 1, justifyContent: "center" },
  actionBtnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
