import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HospitalCard } from "@/components/HospitalCard";
import { SearchBar } from "@/components/SearchBar";
import { HUMANITARIAN_CONTACTS, HumanitarianContact } from "@/constants/humanitarian";
import { KENYA_HOSPITALS } from "@/constants/kenya-hospitals";
import { useColors } from "@/hooks/useColors";
import { useFavorites } from "@/hooks/useFavorites";

type Tab = "humanitarian" | "blood" | "mental";

const bloodBanks = KENYA_HOSPITALS.filter((h) => h.isBloodBank);
const mentalHospitals = KENYA_HOSPITALS.filter((h) => h.isMentalHealth);

function HumanitarianCard({ contact }: { contact: HumanitarianContact }) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(contact.id);

  const handleCall = async () => {
    if (Platform.OS !== "web") await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = `tel:${contact.number.replace(/\D/g, "")}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
    else Alert.alert(contact.name, `Dial: ${contact.number}`, [{ text: "OK" }]);
  };

  const handleEmail = () => {
    if (contact.email) Linking.openURL(`mailto:${contact.email}`);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={[styles.cardName, { color: colors.foreground }]} numberOfLines={2}>
            {contact.name}
          </Text>
          <View style={[styles.sectorTag, { backgroundColor: "#F5F3FF" }]}>
            <Text style={[styles.sectorText, { color: "#7C3AED" }]}>{contact.sector}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite({ id: contact.id, type: "humanitarian", name: contact.name, number: contact.number, description: contact.description })}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="star" size={16} color={fav ? "#F59E0B" : colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.cardDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
        {contact.description}
      </Text>

      <View style={styles.metaRow}>
        <Feather name="clock" size={11} color={colors.mutedForeground} />
        <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{contact.available}</Text>
        {!contact.verified && (
          <View style={[styles.unverifiedTag, { backgroundColor: "#FFF7ED" }]}>
            <Text style={{ color: "#C2410C", fontSize: 10, fontFamily: "Inter_500Medium" }}>Unverified</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#7C3AED" }]}
          onPress={handleCall}
          activeOpacity={0.8}
        >
          <Feather name="phone" size={13} color="#fff" />
          <Text style={styles.actionText}>{contact.number}</Text>
        </TouchableOpacity>
        {contact.email && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#0369A1" }]}
            onPress={handleEmail}
            activeOpacity={0.8}
          >
            <Feather name="mail" size={13} color="#fff" />
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function ServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 0 : insets.top;
  const [activeTab, setActiveTab] = useState<Tab>("humanitarian");
  const [query, setQuery] = useState("");

  const TAB_CONFIG: { key: Tab; label: string; icon: string; color: string }[] = [
    { key: "humanitarian", label: "Humanitarian", icon: "users", color: "#7C3AED" },
    { key: "blood", label: "Blood Banks", icon: "droplet", color: "#BE123C" },
    { key: "mental", label: "Mental Health", icon: "heart", color: "#059669" },
  ];

  const currentData = (): Array<{ id: string; _type: Tab; data: HumanitarianContact | typeof KENYA_HOSPITALS[0] }> => {
    const q = query.toLowerCase();
    if (activeTab === "humanitarian") {
      return HUMANITARIAN_CONTACTS.filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      ).map((c) => ({ id: c.id, _type: "humanitarian", data: c }));
    }
    const hospitals = activeTab === "blood" ? bloodBanks : mentalHospitals;
    return hospitals
      .filter((h) => !q || h.name.toLowerCase().includes(q) || h.county.toLowerCase().includes(q))
      .map((h) => ({ id: h.id, _type: activeTab, data: h }));
  };

  const data = currentData();

  const ListHeader = () => (
    <View style={{ backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Services</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Humanitarian · Blood Banks · Mental Health
        </Text>
      </View>
      <View style={styles.tabRow}>
        {TAB_CONFIG.map((t) => {
          const active = activeTab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[
                styles.tab,
                { backgroundColor: active ? t.color : colors.card, borderColor: active ? t.color : colors.border },
              ]}
              onPress={() => { setActiveTab(t.key); setQuery(""); }}
              activeOpacity={0.8}
            >
              <Feather name={t.icon as any} size={13} color={active ? "#fff" : colors.mutedForeground} />
              <Text style={[styles.tabText, { color: active ? "#fff" : colors.mutedForeground }]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder={`Search ${activeTab}...`} />
      </View>
      <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
        {data.length} result{data.length !== 1 ? "s" : ""}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item._type === "humanitarian" ? (
            <HumanitarianCard contact={item.data as HumanitarianContact} />
          ) : (
            <HospitalCard hospital={item.data as any} />
          )
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No results</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Try a different search</Text>
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
  tabRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 10 },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  tabText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  searchWrap: { paddingHorizontal: 16, marginBottom: 8 },
  countLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 16,
    paddingBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
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
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  cardName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  sectorTag: { alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  sectorText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  cardDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  unverifiedTag: { borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionText: { color: "#fff", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", paddingTop: 60, gap: 8, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
});
