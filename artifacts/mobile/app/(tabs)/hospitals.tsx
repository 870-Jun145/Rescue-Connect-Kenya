import React from "react";
import { FlatList, View, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { CONTACTS, Contact } from "@/constants/data";
import { ContactCard } from "@/components/ContactCard";
import { SectionHeader } from "@/components/SectionHeader";

const hospitals = CONTACTS.filter((c) => c.category === "hospital");

export default function HospitalsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const renderItem = ({ item }: { item: Contact }) => (
    <ContactCard contact={item} />
  );

  const ListHeader = () => (
    <View>
      <View
        style={[
          styles.header,
          { paddingTop: topInset + 12, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Hospitals</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Major hospitals with 24/7 emergency departments
        </Text>
        <View style={[styles.badge, { backgroundColor: "#EFF6FF" }]}>
          <Text style={[styles.badgeText, { color: "#0369A1" }]}>
            Always call 911 first for life-threatening emergencies
          </Text>
        </View>
      </View>
      <SectionHeader title="Medical Centers" count={hospitals.length} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={hospitals}
        keyExtractor={(item) => item.id}
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
  badge: {
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
  },
  list: {},
});
