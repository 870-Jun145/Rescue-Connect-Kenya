import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { ContactCategory, CATEGORY_LABELS, CATEGORY_ICONS } from "@/constants/data";

interface CategoryFilterProps {
  selected: ContactCategory | "all";
  onSelect: (cat: ContactCategory | "all") => void;
}

const ALL_CATEGORIES: Array<{ key: ContactCategory | "all"; label: string; icon: string }> = [
  { key: "all", label: "All", icon: "grid" },
  { key: "emergency", label: "Emergency", icon: CATEGORY_ICONS.emergency },
  { key: "hospital", label: "Hospitals", icon: CATEGORY_ICONS.hospital },
  { key: "rescue", label: "Rescue", icon: CATEGORY_ICONS.rescue },
  { key: "poison", label: "Poison", icon: CATEGORY_ICONS.poison },
  { key: "mental", label: "Support", icon: CATEGORY_ICONS.mental },
];

const ACTIVE_COLORS: Record<string, string> = {
  all: "#0f172a",
  emergency: "#DC2626",
  hospital: "#0369A1",
  rescue: "#D97706",
  poison: "#7C3AED",
  mental: "#059669",
};

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const colors = useColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {ALL_CATEGORIES.map((cat) => {
        const isActive = selected === cat.key;
        const activeColor = ACTIVE_COLORS[cat.key];
        return (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? activeColor : colors.card,
                borderColor: isActive ? activeColor : colors.border,
              },
            ]}
            onPress={() => onSelect(cat.key)}
            activeOpacity={0.75}
          >
            <Feather
              name={cat.icon as any}
              size={13}
              color={isActive ? "#fff" : colors.mutedForeground}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? "#fff" : colors.mutedForeground },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
