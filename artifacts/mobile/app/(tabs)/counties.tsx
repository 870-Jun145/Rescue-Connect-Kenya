import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KENYA_HOSPITALS, Hospital } from "@/constants/kenya-hospitals";
import { useColors } from "@/hooks/useColors";

// ─── All 47 Kenya Counties (official order) ──────────────────────────────────

const ALL_47_COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
  "Tharaka Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
  "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
  "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
  "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi",
];

// ─── Types ────────────────────────────────────────────────────────────────────

type CountyStats = {
  name: string;
  total: number;
  verified: number;
  public: number;
  private: number;
  faithBased: number;
  hasBloodBank: boolean;
  hasMentalHealth: boolean;
  highestLevel: string;
  hospitals: Hospital[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_ORDER = ["Level 6", "Level 5", "Level 4", "Level 3", "Level 2", "Level 1"];

function buildStats(): Map<string, CountyStats> {
  const map = new Map<string, CountyStats>();

  ALL_47_COUNTIES.forEach((name) => {
    map.set(name, {
      name,
      total: 0,
      verified: 0,
      public: 0,
      private: 0,
      faithBased: 0,
      hasBloodBank: false,
      hasMentalHealth: false,
      highestLevel: "",
      hospitals: [],
    });
  });

  KENYA_HOSPITALS.forEach((h) => {
    const stats = map.get(h.county);
    if (!stats) return;
    stats.hospitals.push(h);
    stats.total++;
    if (h.verified) stats.verified++;
    if (h.type === "public") stats.public++;
    if (h.type === "private") stats.private++;
    if (h.type === "faith-based") stats.faithBased++;
    if (h.isBloodBank) stats.hasBloodBank = true;
    if (h.isMentalHealth) stats.hasMentalHealth = true;
    const lvlIdx = LEVEL_ORDER.indexOf(h.level);
    const curIdx = LEVEL_ORDER.indexOf(stats.highestLevel);
    if (lvlIdx !== -1 && (curIdx === -1 || lvlIdx < curIdx)) {
      stats.highestLevel = h.level;
    }
  });

  return map;
}

const COUNTY_STATS = buildStats();

function getCountyColor(stats: CountyStats): string {
  if (stats.total === 0) return "#94A3B8";
  if (stats.verified > 0) return "#006600";
  return "#F59E0B";
}

// ─── Hospital Card ─────────────────────────────────────────────────────────────

function HospitalCard({
  hospital,
  colors,
}: {
  hospital: Hospital;
  colors: ReturnType<typeof useColors>;
}) {
  const typeColor =
    hospital.type === "public"
      ? "#006600"
      : hospital.type === "private"
      ? "#003DA5"
      : "#8B4513";

  const callPhone = () => {
    if (hospital.phone) Linking.openURL(`tel:${hospital.phone.replace(/\s/g, "")}`);
  };

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

  return (
    <View
      style={[
        styles.hospitalCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: typeColor,
        },
      ]}
    >
      {/* Top row */}
      <View style={styles.hCardTop}>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.hCardName, { color: colors.foreground }]}
            numberOfLines={2}
          >
            {hospital.name}
          </Text>
          <View style={styles.hCardBadges}>
            <View style={[styles.smallBadge, { backgroundColor: colors.muted }]}>
              <Text style={[styles.smallBadgeText, { color: colors.mutedForeground }]}>
                {hospital.level}
              </Text>
            </View>
            <View style={[styles.smallBadge, { backgroundColor: typeColor + "22" }]}>
              <Text style={[styles.smallBadgeText, { color: typeColor }]}>
                {hospital.type}
              </Text>
            </View>
            {!hospital.verified && (
              <View style={[styles.smallBadge, { backgroundColor: "#FEF3C7" }]}>
                <Text style={[styles.smallBadgeText, { color: "#92400E" }]}>
                  Unverified
                </Text>
              </View>
            )}
            {hospital.isBloodBank && (
              <Text style={styles.specialIcon}>🩸</Text>
            )}
            {hospital.isMentalHealth && (
              <Text style={styles.specialIcon}>🧠</Text>
            )}
          </View>
        </View>
      </View>

      {/* Address */}
      {hospital.address ? (
        <View style={styles.hCardRow}>
          <Feather name="map-pin" size={12} color={colors.mutedForeground} />
          <Text
            style={[styles.hCardMeta, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {hospital.address}
          </Text>
        </View>
      ) : null}

      {/* Phone */}
      {hospital.phone ? (
        <View style={styles.hCardRow}>
          <Feather name="phone" size={12} color="#006600" />
          <Text style={[styles.hCardMeta, { color: "#006600" }]}>
            {hospital.phone}
          </Text>
        </View>
      ) : (
        <View style={styles.hCardRow}>
          <Feather name="phone-off" size={12} color={colors.mutedForeground} />
          <Text style={[styles.hCardMeta, { color: colors.mutedForeground }]}>
            Contact pending verification
          </Text>
        </View>
      )}

      {/* Specialties */}
      {hospital.specialties && hospital.specialties.length > 0 && (
        <View style={styles.specialtiesRow}>
          {hospital.specialties.slice(0, 4).map((s) => (
            <View
              key={s}
              style={[styles.specialtyChip, { backgroundColor: colors.muted }]}
            >
              <Text style={[styles.specialtyText, { color: colors.foreground }]}>
                {s}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.hCardActions}>
        {hospital.phone && (
          <TouchableOpacity
            style={[styles.hCardBtn, { backgroundColor: "#006600" }]}
            onPress={callPhone}
          >
            <Feather name="phone" size={13} color="#fff" />
            <Text style={styles.hCardBtnText}>Call</Text>
          </TouchableOpacity>
        )}
        {hospital.coordinates && (
          <TouchableOpacity
            style={[styles.hCardBtn, { backgroundColor: "#003DA5" }]}
            onPress={openDirections}
          >
            <Feather name="navigation" size={13} color="#fff" />
            <Text style={styles.hCardBtnText}>Directions</Text>
          </TouchableOpacity>
        )}
        {hospital.email && (
          <TouchableOpacity
            style={[styles.hCardBtn, { backgroundColor: colors.muted }]}
            onPress={() => Linking.openURL(`mailto:${hospital.email}`)}
          >
            <Feather name="mail" size={13} color={colors.foreground} />
            <Text style={[styles.hCardBtnText, { color: colors.foreground }]}>
              Email
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── County List Item ──────────────────────────────────────────────────────────

function CountyRow({
  stats,
  index,
  onPress,
  colors,
}: {
  stats: CountyStats;
  index: number;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  const dotColor = getCountyColor(stats);

  return (
    <TouchableOpacity
      style={[
        styles.countyRow,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Number */}
      <View style={[styles.countyNum, { backgroundColor: colors.muted }]}>
        <Text style={[styles.countyNumText, { color: colors.mutedForeground }]}>
          {String(index + 1).padStart(2, "0")}
        </Text>
      </View>

      {/* Status dot */}
      <View style={[styles.countyDot, { backgroundColor: dotColor }]} />

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.countyName, { color: colors.foreground }]}>
          {stats.name}
        </Text>
        {stats.total > 0 ? (
          <View style={styles.countyMeta}>
            <Text style={[styles.countyMetaText, { color: colors.mutedForeground }]}>
              {stats.total} hospital{stats.total !== 1 ? "s" : ""}
            </Text>
            {stats.verified > 0 && (
              <Text style={[styles.countyMetaText, { color: "#006600" }]}>
                · {stats.verified} verified
              </Text>
            )}
            {stats.highestLevel ? (
              <Text style={[styles.countyMetaText, { color: colors.mutedForeground }]}>
                · Up to {stats.highestLevel}
              </Text>
            ) : null}
          </View>
        ) : (
          <Text style={[styles.countyMetaText, { color: colors.mutedForeground }]}>
            No hospitals in database yet
          </Text>
        )}
      </View>

      {/* Specials + chevron */}
      <View style={styles.countyRight}>
        {stats.hasBloodBank && <Text style={styles.countyIcon}>🩸</Text>}
        {stats.hasMentalHealth && <Text style={styles.countyIcon}>🧠</Text>}
        {stats.total > 0 && (
          <View style={[styles.countBubble, { backgroundColor: "#C8102E" }]}>
            <Text style={styles.countBubbleText}>{stats.total}</Text>
          </View>
        )}
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </View>
    </TouchableOpacity>
  );
}

// ─── County Detail View ────────────────────────────────────────────────────────

function CountyDetail({
  stats,
  onBack,
  colors,
  insets,
}: {
  stats: CountyStats;
  onBack: () => void;
  colors: ReturnType<typeof useColors>;
  insets: ReturnType<typeof useSafeAreaInsets>;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "public" | "private" | "faith-based"
  >("all");

  const hospitals = useMemo(() => {
    let list = stats.hospitals;
    if (typeFilter !== "all") list = list.filter((h) => h.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          (h.address ?? "").toLowerCase().includes(q)
      );
    }
    // Sort: verified first, then by level
    return [...list].sort((a, b) => {
      if (a.verified !== b.verified) return a.verified ? -1 : 1;
      return LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level);
    });
  }, [stats, search, typeFilter]);

  const TYPE_FILTERS = ["all", "public", "private", "faith-based"] as const;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.detailHeader,
          { paddingTop: insets.top + 10, backgroundColor: "#C8102E" },
        ]}
      >
        <View style={styles.flagStrip}>
          {["#006600", "#fff", "#C8102E", "#fff", "#006600"].map((c, i) => (
            <View key={i} style={[styles.flagBand, { backgroundColor: c }]} />
          ))}
        </View>
        <View style={styles.detailHeaderRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailCountyName}>{stats.name} County</Text>
            <Text style={styles.detailCountySub}>
              {stats.total} hospital{stats.total !== 1 ? "s" : ""} ·{" "}
              {stats.verified} verified
            </Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          {[
            { label: "Public", count: stats.public, color: "#006600" },
            { label: "Private", count: stats.private, color: "#003DA5" },
            { label: "Faith", count: stats.faithBased, color: "#8B4513" },
          ].map(({ label, count, color }) => (
            <View key={label} style={styles.statItem}>
              <View
                style={[styles.statDot, { backgroundColor: color }]}
              />
              <Text style={styles.statText}>
                {count} {label}
              </Text>
            </View>
          ))}
          {stats.hasBloodBank && (
            <View style={styles.statItem}>
              <Text style={styles.statText}>🩸 Blood Bank</Text>
            </View>
          )}
          {stats.hasMentalHealth && (
            <View style={styles.statItem}>
              <Text style={styles.statText}>🧠 Mental Health</Text>
            </View>
          )}
        </View>
      </View>

      {/* Search + filter */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.searchInput,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={15} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchText, { color: colors.foreground }]}
            placeholder="Search hospitals…"
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {TYPE_FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    typeFilter === f ? "#C8102E" : colors.muted,
                  borderColor:
                    typeFilter === f ? "#C8102E" : colors.border,
                },
              ]}
              onPress={() => setTypeFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      typeFilter === f ? "#fff" : colors.mutedForeground,
                  },
                ]}
              >
                {f === "all"
                  ? `All (${stats.total})`
                  : f === "public"
                  ? `Public (${stats.public})`
                  : f === "private"
                  ? `Private (${stats.private})`
                  : `Faith (${stats.faithBased})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Hospital list */}
      {hospitals.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="inbox" size={40} color={colors.mutedForeground} />
          <Text
            style={[styles.emptyText, { color: colors.mutedForeground }]}
          >
            {stats.total === 0
              ? "No hospitals recorded for this county yet."
              : "No hospitals match your search."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={hospitals}
          keyExtractor={(h) => h.id}
          contentContainerStyle={[
            styles.hospitalList,
            { paddingBottom: insets.bottom + 90 },
          ]}
          renderItem={({ item }) => (
            <HospitalCard hospital={item} colors={colors} />
          )}
        />
      )}
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function CountiesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Filtered county list
  const countyList = useMemo(() => {
    const all = ALL_47_COUNTIES.map((name) => COUNTY_STATS.get(name)!);
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter((s) => s.name.toLowerCase().includes(q));
  }, [search]);

  const totalHospitals = useMemo(
    () => Array.from(COUNTY_STATS.values()).reduce((s, c) => s + c.total, 0),
    []
  );

  const openCounty = (name: string) => {
    setSelectedCounty(name);
  };

  const closeCounty = () => {
    setSelectedCounty(null);
  };

  const selectedStats = selectedCounty
    ? COUNTY_STATS.get(selectedCounty)!
    : null;

  // If a county is selected, show detail view
  if (selectedStats) {
    return (
      <CountyDetail
        stats={selectedStats}
        onBack={closeCounty}
        colors={colors}
        insets={insets}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 10, backgroundColor: "#C8102E" },
        ]}
      >
        <View style={styles.flagStrip}>
          {["#006600", "#fff", "#C8102E", "#fff", "#006600"].map((c, i) => (
            <View key={i} style={[styles.flagBand, { backgroundColor: c }]} />
          ))}
        </View>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>🏳️ 47 Counties</Text>
            <Text style={styles.headerSub}>
              {totalHospitals} hospitals across Kenya
            </Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.headerStatItem}>
              <Text style={styles.headerStatNum}>47</Text>
              <Text style={styles.headerStatLabel}>Counties</Text>
            </View>
            <View
              style={[
                styles.headerStatItem,
                { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.3)" },
              ]}
            >
              <Text style={styles.headerStatNum}>{totalHospitals}</Text>
              <Text style={styles.headerStatLabel}>Hospitals</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.searchInput,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={15} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchText, { color: colors.foreground }]}
            placeholder="Search counties…"
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          {[
            { color: "#006600", label: "Has verified hospitals" },
            { color: "#F59E0B", label: "Unverified only" },
            { color: "#94A3B8", label: "No data yet" },
          ].map(({ color, label }) => (
            <View key={label} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: color }]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: colors.mutedForeground },
                ]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* County list */}
      <FlatList
        data={countyList}
        keyExtractor={(s) => s.name}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 90 },
        ]}
        renderItem={({ item, index }) => (
          <CountyRow
            stats={item}
            index={ALL_47_COUNTIES.indexOf(item.name)}
            onPress={() => openCounty(item.name)}
            colors={colors}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No counties match "{search}"
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header shared
  flagStrip: {
    flexDirection: "row",
    height: 4,
    width: 100,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  flagBand: { flex: 1 },

  // List header
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  headerStats: { flexDirection: "row", gap: 0 },
  headerStatItem: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerStatNum: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  headerStatLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },

  // Detail header
  detailHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  detailHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  detailCountyName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  detailCountySub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
  },
  statsStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statDot: { width: 8, height: 8, borderRadius: 4 },
  statText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#fff",
  },

  // Search bar
  searchBar: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    gap: 8,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },

  // Legend
  legendRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 4.5 },
  legendText: { fontSize: 11, fontFamily: "Inter_400Regular" },

  // Filter chips
  filterRow: { paddingBottom: 2, gap: 8 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  // County list
  list: { padding: 12, gap: 8 },
  countyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  countyNum: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  countyNumText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  countyDot: { width: 10, height: 10, borderRadius: 5 },
  countyName: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  countyMeta: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  countyMetaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  countyRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  countyIcon: { fontSize: 14 },
  countBubble: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  countBubbleText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },

  // Hospital cards
  hospitalList: { padding: 12, gap: 12 },
  hospitalCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 14,
    gap: 6,
  },
  hCardTop: { flexDirection: "row", alignItems: "flex-start" },
  hCardName: { fontSize: 15, fontFamily: "Inter_600SemiBold", lineHeight: 20, marginBottom: 6 },
  hCardBadges: { flexDirection: "row", flexWrap: "wrap", gap: 5, alignItems: "center" },
  smallBadge: { borderRadius: 7, paddingHorizontal: 7, paddingVertical: 2 },
  smallBadgeText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  specialIcon: { fontSize: 14 },
  hCardRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  hCardMeta: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  specialtiesRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  specialtyChip: { borderRadius: 7, paddingHorizontal: 8, paddingVertical: 2 },
  specialtyText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  hCardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    flexWrap: "wrap",
  },
  hCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  hCardBtnText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },

  // Empty
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
