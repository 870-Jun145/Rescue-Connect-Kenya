import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, Region, UrlTile } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KENYA_HOSPITALS, Hospital } from "@/constants/kenya-hospitals";
import { useColors } from "@/hooks/useColors";
import {
  formatDistance,
  getDistanceKm,
  useLocation,
} from "@/hooks/useLocation";

// ─── Constants ───────────────────────────────────────────────────────────────

const KENYA_CENTER: Region = {
  latitude: 0.0236,
  longitude: 37.9062,
  latitudeDelta: 8.5,
  longitudeDelta: 8.5,
};

const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const GPS_CACHE_KEY = "rescue_connect_last_gps";
const NEAREST_COUNT = 5;

const TYPE_COLORS: Record<string, string> = {
  public: "#006600",
  private: "#003DA5",
  "faith-based": "#8B4513",
};

type FilterType =
  | "all"
  | "public"
  | "private"
  | "faith-based"
  | "bloodbank"
  | "mentalhealth";

const FILTERS: { key: FilterType; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "map-pin" },
  { key: "public", label: "Public", icon: "home" },
  { key: "private", label: "Private", icon: "briefcase" },
  { key: "faith-based", label: "Faith", icon: "heart" },
  { key: "bloodbank", label: "Blood", icon: "droplet" },
  { key: "mentalhealth", label: "Mental", icon: "smile" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function accuracyColor(acc?: number): string {
  if (!acc) return "#94A3B8";
  if (acc <= 30) return "#22c55e";
  if (acc <= 100) return "#f59e0b";
  return "#ef4444";
}

function markerColor(
  hospital: Hospital,
  nearestIds: Set<string>,
  topId: string | undefined
): string {
  if (hospital.id === topId) return "#FFD700";
  if (nearestIds.has(hospital.id)) return "#FB923C";
  if (!hospital.verified) return "#94A3B8";
  return TYPE_COLORS[hospital.type] ?? "#C8102E";
}

// ─── Hospital Detail Modal ────────────────────────────────────────────────────

function HospitalDetailModal({
  hospital,
  distanceKm,
  onClose,
}: {
  hospital: Hospital | null;
  distanceKm?: number;
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
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      )
    );
  };

  const callPhone = () => {
    if (hospital.phone)
      Linking.openURL(`tel:${hospital.phone.replace(/\s/g, "")}`);
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalSheet,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
          <View
            style={[
              styles.modalTypeBadge,
              { backgroundColor: TYPE_COLORS[hospital.type] ?? "#888" },
            ]}
          />

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              {/* Title row */}
              <View style={styles.modalTitleRow}>
                <Text
                  style={[styles.modalName, { color: colors.foreground }]}
                  numberOfLines={3}
                >
                  {hospital.name}
                </Text>
                {!hospital.verified && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: colors.muted },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Unverified
                    </Text>
                  </View>
                )}
              </View>

              {/* Distance */}
              {distanceKm !== undefined && (
                <View style={styles.distanceRow}>
                  <Feather name="navigation" size={13} color="#006600" />
                  <Text style={[styles.distanceText, { color: "#006600" }]}>
                    {formatDistance(distanceKm)} away
                  </Text>
                </View>
              )}

              {/* Meta badges */}
              <View style={styles.metaRow}>
                <View style={[styles.badge, { backgroundColor: colors.muted }]}>
                  <Text
                    style={[
                      styles.badgeText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {hospital.level}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.muted }]}>
                  <Text
                    style={[
                      styles.badgeText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {hospital.type}
                  </Text>
                </View>
                {hospital.isBloodBank && (
                  <View style={[styles.badge, { backgroundColor: "#FEE2E2" }]}>
                    <Text style={[styles.badgeText, { color: "#991B1B" }]}>
                      🩸 Blood Bank
                    </Text>
                  </View>
                )}
                {hospital.isMentalHealth && (
                  <View style={[styles.badge, { backgroundColor: "#EDE9FE" }]}>
                    <Text style={[styles.badgeText, { color: "#5B21B6" }]}>
                      🧠 Mental Health
                    </Text>
                  </View>
                )}
              </View>

              {/* Info rows */}
              {hospital.address && (
                <InfoRow
                  icon="map-pin"
                  text={hospital.address}
                  color={colors.mutedForeground}
                />
              )}
              {hospital.phone ? (
                <InfoRow
                  icon="phone"
                  text={hospital.phone}
                  color={colors.foreground}
                />
              ) : (
                <InfoRow
                  icon="phone-off"
                  text="Contact pending verification"
                  color={colors.mutedForeground}
                />
              )}
              {hospital.email && (
                <InfoRow
                  icon="mail"
                  text={hospital.email}
                  color={colors.mutedForeground}
                />
              )}

              {/* Specialties */}
              {hospital.specialties && hospital.specialties.length > 0 && (
                <View style={styles.chipsWrap}>
                  {hospital.specialties.map((s) => (
                    <View
                      key={s}
                      style={[
                        styles.chip,
                        { backgroundColor: colors.muted },
                      ]}
                    >
                      <Text
                        style={[styles.chipText, { color: colors.foreground }]}
                      >
                        {s}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Actions */}
          <View
            style={[styles.modalActions, { borderTopColor: colors.border }]}
          >
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
              <Text
                style={[styles.actionBtnText, { color: colors.foreground }]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function InfoRow({
  icon,
  text,
  color,
}: {
  icon: any;
  text: string;
  color: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Feather name={icon} size={14} color={color} style={{ marginTop: 1 }} />
      <Text style={[styles.infoText, { color }]} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

// ─── Nearest Hospital Strip ───────────────────────────────────────────────────

function NearestStrip({
  hospitals,
  onSelect,
  colors,
}: {
  hospitals: Array<Hospital & { distKm: number }>;
  onSelect: (h: Hospital) => void;
  colors: ReturnType<typeof useColors>;
}) {
  if (hospitals.length === 0) return null;

  return (
    <View
      style={[
        styles.nearestContainer,
        { backgroundColor: colors.card, borderTopColor: colors.border },
      ]}
    >
      <View style={styles.nearestHeader}>
        <Feather name="navigation" size={13} color="#006600" />
        <Text style={[styles.nearestTitle, { color: colors.foreground }]}>
          Nearest Hospitals
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.nearestScroll}
      >
        {hospitals.map((h, i) => (
          <TouchableOpacity
            key={h.id}
            style={[
              styles.nearestCard,
              {
                backgroundColor: i === 0 ? "#FEF9C3" : colors.muted,
                borderColor: i === 0 ? "#EAB308" : colors.border,
              },
            ]}
            onPress={() => onSelect(h)}
          >
            {i === 0 && (
              <Text style={styles.nearestStar}>⭐ Nearest</Text>
            )}
            <Text
              style={[styles.nearestName, { color: colors.foreground }]}
              numberOfLines={2}
            >
              {h.name}
            </Text>
            <View style={styles.nearestMeta}>
              <View
                style={[
                  styles.nearestDistBadge,
                  { backgroundColor: i === 0 ? "#EAB308" : "#006600" },
                ]}
              >
                <Text style={styles.nearestDist}>
                  {formatDistance(h.distKm)}
                </Text>
              </View>
              <Text
                style={[
                  styles.nearestType,
                  { color: colors.mutedForeground },
                ]}
              >
                {h.type}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Main Map Component ───────────────────────────────────────────────────────

export function HospitalMap() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { location, loading, requestLocation } = useLocation();
  const mapRef = useRef<MapView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [selected, setSelected] = useState<Hospital | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [autoZoomed, setAutoZoomed] = useState(false);

  // ── Pulse animation for nearest hospital marker ──
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // ── Cache last GPS to AsyncStorage ──
  useEffect(() => {
    if (location) {
      AsyncStorage.setItem(
        GPS_CACHE_KEY,
        JSON.stringify({ lat: location.lat, lng: location.lng })
      ).catch(() => {});
    }
  }, [location]);

  // ── Filtered hospital list ──
  const hospitals = useMemo(() => {
    const base = KENYA_HOSPITALS.filter((h) => h.coordinates);
    switch (filter) {
      case "public":
        return base.filter((h) => h.type === "public");
      case "private":
        return base.filter((h) => h.type === "private");
      case "faith-based":
        return base.filter((h) => h.type === "faith-based");
      case "bloodbank":
        return base.filter((h) => h.isBloodBank);
      case "mentalhealth":
        return base.filter((h) => h.isMentalHealth);
      default:
        return base;
    }
  }, [filter]);

  // ── Nearest hospitals (sorted by distance from user) ──
  const nearestHospitals = useMemo(() => {
    if (!location) return [];
    return KENYA_HOSPITALS.filter((h) => h.coordinates)
      .map((h) => ({
        ...h,
        distKm: getDistanceKm(
          location.lat,
          location.lng,
          h.coordinates!.lat,
          h.coordinates!.lng
        ),
      }))
      .sort((a, b) => a.distKm - b.distKm)
      .slice(0, NEAREST_COUNT);
  }, [location]);

  const nearestIds = useMemo(
    () => new Set(nearestHospitals.map((h) => h.id)),
    [nearestHospitals]
  );
  const topHospitalId = nearestHospitals[0]?.id;

  // ── Distance for selected hospital ──
  const selectedDistKm = useMemo(() => {
    if (!selected?.coordinates || !location) return undefined;
    return getDistanceKm(
      location.lat,
      location.lng,
      selected.coordinates.lat,
      selected.coordinates.lng
    );
  }, [selected, location]);

  // ── Auto-zoom to user + nearest hospital on first GPS fix ──
  useEffect(() => {
    if (!location || autoZoomed || !mapRef.current) return;
    const top = nearestHospitals[0];
    if (!top) {
      mapRef.current.animateToRegion(
        {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        },
        800
      );
    } else {
      const minLat = Math.min(location.lat, top.coordinates!.lat);
      const maxLat = Math.max(location.lat, top.coordinates!.lat);
      const minLng = Math.min(location.lng, top.coordinates!.lng);
      const maxLng = Math.max(location.lng, top.coordinates!.lng);
      const latDelta = (maxLat - minLat) * 2.4 + 0.02;
      const lngDelta = (maxLng - minLng) * 2.4 + 0.02;
      mapRef.current.animateToRegion(
        {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: Math.max(latDelta, 0.08),
          longitudeDelta: Math.max(lngDelta, 0.08),
        },
        900
      );
    }
    setAutoZoomed(true);
  }, [location, nearestHospitals, autoZoomed]);

  // ── Pan to my location ──
  const goToMyLocation = useCallback(() => {
    if (location) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        },
        600
      );
    } else {
      requestLocation();
    }
  }, [location, requestLocation]);

  // ── Pan to a selected nearest hospital ──
  const goToNearestHospital = useCallback(
    (h: Hospital) => {
      setSelected(h);
      if (h.coordinates) {
        mapRef.current?.animateToRegion(
          {
            latitude: h.coordinates.lat,
            longitude: h.coordinates.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          600
        );
      }
    },
    []
  );

  return (
    <View style={styles.container}>
      {/* ── Map ── */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={KENYA_CENTER}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        mapType="none"
        rotateEnabled={false}
      >
        {/* OpenStreetMap tiles — works with NO API key */}
        <UrlTile
          urlTemplate={OSM_TILE_URL}
          maximumZ={19}
          flipY={false}
          zIndex={-1}
          shouldReplaceMapContent
        />

        {/* Hospital markers */}
        {hospitals.map((h) => {
          const isTop = h.id === topHospitalId;
          const isNear = nearestIds.has(h.id);
          const pin = markerColor(h, nearestIds, topHospitalId);

          if (isTop) {
            // Nearest hospital — pulsing star marker
            return (
              <Marker
                key={h.id}
                coordinate={{
                  latitude: h.coordinates!.lat,
                  longitude: h.coordinates!.lng,
                }}
                anchor={{ x: 0.5, y: 1 }}
                onPress={() => setSelected(h)}
                zIndex={99}
              >
                <View style={styles.topMarkerWrap}>
                  <Animated.View
                    style={[
                      styles.topMarkerPulse,
                      { transform: [{ scale: pulseAnim }] },
                    ]}
                  />
                  <View style={styles.topMarkerInner}>
                    <Text style={styles.topMarkerStar}>⭐</Text>
                  </View>
                  {nearestHospitals[0] && (
                    <View style={styles.topMarkerLabel}>
                      <Text style={styles.topMarkerLabelText}>
                        {formatDistance(nearestHospitals[0].distKm)}
                      </Text>
                    </View>
                  )}
                </View>
                <Callout tooltip={false} onPress={() => setSelected(h)}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutName} numberOfLines={2}>
                      ⭐ {h.name}
                    </Text>
                    <Text style={styles.calloutSub}>
                      {h.level} · Nearest hospital
                    </Text>
                    <Text style={styles.calloutTap}>Tap for details →</Text>
                  </View>
                </Callout>
              </Marker>
            );
          }

          if (isNear) {
            return (
              <Marker
                key={h.id}
                coordinate={{
                  latitude: h.coordinates!.lat,
                  longitude: h.coordinates!.lng,
                }}
                anchor={{ x: 0.5, y: 1 }}
                onPress={() => setSelected(h)}
                zIndex={50}
              >
                <View style={[styles.nearMarker, { borderColor: pin }]}>
                  <View style={[styles.nearMarkerDot, { backgroundColor: pin }]} />
                </View>
                <Callout tooltip={false} onPress={() => setSelected(h)}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutName} numberOfLines={2}>
                      {h.name}
                    </Text>
                    <Text style={styles.calloutSub}>
                      {h.level} · {h.county}
                    </Text>
                    <Text style={styles.calloutTap}>Tap for details →</Text>
                  </View>
                </Callout>
              </Marker>
            );
          }

          return (
            <Marker
              key={h.id}
              coordinate={{
                latitude: h.coordinates!.lat,
                longitude: h.coordinates!.lng,
              }}
              pinColor={pin}
              onPress={() => setSelected(h)}
              zIndex={1}
            >
              <Callout tooltip={false} onPress={() => setSelected(h)}>
                <View style={styles.callout}>
                  <Text style={styles.calloutName} numberOfLines={2}>
                    {h.name}
                  </Text>
                  <Text style={styles.calloutSub}>
                    {h.level} · {h.county}
                  </Text>
                  <Text style={styles.calloutTap}>Tap for details →</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* ── Header ── */}
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: insets.top + 10,
            backgroundColor: "#C8102E",
          },
        ]}
      >
        <View style={styles.flagStrip}>
          {["#006600", "#fff", "#C8102E", "#fff", "#006600"].map((c, i) => (
            <View key={i} style={[styles.flagBand, { backgroundColor: c }]} />
          ))}
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>🗺️ Hospital Map</Text>
          <View style={styles.headerRight}>
            {location && (
              <View
                style={[
                  styles.accuracyBadge,
                  { backgroundColor: accuracyColor(location.accuracy) },
                ]}
              >
                <Text style={styles.accuracyText}>
                  GPS ±{Math.round(location.accuracy ?? 0)}m
                </Text>
              </View>
            )}
            <Text style={styles.headerCount}>{hospitals.length} pins</Text>
          </View>
        </View>
      </View>

      {/* ── Filter chips ── */}
      <View
        style={[
          styles.filterBar,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? "#C8102E" : colors.muted,
                    borderColor: active ? "#C8102E" : colors.border,
                  },
                ]}
                onPress={() => setFilter(f.key)}
              >
                <Feather
                  name={f.icon as any}
                  size={12}
                  color={active ? "#fff" : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.filterText,
                    { color: active ? "#fff" : colors.mutedForeground },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── My Location FAB ── */}
      <TouchableOpacity
        style={[
          styles.locationFab,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            bottom: nearestHospitals.length > 0
              ? insets.bottom + 182
              : insets.bottom + 78,
          },
        ]}
        onPress={goToMyLocation}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#C8102E" />
        ) : (
          <Feather name="crosshair" size={22} color="#C8102E" />
        )}
      </TouchableOpacity>

      {/* ── Legend ── */}
      <View
        style={[
          styles.legend,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            bottom: nearestHospitals.length > 0
              ? insets.bottom + 182
              : insets.bottom + 78,
          },
        ]}
      >
        {[
          { color: "#FFD700", label: "Nearest" },
          { color: "#006600", label: "Public" },
          { color: "#003DA5", label: "Private" },
          { color: "#8B4513", label: "Faith" },
          { color: "#94A3B8", label: "Unverified" },
        ].map(({ color, label }) => (
          <View key={label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Nearest Hospitals Strip ── */}
      {nearestHospitals.length > 0 && (
        <View
          style={[
            styles.nearestOuter,
            { paddingBottom: insets.bottom + 60 },
          ]}
        >
          <NearestStrip
            hospitals={nearestHospitals}
            onSelect={goToNearestHospital}
            colors={colors}
          />
        </View>
      )}

      {/* ── Hospital Detail Modal ── */}
      <HospitalDetailModal
        hospital={selected}
        distanceKm={selectedDistKm}
        onClose={() => setSelected(null)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },

  // Header
  headerBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 10,
  },
  flagStrip: {
    flexDirection: "row",
    height: 4,
    width: 100,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 6,
  },
  flagBand: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  accuracyBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  accuracyText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  headerCount: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  // Filters
  filterBar: {
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  filterScroll: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flexDirection: "row",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  // FAB
  locationFab: {
    position: "absolute",
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  // Legend
  legend: {
    position: "absolute",
    left: 16,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, fontFamily: "Inter_400Regular" },

  // Custom markers
  topMarkerWrap: { alignItems: "center" },
  topMarkerPulse: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,215,0,0.35)",
  },
  topMarkerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  topMarkerStar: { fontSize: 16 },
  topMarkerLabel: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  topMarkerLabelText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: "#000",
  },
  nearMarker: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  nearMarkerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Callout
  callout: { width: 190, padding: 10, borderRadius: 8 },
  calloutName: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#111",
    marginBottom: 2,
  },
  calloutSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#555",
    marginBottom: 4,
  },
  calloutTap: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#C8102E",
  },

  // Nearest strip
  nearestOuter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  nearestContainer: {
    borderTopWidth: 1,
    paddingTop: 8,
  },
  nearestHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  nearestTitle: { fontSize: 12, fontFamily: "Inter_700Bold" },
  nearestScroll: { paddingHorizontal: 12, gap: 10, paddingBottom: 8 },
  nearestCard: {
    width: 150,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 10,
    gap: 4,
  },
  nearestStar: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#92400E" },
  nearestName: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 16,
  },
  nearestMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  nearestDistBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  nearestDist: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  nearestType: { fontSize: 10, fontFamily: "Inter_400Regular" },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: "78%",
    paddingBottom: 34,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  modalTypeBadge: {
    height: 3,
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 12,
  },
  modalHeader: { paddingHorizontal: 20, paddingBottom: 12 },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  modalName: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    lineHeight: 24,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  distanceText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  chip: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    flexWrap: "wrap",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
