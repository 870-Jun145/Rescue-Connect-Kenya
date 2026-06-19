import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HospitalCard } from "@/components/HospitalCard";
import { EmergencyCard } from "@/components/EmergencyCard";
import { EMERGENCY_CONTACTS } from "@/constants/emergency";
import { KENYA_HOSPITALS } from "@/constants/kenya-hospitals";
import { HUMANITARIAN_CONTACTS } from "@/constants/humanitarian";
import { useColors } from "@/hooks/useColors";
import { useFavorites, FavoriteItem } from "@/hooks/useFavorites";
import { useNotificationsContext } from "@/app/_layout";

const APP_VERSION = "1.0.0";
const LAST_UPDATED = "June 2025";
const REPORT_EMAIL = "rescueconnectkenya@gmail.com";
const REPORT_WHATSAPP = "254700000000";

type Section = "favorites" | "notifications" | "report" | "disclaimer" | "update";

function FavoriteRow({ item, onRemove }: { item: FavoriteItem; onRemove: () => void }) {
  const colors = useColors();

  const handleCall = () => {
    const url = `tel:${item.number.replace(/\D/g, "")}`;
    Linking.openURL(url).catch(() =>
      Alert.alert(item.name, `Dial: ${item.number}`, [{ text: "OK" }])
    );
  };

  return (
    <View style={[styles.favRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.favInfo}>
        <Text style={[styles.favName, { color: colors.foreground }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.favNumber, { color: colors.primary }]}>{item.number}</Text>
        {item.county && (
          <Text style={[styles.favMeta, { color: colors.mutedForeground }]}>{item.county} County</Text>
        )}
      </View>
      <View style={styles.favActions}>
        <TouchableOpacity
          style={[styles.favCallBtn, { backgroundColor: "#C8102E" }]}
          onPress={handleCall}
        >
          <Feather name="phone" size={14} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="trash-2" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 0 : insets.top;
  const { favorites, removeFavorite } = useFavorites();
  const { status, expoPushToken, registerForPushNotifications, sendLocalNotification } =
    useNotificationsContext();
  const [activeSection, setActiveSection] = useState<Section | null>(null);

  const openEmail = () => {
    Linking.openURL(
      `mailto:${REPORT_EMAIL}?subject=Rescue Connect Kenya - Report Inaccuracy&body=Hospital/Contact name:%0ACorrect information:%0AYour name (optional):`
    );
  };

  const openWhatsApp = () => {
    Linking.openURL(
      `https://wa.me/${REPORT_WHATSAPP}?text=Hi%2C%20I%20want%20to%20report%20an%20inaccuracy%20in%20Rescue%20Connect%20Kenya%3A`
    ).catch(() => Alert.alert("WhatsApp not installed", "Please email us instead."));
  };

  const MENU_ITEMS: Array<{ key: Section; icon: string; label: string; count?: number; color: string }> = [
    { key: "favorites", icon: "star", label: "Saved Favorites", count: favorites.length, color: "#F59E0B" },
    { key: "notifications", icon: "bell", label: "Push Notifications", color: "#C8102E" },
    { key: "report", icon: "flag", label: "Report Inaccuracy", color: "#7C3AED" },
    { key: "disclaimer", icon: "info", label: "Disclaimer", color: "#0369A1" },
    { key: "update", icon: "refresh-cw", label: "App Updates & Version", color: "#16A34A" },
  ];

  const topInsetVal = Platform.OS === "web" ? 0 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInsetVal + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>More</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Favorites · Report · Disclaimer · Updates
        </Text>
      </View>

      {/* Menu */}
      <View style={{ gap: 8, paddingHorizontal: 16, marginBottom: 12 }}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.menuItem,
              {
                backgroundColor: activeSection === item.key ? item.color : colors.card,
                borderColor: activeSection === item.key ? item.color : colors.border,
              },
            ]}
            onPress={() => setActiveSection(activeSection === item.key ? null : item.key)}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIcon, { backgroundColor: activeSection === item.key ? "rgba(255,255,255,0.2)" : colors.muted }]}>
              <Feather name={item.icon as any} size={18} color={activeSection === item.key ? "#fff" : item.color} />
            </View>
            <Text style={[styles.menuLabel, { color: activeSection === item.key ? "#fff" : colors.foreground }]}>
              {item.label}
            </Text>
            {item.count !== undefined && (
              <View style={[styles.badge, { backgroundColor: item.color }]}>
                <Text style={styles.badgeText}>{item.count}</Text>
              </View>
            )}
            <Feather
              name={activeSection === item.key ? "chevron-up" : "chevron-down"}
              size={16}
              color={activeSection === item.key ? "#fff" : colors.mutedForeground}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* === FAVORITES === */}
      {activeSection === "favorites" && (
        <View style={styles.expandedSection}>
          {favorites.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.muted }]}>
              <Feather name="star" size={28} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.foreground }]}>No saved favorites yet</Text>
              <Text style={[styles.emptySubtext, { color: colors.mutedForeground }]}>
                Tap the ★ icon on any contact or hospital to save it here
              </Text>
            </View>
          ) : (
            <View style={{ gap: 10, paddingHorizontal: 16 }}>
              {favorites.map((fav) => (
                <FavoriteRow key={fav.id} item={fav} onRemove={() => removeFavorite(fav.id)} />
              ))}
            </View>
          )}
        </View>
      )}

      {/* === NOTIFICATIONS === */}
      {activeSection === "notifications" && (
        <View style={[styles.expandedSection, { paddingHorizontal: 16 }]}>
          <View style={[styles.infoBox, { backgroundColor: "#FEF2F2", borderColor: "#FECACA" }]}>
            <Text style={[styles.infoTitle, { color: "#991B1B" }]}>🔔 Emergency Push Alerts</Text>
            <Text style={[styles.infoText, { color: "#7F1D1D" }]}>
              Receive instant push notifications for emergency alerts, new verified contacts, and critical updates across your county.
            </Text>
          </View>

          {/* Status card */}
          <View style={[styles.notifStatusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.notifStatusRow}>
              <View
                style={[
                  styles.notifStatusDot,
                  {
                    backgroundColor:
                      status === "granted"
                        ? "#16A34A"
                        : status === "denied"
                        ? "#C8102E"
                        : status === "unsupported"
                        ? "#94A3B8"
                        : "#F59E0B",
                  },
                ]}
              />
              <Text style={[styles.notifStatusLabel, { color: colors.foreground }]}>
                {status === "granted"
                  ? "Notifications enabled"
                  : status === "denied"
                  ? "Notifications blocked"
                  : status === "unsupported"
                  ? "Not supported on this device"
                  : status === "loading"
                  ? "Requesting permission..."
                  : "Notifications not yet enabled"}
              </Text>
            </View>
            {expoPushToken && (
              <Text style={[styles.notifToken, { color: colors.mutedForeground }]} numberOfLines={2}>
                Token: {expoPushToken}
              </Text>
            )}
          </View>

          {status !== "granted" && status !== "unsupported" && (
            <TouchableOpacity
              style={[styles.reportBtn, { backgroundColor: "#C8102E" }]}
              onPress={registerForPushNotifications}
              activeOpacity={0.8}
            >
              <Feather name="bell" size={18} color="#fff" />
              <View>
                <Text style={styles.reportBtnTitle}>Enable Notifications</Text>
                <Text style={styles.reportBtnSub}>Get instant emergency alerts</Text>
              </View>
            </TouchableOpacity>
          )}

          {status === "granted" && (
            <TouchableOpacity
              style={[styles.reportBtn, { backgroundColor: "#16A34A" }]}
              onPress={() =>
                sendLocalNotification(
                  "🚨 Test Alert — Rescue Connect Kenya",
                  "Push notifications are working! You will receive emergency alerts and contact updates.",
                  "emergency-alerts"
                )
              }
              activeOpacity={0.8}
            >
              <Feather name="send" size={18} color="#fff" />
              <View>
                <Text style={styles.reportBtnTitle}>Send Test Notification</Text>
                <Text style={styles.reportBtnSub}>Confirm alerts are working</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* What you'll receive */}
          <View style={[styles.infoBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>What you'll receive:</Text>
            {[
              "🚨 Emergency alerts broadcast by county authorities",
              "🏥 Newly verified hospital contacts added to the database",
              "📱 App updates with corrected or added contacts",
              "⚠️ Service disruption alerts (e.g. hospital emergencies)",
            ].map((item, i) => (
              <Text key={i} style={[styles.infoText, { color: colors.mutedForeground }]}>
                {item}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* === REPORT === */}
      {activeSection === "report" && (
        <View style={[styles.expandedSection, { paddingHorizontal: 16 }]}>
          <View style={[styles.infoBox, { backgroundColor: "#FEF2F2", borderColor: "#FECACA" }]}>
            <Text style={[styles.infoTitle, { color: "#991B1B" }]}>📣 Report Inaccurate Information</Text>
            <Text style={[styles.infoText, { color: "#7F1D1D" }]}>
              We strive to maintain accurate, verified emergency contacts. If you discover an incorrect phone number, wrong location, or outdated information, please report it immediately.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.reportBtn, { backgroundColor: "#C8102E" }]}
            onPress={openEmail}
            activeOpacity={0.8}
          >
            <Feather name="mail" size={18} color="#fff" />
            <View>
              <Text style={styles.reportBtnTitle}>Report via Email</Text>
              <Text style={styles.reportBtnSub}>{REPORT_EMAIL}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reportBtn, { backgroundColor: "#16A34A" }]}
            onPress={openWhatsApp}
            activeOpacity={0.8}
          >
            <Feather name="message-circle" size={18} color="#fff" />
            <View>
              <Text style={styles.reportBtnTitle}>Report via WhatsApp</Text>
              <Text style={styles.reportBtnSub}>Chat with our verification team</Text>
            </View>
          </TouchableOpacity>
          <Text style={[styles.reportNote, { color: colors.mutedForeground }]}>
            Contacts with the "Unverified" tag are pending confirmation. Your report helps us serve Kenyans better.
          </Text>
        </View>
      )}

      {/* === DISCLAIMER === */}
      {activeSection === "disclaimer" && (
        <View style={[styles.expandedSection, { paddingHorizontal: 16 }]}>
          <View style={[styles.infoBox, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}>
            <Text style={[styles.infoTitle, { color: "#1E40AF" }]}>⚖️ Disclaimer</Text>
            <Text style={[styles.infoText, { color: "#1E3A8A" }]}>
              Rescue Connect Kenya is provided for public safety and emergency information purposes only.
            </Text>
          </View>
          {[
            {
              title: "Accuracy of Information",
              text: "While we strive to provide accurate and up-to-date contact information, we cannot guarantee that all contacts are current. Hospital numbers, operational hours, and services may change without notice. Always use 999 or 112 first in a life-threatening emergency.",
            },
            {
              title: "No Medical Advice",
              text: "This app does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.",
            },
            {
              title: "Verified vs Unverified Contacts",
              text: "Contacts marked 'Unverified' have not been independently confirmed by our team. Use them with caution and report any inaccuracies.",
            },
            {
              title: "Emergency First",
              text: "In any life-threatening situation, call 999 or 112 immediately. These lines work on all networks — including when you have no airtime.",
            },
            {
              title: "Liability",
              text: "Rescue Connect Kenya and its developers are not liable for any harm arising from reliance on information in this app. This app is an informational tool, not a substitute for official emergency services.",
            },
          ].map((item, i) => (
            <View key={i} style={[styles.disclaimerItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.disclaimerTitle, { color: colors.foreground }]}>{item.title}</Text>
              <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>{item.text}</Text>
            </View>
          ))}
        </View>
      )}

      {/* === UPDATE === */}
      {activeSection === "update" && (
        <View style={[styles.expandedSection, { paddingHorizontal: 16 }]}>
          <View style={[styles.infoBox, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]}>
            <Text style={[styles.infoTitle, { color: "#065F46" }]}>🔄 App Version & Updates</Text>
            <Text style={[styles.infoText, { color: "#047857" }]}>
              Rescue Connect Kenya is updated regularly with verified contacts from hospitals, government agencies, and humanitarian organizations.
            </Text>
          </View>

          {[
            { label: "App Version", value: APP_VERSION },
            { label: "Data Last Updated", value: LAST_UPDATED },
            { label: "Hospitals Listed", value: `${KENYA_HOSPITALS.length}+` },
            { label: "Emergency Contacts", value: `${EMERGENCY_CONTACTS.length}` },
            { label: "Humanitarian Orgs", value: `${HUMANITARIAN_CONTACTS.length}` },
            { label: "Counties Covered", value: "All 47 Counties" },
          ].map((item, i) => (
            <View key={i} style={[styles.versionRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.versionLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
              <Text style={[styles.versionValue, { color: colors.foreground }]}>{item.value}</Text>
            </View>
          ))}

          <View style={[styles.infoBox, { backgroundColor: colors.muted, borderColor: colors.border, marginTop: 8 }]}>
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Updates are pushed automatically through the app store. To request an update or submit a new contact, email {REPORT_EMAIL} or use the Report feature above.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16, gap: 4 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  menuIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold" },
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: "#fff", fontSize: 12, fontFamily: "Inter_700Bold" },
  expandedSection: { marginBottom: 16, gap: 10 },
  // Favorites
  favRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  favInfo: { flex: 1, gap: 2 },
  favName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  favNumber: { fontSize: 17, fontFamily: "Inter_700Bold" },
  favMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  favActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  favCallBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  emptyBox: { alignItems: "center", padding: 32, borderRadius: 14, gap: 8, marginHorizontal: 16 },
  emptyText: { fontSize: 16, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  emptySubtext: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  // Report
  infoBox: { borderRadius: 12, padding: 14, borderWidth: 1, gap: 8 },
  infoTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
  },
  reportBtnTitle: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  reportBtnSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Inter_400Regular" },
  reportNote: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, textAlign: "center" },
  // Disclaimer
  disclaimerItem: { borderRadius: 12, padding: 14, borderWidth: 1, gap: 6 },
  disclaimerTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  disclaimerText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  // Notifications
  notifStatusCard: { borderRadius: 12, padding: 14, borderWidth: 1, gap: 6 },
  notifStatusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  notifStatusDot: { width: 10, height: 10, borderRadius: 5 },
  notifStatusLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  notifToken: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 16 },
  // Update
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  versionLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  versionValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
