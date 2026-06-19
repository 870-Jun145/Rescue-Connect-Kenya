import React from "react";
import { FlatList, View, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { CONTACTS, Contact } from "@/constants/data";
import { ContactCard } from "@/components/ContactCard";
import { SectionHeader } from "@/components/SectionHeader";

const rescueOrgs = CONTACTS.filter(
  (c) => c.category === "rescue"
);
const poisonOrgs = CONTACTS.filter((c) => c.category === "poison");

export default function RescueScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  type SectionItem = { type: "header"; title: string; count: number } | { type: "contact"; data: Contact };

  const items: SectionItem[] = [
    { type: "header", title: "Rescue Organizations", count: rescueOrgs.length },
    ...rescueOrgs.map((c): SectionItem => ({ type: "contact", data: c })),
    { type: "header", title: "Poison Control", count: poisonOrgs.length },
    ...poisonOrgs.map((c): SectionItem => ({ type: "contact", data: c })),
  ];

  const ListHeader = () => (
    <View
      style={[
        styles.header,
        { paddingTop: topInset + 12, backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Rescue & Hazard</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Search & rescue teams and hazardous material response
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: SectionItem }) => {
    if (item.type === "header") {
      return <SectionHeader title={item.title} count={item.count} />;
    }
    return <ContactCard contact={item.data} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item, i) =>
          item.type === "header" ? `hdr-${i}` : item.data.id
        }
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 + 84 : insets.bottom + 90,
          },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  list: {},
});
