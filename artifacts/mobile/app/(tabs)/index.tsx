import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HospitalCard } from "@/components/HospitalCard";
import { NearbyHospitals } from "@/components/NearbyHospitals";
import { QuickDial } from "@/components/QuickDial";
import { SOSButton } from "@/components/SOSButton";
import { SearchBar } from "@/components/SearchBar";
import { EMERGENCY_CONTACTS } from "@/constants/emergency";
import { KENYA_HOSPITALS } from "@/constants/kenya-hospitals";
import { useColors } from "@/hooks/useColors";
import { useLocation } from "@/hooks/useLocation";
import { EmergencyCard } from "@/components/EmergencyCard";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { location, error, loading, requestLocation } = useLocation();
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const topInset = Platform.OS === "web" ? 0 : insets.top;

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    const hospitals = KENYA_HOSPITALS.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.county.toLowerCase().includes(q) ||
        (h.address ?? "").toLowerCase().includes(q) ||
        h.level.toLowerCase().includes(q)
    );
    const contacts = EMERGENCY_CONTACTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.number.includes(q) ||
        c.description.toLowerCase().includes(q)
    );
    return { hospitals, contacts };
  }, [query]);

  if (searchActive && searchResults) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.searchHeader, { paddingTop: topInset + 12, backgroundColor: colors.background }]}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search hospitals, contacts..." />
          <TouchableOpacity onPress={() => { setSearchActive(false); setQuery(""); }} style={styles.cancelBtn}>
            <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={[
            ...searchResults.contacts.map((c) => ({ type: "contact" as const, data: c })),
            ...searchResults.hospitals.map((h) => ({ type: "hospital" as const, data: h })),
          ]}
          keyExtractor={(item) => item.data.id}
          renderItem={({ item }) =>
            item.type === "contact" ? (
              <EmergencyCard contact={item.data as any} />
            ) : (
              <HospitalCard hospital={item.data as any} />
            )
          }
          ListHeaderComponent={() => (
            <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
              {(searchResults.contacts.length + searchResults.hospitals.length)} results
            </Text>
          )}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No results</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Try a different name, county or contact
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 }}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 20, backgroundColor: colors.primary }]}>
        <Text style={styles.appName}>🚨 Rescue Connect Kenya</Text>
        <Text style={styles.tagline}>Your trusted 24/7 emergency handler</Text>
      </View>

      {/* Search bar */}
      <View style={[styles.searchRow, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          style={[styles.searchTap, { backgroundColor: "#fff" }]}
          onPress={() => setSearchActive(true)}
          activeOpacity={0.8}
        >
          <Feather name="search" size={16} color="#64748B" />
          <Text style={styles.searchPlaceholder}>Search hospitals, counties, contacts...</Text>
        </TouchableOpacity>
      </View>

      {/* SOS Section */}
      <View style={[styles.section, { backgroundColor: "#FEF2F2" }]}>
        <Text style={[styles.sectionTitle, { color: "#991B1B" }]}>Emergency SOS</Text>
        <SOSButton />
      </View>

      {/* Quick Dial */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Dial</Text>
        <QuickDial />
      </View>

      {/* GPS Nearby */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Nearest Hospitals</Text>
          <Feather name="navigation" size={14} color={colors.primary} />
        </View>
        <NearbyHospitals
          location={location}
          loading={loading}
          error={error}
          onRequestLocation={requestLocation}
        />
      </View>

      {/* Data disclaimer notice */}
      <View style={[styles.notice, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Feather name="info" size={14} color={colors.mutedForeground} />
        <Text style={[styles.noticeText, { color: colors.mutedForeground }]}>
          Some contacts are pending verification. Report inaccuracies via the More tab.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    gap: 4,
  },
  appName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  tagline: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    marginBottom: 16,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchTap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchPlaceholder: {
    color: "#94A3B8",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  section: {
    paddingVertical: 16,
    gap: 12,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 16,
  },
  notice: {
    flexDirection: "row",
    gap: 8,
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  cancelBtn: { flexShrink: 0 },
  cancelText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  resultCount: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  empty: { alignItems: "center", paddingTop: 60, gap: 8, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
});
