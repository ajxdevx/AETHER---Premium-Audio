"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { lockPageScroll, unlockPageScroll } from "@/lib/smoothScroll";

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-card/70", className)}
      aria-hidden
    />
  );
}

function ProductCardSkeleton({
  className,
}: {
  className?: string;
  /** @deprecated Ignored — shop/product skeletons stay grey. */
  pastel?: string;
  pastelIndex?: number;
}) {
  return (
    <article
      className={cn(
        "relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] bg-[#E8E8EA]",
        className
      )}
      aria-hidden
    >
      <div className="relative z-10 flex items-start justify-between gap-2 px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <LoadingSkeleton className="h-6 w-14 rounded-full" />
          <LoadingSkeleton className="h-6 w-16 rounded-full" />
        </div>
        <LoadingSkeleton className="h-10 w-10 shrink-0 rounded-full" />
      </div>

      {/* Image area left empty (grey surface only) — no image skeleton block. */}
      <div className="relative mx-auto mt-1 aspect-square w-[86%] max-w-[228px] sm:w-[88%] sm:max-w-[236px]" />

      <div className="relative z-10 mt-auto px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="rounded-[1.35rem] bg-white/90 p-4 shadow-[0_12px_32px_-22px_rgba(40,35,20,0.35)]">
          <LoadingSkeleton className="h-3 w-28" />
          <LoadingSkeleton className="mt-2 h-5 w-4/5 sm:h-6" />
          <div className="mt-2.5 flex items-center gap-1.5">
            <LoadingSkeleton className="h-3.5 w-20" />
            <LoadingSkeleton className="h-3 w-12" />
          </div>
          <div className="mt-3 flex flex-col gap-3">
            <LoadingSkeleton className="h-6 w-24" />
            <LoadingSkeleton className="h-11 w-full rounded-full" />
          </div>
        </div>
      </div>
    </article>
  );
}

type ProductGridVariant = "featured" | "shop" | "related";

const GRID_CLASS: Record<ProductGridVariant, string> = {
  featured: "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6",
  shop: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6",
  related: "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6",
};

export function ProductGridSkeleton({
  count = 4,
  variant = "featured",
  className,
}: {
  count?: number;
  variant?: ProductGridVariant;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className={GRID_CLASS[variant]}>
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

const PRODUCT_PAGE_SKELETON_GREY = "#E8E8EA";
const PRODUCT_PAGE_SKELETON_GREY_SOFT = "#F0F0F2";

/** Grey pulse bones for the product page. */
function GreySkeleton({
  className,
  tone = "base",
}: {
  className?: string;
  tone?: "base" | "soft" | "dark";
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg",
        tone === "base" && "bg-card",
        tone === "soft" && "bg-[#ECECEE]",
        tone === "dark" && "bg-[#D4D4D8]",
        className
      )}
      aria-hidden
    />
  );
}

export function ProductPageSkeleton({
  pastel: _pastel = undefined,
}: {
  /** Kept for call-site compatibility; product skeleton stays grey. */
  pastel?: string;
}) {
  void _pastel;

  useEffect(() => {
    lockPageScroll();

    const block = (event: Event) => {
      event.preventDefault();
    };

    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });

    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      unlockPageScroll();
    };
  }, []);

  return (
    <div aria-busy="true" aria-label="Loading product">
      <GreySkeleton className="mb-5 h-4 w-48 md:mb-6" tone="soft" />

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)] xl:gap-12">
        <div className="flex min-w-0 items-stretch gap-3 md:gap-4 lg:min-h-[min(72vh,720px)] lg:items-start">
          <div
            className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] lg:min-h-[min(72vh,720px)]"
            style={{ backgroundColor: PRODUCT_PAGE_SKELETON_GREY }}
          >
            <div className="relative aspect-square w-full min-h-0 flex-1 lg:aspect-auto">
              <GreySkeleton className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full" tone="soft" />
            </div>
            <div className="flex shrink-0 items-center justify-center px-4 pb-4 pt-1 sm:pb-5">
              <GreySkeleton className="h-10 w-36 rounded-full" tone="soft" />
            </div>
          </div>

          <div className="flex w-14 shrink-0 flex-col justify-between self-stretch sm:w-16 md:w-[4.5rem] lg:w-[4.5rem] lg:justify-start lg:gap-2 lg:self-start">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square w-full shrink-0 rounded-2xl lg:h-[4.5rem] lg:w-[4.5rem]"
                style={{ backgroundColor: PRODUCT_PAGE_SKELETON_GREY }}
                aria-hidden
              />
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <GreySkeleton className="h-6 w-14 rounded-full" />
            <GreySkeleton className="h-6 w-16 rounded-full" />
          </div>
          <GreySkeleton className="h-3 w-24" tone="dark" />
          <GreySkeleton className="mt-2 h-10 w-4/5 sm:h-12" />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <GreySkeleton className="h-4 w-28" tone="soft" />
            <GreySkeleton className="h-4 w-24" tone="soft" />
          </div>
          <div className="mt-4 flex items-end gap-3">
            <GreySkeleton className="h-8 w-28" />
            <GreySkeleton className="mb-1 h-4 w-16" tone="soft" />
          </div>
          <GreySkeleton className="mt-1.5 h-4 w-56" tone="soft" />
          <GreySkeleton className="mt-4 h-16 w-full sm:h-14" tone="soft" />

          <ul className="mt-5 grid grid-cols-1 gap-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5"
                style={{ backgroundColor: PRODUCT_PAGE_SKELETON_GREY_SOFT }}
              >
                <GreySkeleton className="h-8 w-8 shrink-0 rounded-full" />
                <GreySkeleton className="h-4 w-3/5" />
              </li>
            ))}
          </ul>

          <div className="mt-6 flex w-full flex-col gap-3">
            <div className="grid w-full grid-cols-[7.75rem_minmax(0,1fr)] gap-2.5 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-3">
              <GreySkeleton className="h-12 w-full rounded-full" />
              <GreySkeleton className="h-12 w-full rounded-full" tone="dark" />
            </div>
            <GreySkeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShopPageSkeleton() {
  useEffect(() => {
    lockPageScroll();

    const block = (event: Event) => {
      event.preventDefault();
    };

    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });

    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      unlockPageScroll();
    };
  }, []);

  return (
    <div aria-busy="true" aria-label="Loading shop">
      <LoadingSkeleton className="mb-5 h-4 w-40" />

      <div className="mb-8 flex w-full min-w-0 flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl min-w-0 space-y-3">
          <LoadingSkeleton className="h-10 w-48 sm:h-12 sm:w-56" />
          <LoadingSkeleton className="h-4 w-full max-w-md" />
          <LoadingSkeleton className="h-4 w-3/4 max-w-sm" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10">
        <div className="hidden lg:block" aria-hidden />
        <ProductGridSkeleton count={4} variant="shop" />
      </div>
    </div>
  );
}
