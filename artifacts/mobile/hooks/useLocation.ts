import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";

export type UserLocation = {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
};

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const stopWatching = useCallback(() => {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
  }, []);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Check existing permission first (no prompt if already denied)
      const { status: existing } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(existing);

      let status = existing;
      if (status !== "granted") {
        const result = await Location.requestForegroundPermissionsAsync();
        status = result.status;
        setPermissionStatus(status);
      }

      if (status !== "granted") {
        setError("Location permission denied. Please enable it in Settings.");
        setLoading(false);
        return;
      }

      // 2. Check if location services are enabled on the device
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setError("Location services are disabled. Please turn them on in Settings.");
        setLoading(false);
        return;
      }

      // 3. Get a fast initial fix first (Balanced), then upgrade to High
      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 0,
        distanceInterval: 0,
      });
      setLocation({
        lat: initial.coords.latitude,
        lng: initial.coords.longitude,
        accuracy: initial.coords.accuracy ?? undefined,
        heading: initial.coords.heading ?? undefined,
        speed: initial.coords.speed ?? undefined,
        timestamp: initial.timestamp,
      });
      setLoading(false);

      // 4. Start a high-accuracy position watch for ongoing refinement
      stopWatching();
      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,   // update at most every 10 s
          distanceInterval: 20,  // or when moved 20 m
        },
        (loc) => {
          setLocation({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            accuracy: loc.coords.accuracy ?? undefined,
            heading: loc.coords.heading ?? undefined,
            speed: loc.coords.speed ?? undefined,
            timestamp: loc.timestamp,
          });
        }
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Unable to determine your location.";
      setError(msg);
      setLoading(false);
    }
  }, [stopWatching]);

  // Auto-start on mount; clean up watcher on unmount
  useEffect(() => {
    requestLocation();
    return () => stopWatching();
  }, []);

  return { location, error, loading, permissionStatus, requestLocation };
}

/**
 * Haversine great-circle distance between two GPS coordinates.
 * Returns distance in kilometres.
 */
export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Format distance for display.
 * < 1 km → "450 m", ≥ 1 km → "3.2 km"
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
