export const BRAND = {
  name: "AETHER",
  tagline: "Feel Every Beat. Live Every Moment.",
  heroSubtext:
    "Stunning high-fidelity audio, all-day comfort, and iconic style.",
  description:
    "AETHER Pro Pods are premium over-ear headphones with immersive sound, signature finishes, and everyday comfort — Matcha Green, Space Dark, Blush Pink, and Sky Blue.",
} as const;

/** Brand Matcha Green — accents, hovers, badges (replaces olive). */
export const MATCHA = {
  accent: "#6B9B45",
  accentRgb: "107, 155, 69",
  soft: "#DCEFDA",
  mist: "#E8F2DE",
  border: "#C5D6B5",
  swatch: "#9CB87A",
} as const;

export type SignatureThemeId = "green" | "pink" | "blue" | "black";

/** Site-wide accent themes — switched from Signature Colors. */
export const SIGNATURE_THEMES: Record<
  SignatureThemeId,
  {
    id: SignatureThemeId;
    label: string;
    accent: string;
    accentRgb: string;
    soft: string;
    mist: string;
    border: string;
    swatch: string;
  }
> = {
  green: {
    id: "green",
    label: "Matcha Green",
    accent: MATCHA.accent,
    accentRgb: MATCHA.accentRgb,
    soft: MATCHA.soft,
    mist: MATCHA.mist,
    border: MATCHA.border,
    swatch: MATCHA.swatch,
  },
  pink: {
    id: "pink",
    label: "Blush Pink",
    accent: "#C47A94",
    accentRgb: "196, 122, 148",
    soft: "#F6D6E4",
    mist: "#FBEAF1",
    border: "#E8B8CB",
    swatch: "#F7C4D8",
  },
  blue: {
    id: "blue",
    label: "Sky Blue",
    accent: "#4A90B8",
    accentRgb: "74, 144, 184",
    soft: "#D4E9F7",
    mist: "#E8F4FB",
    border: "#A8D0E8",
    swatch: "#B8DDF5",
  },
  black: {
    id: "black",
    label: "Space Dark",
    accent: "#4A4A4F",
    accentRgb: "74, 74, 79",
    soft: "#E4E5EA",
    mist: "#F0F0F2",
    border: "#C8C9CE",
    swatch: "#1A1A1A",
  },
};

export const DEFAULT_SIGNATURE_THEME: SignatureThemeId = "green";

/** Four AETHER Max finishes — the only products in the catalog. */
export const PRODUCT_COLORS = [
  {
    id: "green",
    name: "Matcha Green",
    hex: MATCHA.swatch,
    rating: 4.9,
    badge: "New",
    highlights: ["Fresh matcha finish", "Limited seasonal colorway"],
  },
  {
    id: "black",
    name: "Space Dark",
    hex: "#1A1A1A",
    rating: 4.8,
    badge: "Most popular",
    highlights: ["Premium space dark finish", "Hides everyday wear"],
  },
  {
    id: "pink",
    name: "Blush Pink",
    hex: "#F7C4D8",
    rating: 4.6,
    highlights: ["Soft blush pink finish", "Playful premium accent"],
  },
  {
    id: "blue",
    name: "Sky Blue",
    hex: "#B8DDF5",
    rating: 4.4,
    highlights: ["Light sky blue finish", "Calm everyday colorway"],
  },
] as const;
