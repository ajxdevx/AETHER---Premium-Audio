"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMaxColorProductsForTheme } from "@/lib/products";
import { filterMaxColorProducts } from "@/lib/siteSearch";
import { filterAndSortShopProducts } from "@/lib/shopFilters";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useWishlist } from "@/hooks/useWishlist";
import { useSignatureTheme } from "@/providers/SignatureThemeProvider";
import {
  PRICE_SLIDER_MAX,
  PRICE_SLIDER_MIN,
  SORT_OPTIONS,
  type SortOption,
} from "@/components/shop/shopConstants";
import type { Product } from "@/types/product";

export function useShopFilters(product: Product | undefined) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const { isFavorite } = useWishlist();
  const { themeId } = useSignatureTheme();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(PRICE_SLIDER_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_SLIDER_MAX);
  const [appliedPriceMin, setAppliedPriceMin] = useState(PRICE_SLIDER_MIN);
  const [appliedPriceMax, setAppliedPriceMax] = useState(PRICE_SLIDER_MAX);
  const [priceDragging, setPriceDragging] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [openFilter, setOpenFilter] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const filterDialogRef = useRef<HTMLDivElement>(null);
  const sortOptionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const priceDraggingRef = useRef(false);

  useFocusTrap(filtersOpen, filterDialogRef);

  useEffect(() => {
    if (!sortOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) setSortOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setSortOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sortOpen]);

  useEffect(() => {
    if (!filtersOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!filtersRef.current?.contains(event.target as Node)) setFiltersOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [filtersOpen]);

  const filtered = useMemo(() => {
    const matchedColorIds = query
      ? new Set(filterMaxColorProducts(query).map((match) => match.colorId))
      : undefined;

    return filterAndSortShopProducts(getMaxColorProductsForTheme(themeId), {
      selectedColors,
      priceMin: appliedPriceMin,
      priceMax: appliedPriceMax,
      favoritesOnly,
      isFavorite: (colorId) =>
        product ? isFavorite(product.id, colorId) : false,
      matchedColorIds,
      sort,
    });
  }, [
    themeId,
    selectedColors,
    appliedPriceMin,
    appliedPriceMax,
    favoritesOnly,
    product,
    query,
    sort,
    isFavorite,
  ]);

  const commitPriceFilter = () => {
    priceDraggingRef.current = false;
    setAppliedPriceMin(priceMin);
    setAppliedPriceMax(priceMax);
    setPriceDragging(false);
  };
  const beginPriceDrag = () => {
    priceDraggingRef.current = true;
    setPriceDragging(true);
  };
  const toggleColor = (colorId: string) => {
    setSelectedColors((current) =>
      current.includes(colorId)
        ? current.filter((id) => id !== colorId)
        : [...current, colorId]
    );
  };
  const priceRangeActive =
    appliedPriceMin > PRICE_SLIDER_MIN || appliedPriceMax < PRICE_SLIDER_MAX;
  const clearFilters = () => {
    setSelectedColors([]);
    setPriceMin(PRICE_SLIDER_MIN);
    setPriceMax(PRICE_SLIDER_MAX);
    setAppliedPriceMin(PRICE_SLIDER_MIN);
    setAppliedPriceMax(PRICE_SLIDER_MAX);
    setPriceDragging(false);
    setFavoritesOnly(false);
    setSort("featured");
    setSortOpen(false);
    setFiltersOpen(false);
    router.replace("/shop");
  };
  const hasSidebarFilters =
    selectedColors.length > 0 || priceRangeActive || favoritesOnly;
  const filterSignature = [
    selectedColors.slice().sort().join(","),
    `${appliedPriceMin}-${appliedPriceMax}`,
    favoritesOnly ? "fav" : "",
    query,
    sort,
  ].join("|");
  const sortLabel =
    SORT_OPTIONS.find((option) => option.id === sort)?.label ?? "Featured";
  const selectedSortIndex = Math.max(
    SORT_OPTIONS.findIndex((option) => option.id === sort),
    0
  );
  const focusSortOption = (index: number) => {
    sortOptionRefs.current[
      (index + SORT_OPTIONS.length) % SORT_OPTIONS.length
    ]?.focus();
  };
  const handleSortKeyDown = (event: KeyboardEvent) => {
    const focusedIndex = sortOptionRefs.current.findIndex(
      (option) => option === document.activeElement
    );
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusSortOption(
        (focusedIndex < 0 ? selectedSortIndex : focusedIndex) +
          (event.key === "ArrowDown" ? 1 : -1)
      );
    } else if (event.key === "Home") {
      event.preventDefault();
      focusSortOption(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusSortOption(SORT_OPTIONS.length - 1);
    }
  };
  const priceMinPercent =
    ((priceMin - PRICE_SLIDER_MIN) / (PRICE_SLIDER_MAX - PRICE_SLIDER_MIN)) * 100;
  const priceMaxPercent =
    ((priceMax - PRICE_SLIDER_MIN) / (PRICE_SLIDER_MAX - PRICE_SLIDER_MIN)) * 100;

  return {
    filtered,
    selectedColors,
    priceMin,
    priceMax,
    priceDragging,
    favoritesOnly,
    sort,
    openFilter,
    sortOpen,
    filtersOpen,
    sortRef,
    filtersRef,
    filterDialogRef,
    sortOptionRefs,
    priceDraggingRef,
    setPriceMin,
    setPriceMax,
    setAppliedPriceMin,
    setAppliedPriceMax,
    setFavoritesOnly,
    setSort,
    setOpenFilter,
    setSortOpen,
    setFiltersOpen,
    commitPriceFilter,
    beginPriceDrag,
    toggleColor,
    priceRangeActive,
    clearFilters,
    hasSidebarFilters,
    filterSignature,
    sortLabel,
    selectedSortIndex,
    focusSortOption,
    handleSortKeyDown,
    priceMinPercent,
    priceMaxPercent,
  };
}
