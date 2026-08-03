import { PRODUCT_CATALOG } from "@/constants/products/catalog";
import {
  DEFAULT_PRODUCT_DETAIL,
  PRODUCT_DETAILS,
} from "@/constants/products/details";
import { getMaxColorImage } from "./max";
import { getDiscountPercent } from "./catalog";
import type { Product } from "@/types/product";

export function applyCatalogToProduct(apiProduct: Product): Product {
  const entry = PRODUCT_CATALOG.find((product) => product.apiId === apiProduct.id);
  if (!entry) return apiProduct;

  const detail = PRODUCT_DETAILS[apiProduct.id] ?? DEFAULT_PRODUCT_DETAIL;
  const compareAt = "compareAtPrice" in entry ? entry.compareAtPrice : undefined;
  const image = getMaxColorImage("black");

  return {
    ...apiProduct,
    title: entry.name,
    description: entry.description,
    category: entry.category.toLowerCase().replace(/\s+/g, "-"),
    price: entry.price,
    discountPercentage: getDiscountPercent(entry.price, compareAt) ?? 0,
    rating: entry.rating,
    tags: [entry.category, entry.type],
    brand: "AETHER",
    sku: `AETHER-${entry.slug.toUpperCase()}`,
    warrantyInformation: "2 year limited warranty",
    shippingInformation: detail.shipping,
    returnPolicy: detail.returns,
    availabilityStatus: "In Stock",
    reviews: [],
    images: [image],
    thumbnail: image,
  };
}
