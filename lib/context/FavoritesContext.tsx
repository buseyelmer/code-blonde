"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/data";

type FavoritesContextValue = {
  favorites: Product[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
};

const STORAGE_KEY = "code-blonde-favorites";

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readFavorites(): Product[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item && typeof item.id === "string");
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setFavorites(readFavorites());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites, isReady]);

  const isFavorite = useCallback(
    (productId: string) => favorites.some((item) => item.id === productId),
    [favorites],
  );

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === product.id);

      if (exists) {
        return current.filter((item) => item.id !== product.id);
      }

      return [...current, product];
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((current) => current.filter((item) => item.id !== productId));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites yalnızca FavoritesProvider içinde kullanılabilir.",
    );
  }

  return context;
}
