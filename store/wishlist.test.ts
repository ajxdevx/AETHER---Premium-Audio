import { describe, expect, it } from "vitest";
import {
  getWishlistKey,
  wishlistReducer,
  type WishlistItem,
} from "@/store/wishlist";

const item = (colorId: string): WishlistItem => ({
  key: getWishlistKey(4, colorId),
  productId: 4,
  title: `${colorId} Aether Pods`,
  colorLabel: colorId,
  colorId,
  price: 2490,
  image: `/${colorId}.png`,
  href: `/products/4?color=${colorId}`,
});

describe("wishlistReducer", () => {
  it("toggles an item on and off", () => {
    const green = item("green");
    const added = wishlistReducer([], { type: "TOGGLE", item: green });

    expect(added).toEqual([green]);
    expect(wishlistReducer(added, { type: "TOGGLE", item: green })).toEqual([]);
  });

  it("adds the newest item first and preserves other variants", () => {
    const green = item("green");
    const blue = item("blue");

    expect(
      wishlistReducer([green], { type: "TOGGLE", item: blue }).map(
        (entry) => entry.colorId
      )
    ).toEqual(["blue", "green"]);
  });

  it("removes, clears, and hydrates deterministically", () => {
    const items = [item("green"), item("pink")];

    expect(
      wishlistReducer(items, { type: "REMOVE", key: items[0].key })
    ).toEqual([items[1]]);
    expect(wishlistReducer(items, { type: "CLEAR" })).toEqual([]);
    expect(wishlistReducer([], { type: "HYDRATE", items })).toEqual(items);
  });
});
