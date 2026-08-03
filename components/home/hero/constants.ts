import { SIGNATURE_THEMES, type SignatureThemeId } from "@/constants/brand";
import { ASSETS } from "@/constants/assets";
import { premiumEase } from "@/components/home/SectionReveal";

export const LISTENER_AVATARS = ASSETS.avatars.listeners;

export const HERO_PODS = ASSETS.marketing.hero.pods;
export const HERO_POD_THEME_IDS = Object.keys(HERO_PODS) as SignatureThemeId[];
export const HERO_STAND = ASSETS.marketing.hero.stand;

export const HERO_DISPLAY_COLORS: {
  id: SignatureThemeId;
  name: string;
  hex: string;
}[] = [
  { id: "pink", name: SIGNATURE_THEMES.pink.label, hex: SIGNATURE_THEMES.pink.swatch },
  { id: "blue", name: SIGNATURE_THEMES.blue.label, hex: SIGNATURE_THEMES.blue.swatch },
  { id: "black", name: SIGNATURE_THEMES.black.label, hex: SIGNATURE_THEMES.black.swatch },
  { id: "green", name: SIGNATURE_THEMES.green.label, hex: SIGNATURE_THEMES.green.soft },
];

/** Shared reveal clock — keeps first paint coherent after intro / deploy. */
export const REVEAL_FALLBACK_MS = 700;

export const colorPanelVariants = {
  hidden: { opacity: 0, y: -14, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: 0.22,
      ease: premiumEase,
      when: "beforeChildren" as const,
    },
  },
};

export const swatchListVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const swatchItemVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: premiumEase },
  },
};
