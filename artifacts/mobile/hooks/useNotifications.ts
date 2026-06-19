import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type PushStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [status, setStatus] = useState<PushStatus>("idle");
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null);

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const registerForPushNotifications = useCallback(async () => {
    if (Platform.OS === "web") {
      setStatus("unsupported");
      return null;
    }

    if (!Device.isDevice) {
      setStatus("unsupported");
      return null;
    }

    setStatus("loading");

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      finalStatus = newStatus;
    }

    if (finalStatus !== "granted") {
      setStatus("denied");
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("emergency-alerts", {
        name: "Emergency Alerts",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#C8102E",
        sound: "default",
        enableVibrate: true,
        showBadge: true,
      });
      await Notifications.setNotificationChannelAsync("updates", {
        name: "App Updates",
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: "default",
      });
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "rescue-connect-kenya",
      });
      setExpoPushToken(tokenData.data);
      setStatus("granted");
      return tokenData.data;
    } catch {
      // On simulators / web fallback
      setStatus("granted");
      return null;
    }
  }, []);

  useEffect(() => {
    registerForPushNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setLastNotification(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (_response) => {
        // Handle tap on notification — navigate if needed
      }
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [registerForPushNotifications]);

  const sendLocalNotification = useCallback(
    async (title: string, body: string, channel = "emergency-alerts") => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          color: "#C8102E",
          ...(Platform.OS === "android" ? { channelId: channel } : {}),
        },
        trigger: null,
      });
    },
    []
  );

  return {
    expoPushToken,
    status,
    lastNotification,
    registerForPushNotifications,
    sendLocalNotification,
  };
}
