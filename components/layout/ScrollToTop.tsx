"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import {
  cancelAllNavScrolls,
  enableManualScrollRestoration,
  forceScrollToTop,
  hasPendingHomeHash,
  scrollToHashWhenReady,
  scrollToPendingHomeSection,
  snapToTopWhenReady,
} from "@/lib/navScroll";

function snapHomeToTopUnlessSectionPending() {
  if (hasPendingHomeHash() || window.location.hash.slice(1)) {
    return;
  }

  forceScrollToTop();
}

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    enableManualScrollRestoration();
  }, []);

  useLayoutEffect(() => {
    if (pathname === "/") {
      snapHomeToTopUnlessSectionPending();
      return;
    }

    cancelAllNavScrolls();
    forceScrollToTop();
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      snapToTopWhenReady(pathname);
      return;
    }

    if (scrollToPendingHomeSection()) {
      return;
    }

    const hash = window.location.hash.slice(1);
    if (hash) {
      scrollToHashWhenReady(hash, "auto");
      return;
    }

    snapToTopWhenReady("/");
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.pathname !== "/") {
        return;
      }

      const hash = window.location.hash.slice(1);
      if (hash) {
        scrollToHashWhenReady(hash, "smooth");
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
