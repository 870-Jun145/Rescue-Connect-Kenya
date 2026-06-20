import * as Updates from "expo-updates";
import { useCallback, useEffect, useRef, useState } from "react";

const CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

export function useAppUpdate() {
  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkForUpdate = useCallback(async () => {
    // Skip in dev mode — expo-updates is not active in Expo Go / dev server
    if (__DEV__) return;

    try {
      setIsChecking(true);
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        await Updates.fetchUpdateAsync();
        setIsUpdateReady(true);
      }
    } catch {
      // Silently ignore — update server may not be configured yet
    } finally {
      setIsChecking(false);
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    try {
      await Updates.reloadAsync();
    } catch {
      // If reload fails, app will try again on next launch
    }
  }, []);

  useEffect(() => {
    // Initial check on mount
    checkForUpdate();

    // Periodic check every 30 min
    intervalRef.current = setInterval(checkForUpdate, CHECK_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkForUpdate]);

  return { isUpdateReady, isChecking, applyUpdate, checkForUpdate };
}
