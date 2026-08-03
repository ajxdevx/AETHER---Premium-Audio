import { ASSETS } from "@/constants/assets";
import { SIGNATURE_THEMES, type SignatureThemeId } from "@/constants/brand";

export type WearVariant = {
  id: SignatureThemeId;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  bg: string;
  /** Draw smaller than the frame so tight crops stay inside the card. */
  fit?: number;
};

export const WEAR_VARIANTS: WearVariant[] = [
  {
    id: "green",
    title: "Crafted for Exceptional Comfort.",
    body: "Every material is carefully chosen for lasting comfort and a premium feel.",
    image: ASSETS.marketing.spotlights.wear.green,
    imageAlt: "Person wearing Matcha Green Aether Pods",
    bg: SIGNATURE_THEMES.green.soft,
    fit: 1,
  },
  {
    id: "blue",
    title: "Tuned for Everyday Clarity.",
    body: "Sky blue tones bring calm clarity that keeps you in the moment.",
    image: ASSETS.marketing.spotlights.wear.blue,
    imageAlt: "Person wearing Sky Blue Aether Pods",
    bg: SIGNATURE_THEMES.blue.soft,
    fit: 1,
  },
  {
    id: "pink",
    title: "Made for Effortless Style.",
    body: "Blush pink tones bring bold presence without ever sacrificing your daily comfort.",
    image: ASSETS.marketing.spotlights.wear.pink,
    imageAlt: "Person wearing Blush Pink Aether Pods",
    bg: SIGNATURE_THEMES.pink.soft,
    fit: 1,
  },
  {
    id: "black",
    title: "Built for Quiet Presence.",
    body: "Space dark tones look refined and disappear softly into your full day.",
    image: ASSETS.marketing.spotlights.wear.black,
    imageAlt: "Person wearing Space Dark Aether Pods",
    bg: SIGNATURE_THEMES.black.soft,
    fit: 1,
  },
];

export const WEAR_CYCLE_MS = 2800;
export const WEAR_HOVER_MQ = "(hover: hover) and (pointer: fine)";
