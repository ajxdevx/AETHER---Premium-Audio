import type { CartItem, Product } from "@/types/product";
import { getCartLineKey } from "@/types/product";

const CART_KEY = "aether-cart";

export type CartAction =
  | {
      type: "ADD";
      product: Product;
      quantity?: number;
      variant?: string;
      displayTitle?: string;
      displayPrice?: number;
      displayThumbnail?: string;
    }
  | { type: "REMOVE"; lineKey: string }
  | { type: "UPDATE_QUANTITY"; lineKey: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function normalizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    lineKey: item.lineKey ?? getCartLineKey(item.id, item.variant),
  };
}

function clampQuantity(quantity: number, stock?: number): number {
  const max = stock && stock > 0 ? stock : 99;
  return Math.max(1, Math.min(quantity, max));
}

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const qty = action.quantity ?? 1;
      const lineKey = getCartLineKey(action.product.id, action.variant);
      const stock = action.product.stock;
      const existing = state.find((i) => i.lineKey === lineKey);
      if (existing) {
        return state.map((i) =>
          i.lineKey === lineKey
            ? {
                ...i,
                quantity: clampQuantity(i.quantity + qty, i.stock ?? stock),
                thumbnail: action.displayThumbnail ?? i.thumbnail,
                variant: action.variant ?? i.variant,
                stock: i.stock ?? stock,
              }
            : i
        );
      }
      return [
        ...state,
        {
          id: action.product.id,
          lineKey,
          title: action.displayTitle ?? action.product.title,
          price: action.displayPrice ?? action.product.price,
          thumbnail: action.displayThumbnail ?? action.product.thumbnail,
          quantity: clampQuantity(qty, stock),
          variant: action.variant,
          stock,
        },
      ];
    }
    case "REMOVE":
      return state.filter((i) => i.lineKey !== action.lineKey);
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return state.filter((i) => i.lineKey !== action.lineKey);
      }
      return state.map((i) =>
        i.lineKey === action.lineKey
          ? { ...i, quantity: clampQuantity(action.quantity, i.stock) }
          : i
      );
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.items.map(normalizeCartItem);
    default:
      return state;
  }
}

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    const items = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return items.map(normalizeCartItem);
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function getCartTotals(items: CartItem[]) {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return { itemCount, subtotal };
}
