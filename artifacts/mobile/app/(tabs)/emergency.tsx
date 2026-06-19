import React, { useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmergencyCard } from "@/components/EmergencyCard";
import { SearchBar } from "@/components/SearchBar";
import { EMERGENCY_CONTACTS, EmergencyContact, EmergencySector } from "@/constants/emergency";
import { useColors } from "@/hooks/useColors";

type Filter = EmergencySector | "all";

const FILTERS: { key: Filter; label: string; color: string }[] = [
  { key: "all", label: "All", color: "#0f172a" },
  { key: "police", label: "Police", color: "#003DA5" },
  { key: "ambulance", label: "Ambulance", color: "#16A34A" },
  { key: "fire", label: "Fire Brigade", color: "#EA580C" },
  { key: "rescue", label: "Rescue", color: "#7C3AED" },
  { key: "disaster", label: "Disaster", color: "#C8102E" },
];

export default function EmergencyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 0 : insets.top;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = EMERGENCY_CONTACTS.filter((c) => {
    const matchesSector = filter === "all" || c.sector === filter;
    const q = query.toLowerCase();
    const matchesQuery =
      !query ||
      c.name.toLowerCase().includes(q) ||
      c.number.includes(q) ||
      c.description.toLowerCase().includes(q);
    return matchesSector && matchesQuery;
  });

  const ListHeader = () => (
    <View style={{ backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Emergency Lines</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Police · Ambulance · Fire Brigade · Rescue
        </Text>
      </View>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search emergency contacts..." />
      </View>
      {/* Filter pills */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(f) => f.key}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => {
          const active = filter === item.key;
          return (
            <TouchableOpacity
              style={[
                styles.pill,
                {
                  backgroundColor: active ? item.color : colors.card,
                  borderColor: active ? item.color : colors.border,
                },
              ]}
              onPress={() => setFilter(item.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.pillText, { color: active ? "#fff" : colors.mutedForeground }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
        {filtered.length} contact{filtered.length !== 1 ? "s" : ""}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EmergencyCard contact={item} />}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No results</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try a different filter or search term
            </Text>
          </View>
        )}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, gap: 4 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular" },
  searchWrap: { paddingHorizontal: 16, marginBottom: 12 },
  filterRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  countLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 16,
    paddingBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  empty: { alignItems: "center", paddingTop: 60, gap: 8, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
});
