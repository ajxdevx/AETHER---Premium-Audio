import { ASSETS } from "@/constants/assets";
import { BRAND } from "@/constants/brand";
import { LOCALE } from "@/constants/locale";

export function getSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (value) return value.replace(/\/$/, "");
  return "https://aether-premium-audio.vercel.app";
}

export const SITE = {
  name: BRAND.name,
  title: `${BRAND.name} — ${BRAND.tagline}`,
  tagline: BRAND.tagline,
  description: BRAND.description,
  locale: `${LOCALE.language}_${LOCALE.region}`,
  country: LOCALE.country,
  currency: LOCALE.currency,
} as const;

export const DEFAULT_OG_IMAGE = {
  url: ASSETS.brand.og,
  width: 1200,
  height: 630,
  alt: `${BRAND.name} Pro Pods — Feel Every Beat. Live Every Moment.`,
} as const;
