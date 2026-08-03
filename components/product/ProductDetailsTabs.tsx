"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Battery,
  Check,
  Lock,
  RotateCcw,
  Shield,
  Star,
  Truck,
  Volume2,
  VolumeX,
} from "@/lib/icons";
import { ASSETS } from "@/constants/assets";
import { SITE_FAQS } from "@/constants/faqs";
import {
  getIncludedBoxItems,
  getProductFullDescription,
  getProductHighlights,
  getProductSpecs,
  getRatingBarDistribution,
} from "@/lib/products";
import { ProductOverviewMediaCard } from "@/components/product/ProductOverviewMediaCard";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

type TabId = "overview" | "specs" | "box" | "faq";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Tech Specs" },
  { id: "box", label: "What's in the Box" },
  { id: "faq", label: "FAQ" },
];

const OVERVIEW_FEATURES = [
  { label: "Precision Drivers", hint: "Studio-grade clarity" },
  { label: "Knit Mesh Canopy", hint: "Breathable all-day fit" },
  { label: "Memory Foam Cushions", hint: "Soft sealed comfort" },
  { label: "Stainless Steel Frame", hint: "Built to last" },
] as const;

interface ProductDetailsTabsProps {
  product: Product;
  rating: number;
  reviewCount: number;
  pastel: string;
  image: string;
  colorId: string;
  title: string;
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = rating - i >= 0.5;
        return (
          <Star
            key={i}
            size={size}
            className={cn(
              filled
                ? "fill-star text-star"
                : "fill-none text-[#C5D6B5]"
            )}
          />
        );
      })}
    </span>
  );
}

