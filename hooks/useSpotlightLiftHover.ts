"use client";

import { useCallback, useEffect, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/gsapClient";

/**
 * Soft lift + image bloom for the smaller spotlight cards.
 * Deliberately different from the large card's magnetic cursor glow.
 */
export function useSpotlightLiftHover(
  cardRef: RefObject<HTMLElement | null>
) {
  const reduceMotion = useReducedMotion();

  const reset = useCallback(async () => {
    const card = cardRef.current;
    if (!card) return;
    const gsap = await loadGsap();
    if (!card.isConnected) return;

    const media = card.querySelectorAll<HTMLElement>("[data-spotlight-media]");
    const wash = card.querySelector<HTMLElement>("[data-spotlight-wash]");

    gsap.to(card, {
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "expo.out",
    });
    if (media.length) {
      gsap.to(media, {
        scale: 1,
        duration: 0.85,
        ease: "expo.out",
      });
    }
    if (wash) {
      gsap.to(wash, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });
    }
  }, [cardRef]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || reduceMotion) return;

    let disposed = false;
    let cleanup = () => {};

    void loadGsap().then((gsap) => {
      if (disposed) return;
      gsap.set(card, { transformOrigin: "50% 50%" });

      const onEnter = () => {
        const media = card.querySelectorAll<HTMLElement>("[data-spotlight-media]");
        const wash = card.querySelector<HTMLElement>("[data-spotlight-wash]");
        gsap.to(card, {
          y: -8,
          scale: 1.015,
          duration: 0.65,
          ease: "expo.out",
          overwrite: "auto",
        });
        if (media.length) gsap.to(media, { scale: 1.1, duration: 0.85, ease: "expo.out", overwrite: "auto" });
        if (wash) gsap.to(wash, { opacity: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      };

      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", reset);
      card.addEventListener("pointercancel", reset);
      cleanup = () => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", reset);
        card.removeEventListener("pointercancel", reset);
        const media = card.querySelectorAll<HTMLElement>("[data-spotlight-media]");
        const wash = card.querySelector<HTMLElement>("[data-spotlight-wash]");
        gsap.killTweensOf([card, wash, ...media].filter(Boolean));
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [cardRef, reduceMotion, reset]);
}
