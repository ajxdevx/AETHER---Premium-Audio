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
import type { Product } from "@/types/product";
import {
  cartReducer,
  getCartTotals,
  loadCart,
  saveCart,
} from "@/store/cart";
import { preloadImage } from "@/lib/preloadImage";
import { useToast, resolveToastTheme } from "@/providers/ToastProvider";

interface AddItemOptions {
  quantity?: number;
  variant?: string;
  displayTitle?: string;
  displayPrice?: number;
  displayThumbnail?: string;
  showToast?: boolean;
}

interface CartContextValue {
  items: ReturnType<typeof loadCart>;
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  isHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, options?: AddItemOptions | number) => void;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    dispatch({ type: "HYDRATE", items: loadCart() });
    const frame = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isHydrated) saveCart(items);
  }, [items, isHydrated]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.classList.add("cart-open");

    return () => {
      document.body.classList.remove("cart-open");
    };
  }, [isOpen]);

  const { itemCount, subtotal } = useMemo(
    () => getCartTotals(items),
    [items]
  );

  const addItem = useCallback((product: Product, options?: AddItemOptions | number) => {
    const opts = typeof options === "number" ? { quantity: options } : options;
    if (opts?.displayThumbnail) preloadImage(opts.displayThumbnail);
    dispatch({
      type: "ADD",
      product,
      quantity: opts?.quantity ?? 1,
      variant: opts?.variant,
      displayTitle: opts?.displayTitle,
      displayPrice: opts?.displayPrice,
      displayThumbnail: opts?.displayThumbnail,
    });

    if (opts?.showToast !== false) {
      const title = opts?.displayTitle ?? product.title;
      const theme = resolveToastTheme(opts?.variant);
      const colorLabel = theme.label ?? opts?.variant?.trim();
      const image = opts?.displayThumbnail ?? product.thumbnail;
      const message = colorLabel
        ? `Added ${title} in ${colorLabel} to cart`
        : `Added ${title} to cart`;

      showToast({
        message,
        title,
        color: colorLabel,
        image,
        bg: theme.bg,
        accent: theme.accent,
        imageBg: theme.imageBg,
        action: {
          label: "View cart",
          onClick: () => setIsOpen(true),
        },
      });
    }
  }, [showToast]);

  const removeItem = useCallback((lineKey: string) => {
    dispatch({ type: "REMOVE", lineKey });
  }, []);

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", lineKey, quantity });
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      isOpen,
      isHydrated,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      clearCart: () => dispatch({ type: "CLEAR" }),
    }),
    [items, itemCount, subtotal, isOpen, isHydrated, addItem, removeItem, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
