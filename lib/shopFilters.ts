import type { SortOption } from "@/components/shop/shopConstants";

export type ShopFilterableProduct = {
  colorId: string;
  price: number;
  rating: number;
  reviewCount: number;
};

export type ShopFilterOptions = {
  selectedColors: readonly string[];
  priceMin: number;
  priceMax: number;
  favoritesOnly: boolean;
  isFavorite: (colorId: string) => boolean;
  matchedColorIds?: ReadonlySet<string>;
  sort: SortOption;
};

export function filterAndSortShopProducts<T extends ShopFilterableProduct>(
  products: readonly T[],
  options: ShopFilterOptions
): T[] {
  let result = products.filter(
    (product) =>
      (options.selectedColors.length === 0 ||
        options.selectedColors.includes(product.colorId)) &&
      product.price >= options.priceMin &&
      product.price <= options.priceMax &&
      (!options.favoritesOnly || options.isFavorite(product.colorId)) &&
      (!options.matchedColorIds ||
        options.matchedColorIds.has(product.colorId))
  );

  switch (options.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result = [...result].sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
      );
      break;
  }

  return result;
}
