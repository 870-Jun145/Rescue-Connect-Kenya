import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { Contact, ContactCategory } from "@/constants/data";

interface ContactCardProps {
  contact: Contact;
}

const CATEGORY_COLORS: Record<
  ContactCategory,
  { bg: string; fg: string; pill: string; pillText: string }
> = {
  emergency: {
    bg: "#FEF2F2",
    fg: "#DC2626",
    pill: "#DC2626",
    pillText: "#fff",
  },
  hospital: {
    bg: "#EFF6FF",
    fg: "#0369A1",
    pill: "#0369A1",
    pillText: "#fff",
  },
  rescue: {
    bg: "#FFFBEB",
    fg: "#D97706",
    pill: "#D97706",
    pillText: "#fff",
  },
  poison: {
    bg: "#F5F3FF",
    fg: "#7C3AED",
    pill: "#7C3AED",
    pillText: "#fff",
  },
  mental: {
    bg: "#ECFDF5",
    fg: "#059669",
    pill: "#059669",
    pillText: "#fff",
  },
};

const CATEGORY_ICON: Record<ContactCategory, string> = {
  emergency: "alert-circle",
  hospital: "activity",
  rescue: "shield",
  poison: "zap",
  mental: "heart",
};

export function ContactCard({ contact }: ContactCardProps) {
  const colors = useColors();
  const cat = CATEGORY_COLORS[contact.category];

  const handleCall = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const url = `tel:${contact.number.replace(/\D/g, "")}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Call " + contact.name,
        "Dial: " + contact.number,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: cat.bg }]}>
        <Feather name={CATEGORY_ICON[contact.category] as any} size={20} color={cat.fg} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {contact.name}
        </Text>
        <Text style={[styles.number, { color: cat.fg }]}>{contact.number}</Text>
        <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
          {contact.description}
        </Text>
        <View style={styles.meta}>
          <Feather name="clock" size={11} color={colors.mutedForeground} />
          <Text style={[styles.available, { color: colors.mutedForeground }]}>
            {contact.available}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.callBtn, { backgroundColor: cat.fg }]}
        onPress={handleCall}
        activeOpacity={0.8}
        testID={`call-${contact.id}`}
      >
        <Feather name="phone" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  number: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  desc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  available: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
