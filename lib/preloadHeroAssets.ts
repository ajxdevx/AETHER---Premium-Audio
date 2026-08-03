import { getImageProps } from "next/image";
import { ASSETS } from "@/constants/assets";

const HERO = ASSETS.marketing.hero;

/** Widths that match typical hero `sizes` output on phone → desktop. */
const PRELOAD_WIDTHS = [640, 1080] as const;

function optimizedSrc(src: string, width: number): string {
  const { props } = getImageProps({
    src,
    alt: "",
    width,
    height: width,
    quality: 75,
  });
  return props.src;
}

function warm(url: string) {
  if (typeof window === "undefined" || !url) return;
  const img = new window.Image();
  img.decoding = "async";
  img.src = url;
}

/**
 * Warm Next-optimized hero images during the signature intro so the first
 * hero reveal does not wait on cold CDN / image-optimizer fetches.
 */
export function preloadHeroAssets() {
  if (typeof window === "undefined") return;

  const sources = [HERO.stand, ...Object.values(HERO.pods)];

  for (const src of sources) {
    warm(src);
    for (const width of PRELOAD_WIDTHS) {
      try {
        warm(optimizedSrc(src, width));
      } catch {
      }
    }
  }
}

export function loadHeroImage(src: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

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
    try {
      img.src = optimizedSrc(src, 1080);
    } catch {
      img.src = src;
    }
    if (img.complete) done();
  });
}
