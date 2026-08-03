import { describe, expect, it } from "vitest";
import { cartReducer, getCartTotals } from "@/store/cart";
import type { CartItem, Product } from "@/types/product";

const product = (overrides: Partial<Product> = {}): Product =>
  ({
    id: 1,
    title: "Aether Pods",
    description: "Test",
    price: 299,
    discountPercentage: 0,
    rating: 4.8,
    stock: 10,
    brand: "AETHER",
    category: "audio",
    thumbnail: "/pod.png",
    images: ["/pod.png"],
    ...overrides,
  }) as Product;

const line = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 1,
  lineKey: "1",
  title: "Aether Pods",
  price: 299,
  thumbnail: "/pod.png",
  quantity: 1,
  ...overrides,
});

describe("cartReducer", () => {
  it("adds a new line", () => {
    const next = cartReducer([], {
      type: "ADD",
      product: product(),
      quantity: 2,
      variant: "green",
    });

    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({
      lineKey: "1:green",
      quantity: 2,
      variant: "green",
      price: 299,
    });
  });

  it("merges quantity for the same line key", () => {
    const existing = [
      line({ lineKey: "1:green", variant: "green", quantity: 2 }),
    ];
    const next = cartReducer(existing, {
      type: "ADD",
      product: product(),
      quantity: 3,
      variant: "green",
    });

    expect(next).toHaveLength(1);
    expect(next[0].quantity).toBe(5);
  });

  it("clamps quantity to stock", () => {
    const next = cartReducer([], {
      type: "ADD",
      product: product({ stock: 3 }),
      quantity: 9,
      variant: "pink",
    });

    expect(next[0].quantity).toBe(3);
  });

  it("clamps merged and updated lines to their stored stock", () => {
    const existing = [
      line({ lineKey: "1:green", variant: "green", quantity: 2, stock: 3 }),
    ];
    const merged = cartReducer(existing, {
      type: "ADD",
      product: product({ stock: 10 }),
      quantity: 5,
      variant: "green",
    });

    expect(merged[0].quantity).toBe(3);
    expect(
      cartReducer(existing, {
        type: "UPDATE_QUANTITY",
        lineKey: "1:green",
        quantity: 99,
      })[0].quantity
    ).toBe(3);
  });

  it("uses the cart limit when stock is unavailable", () => {
    const next = cartReducer([], {
      type: "ADD",
      product: product({ stock: undefined }),
      quantity: 150,
    });

    expect(next[0].quantity).toBe(99);
  });

  it("removes a line", () => {
    const existing = [line({ lineKey: "a" }), line({ lineKey: "b", id: 2 })];
    expect(cartReducer(existing, { type: "REMOVE", lineKey: "a" })).toEqual([
      existing[1],
    ]);
  });

  it("updates quantity and removes when quantity is 0", () => {
    const existing = [line({ lineKey: "a", quantity: 2, stock: 5 })];
    expect(
      cartReducer(existing, {
        type: "UPDATE_QUANTITY",
        lineKey: "a",
        quantity: 4,
      })[0].quantity
    ).toBe(4);

    expect(
      cartReducer(existing, {
        type: "UPDATE_QUANTITY",
        lineKey: "a",
        quantity: 0,
      })
    ).toEqual([]);
  });

  it("clears and hydrates", () => {
    const existing = [line()];
    expect(cartReducer(existing, { type: "CLEAR" })).toEqual([]);

    const hydrated = cartReducer([], {
      type: "HYDRATE",
      items: [{ ...line({ id: 9 }), lineKey: undefined as unknown as string }],
    });
    expect(hydrated[0].lineKey).toBe("9:default");
  });
});

describe("getCartTotals", () => {
  it("sums item count and subtotal", () => {
    expect(
      getCartTotals([
        line({ quantity: 2, price: 100 }),
        line({ id: 2, lineKey: "2", quantity: 1, price: 50 }),
      ])
    ).toEqual({ itemCount: 3, subtotal: 250 });
  });

  it("handles an empty cart", () => {
    expect(getCartTotals([])).toEqual({ itemCount: 0, subtotal: 0 });
  });
});
