"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ChevronDown, SlidersHorizontal } from "@/lib/icons";
import { MAX_PRODUCT_ID } from "@/lib/products";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { useShopFilters } from "@/hooks/useShopFilters";
import { MaxColorProductCard } from "@/components/product/MaxColorProductCard";
import { CompareMaxGrid } from "@/components/shop/CompareMaxGrid";
import { ShopFaqs } from "@/components/shop/ShopFaqs";
import { ShopFilterPanel } from "@/components/shop/ShopFilterPanel";
import { ShopServiceBar } from "@/components/shop/ShopServiceBar";
import { TradeInCard } from "@/components/shop/TradeInCard";
import { PANEL_RADIUS, SORT_OPTIONS } from "@/components/shop/shopConstants";
import { LoadingSkeleton, ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Container } from "@/components/ui/Container";
import { PageTransition } from "@/components/layout/PageTransition";
import { PageShell, PAGE_SHELL_PADDING } from "@/components/layout/PageShell";
import {
  MountReveal,
  MountStagger,
  StaggerItem,
} from "@/components/home/SectionReveal";
import { lockPageScroll, unlockPageScroll } from "@/lib/smoothScroll";
import { cn } from "@/lib/utils";

export function ShopPageContent() {
  const { products, isLoading, isError, refetch } = useCatalogProducts([
    MAX_PRODUCT_ID,
  ]);
  const product = products[0];

  const showProductSkeleton = isLoading;

  useEffect(() => {
    if (!showProductSkeleton) return;

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
  }, [showProductSkeleton]);

  const {
    filtered, selectedColors, priceMin, priceMax, priceDragging, favoritesOnly,
    sort, openFilter, sortOpen, filtersOpen, sortRef, filtersRef,
    filterDialogRef, sortOptionRefs, priceDraggingRef, setPriceMin, setPriceMax,
    setAppliedPriceMin, setAppliedPriceMax, setFavoritesOnly, setSort,
    setOpenFilter, setSortOpen, setFiltersOpen, commitPriceFilter,
    beginPriceDrag, toggleColor, priceRangeActive, clearFilters,
    hasSidebarFilters, filterSignature, sortLabel, selectedSortIndex,
    focusSortOption, handleSortKeyDown, priceMinPercent, priceMaxPercent,
  } = useShopFilters(product);

  const filterPanelProps = {
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
  };

  const productCountLabel = `${filtered.length} Product${filtered.length === 1 ? "" : "s"}`;
  return (
    <PageShell className={cn(PAGE_SHELL_PADDING, "overflow-x-clip")}>
      <PageTransition>
        <Container wide className="min-w-0 overflow-x-clip">
          <MountStagger stagger={0.1} delay={0.05}>
            <StaggerItem>
              <nav
                aria-label="Breadcrumb"
                className="mb-5 flex flex-wrap items-center gap-1.5 text-[13px] text-ink-warm"
              >
                <Link href="/" className="transition-colors hover:text-ink">
                  Home
                </Link>
                <span aria-hidden className="text-brand-border">
                  /
                </span>
                <span className="font-medium text-ink">Shop</span>
                <span aria-hidden className="text-brand-border">
                  /
                </span>
                <span className="font-medium text-ink">Aether Pods</span>
              </nav>
            </StaggerItem>

            <StaggerItem>
              <div className="mb-8 flex w-full min-w-0 flex-col gap-4 overflow-x-clip md:mb-10 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl min-w-0">
                  <h1 className="section-heading text-[clamp(1.85rem,2.5vw+1rem,2.75rem)]">
                    Aether Pods
                  </h1>
                  <p className="section-lead mt-2">
                    Four signature finishes. Premium over-ear sound, all-day comfort,
                    and the AETHER build — shop the full lineup here.
                  </p>
                </div>

                <div className="flex w-full min-w-0 flex-col gap-2.5 md:w-auto md:items-end lg:flex-row lg:items-center lg:gap-3">
                  <div className="flex w-full min-w-0 items-center gap-2.5 sm:gap-3 md:w-auto">
                    <div ref={filtersRef} className="relative min-w-0 flex-1 lg:hidden md:flex-none">
                      <button
                        type="button"
                        id="shop-filters-trigger"
                        aria-haspopup="dialog"
                        aria-expanded={filtersOpen}
                        aria-controls="shop-filters-popover"
                        onClick={() => {
                          setSortOpen(false);
                          setFiltersOpen((v) => !v);
                        }}
                        className={cn(
                          "group inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-brand-soft px-3.5 text-[13px] font-semibold text-brand sm:gap-2 sm:px-4",
                          "transition-[background-color,color,box-shadow] duration-300 ease-out",
                          "brand-icon-hover",
                          filtersOpen &&
                            "bg-brand text-white shadow-[0_4px_16px_-6px_rgba(var(--brand-accent-rgb),0.35)]"
                        )}
                      >
                        <SlidersHorizontal size={15} strokeWidth={2} aria-hidden />
                        Filters
                        {hasSidebarFilters ? (
                          <span
                            className={cn(
                              "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                              filtersOpen
                                ? "bg-white text-brand"
                                : "bg-brand text-white group-hover:bg-white group-hover:text-brand"
                            )}
                          >
                            {(selectedColors.length > 0 ? 1 : 0) +
                              (priceRangeActive ? 1 : 0) +
                              (favoritesOnly ? 1 : 0)}
                          </span>
                        ) : null}
                      </button>
                      {filtersOpen ? (
                        <div
                          ref={filterDialogRef}
                          id="shop-filters-popover"
                          role="dialog"
                          aria-label="Product filters"
                          data-lenis-prevent
                          data-hide-scrollbar
                          className="absolute left-0 top-[calc(100%+0.45rem)] z-30 w-[min(26rem,calc(100vw-2rem))] max-h-[min(70dvh,28rem)] overflow-y-auto overscroll-contain shadow-[0_16px_40px_-20px_rgba(80,60,20,0.28)] sm:w-[min(28rem,calc(100vw-2.5rem))]"
                        >
                          <ShopFilterPanel compact {...filterPanelProps} />
                        </div>
                      ) : null}
                    </div>

                    <div ref={sortRef} className="relative min-w-0 flex-1 md:flex-none">
                      <button
                        type="button"
                        id="shop-sort-trigger"
                        aria-haspopup="listbox"
                        aria-expanded={sortOpen}
                        aria-controls="shop-sort-listbox"
                        onClick={() => {
                          setFiltersOpen(false);
                          setSortOpen((v) => {
                            const next = !v;
                            if (next) {
                              window.requestAnimationFrame(() =>
                                focusSortOption(selectedSortIndex)
                              );
                            }
                            return next;
                          });
                        }}
                        onKeyDown={(event) => {
                          if (!sortOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
                            event.preventDefault();
                            setFiltersOpen(false);
                            setSortOpen(true);
                            window.requestAnimationFrame(() =>
                              focusSortOption(selectedSortIndex)
                            );
                          }
                        }}
                        className={cn(
                          "group inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-brand-border bg-white px-3.5 text-[13px] font-semibold text-brand sm:gap-2 sm:px-4 md:w-auto",
                          "transition-[background-color,color,border-color,box-shadow] duration-300 ease-out",
                          "hover:border-brand brand-icon-hover",
                          sortOpen &&
                            "border-brand bg-brand text-white shadow-[0_4px_16px_-6px_rgba(var(--brand-accent-rgb),0.35)]"
                        )}
                      >
                        <span className="min-w-0 truncate">
                          <span className="md:hidden">Sort: {sortLabel}</span>
                          <span className="hidden md:inline">
                            Sort by: {sortLabel}
                          </span>
                        </span>
                        <ChevronDown
                          size={15}
                          className={cn(
                            "shrink-0 transition-transform duration-200",
                            sortOpen && "rotate-180"
                          )}
                          aria-hidden
                        />
                      </button>
                      {sortOpen ? (
                        <ul
                          id="shop-sort-listbox"
                          data-lenis-prevent
                          data-hide-scrollbar
                          role="listbox"
                          aria-labelledby="shop-sort-trigger"
                          onKeyDown={handleSortKeyDown}
                          className="absolute inset-x-0 top-[calc(100%+0.45rem)] z-20 max-h-[min(50dvh,16rem)] space-y-1 overflow-y-auto overscroll-contain rounded-[1.25rem] bg-white p-1.5 shadow-[0_16px_40px_-20px_rgba(80,60,20,0.28)] md:inset-x-auto md:right-0 md:w-52"
                        >
                          {SORT_OPTIONS.map((option, index) => (
                            <li key={option.id}>
                              <button
                                ref={(element) => {
                                  sortOptionRefs.current[index] = element;
                                }}
                                type="button"
                                role="option"
                                aria-selected={sort === option.id}
                                onClick={() => {
                                  setSort(option.id);
                                  setSortOpen(false);
                                }}
                                className={cn(
                                  "w-full cursor-pointer rounded-2xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors duration-200",
                                  sort === option.id
                                    ? "bg-brand text-white"
                                    : "text-ink-warm hover:bg-brand-soft hover:text-ink"
                                )}
                              >
                                {option.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>

                  {showProductSkeleton ? (
                    <LoadingSkeleton className="h-11 w-full rounded-full lg:w-28" />
                  ) : (
                    <span className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-soft px-4 text-[13px] font-semibold tabular-nums text-brand lg:w-fit lg:shrink-0">
                      {productCountLabel}
                    </span>
                  )}
                </div>
              </div>
            </StaggerItem>
          </MountStagger>

          <div className="grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10">
            <MountReveal
              delay={0.18}
              y={32}
              className="hidden space-y-5 lg:block"
            >
              <aside className="space-y-5">
                <ShopFilterPanel {...filterPanelProps} />
                <TradeInCard />
              </aside>
            </MountReveal>

            <MountReveal delay={0.12} y={24} className="min-w-0">
              {showProductSkeleton && <ProductGridSkeleton count={4} variant="shop" />}
              {!showProductSkeleton && isError && <ErrorState onRetry={refetch} />}
              {!showProductSkeleton && !isError && !product && (
                <ErrorState
                  message="Products unavailable. Please try again."
                  onRetry={refetch}
                />
              )}
              {!showProductSkeleton && !isError && product && (
                <>
                  {priceDragging ? (
                    <div
                      className="min-h-[24rem] sm:min-h-[28rem]"
                      aria-busy="true"
                      aria-label="Updating price filter"
                    />
                  ) : filtered.length > 0 ? (
                    <MountStagger
                      key={filterSignature}
                      className="grid grid-cols-1 gap-5 [perspective:1200px] sm:grid-cols-2 lg:gap-6"
                      stagger={0.08}
                      delay={0.02}
                    >
                      {filtered.map((item) => (
                        <StaggerItem key={item.colorId}>
                          <MaxColorProductCard
                            product={product}
                            name={item.name}
                            colorLabel={item.colorLabel}
                            colorId={item.colorId}
                            rating={item.rating}
                            reviewCount={item.reviewCount}
                            price={item.price}
                            compareAt={item.compareAt}
                            image={item.image}
                            pastel={item.pastel}
                            isNew={item.isNew}
                            promo={item.promo}
                            largeImage
                          />
                        </StaggerItem>
                      ))}
                    </MountStagger>
                  ) : (
                    <div
                      className={cn(
                        "bg-brand-mist px-6 py-16 text-center",
                        PANEL_RADIUS
                      )}
                    >
                      <p className="text-[15px] font-semibold text-ink">
                        No finishes match your filters
                      </p>
                      <p className="mt-1 text-[13px] text-ink-warm">
                        Clear filters or try another color.
                      </p>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 cursor-pointer text-[13px] font-semibold text-ink transition-colors hover:text-brand"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </>
              )}
              <div className="mt-8 lg:hidden">
                <TradeInCard />
              </div>
            </MountReveal>
          </div>

          <CompareMaxGrid />

          <ShopServiceBar />

          <ShopFaqs />
        </Container>
      </PageTransition>
    </PageShell>
  );
}
