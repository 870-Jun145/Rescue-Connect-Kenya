import React, { useState, useMemo } from "react";
import { FlatList, View, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { CONTACTS, Contact, ContactCategory } from "@/constants/data";
import { ContactCard } from "@/components/ContactCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import { SectionHeader } from "@/components/SectionHeader";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ContactCategory | "all">("all");

  const filtered = useMemo(() => {
    let list = CONTACTS;
    if (category !== "all") list = list.filter((c) => c.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.number.includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, category]);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const renderItem = ({ item }: { item: Contact }) => (
    <ContactCard contact={item} />
  );

  const ListHeader = () => (
    <View>
      <View style={[styles.header, { paddingTop: topInset + 12, backgroundColor: colors.background }]}>
        <Text style={[styles.appTitle, { color: colors.foreground }]}>Emergency Contacts</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Tap any card to call immediately
        </Text>
        <View style={styles.searchWrap}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search hotlines, hospitals..." />
        </View>
        <CategoryFilter selected={category} onSelect={setCategory} />
      </View>
      <SectionHeader title="Contacts" count={filtered.length} />
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No results</Text>
      <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
        Try a different search or category
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 + 84 : insets.bottom + 90,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingBottom: 12,
    gap: 12,
  },
  appTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 16,
    marginTop: -6,
  },
  searchWrap: {},
  list: {
    paddingTop: 0,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
