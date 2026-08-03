import { describe, expect, it } from "vitest";
import * as products from "@/lib/products";

describe("lib/products facade", () => {
  it("exposes catalog, color, and max-product domain APIs", () => {
    expect(typeof products.getAllCatalogIds).toBe("function");
    expect(typeof products.resolveProductColorId).toBe("function");
    expect(typeof products.getMaxColorProduct).toBe("function");
    expect(typeof products.getProductPreviewDescription).toBe("function");
    expect(typeof products.getRatingBarDistribution).toBe("function");
    expect(products.MAX_COLOR_PRODUCTS.length).toBeGreaterThan(0);
    expect(products.getMaxColorProduct("green").colorId).toBe("green");
  });
});
