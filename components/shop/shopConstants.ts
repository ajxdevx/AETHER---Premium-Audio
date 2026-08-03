import { Lock, RotateCcw, Shield, Truck } from "@/lib/icons";

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

export const SERVICE_ITEMS = [
  { label: "Free Shipping", hint: "On every order", icon: Truck },
  { label: "30-Day Returns", hint: "Easy full refund", icon: RotateCcw },
  { label: "2-Year Warranty", hint: "Full coverage included", icon: Shield },
  { label: "Secure Payments", hint: "Safe encrypted checkout", icon: Lock },
] as const;

export const FILTER_SECTIONS = ["Color", "Price", "Favourite"] as const;

/** Same flat swatches as Hero signature colors */
export const FILTER_COLOR_SWATCHES: Record<string, string> = {
  pink: "#F7C4D8",
  blue: "#B8DDF5",
  black: "#1A1A1A",
  green: "#9CB87A",
};

export const PRICE_SLIDER_MIN = 0;
export const PRICE_SLIDER_MAX = 5000;
export const PRICE_SLIDER_STEP = 50;

/** Shop panels use the shared card radius. */
export { CARD_RADIUS as PANEL_RADIUS } from "@/lib/buttonStyles";
