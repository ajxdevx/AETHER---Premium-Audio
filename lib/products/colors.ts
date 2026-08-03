import { PRODUCT_COLORS } from "@/constants/brand";

export type ProductColorId = (typeof PRODUCT_COLORS)[number]["id"];

export function getProductColorById(id: string) {
  return PRODUCT_COLORS.find((c) => c.id === id) ?? PRODUCT_COLORS[0];
}

export function getProductColorName(id: string): string {
  return getProductColorById(id).name;
}

export function isValidProductColorId(
  id: string | null | undefined
): id is ProductColorId {
  return !!id && PRODUCT_COLORS.some((color) => color.id === id);
}

export function resolveProductColorId(id: string | null | undefined): ProductColorId {
  return isValidProductColorId(id) ? id : PRODUCT_COLORS[0].id;
}
