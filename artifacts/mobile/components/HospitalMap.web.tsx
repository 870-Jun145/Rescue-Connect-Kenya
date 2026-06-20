import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KENYA_HOSPITALS } from "@/constants/kenya-hospitals";
import { useColors } from "@/hooks/useColors";
import { formatDistance, getDistanceKm } from "@/hooks/useLocation";

const MAP_ID = "rescue-connect-leaflet-map";

const TYPE_COLORS: Record<string, string> = {
  public: "#006600",
  private: "#003DA5",
  "faith-based": "#8B4513",
};

// Hospitals with coordinates serialised for Leaflet
const MAP_HOSPITALS = KENYA_HOSPITALS.filter((h) => h.coordinates).map((h) => ({
  id: h.id,
  name: h.name,
  lat: h.coordinates!.lat,
  lng: h.coordinates!.lng,
  level: h.level,
  county: h.county,
  type: h.type,
  phone: h.phone ?? "",
  verified: h.verified,
  isBloodBank: !!h.isBloodBank,
  isMentalHealth: !!h.isMentalHealth,
}));

function loadLeaflet(cb: () => void) {
  const w = window as any;
  if (w.L) { cb(); return; }

  // CSS
  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link");
    link.id = "leaflet-css";
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }

  // Extra style: make popups look clean
  if (!document.getElementById("leaflet-popup-style")) {
    const style = document.createElement("style");
    style.id = "leaflet-popup-style";
    style.textContent = `
      .rck-popup { min-width: 200px; font-family: system-ui, sans-serif; }
      .rck-popup .name { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 4px; }
      .rck-popup .sub { font-size: 12px; color: #555; margin-bottom: 6px; }
      .rck-popup .phone { font-size: 13px; color: #006600; font-weight: 600; display:block; margin-bottom: 4px; }
      .rck-popup .dir { font-size: 12px; color: #003DA5; font-weight: 600; }
      .rck-popup .badge { display:inline-block; font-size:11px; padding:2px 7px; border-radius:10px; margin-right:4px; margin-bottom:4px; }
      .leaflet-popup-content-wrapper { border-radius: 12px !important; }
      .leaflet-popup-content { margin: 12px 14px !important; }
    `;
    document.head.appendChild(style);
  }

  // JS
  const script = document.createElement("script");
  script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  script.onload = cb;
  script.onerror = () => console.error("[LeafletMap] Failed to load Leaflet");
  document.head.appendChild(script);
}

