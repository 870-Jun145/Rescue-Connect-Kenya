import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const FAVORITES_KEY = "@rescue_connect_kenya_favorites";

export type FavoriteItem = {
  id: string;
  type: "emergency" | "hospital" | "humanitarian";
  name: string;
  number: string;
  county?: string;
  description?: string;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then((data) => {
        if (data) setFavorites(JSON.parse(data));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const persist = useCallback(async (items: FavoriteItem[]) => {
    setFavorites(items);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  }, []);

  const addFavorite = useCallback(
    async (item: FavoriteItem) => {
      const updated = [...favorites.filter((f) => f.id !== item.id), item];
      await persist(updated);
    },
    [favorites, persist]
  );

  const removeFavorite = useCallback(
    async (id: string) => {
      const updated = favorites.filter((f) => f.id !== id);
      await persist(updated);
    },
    [favorites, persist]
  );

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (item: FavoriteItem) => {
      if (isFavorite(item.id)) {
        await removeFavorite(item.id);
      } else {
        await addFavorite(item);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return { favorites, loaded, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
