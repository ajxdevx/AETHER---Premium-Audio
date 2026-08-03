"use client";

import { useEffect } from "react";
import { restoreStaleImages } from "@/lib/restoreStaleImages";

const MIN_HIDDEN_MS = 2_000;

/**
 * After a long background/idle period browsers discard decoded image bitmaps.
 * Cart/checkout thumbs and payment logos then show alt text until the img is
 * re-requested. Restore them when the tab becomes visible again.
 */
export function RestoreImagesOnResume() {
  useEffect(() => {
    let hiddenAt = 0;
    let resumeTimer = 0;

    const scheduleRestore = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        restoreStaleImages();
      }, 50);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
        return;
      }

      if (hiddenAt > 0 && Date.now() - hiddenAt < MIN_HIDDEN_MS) return;
      scheduleRestore();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) scheduleRestore();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.clearTimeout(resumeTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
