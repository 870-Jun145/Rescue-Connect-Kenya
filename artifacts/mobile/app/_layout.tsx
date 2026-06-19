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
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LaunchScreen } from "@/components/LaunchScreen";
import { useNotifications } from "@/hooks/useNotifications";

// Keep native splash up until we're ready to show our custom one
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

function AppWithNotifications({ onHideNativeSplash }: { onHideNativeSplash: () => void }) {
  const notifications = useNotifications();
  const [showLaunch, setShowLaunch] = useState(true);

  useEffect(() => {
    // Hide native splash so our custom LaunchScreen takes over
    onHideNativeSplash();
  }, []);

  return (
    <NotificationsContext.Provider value={notifications}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <RootLayoutNav />
          {showLaunch && (
            <LaunchScreen
              isReady={true}
              onFinish={() => setShowLaunch(false)}
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
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);

  const hideNativeSplash = useCallback(async () => {
    if (!nativeSplashHidden) {
      await SplashScreen.hideAsync();
      setNativeSplashHidden(true);
    }
  }, [nativeSplashHidden]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppWithNotifications onHideNativeSplash={hideNativeSplash} />
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
