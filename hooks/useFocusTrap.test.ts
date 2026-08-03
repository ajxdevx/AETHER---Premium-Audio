import { describe, expect, it } from "vitest";
import { getFocusableElements } from "@/hooks/useFocusTrap";

describe("getFocusableElements", () => {
  it("returns focusable controls and skips disabled / negative tabindex", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <a href="/shop">Shop</a>
      <button type="button">Open</button>
      <button type="button" disabled>Disabled</button>
      <input type="text" />
      <input type="text" disabled />
      <div tabindex="0">Focusable</div>
      <div tabindex="-1">Skip</div>
    `;

    const focusable = getFocusableElements(root);
    expect(focusable.map((el) => el.tagName.toLowerCase() + (el.getAttribute("tabindex") ?? ""))).toEqual([
      "a",
      "button",
      "input",
      "div0",
    ]);
  });

  it("returns an empty list when nothing is focusable", () => {
    const root = document.createElement("div");
    root.innerHTML = `<span>No controls</span><button disabled>Nope</button>`;
    expect(getFocusableElements(root)).toEqual([]);
  });
});
