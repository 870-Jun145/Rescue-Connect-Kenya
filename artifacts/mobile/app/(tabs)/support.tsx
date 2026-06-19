import React from "react";
import { FlatList, View, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { CONTACTS, Contact } from "@/constants/data";
import { ContactCard } from "@/components/ContactCard";
import { SectionHeader } from "@/components/SectionHeader";

const mentalContacts = CONTACTS.filter((c) => c.category === "mental");

export default function SupportScreen() {
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
        <Text style={[styles.title, { color: colors.foreground }]}>Support Lines</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Mental health, crisis intervention, and family safety
        </Text>
        <View style={[styles.badge, { backgroundColor: "#ECFDF5" }]}>
          <Text style={[styles.badgeText, { color: "#059669" }]}>
            You are not alone. Trained counselors are available 24/7 — free and confidential.
          </Text>
        </View>
      </View>
      <SectionHeader title="Crisis & Support" count={mentalContacts.length} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={mentalContacts}
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
