"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { setLenisInstance } from "@/lib/smoothScroll";
import "lenis/dist/lenis.css";

/**
 * Framer handles UI chrome; GSAP handles media morphs/hovers; Lenis is
 * optional marketing-page scrolling (disabled on cart/checkout).
 * Skips when the user prefers reduced motion.
 */
function shouldSkipLenis(pathname: string) {
  return (
    pathname === "/cart" ||
    pathname.startsWith("/cart/") ||
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/")
  );
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (
      shouldSkipLenis(pathname) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setLenisInstance(null);
      return;
    }

    let lenis: Lenis | null = null;
    let cancelled = false;

    const startId = window.setTimeout(async () => {
      if (cancelled) return;
      const { default: LenisConstructor } = await import("lenis");
      if (cancelled) return;

      lenis = new LenisConstructor({
        autoRaf: true,
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.2,
        anchors: false,
        stopInertiaOnNavigate: true,
        prevent: (node) =>
          Boolean(
            node.closest(
              "[data-lenis-prevent],[data-lenis-prevent-wheel],[data-lenis-prevent-touch]"
            )
          ),
      });
      setLenisInstance(lenis);
    }, 320);

    return () => {
      cancelled = true;
      window.clearTimeout(startId);
      setLenisInstance(null);
      lenis?.destroy();
    };
  }, [pathname]);

  return children;
}
