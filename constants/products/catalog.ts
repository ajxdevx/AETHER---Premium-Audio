export type ProductBadgeType = "best-seller" | "promo";

export const PRODUCT_CATALOG = [
  {
    apiId: 4,
    slug: "max",
    name: "AETHER Max",
    type: "premium large over-ear headphones",
    category: "Premium Over-Ear",
    description: "Studio-grade audio in a premium build.",
    price: 2490,
    rating: 4.7,
    reviewCount: 156,
    badges: ["best-seller"] as const,
    compareAtPrice: 2990,
  },
] as const;

export type ProductSlug = (typeof PRODUCT_CATALOG)[number]["slug"];
