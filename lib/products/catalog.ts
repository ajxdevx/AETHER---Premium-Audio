import { PRODUCT_CATALOG } from "@/constants/products/catalog";

export function getCatalogEntry(productId: number) {
  return PRODUCT_CATALOG.find((entry) => entry.apiId === productId);
}

export function getDiscountPercent(
  price: number,
  compareAt?: number
): number | undefined {
  if (!compareAt || compareAt <= price) return undefined;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function getAllCatalogIds(): number[] {
  return PRODUCT_CATALOG.map((entry) => entry.apiId);
}
