"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  getWishlistKey,
  loadWishlist,
  saveWishlist,
  wishlistReducer,
  type WishlistItem,
} from "@/store/wishlist";

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isHydrated: boolean;
  isFavorite: (productId: number, colorId: string) => boolean;
  toggleFavorite: (item: Omit<WishlistItem, "key">) => void;
  removeFavorite: (key: string) => void;
  clearFavorites: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(wishlistReducer, []);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    dispatch({ type: "HYDRATE", items: loadWishlist() });
    const frame = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isHydrated) saveWishlist(items);
  }, [items, isHydrated]);

  const isFavorite = useCallback(
    (productId: number, colorId: string) =>
      items.some((item) => item.key === getWishlistKey(productId, colorId)),
    [items]
  );

  const toggleFavorite = useCallback((item: Omit<WishlistItem, "key">) => {
    dispatch({
      type: "TOGGLE",
      item: {
        ...item,
        key: getWishlistKey(item.productId, item.colorId),
      },
    });
  }, []);

  const removeFavorite = useCallback((key: string) => {
    dispatch({ type: "REMOVE", key });
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isHydrated,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites: () => dispatch({ type: "CLEAR" }),
    }),
    [items, isHydrated, isFavorite, toggleFavorite, removeFavorite]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
