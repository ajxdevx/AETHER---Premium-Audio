import { describe, expect, it } from "vitest";
import {
  filterMaxColorProducts,
  searchFaqs,
  searchSite,
} from "@/lib/siteSearch";

describe("filterMaxColorProducts", () => {
  it("matches design names", () => {
    const results = filterMaxColorProducts("matcha");
    expect(results.map((item) => item.colorId)).toEqual(["green"]);
  });

  it("matches color aliases", () => {
    expect(filterMaxColorProducts("blush")[0]?.colorId).toBe("pink");
    expect(filterMaxColorProducts("midnight")[0]?.colorId).toBe("black");
    expect(filterMaxColorProducts("sky")[0]?.colorId).toBe("blue");
  });

  it("matches product features and catalog terms", () => {
    const battery = filterMaxColorProducts("battery");
    expect(battery.length).toBeGreaterThan(0);

    const wireless = filterMaxColorProducts("wireless headphones");
    expect(wireless.length).toBeGreaterThan(0);
  });

  it("returns all finishes for an empty query", () => {
    expect(filterMaxColorProducts("")).toHaveLength(4);
  });
});

describe("searchFaqs", () => {
  it("matches shipping and returns questions", () => {
    expect(searchFaqs("shipping")[0]?.id).toBe("shipping");
    expect(searchFaqs("return policy")[0]?.id).toBe("returns");
  });

  it("matches answer content", () => {
    expect(searchFaqs("morocco")[0]?.id).toBe("shipping");
    expect(searchFaqs("trade in")[0]?.id).toBe("trade-in");
  });
});

describe("searchSite", () => {
  it("returns products and faqs together", () => {
    const results = searchSite("battery");
    expect(results.products.length).toBeGreaterThan(0);
    expect(results.faqs.some((faq) => faq.id === "battery")).toBe(true);
  });
});
