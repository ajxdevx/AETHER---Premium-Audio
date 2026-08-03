import { describe, expect, it } from "vitest";
import { MAX_COLOR_PRODUCTS } from "@/lib/products";
import { filterAndSortShopProducts } from "@/lib/shopFilters";

const defaults = {
  selectedColors: [] as string[],
  priceMin: 0,
  priceMax: 5000,
  favoritesOnly: false,
  isFavorite: () => false,
  sort: "featured" as const,
};

describe("filterAndSortShopProducts", () => {
  it("filters by inclusive price range and selected colors", () => {
    const result = filterAndSortShopProducts(MAX_COLOR_PRODUCTS, {
      ...defaults,
      selectedColors: ["green", "blue", "black"],
      priceMin: 1990,
      priceMax: 2190,
    });

    expect(result.map((product) => product.colorId)).toEqual(["green", "blue"]);
  });

  it("filters favorites and search matches together", () => {
    const result = filterAndSortShopProducts(MAX_COLOR_PRODUCTS, {
      ...defaults,
      favoritesOnly: true,
      isFavorite: (colorId) => colorId === "pink" || colorId === "blue",
      matchedColorIds: new Set(["blue", "black"]),
    });

    expect(result.map((product) => product.colorId)).toEqual(["blue"]);
  });

  it("sorts by price without mutating the source order", () => {
    const source = [...MAX_COLOR_PRODUCTS];
    const result = filterAndSortShopProducts(source, {
      ...defaults,
      sort: "price-desc",
    });

    expect(result.map((product) => product.price)).toEqual([2490, 2490, 2190, 1990]);
    expect(source.map((product) => product.colorId)).toEqual([
      "green",
      "black",
      "pink",
      "blue",
    ]);
  });

  it("breaks rating ties by review count", () => {
    const products = [
      { ...MAX_COLOR_PRODUCTS[0], rating: 4.8, reviewCount: 10 },
      { ...MAX_COLOR_PRODUCTS[1], rating: 4.8, reviewCount: 20 },
    ];

    expect(
      filterAndSortShopProducts(products, { ...defaults, sort: "rating" }).map(
        (product) => product.colorId
      )
    ).toEqual(["black", "green"]);
  });
});
