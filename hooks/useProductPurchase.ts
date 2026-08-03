"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import type { MaxColorProduct } from "@/lib/products";
import { getCartLineKey, type Product } from "@/types/product";

export function useProductPurchase(
  product: Product | undefined,
  colorId: string,
  colorProduct: MaxColorProduct
) {
  const router = useRouter();
  const { addItem, items } = useCart();
  const [quantityState, setQuantityState] = useState({ colorId, value: 1 });
  const quantity = quantityState.colorId === colorId ? quantityState.value : 1;
  const setQuantity = (value: number | ((current: number) => number)) => {
    setQuantityState((current) => {
      const currentValue = current.colorId === colorId ? current.value : 1;
      return {
        colorId,
        value: typeof value === "function" ? value(currentValue) : value,
      };
    });
  };
  const existingCartQuantity = product
    ? items.find(
        (item) => item.lineKey === getCartLineKey(product.id, colorId)
      )?.quantity ?? 0
    : 0;
  const remainingStock = product
    ? Math.max(product.stock - existingCartQuantity, 0)
    : 0;
  const canAddToCart =
    Boolean(product && product.stock > 0) &&
    remainingStock > 0 &&
    Math.min(quantity, Math.max(remainingStock, 1)) <= remainingStock;
  const cartOptions = {
    quantity,
    variant: colorId,
    displayTitle: colorProduct.name,
    displayPrice: colorProduct.price,
    displayThumbnail: colorProduct.image,
  };
  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, {
      ...cartOptions,
      quantity: Math.min(quantity, Math.max(remainingStock, 1)),
    });
  };
  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, {
      ...cartOptions,
      quantity: Math.min(quantity, Math.max(remainingStock, 1)),
      showToast: false,
    });
    router.push("/checkout");
  };

  return {
    quantity,
    setQuantity,
    remainingStock,
    canAddToCart,
    handleAddToCart,
    handleBuyNow,
  };
}
