"use client";

export interface WishlistItem {
  key: string;
  productId: number;
  title: string;
  colorLabel: string;
  colorId: string;
  price: number;
  image: string;
  href: string;
  pastel?: string;
}

export type WishlistAction =
  | { type: "TOGGLE"; item: WishlistItem }
  | { type: "REMOVE"; key: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: WishlistItem[] };

const WISHLIST_KEY = "aether-wishlist";

export function getWishlistKey(productId: number, colorId: string) {
  return `${productId}:${colorId}`;
}

export function wishlistReducer(
  state: WishlistItem[],
  action: WishlistAction
): WishlistItem[] {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.some((item) => item.key === action.item.key);
      if (exists) return state.filter((item) => item.key !== action.item.key);
      return [action.item, ...state];
    }
    case "REMOVE":
      return state.filter((item) => item.key !== action.key);
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.items;
    default:
      return state;
  }
}

export function loadWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}
