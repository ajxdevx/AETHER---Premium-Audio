"use client";

import { useCallback, useEffect, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/gsapClient";

type AwardHoverOptions = {
  enabled?: boolean;
  mediaSelector?: string;
  maxTilt?: number;
  lift?: number;
  mediaScale?: number;
};

/**
 * Awwwards-style 3D tilt + media parallax + soft shine follow.
 * Card should include an optional `[data-award-shine]` layer and media marked with `mediaSelector`.
 */
export function useAwardCardHover(
  cardRef: RefObject<HTMLElement | null>,
  {
    enabled = true,
    mediaSelector = "[data-award-media]",
    maxTilt = 10,
    lift = -6,
    mediaScale = 1.08,
  }: AwardHoverOptions = {}
) {
  const reduceMotion = useReducedMotion();
  const active = enabled && !reduceMotion;

  const reset = useCallback(async () => {
    const card = cardRef.current;
    if (!card) return;
    const gsap = await loadGsap();
    if (!card.isConnected) return;

    const media = card.querySelectorAll<HTMLElement>(mediaSelector);
    const shine = card.querySelector<HTMLElement>("[data-award-shine]");

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
    });
    if (media.length) {
      gsap.to(media, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      });
    }
    if (shine) {
      gsap.to(shine, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });
    }
  }, [cardRef, mediaSelector]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !active) return;

    let disposed = false;
    let cleanup = () => {};

    void loadGsap().then((gsap) => {
      if (disposed) return;
      gsap.set(card, { transformPerspective: 900, transformStyle: "preserve-3d" });

      const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * maxTilt * 1.2;
      const rotateX = (0.5 - py) * maxTilt;
      const media = card.querySelectorAll<HTMLElement>(mediaSelector);
      const shine = card.querySelector<HTMLElement>("[data-award-shine]");

      gsap.to(card, {
        rotateX,
        rotateY,
        y: lift,
        scale: 1.015,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (media.length) {
        gsap.to(media, {
          scale: mediaScale,
          x: (px - 0.5) * -10,
          y: (py - 0.5) * -6,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      if (shine) {
        gsap.to(shine, {
          opacity: 0.5,
          background: `radial-gradient(380px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.55), transparent 55%)`,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      };

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", reset);
      card.addEventListener("pointercancel", reset);

      cleanup = () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", reset);
        card.removeEventListener("pointercancel", reset);
        const media = card.querySelectorAll<HTMLElement>(mediaSelector);
        const shine = card.querySelector<HTMLElement>("[data-award-shine]");
        // Kill only — never tween or clearProps during unmount (DOM races).
        gsap.killTweensOf([card, shine, ...media].filter(Boolean));
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [active, cardRef, lift, maxTilt, mediaScale, mediaSelector, reset]);
}
