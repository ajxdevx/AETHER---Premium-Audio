"use client";

import { useCallback, useEffect, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/gsapClient";

type SpotlightMagneticOptions = {
  /** Scale/pan the media layer on hover. Default true. */
  mediaZoom?: boolean;
  /** Drift the text/copy opposite the cursor. Default true. */
  copyMotion?: boolean;
};

/**
 * Distinct from product-card 3D tilt: magnetic cursor glow, liquid border,
 * content/image split motion — flat plane, no rotateX/Y.
 */
export function useSpotlightMagneticHover(
  cardRef: RefObject<HTMLElement | null>,
  { mediaZoom = true, copyMotion = true }: SpotlightMagneticOptions = {}
) {
  const reduceMotion = useReducedMotion();

  const reset = useCallback(async () => {
    const card = cardRef.current;
    if (!card) return;
    const gsap = await loadGsap();
    if (!card.isConnected) return;

    const media = card.querySelectorAll<HTMLElement>("[data-spotlight-media]");
    const copy = card.querySelectorAll<HTMLElement>("[data-spotlight-copy]");
    const glow = card.querySelector<HTMLElement>("[data-spotlight-glow]");
    const rim = card.querySelector<HTMLElement>("[data-spotlight-rim]");
    const veil = card.querySelector<HTMLElement>("[data-spotlight-veil]");

    gsap.to(card, {
      scale: 1,
      y: 0,
      duration: 0.85,
      ease: "expo.out",
    });
    if (media.length && mediaZoom) {
      gsap.to(media, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
      });
    }
    if (copy.length && copyMotion) {
      gsap.to(copy, {
        x: 0,
        y: 0,
        duration: 0.85,
        ease: "expo.out",
      });
    }
    if (glow) {
      gsap.to(glow, {
        opacity: 0,
        scale: 0.6,
        duration: 0.55,
        ease: "power2.out",
      });
    }
    if (rim) {
      gsap.to(rim, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    if (veil) {
      gsap.to(veil, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [cardRef, copyMotion, mediaZoom]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || reduceMotion) return;

    let disposed = false;
    let cleanup = () => {};

    void loadGsap().then((gsap) => {
      if (disposed) return;
      const glow = card.querySelector<HTMLElement>("[data-spotlight-glow]");
      const rim = card.querySelector<HTMLElement>("[data-spotlight-rim]");

      gsap.set(card, { transformOrigin: "50% 50%" });
      if (glow) gsap.set(glow, { xPercent: -50, yPercent: -50, scale: 0.6 });

      const onEnter = () => {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.7,
        ease: "expo.out",
        overwrite: "auto",
      });
      if (rim) {
        gsap.to(rim, {
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      };

      const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const dx = px - 0.5;
      const dy = py - 0.5;

      const media = card.querySelectorAll<HTMLElement>("[data-spotlight-media]");
      const copy = card.querySelectorAll<HTMLElement>("[data-spotlight-copy]");
      const veil = card.querySelector<HTMLElement>("[data-spotlight-veil]");

      if (glow) {
        gsap.to(glow, {
          left: `${px * 100}%`,
          top: `${py * 100}%`,
          opacity: 0.85,
          scale: 1,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      if (rim) {
        gsap.to(rim, {
          background: `radial-gradient(520px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.7), transparent 42%)`,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (mediaZoom && media.length) {
        gsap.to(media, {
          scale: 1.14,
          x: dx * 28,
          y: dy * 22,
          duration: 0.75,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      if (copyMotion && copy.length) {
        gsap.to(copy, {
          x: dx * -14,
          y: dy * -10,
          duration: 0.7,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      if (veil) {
        gsap.to(veil, {
          opacity: 0.22,
          background: `radial-gradient(460px circle at ${px * 100}% ${py * 100}%, transparent 20%, rgba(20,18,14,0.18) 70%)`,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      };

      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", reset);
      card.addEventListener("pointercancel", reset);

      cleanup = () => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", reset);
        card.removeEventListener("pointercancel", reset);
        const media = card.querySelectorAll<HTMLElement>("[data-spotlight-media]");
        const copy = card.querySelectorAll<HTMLElement>("[data-spotlight-copy]");
        const veil = card.querySelector<HTMLElement>("[data-spotlight-veil]");
        gsap.killTweensOf([card, glow, rim, veil, ...media, ...copy].filter(Boolean));
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [cardRef, copyMotion, mediaZoom, reduceMotion, reset]);
}
