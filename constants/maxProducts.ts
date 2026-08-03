import { ASSETS, type MaxColorId } from "@/constants/assets";
import type { SignatureThemeId } from "@/constants/brand";

export const MAX_PRODUCT_ID = 4;

const MAX_COLORS = ASSETS.products.max;

export const MAX_COLOR_PRODUCTS = [
  {
    name: "Matcha Green",
    colorLabel: "Green",
    colorId: "green" as const,
    rating: 4.9,
    reviewCount: 2914,
    price: 1990,
    compareAt: 2490 as number | undefined,
    pastel: "#DCEFDA",
    image: MAX_COLORS.primary.green,
    isNew: true,
    promo: true,
  },
  {
    name: "Space Dark",
    colorLabel: "Space Dark",
    colorId: "black" as const,
    rating: 4.8,
    reviewCount: 20859,
    price: 2490,
    compareAt: undefined as number | undefined,
    pastel: "#E4E5EA",
    image: MAX_COLORS.primary.black,
    isNew: false,
    promo: false,
  },
  {
    name: "Blush Pink",
    colorLabel: "Pink",
    colorId: "pink" as const,
    rating: 4.6,
    reviewCount: 15682,
    price: 2490,
    compareAt: undefined as number | undefined,
    pastel: "#F6D6E4",
    image: MAX_COLORS.primary.pink,
    isNew: false,
    promo: false,
  },
  {
    name: "Sky Blue",
    colorLabel: "Sky Blue",
    colorId: "blue" as const,
    rating: 4.4,
    reviewCount: 11347,
    price: 2190,
    compareAt: 2490 as number | undefined,
    pastel: "#D4E9F7",
    image: MAX_COLORS.primary.blue,
    isNew: false,
    promo: true,
  },
] as const;

export type MaxColorProduct = (typeof MAX_COLOR_PRODUCTS)[number];

export function getMaxColorProduct(colorId: string) {
  return (
    MAX_COLOR_PRODUCTS.find((item) => item.colorId === colorId) ??
    MAX_COLOR_PRODUCTS[0]
  );
}

export function getMaxColorImage(colorId: string) {
  return getMaxColorProduct(colorId).image;
}

function maxColorKey(colorId: string): MaxColorId {
  return colorId === "green" ||
    colorId === "black" ||
    colorId === "pink" ||
    colorId === "blue"
    ? colorId
    : "green";
}

export function getMaxColorSecondImage(colorId: string) {
  return MAX_COLORS.views["02"][maxColorKey(colorId)];
}

export function getMaxColorThirdImage(colorId: string) {
  return MAX_COLORS.views["03"][maxColorKey(colorId)];
}

export function getMaxColorFourthImage(colorId: string) {
  return MAX_COLORS.views["04"][maxColorKey(colorId)];
}

export function getMaxColorFifthImage(colorId: string) {
  return MAX_COLORS.views["05"][maxColorKey(colorId)];
}

/** Primary + alternate studio views for the product gallery. */
export function getMaxColorGalleryImages(colorId: string): string[] {
  return [
    getMaxColorImage(colorId),
    getMaxColorSecondImage(colorId),
    getMaxColorThirdImage(colorId),
    getMaxColorFourthImage(colorId),
    getMaxColorFifthImage(colorId),
  ];
}

/** Theme color first; keep relative order of the rest. */
export function getMaxColorProductsForTheme(themeId: SignatureThemeId) {
  const selected = MAX_COLOR_PRODUCTS.find((item) => item.colorId === themeId);
  const rest = MAX_COLOR_PRODUCTS.filter((item) => item.colorId !== themeId);
  return selected ? [selected, ...rest] : [...MAX_COLOR_PRODUCTS];
}

/** What’s included strip — headphones + kit shots follow selected finish. */
export function getIncludedBoxItems(colorId: string) {
  const key = maxColorKey(colorId);
  const kit = ASSETS.marketing.kit;

  return [
    {
      label: "Headphones",
      description: "Premium over-ear sound",
      image: getMaxColorImage(colorId),
    },
    {
      label: "Cases",
      description: "Smart protective case",
      image: kit.cases[key],
    },
    {
      label: "Cables",
      description: "Lightning to USB cable",
      image: kit.cables[key],
    },
    {
      label: "Stands",
      description: "Sleek desk display stand",
      image: kit.stands[key],
    },
    {
      label: "Accessories",
      description: "Soft replacement cushions",
      image: kit.accessories[key],
    },
  ] as const;
}
