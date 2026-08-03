import type { Product } from "@/types/product";
import {
  DEFAULT_PRODUCT_DETAIL,
  PRODUCT_DETAILS,
  type ProductDetail,
  type ProductSpec,
} from "@/constants/products/details";
import { getCatalogEntry } from "./catalog";

function getProductDetail(product: Product): ProductDetail {
  return PRODUCT_DETAILS[product.id] ?? DEFAULT_PRODUCT_DETAIL;
}

function getDisplayDescription(product: Product): string {
  const match = getCatalogEntry(product.id);
  if (match?.description) return match.description;
  const firstSentence = product.description.split(".")[0];
  return firstSentence ? `${firstSentence.trim()}.` : product.description;
}

export function getProductPreviewDescription(product: Product): string {
  return getDisplayDescription(product);
}

export function getProductFullDescription(product: Product): string {
  const detail = getProductDetail(product);
  const featureDetail = detail.highlights
    .slice(0, 4)
    .map((line) => (line.endsWith(".") ? line : `${line}.`))
    .join(" ");
  return `${detail.longDescription} ${featureDetail}`.trim();
}

export function getProductHighlights(product: Product, limit = 3): string[] {
  return getProductDetail(product).highlights.slice(0, limit);
}

export function getProductSpecs(product: Product): ProductSpec[] {
  return getProductDetail(product).specs;
}

export type { ProductSpec, ProductDetail };