export function ProductDetailsTabs({
  product,
  rating,
  reviewCount,
  pastel,
  image,
  colorId,
  title,
}: ProductDetailsTabsProps) {
  const [tab, setTab] = useState<TabId>("overview");
  const boxItems = useMemo(() => getIncludedBoxItems(colorId), [colorId]);
  const specs = useMemo(() => getProductSpecs(product), [product]);
  const highlights = useMemo(
    () => getProductHighlights(product, 4),
    [product]
  );
  const description = useMemo(
    () => getProductFullDescription(product),
    [product]
  );
  const compactReviews =
    reviewCount >= 1000
      ? `${(reviewCount / 1000).toFixed(1).replace(/\.0$/, "")}k`
      : String(reviewCount);
  const overviewImage =
    colorId === "green" ||
    colorId === "blue" ||
    colorId === "pink" ||
    colorId === "black"
      ? ASSETS.marketing.spotlights.wear[colorId]
      : image;
  const overviewVideo =
    colorId === "green" ||
    colorId === "blue" ||
    colorId === "pink" ||
    colorId === "black"
      ? ASSETS.marketing.spotlights.wearVideo[colorId]
      : null;
  const isLifestyleOverview =
    colorId === "green" ||
    colorId === "blue" ||
    colorId === "pink" ||
    colorId === "black";
  const ratingBars = useMemo(
    () => getRatingBarDistribution(rating, reviewCount),
    [rating, reviewCount]
  );

  return (
    <section className="mt-14 lg:mt-16" aria-label="Product details">
      <div className="overflow-x-auto overscroll-x-contain border-b border-brand-soft [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full gap-1 sm:w-full sm:min-w-0 sm:flex-wrap" role="tablist">
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={cn(
                  "relative shrink-0 cursor-pointer px-4 py-3.5 text-[13px] font-semibold transition-colors sm:px-5 sm:text-[14px]",
                  active
                    ? "text-ink"
                    : "text-ink-soft hover:text-brand"
                )}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-brand sm:inset-x-5" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-8 lg:pt-10">
        {tab === "overview" ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[1.05fr_0.9fr_0.95fr] xl:gap-10">
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-announce)] text-[1.65rem] font-bold tracking-tight text-ink sm:text-[1.85rem]">
                Sound that surrounds you.
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-label sm:text-[15px]">
                {description}
              </p>
              <ul className="mt-6 space-y-3">
                {OVERVIEW_FEATURES.map((feature, i) => (
                  <li key={feature.label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                      <Check size={14} strokeWidth={2.75} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-ink">
                        {feature.label}
                      </p>
                      <p className="text-[12px] text-ink-soft">
                        {highlights[i] ?? feature.hint}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <ProductOverviewMediaCard
              image={overviewImage}
              title={title}
              pastel={pastel}
              isLifestyle={isLifestyleOverview}
              colorId={colorId}
              videoSrc={overviewVideo}
            />

            <div className="min-w-0 rounded-[1.75rem] bg-brand-mist p-5 sm:p-6 md:col-span-2 xl:col-span-1">
              <div className="flex items-end gap-3">
                <p className="font-[family-name:var(--font-announce)] text-[3rem] font-bold leading-none tracking-tight text-ink">
                  {rating.toFixed(1)}
                </p>
                <div className="pb-1">
                  <Stars rating={rating} size={15} />
                  <p className="mt-1 text-[12px] font-medium text-ink-soft">
                    Based on {compactReviews} reviews
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {ratingBars.map((row) => (
                  <li key={row.stars} className="flex items-center gap-2.5">
                    <span className="w-3 text-[11px] font-semibold tabular-nums text-ink-warm">
                      {row.stars}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-soft">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="group/btn relative mt-5 flex h-11 w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-ink text-[13px] font-semibold text-white"
              >
                <ButtonWipeFill />
                <span className="relative z-[1]">Write a Review</span>
              </button>

              <div className="mt-5 border-t border-brand-soft pt-5">
                <div className="flex items-center gap-2">
                  <Stars rating={5} size={12} />
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                    Verified Buyer
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-label">
                  “Comfortable for long sessions and the noise cancellation is
                  next level. Flights and open offices just disappear.”
                </p>
                <p className="mt-2 text-[12px] font-semibold text-ink">
                  Amine K.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "specs" ? (
          <dl className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {specs.map(({ label, value }) => (
              <div
                key={label}
                className="flex min-h-[6.5rem] flex-col justify-between rounded-[1.35rem] bg-brand-mist p-5 sm:min-h-[7rem] sm:p-6"
              >
                <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brand sm:text-[13px]">
                  {label}
                </dt>
                <dd className="mt-3 text-[1.05rem] font-bold leading-snug tracking-tight text-ink sm:text-[1.15rem]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {tab === "box" ? (
          <ul className="grid w-full grid-cols-1 gap-3 xl:grid-cols-5 xl:gap-4">
            {boxItems.map(({ label, description, image: boxImage }) => (
              <li
                key={label}
                className="flex min-w-0 items-center gap-4 overflow-hidden rounded-[1.35rem] bg-brand-mist p-3.5 sm:gap-5 sm:p-4 xl:min-h-[10rem] xl:flex-col xl:items-stretch xl:gap-0 xl:p-0"
              >
                <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20 xl:mx-auto xl:mt-5 xl:h-24 xl:w-full xl:max-w-[7.5rem]">
                  <Image
                    src={boxImage}
                    alt=""
                    fill
                    className="object-contain scale-100 sm:scale-105 xl:scale-110"
                    sizes="140px"
                  />
                </div>
                <div className="min-w-0 flex-1 text-left xl:mt-auto xl:px-5 xl:pb-5 xl:pt-2 xl:text-center">
                  <p className="text-[14px] font-semibold leading-tight text-ink sm:text-[15px]">
                    {label}
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-ink-soft sm:text-[13px]">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {tab === "faq" ? (
          <ul className="grid w-full grid-cols-1 gap-3 lg:gap-4">
            {SITE_FAQS.map((item) => (
              <li
                key={item.id}
                className="rounded-[1.35rem] bg-brand-mist px-5 py-5 sm:px-6 sm:py-6"
              >
                <p className="text-[14px] font-semibold text-ink sm:text-[15px]">
                  {item.question}
                </p>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink-label sm:text-[14px]">
                  {item.answer}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export const KEY_FEATURES = [
  {
    label: "Active Noise Cancellation",
    icon: VolumeX,
  },
  {
    label: "Transparency Mode",
    icon: Volume2,
  },
  {
    label: "Personalized Spatial Audio",
    icon: Star,
  },
  {
    label: "Up to 20 Hours of Battery",
    icon: Battery,
  },
] as const;

export const TRUST_ITEMS = [
  { label: "Free Shipping", hint: "On every order", icon: Truck },
  { label: "30-Day Returns", hint: "Easy full refund", icon: RotateCcw },
  { label: "2-Year Warranty", hint: "Full coverage included", icon: Shield },
  { label: "Secure Payments", hint: "Safe encrypted checkout", icon: Lock },
] as const;

export function formatInstallment(price: number) {
  return formatPrice(Math.round((price / 4) * 100) / 100);
}
