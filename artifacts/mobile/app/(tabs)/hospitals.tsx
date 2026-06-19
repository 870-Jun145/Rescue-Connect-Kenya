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
import { SearchBar } from "@/components/SearchBar";
import {
  KENYA_COUNTIES,
  KENYA_HOSPITALS,
  HospitalLevel,
  HospitalType,
} from "@/constants/kenya-hospitals";
import { useColors } from "@/hooks/useColors";

type SpecialFilter = "all" | "blood" | "mental";

const LEVELS: Array<HospitalLevel | "all"> = ["all", "Level 6", "Level 5", "Level 4", "Level 3"];
const TYPES: Array<HospitalType | "all"> = ["all", "public", "private", "faith-based"];

export default function HospitalsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 0 : insets.top;

  const [query, setQuery] = useState("");
  const [county, setCounty] = useState<string>("all");
  const [level, setLevel] = useState<HospitalLevel | "all">("all");
  const [type, setType] = useState<HospitalType | "all">("all");
  const [special, setSpecial] = useState<SpecialFilter>("all");

  const filtered = useMemo(() => {
    let list = KENYA_HOSPITALS;
    if (county !== "all") list = list.filter((h) => h.county === county);
    if (level !== "all") list = list.filter((h) => h.level === level);
    if (type !== "all") list = list.filter((h) => h.type === type);
    if (special === "blood") list = list.filter((h) => h.isBloodBank);
    if (special === "mental") list = list.filter((h) => h.isMentalHealth);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.county.toLowerCase().includes(q) ||
          (h.address ?? "").toLowerCase().includes(q) ||
          (h.subCounty ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, county, level, type, special]);

  const FilterChip = ({
    label,
    active,
    color,
    onPress,
  }: {
    label: string;
    active: boolean;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: active ? color : colors.card, borderColor: active ? color : colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.chipText, { color: active ? "#fff" : colors.mutedForeground }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={{ backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Hospitals</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          All {KENYA_HOSPITALS.length}+ hospitals across 47 counties
        </Text>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search hospital name, county..." />
      </View>

      {/* Special filters */}
      <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {[
          { key: "all" as SpecialFilter, label: "All Hospitals", color: "#0f172a" },
          { key: "blood" as SpecialFilter, label: "🩸 Blood Banks", color: "#BE123C" },
          { key: "mental" as SpecialFilter, label: "🧠 Mental Health", color: "#059669" },
        ].map((f) => (
          <FilterChip key={f.key} label={f.label} active={special === f.key} color={f.color} onPress={() => setSpecial(f.key)} />
        ))}
      </ScrollView>

      {/* Level filter */}
      <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>Level</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {LEVELS.map((l) => (
          <FilterChip
            key={l}
            label={l === "all" ? "All Levels" : l}
            active={level === l}
            color="#C8102E"
            onPress={() => setLevel(l)}
          />
        ))}
      </ScrollView>

      {/* Type filter */}
      <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {TYPES.map((t) => (
          <FilterChip
            key={t}
            label={t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
            active={type === t}
            color="#0369A1"
            onPress={() => setType(t)}
          />
        ))}
      </ScrollView>

      {/* County filter */}
      <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>County</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        <FilterChip label="All Counties" active={county === "all"} color="#006600" onPress={() => setCounty("all")} />
        {KENYA_COUNTIES.map((c) => (
          <FilterChip key={c} label={c} active={county === c} color="#006600" onPress={() => setCounty(c)} />
        ))}
      </ScrollView>

      <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
        {filtered.length} hospital{filtered.length !== 1 ? "s" : ""}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HospitalCard hospital={item} />}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No hospitals found</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Clear some filters or update your search
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
  searchWrap: { paddingHorizontal: 16, marginBottom: 8 },
  filterLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  filterRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  chip: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  countLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  empty: { alignItems: "center", paddingTop: 60, gap: 8, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
});
