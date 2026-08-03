import { afterEach, describe, expect, it, vi } from "vitest";
import { restoreStaleImages } from "@/lib/restoreStaleImages";

describe("restoreStaleImages", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reassigns src for images that failed to decode", () => {
    const img = document.createElement("img");
    img.setAttribute("src", "/payments/visa.png");
    Object.defineProperty(img, "complete", { value: true });
    Object.defineProperty(img, "naturalWidth", { value: 0 });
    document.body.appendChild(img);

    const removeSpy = vi.spyOn(img, "removeAttribute");
    restoreStaleImages();

    expect(removeSpy).toHaveBeenCalledWith("src");
    expect(img.getAttribute("src") ?? img.src).toContain("/payments/visa.png");
  });

  it("skips healthy images", () => {
    const img = document.createElement("img");
    img.setAttribute("src", "/payments/visa.png");
    Object.defineProperty(img, "complete", { value: true });
    Object.defineProperty(img, "naturalWidth", { value: 56 });
    document.body.appendChild(img);

    const removeSpy = vi.spyOn(img, "removeAttribute");
    restoreStaleImages();

    expect(removeSpy).not.toHaveBeenCalled();
  });
});
