const MAX_RESTORES_PER_SRC = 3;
const restoreCounts = new WeakMap<HTMLImageElement, number>();

/** Re-request images that lost their decoded bitmap after tab sleep / bfcache. */
export function restoreStaleImages(root: ParentNode = document) {
  const images = root.querySelectorAll("img");

  images.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) return;

    const src = img.currentSrc || img.getAttribute("src");
    if (!src) return;

    const attempts = restoreCounts.get(img) ?? 0;
    if (attempts >= MAX_RESTORES_PER_SRC) return;
    restoreCounts.set(img, attempts + 1);

    const srcset = img.getAttribute("srcset");
    img.removeAttribute("src");
    if (srcset) img.removeAttribute("srcset");

    // Force a fresh network/cache fetch of the same URL.
    img.src = src;
    if (srcset) img.setAttribute("srcset", srcset);
  });
}