export function HospitalMap() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [nearestName, setNearestName] = useState<string | null>(null);
  const [nearestDist, setNearestDist] = useState<number | null>(null);

  useEffect(() => {
    let destroyed = false;

    // Small delay so the View is in the DOM
    const timer = setTimeout(() => {
      loadLeaflet(() => {
        if (destroyed) return;
        const container = document.getElementById(MAP_ID);
        if (!container) return;
        if ((container as any)._leafletMapInit) return;
        (container as any)._leafletMapInit = true;

        const L = (window as any).L;

        const map = L.map(container, {
          center: [0.0236, 37.9062],
          zoom: 6,
          zoomControl: true,
        });
        mapRef.current = map;

        // OpenStreetMap tiles — free, no API key
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Hospital markers
        MAP_HOSPITALS.forEach((h) => {
          const color = h.verified
            ? TYPE_COLORS[h.type] ?? "#C8102E"
            : "#94A3B8";

          const icon = L.divIcon({
            className: "",
            html: `<div style="width:11px;height:11px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.35);"></div>`,
            iconSize: [11, 11],
            iconAnchor: [5, 5],
          });

          const popup = `
            <div class="rck-popup">
              <div class="name">${h.name}</div>
              <div class="sub">${h.level} · ${h.county}</div>
              ${h.isBloodBank ? '<span class="badge" style="background:#FEE2E2;color:#991B1B">🩸 Blood Bank</span>' : ""}
              ${h.isMentalHealth ? '<span class="badge" style="background:#EDE9FE;color:#5B21B6">🧠 Mental Health</span>' : ""}
              ${h.phone ? `<a href="tel:${h.phone}" class="phone">📞 ${h.phone}</a>` : ""}
              <a href="https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}"
                 target="_blank" class="dir">🗺️ Open in Google Maps</a>
            </div>
          `;

          L.marker([h.lat, h.lng], { icon })
            .addTo(map)
            .bindPopup(popup, { maxWidth: 260 });
        });
      });
    }, 350);

    return () => {
      destroyed = true;
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      const container = document.getElementById(MAP_ID);
      if (container) delete (container as any)._leafletMapInit;
    };
  }, []);

  // ── "Find My Location" via browser geolocation ──
  const findMyLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported in this browser.");
      return;
    }
    setLocating(true);
    setLocError(null);
    setNearestName(null);
    setNearestDist(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude: lat, longitude: lng } = pos.coords;
        const map = mapRef.current;
        const L = (window as any).L;
        if (!map || !L) return;

        // Remove previous user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
          userMarkerRef.current = null;
        }

        // Blue "you are here" marker
        const userIcon = L.divIcon({
          className: "",
          html: `<div style="width:16px;height:16px;border-radius:50%;background:#3B82F6;border:3px solid #fff;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        userMarkerRef.current = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 })
          .addTo(map)
          .bindPopup("<b>📍 You are here</b>")
          .openPopup();

        // Find nearest hospital
        const sorted = MAP_HOSPITALS.map((h) => ({
          ...h,
          dist: getDistanceKm(lat, lng, h.lat, h.lng),
        })).sort((a, b) => a.dist - b.dist);

        const nearest = sorted[0];
        setNearestName(nearest?.name ?? null);
        setNearestDist(nearest?.dist ?? null);

        // Zoom to fit user + nearest hospital
        if (nearest) {
          const bounds = L.latLngBounds(
            [lat, lng],
            [nearest.lat, nearest.lng]
          ).pad(0.4);
          map.fitBounds(bounds);
        } else {
          map.setView([lat, lng], 13);
        }
      },
      (err) => {
        setLocating(false);
        setLocError(
          err.code === 1
            ? "Location permission denied."
            : "Unable to get your location."
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.flagStrip}>
          {["#006600", "#fff", "#C8102E", "#fff", "#006600"].map((c, i) => (
            <View key={i} style={[styles.flagBand, { backgroundColor: c }]} />
          ))}
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>🗺️ Hospital Map</Text>
          <Text style={styles.headerSub}>{MAP_HOSPITALS.length} hospitals</Text>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapWrap}>
        <View nativeID={MAP_ID} style={styles.leafletContainer} />

        {/* Legend overlay */}
        <View
          style={[
            styles.legend,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {[
            { color: "#006600", label: "Public" },
            { color: "#003DA5", label: "Private" },
            { color: "#8B4513", label: "Faith" },
            { color: "#94A3B8", label: "Unverified" },
          ].map(({ color, label }) => (
            <View key={label} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text
                style={[styles.legendText, { color: colors.mutedForeground }]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* Near Me FAB */}
        <TouchableOpacity
          style={[
            styles.nearMeFab,
            { backgroundColor: "#C8102E" },
          ]}
          onPress={findMyLocation}
          disabled={locating}
        >
          {locating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Feather name="crosshair" size={18} color="#fff" />
          )}
          <Text style={styles.nearMeText}>
            {locating ? "Locating…" : "Near Me"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom info bar */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 4 },
        ]}
      >
        {nearestName && nearestDist !== null ? (
          <View style={styles.nearestRow}>
            <Feather name="navigation" size={14} color="#006600" />
            <Text style={[styles.nearestText, { color: colors.foreground }]}>
              <Text style={{ fontFamily: "Inter_700Bold" }}>
                Nearest:
              </Text>{" "}
              {nearestName} —{" "}
              <Text style={{ color: "#006600", fontFamily: "Inter_600SemiBold" }}>
                {formatDistance(nearestDist)} away
              </Text>
            </Text>
          </View>
        ) : locError ? (
          <View style={styles.nearestRow}>
            <Feather name="alert-circle" size={14} color="#ef4444" />
            <Text style={[styles.nearestText, { color: "#ef4444" }]}>
              {locError}
            </Text>
          </View>
        ) : (
          <View style={styles.nearestRow}>
            <Feather name="info" size={14} color={colors.mutedForeground} />
            <Text
              style={[
                styles.nearestText,
                { color: colors.mutedForeground },
              ]}
            >
              Tap a pin to see hospital details · Tap{" "}
              <Text style={{ fontFamily: "Inter_700Bold" }}>Near Me</Text> to
              find the closest hospital
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    backgroundColor: "#C8102E",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
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
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.85)",
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  // Map area
  mapWrap: { flex: 1, position: "relative" },
  leafletContainer: { flex: 1 } as any,

  // Legend
  legend: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 4,
    zIndex: 500,
  },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, fontFamily: "Inter_400Regular" },

  // Near Me FAB
  nearMeFab: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 500,
    elevation: 4,
  },
  nearMeText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },

  // Bottom bar
  bottomBar: {
    borderTopWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  nearestRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  nearestText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
});
