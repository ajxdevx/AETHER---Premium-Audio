import { getImageProps } from "next/image";

export function preloadImage(src: string) {
  if (typeof window === "undefined") return;
  const img = new window.Image();
  img.src = src;
}

/**
 * Resolve when a Next-optimized image is decoded (or fails).
 * Uses the same optimizer URL the `<Image>` component will request.
 */
export function loadOptimizedImage(src: string, width = 1080): Promise<void> {
  if (typeof window === "undefined" || !src) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new window.Image();
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    img.onload = done;
    img.onerror = done;
    img.decoding = "async";

    try {
      const { props } = getImageProps({
        src,
        alt: "",
        width,
        height: width,
        quality: 75,
      });
      img.src = props.src;
    } catch {
      img.src = src;
    }

    if (img.complete) done();
  });
}
