import { BRAND } from "@/constants/brand";
import { SITE_FAQS, type SiteFaq } from "@/constants/faqs";
import {
  MAX_COLOR_PRODUCTS,
  MAX_PRODUCT_ID,
  type MaxColorProduct,
  getCatalogEntry,
} from "@/lib/products";
import { PRODUCT_DETAILS } from "@/constants/products/details";

/** Finish aliases — design name, color words, and common nicknames. */
const COLOR_ALIASES: Record<MaxColorProduct["colorId"], string[]> = {
  green: ["matcha", "sage", "forest", "olive", "mint"],
  black: ["space", "dark", "midnight", "charcoal", "grey", "gray", "noir"],
  pink: ["blush", "rose", "magenta", "coral"],
  blue: ["sky", "azure", "cyan", "cobalt"],
};

const SHARED_PRODUCT_TERMS = [
  BRAND.name,
  BRAND.tagline,
  "aether",
  "pods",
  "max",
  "headphones",
  "headset",
  "over ear",
  "wireless",
  "audio",
  "anc",
  "noise cancellation",
  "case",
  "cable",
  "stand",
  "accessories",
  "cushions",
  "pads",
  "precision drivers",
  "knit mesh canopy",
  "memory foam",
  "stainless steel",
];

const catalog = getCatalogEntry(MAX_PRODUCT_ID);
const detail = PRODUCT_DETAILS[MAX_PRODUCT_ID];

const CATALOG_TERMS = catalog
  ? [
      catalog.name,
      catalog.slug,
      catalog.type,
      catalog.category,
      catalog.description,
      ...catalog.badges,
      "best seller",
      "bestseller",
    ]
  : [];

const DETAIL_TERMS = detail
  ? [
      detail.longDescription,
      ...detail.highlights,
      ...detail.specs.flatMap((spec) => [spec.label, spec.value]),
      detail.shipping,
      detail.returns,
    ]
  : [];

type ScoredProduct = MaxColorProduct & { score: number };
type ScoredFaq = SiteFaq & { score: number };

export type SiteSearchResults = {
  products: ScoredProduct[];
  faqs: ScoredFaq[];
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(query: string): string[] {
  return normalize(query).split(" ").filter(Boolean);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scoreHaystack(haystack: string, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  if (!tokens.every((token) => haystack.includes(token))) return 0;

  let score = tokens.length * 10;
  for (const token of tokens) {
    if (haystack.startsWith(token) || haystack.includes(` ${token} `)) {
      score += 4;
    }
    if (
      new RegExp(`(?:^|\\s)${escapeRegExp(token)}(?:\\s|$)`).test(haystack)
    ) {
      score += 6;
    }
  }
  return score;
}

function productHaystack(item: MaxColorProduct): string {
  const aliases = COLOR_ALIASES[item.colorId] ?? [];
  const flags = [
    item.isNew ? "new latest" : "",
    item.promo ? "promo sale deal offer discount" : "",
  ];

  return normalize(
    [
      item.name,
      item.colorLabel,
      item.colorId,
      ...aliases,
      ...flags,
      ...SHARED_PRODUCT_TERMS,
      ...CATALOG_TERMS,
      ...DETAIL_TERMS,
    ].join(" ")
  );
}

function faqHaystack(faq: SiteFaq): string {
  return normalize(
    [faq.id, faq.question, faq.answer, "faq", "help", "support"].join(" ")
  );
}

function rankProducts(query: string): ScoredProduct[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return MAX_COLOR_PRODUCTS.map((item) => ({ ...item, score: 0 }));
  }

  return MAX_COLOR_PRODUCTS.map((item) => {
    const primary = normalize(
      [item.name, item.colorLabel, item.colorId].join(" ")
    );
    const aliases = normalize((COLOR_ALIASES[item.colorId] ?? []).join(" "));
    const full = productHaystack(item);

    const primaryScore = scoreHaystack(primary, tokens) * 3;
    const aliasScore = scoreHaystack(aliases, tokens) * 2;
    const fullScore = scoreHaystack(full, tokens);

    return { ...item, score: Math.max(primaryScore, aliasScore, fullScore) };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

/** Ranked finishes for shop filters and product search. */
export function filterMaxColorProducts(query: string): MaxColorProduct[] {
  return rankProducts(query);
}

/** Ranked FAQs matching question, answer, and help keywords. */
export function searchFaqs(query: string): ScoredFaq[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  return SITE_FAQS.map((faq) => {
    const questionScore = scoreHaystack(normalize(faq.question), tokens) * 3;
    const fullScore = scoreHaystack(faqHaystack(faq), tokens);
    return { ...faq, score: Math.max(questionScore, fullScore) };
  })
    .filter((faq) => faq.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** Combined product + FAQ search for the header dropdown. */
export function searchSite(query: string): SiteSearchResults {
  return {
    products: rankProducts(query),
    faqs: searchFaqs(query),
  };
}

export function faqHref(faqId: string): string {
  return `/shop#faq-${faqId}`;
}
