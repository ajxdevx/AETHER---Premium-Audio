"use client";

import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { ChevronDown } from "@/lib/icons";
import { MAX_COLOR_PRODUCTS } from "@/lib/products";
import {
  FILTER_COLOR_SWATCHES,
  FILTER_SECTIONS,
  PANEL_RADIUS,
  PRICE_SLIDER_MAX,
  PRICE_SLIDER_MIN,
  PRICE_SLIDER_STEP,
} from "@/components/shop/shopConstants";
import { cn, formatPrice } from "@/lib/utils";

type ShopFilterPanelProps = {
  compact?: boolean;
  hasSidebarFilters: boolean;
  clearFilters: () => void;
  openFilter: string;
  setOpenFilter: Dispatch<SetStateAction<string>>;
  selectedColors: string[];
  toggleColor: (colorId: string) => void;
  priceMin: number;
  priceMax: number;
  setPriceMin: Dispatch<SetStateAction<number>>;
  setPriceMax: Dispatch<SetStateAction<number>>;
  setAppliedPriceMin: Dispatch<SetStateAction<number>>;
  setAppliedPriceMax: Dispatch<SetStateAction<number>>;
  priceMinPercent: number;
  priceMaxPercent: number;
  beginPriceDrag: () => void;
  commitPriceFilter: () => void;
  priceDraggingRef: MutableRefObject<boolean>;
  favoritesOnly: boolean;
  setFavoritesOnly: Dispatch<SetStateAction<boolean>>;
};

export function ShopFilterPanel({
  compact = false,
  hasSidebarFilters,
  clearFilters,
  openFilter,
  setOpenFilter,
  selectedColors,
  toggleColor,
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  setAppliedPriceMin,
  setAppliedPriceMax,
  priceMinPercent,
  priceMaxPercent,
  beginPriceDrag,
  commitPriceFilter,
  priceDraggingRef,
  favoritesOnly,
  setFavoritesOnly,
}: ShopFilterPanelProps) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-brand-border bg-white",
        compact ? "rounded-[1.25rem]" : PANEL_RADIUS
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b border-brand-border bg-brand-soft",
          compact ? "px-4 py-3.5" : "px-5 py-4"
        )}
      >
        <h2 className="text-[14px] font-bold text-ink">Filter By</h2>
        {hasSidebarFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer text-[12px] font-semibold text-ink transition-colors hover:text-brand"
          >
            Clear All
          </button>
        ) : null}
      </div>

      <div className="divide-y divide-brand-soft">
        {FILTER_SECTIONS.map((section) => {
          const isOpen = openFilter === section;
          return (
            <div key={section}>
              <button
                type="button"
                id={`shop-filter-trigger-${section}`}
                onClick={() =>
                  setOpenFilter((prev) => (prev === section ? "" : section))
                }
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between px-5 py-3.5 text-left text-[13px] font-semibold text-ink transition-colors duration-200",
                  isOpen ? "bg-brand-soft" : "hover:bg-brand-soft"
                )}
                aria-expanded={isOpen}
                aria-controls={`shop-filter-panel-${section}`}
              >
                {section}
                <ChevronDown
                  size={15}
                  className={cn(
                    "text-ink-warm transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>

              {isOpen && section === "Color" ? (
                <ul
                  id={`shop-filter-panel-${section}`}
                  role="list"
                  className="space-y-1 px-3 pb-4 pt-2"
                >
                  {MAX_COLOR_PRODUCTS.map((item) => {
                    const checked = selectedColors.includes(item.colorId);
                    return (
                      <li key={item.colorId}>
                        <button
                          type="button"
                          aria-pressed={checked}
                          onClick={() => toggleColor(item.colorId)}
                          className={cn(
                            "flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-200",
                            checked
                              ? "bg-brand text-white"
                              : "text-ink hover:bg-brand-soft"
                          )}
                        >
                          <span
                            className="h-4 w-4 shrink-0 rounded-full ring-1 ring-[#C5D6B5]"
                            style={{
                              backgroundColor:
                                FILTER_COLOR_SWATCHES[item.colorId] ??
                                item.pastel,
                            }}
                            aria-hidden
                          />
                          <span className="flex-1 text-[13px] font-medium">
                            {item.colorLabel}
                          </span>
                          <span
                            className={cn(
                              "text-[12px] tabular-nums",
                              checked ? "text-white/75" : "text-ink-soft"
                            )}
                          >
                            1
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}

              {isOpen && section === "Price" ? (
                <div
                  id={`shop-filter-panel-${section}`}
                  className="space-y-4 px-4 pb-5 pt-3"
                >
                  <div className="flex items-center justify-between gap-3 text-[12px] font-semibold tabular-nums text-ink">
                    <span>{formatPrice(priceMin)}</span>
                    <span className="font-medium text-ink-soft">to</span>
                    <span>{formatPrice(priceMax)}</span>
                  </div>

                  <div className="relative h-7">
                    <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-border" />
                    <div
                      className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand"
                      style={{
                        left: `${priceMinPercent}%`,
                        right: `${100 - priceMaxPercent}%`,
                      }}
                    />
                    <input
                      type="range"
                      min={PRICE_SLIDER_MIN}
                      max={PRICE_SLIDER_MAX}
                      step={PRICE_SLIDER_STEP}
                      value={priceMin}
                      aria-label="Minimum price"
                      onPointerDown={beginPriceDrag}
                      onPointerUp={commitPriceFilter}
                      onPointerCancel={commitPriceFilter}
                      onChange={(e) => {
                        const next = Math.min(Number(e.target.value), priceMax);
                        setPriceMin(next);
                        if (!priceDraggingRef.current) {
                          setAppliedPriceMin(next);
                        }
                      }}
                      className="price-range-thumb absolute inset-0 z-[2] h-7 w-full cursor-pointer appearance-none bg-transparent"
                    />
                    <input
                      type="range"
                      min={PRICE_SLIDER_MIN}
                      max={PRICE_SLIDER_MAX}
                      step={PRICE_SLIDER_STEP}
                      value={priceMax}
                      aria-label="Maximum price"
                      onPointerDown={beginPriceDrag}
                      onPointerUp={commitPriceFilter}
                      onPointerCancel={commitPriceFilter}
                      onChange={(e) => {
                        const next = Math.max(Number(e.target.value), priceMin);
                        setPriceMax(next);
                        if (!priceDraggingRef.current) {
                          setAppliedPriceMax(next);
                        }
                      }}
                      className="price-range-thumb absolute inset-0 z-[3] h-7 w-full cursor-pointer appearance-none bg-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-medium text-ink-soft">
                    <span>{formatPrice(PRICE_SLIDER_MIN)}</span>
                    <span>{formatPrice(PRICE_SLIDER_MAX)}</span>
                  </div>
                </div>
              ) : null}

              {isOpen && section === "Favourite" ? (
                <div
                  id={`shop-filter-panel-${section}`}
                  className="px-3 pb-4 pt-2"
                >
                  <button
                    type="button"
                    aria-pressed={favoritesOnly}
                    onClick={() => setFavoritesOnly((v) => !v)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-2xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors duration-200",
                      favoritesOnly
                        ? "bg-brand text-white"
                        : "text-ink-warm hover:bg-brand-soft hover:text-ink"
                    )}
                  >
                    <span>Favourites only</span>
                    <span
                      className={cn(
                        "relative h-5 w-9 rounded-full transition-colors",
                        favoritesOnly ? "bg-white/35" : "bg-brand-border"
                      )}
                      aria-hidden
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                          favoritesOnly ? "translate-x-4" : "translate-x-0.5"
                        )}
                      />
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
