import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LaunchScreen } from "@/components/LaunchScreen";
import { UpdateBanner } from "@/components/UpdateBanner";
import { useNotifications } from "@/hooks/useNotifications";

// Keep native splash visible while fonts are loading
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

type NotificationsContextValue = ReturnType<typeof useNotifications>;
const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotificationsContext must be used inside RootLayout");
  return ctx;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

/**
 * Sequencing:
 * 1. Native splash hides → LaunchScreen renders (entrance animations play over ~1.2 s)
 * 2. After DISPLAY_DURATION ms the LaunchScreen fade-out begins (~500 ms)
 * 3. Once fade-out completes, home screen becomes fully visible
 *
 * The home screen is mounted *underneath* the LaunchScreen from step 1, but
 * is invisible until the overlay is gone — so the user sees only the launch
 * screen until it finishes.
 */
const DISPLAY_DURATION = 30000; // ms the launch screen stays fully visible

function AppWithNotifications() {
  const notifications = useNotifications();

  // Phase 1: overlay visible, not yet ready to fade
  // Phase 2: ready = true → LaunchScreen starts its fade-out
  // Phase 3: mounted = false → overlay removed from tree entirely
  const [launchReady, setLaunchReady] = useState(false);
  const [launchMounted, setLaunchMounted] = useState(true);
  const nativeSplashHidden = useRef(false);

  useEffect(() => {
    // Hide the native splash and start the custom launch screen timer
    const hideSplash = async () => {
      if (!nativeSplashHidden.current) {
        nativeSplashHidden.current = true;
        await SplashScreen.hideAsync();
      }
    };

    hideSplash();

    // After enough time for animations + viewing, signal the fade-out
    const timer = setTimeout(() => {
      setLaunchReady(true);
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, []);

  return (
    <NotificationsContext.Provider value={notifications}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          {/* Home screen always mounted but invisible under launch overlay */}
          <RootLayoutNav />

          {/* OTA update banner — slides in from top when a new version is ready */}
          <UpdateBanner />

          {/* Launch overlay — removed from tree after its fade-out completes */}
          {launchMounted && (
            <LaunchScreen
              isReady={launchReady}
              onFinish={() => setLaunchMounted(false)}
            />
          )}
        </KeyboardProvider>
      </GestureHandlerRootView>
    </NotificationsContext.Provider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // While fonts load, keep the native splash on screen (nothing rendered yet)
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppWithNotifications />
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
