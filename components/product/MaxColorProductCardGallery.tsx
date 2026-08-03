"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SIGNATURE_THEMES,
  type SignatureThemeId,
} from "@/constants/brand";
import { getMaxColorGalleryImages } from "@/lib/products";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { loadGsap } from "@/lib/gsapClient";
import { cn } from "@/lib/utils";

const CARD_VIEW_MS = 2500;

export function productAccent(colorId: string) {
  const theme = SIGNATURE_THEMES[colorId as SignatureThemeId];
  return theme?.accent ?? SIGNATURE_THEMES.green.accent;
}

type MaxColorProductCardGalleryProps = {
  productId: number;
  name: string;
  colorId: string;
  largeImage?: boolean;
  /** Only the first above-the-fold card should opt in. */
  priority?: boolean;
  isTouch: boolean;
  cardHover: boolean;
  /** When false, skip hover/touch gallery auto-cycle. */
  allowCycle?: boolean;
};

export function MaxColorProductCardGallery({
  productId,
  name,
  colorId,
  largeImage = false,
  priority = false,
  isTouch,
  cardHover,
  allowCycle = true,
}: MaxColorProductCardGalleryProps) {
  const reduceMotion = useReducedMotion();
  const [activeView, setActiveView] = useState(0);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const viewRef = useRef(0);
  const busyRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const didSwipeRef = useRef(false);
  const galleryImages = useMemo(
    () => getMaxColorGalleryImages(colorId),
    [colorId]
  );

  const setLayerRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      layerRefs.current[index] = el;
    },
    []
  );


  useEffect(() => {
    const layerNodes = layerRefs.current;
    return () => {
      const layers = layerNodes.filter(Boolean) as HTMLDivElement[];
      void loadGsap().then((gsap) => gsap.killTweensOf(layers));
    };
  }, []);

  const morphTo = useCallback(
    async (nextIndex: number, instant = false) => {
      if (busyRef.current && !instant) return;
      if (nextIndex === viewRef.current && !instant) return;
      if (nextIndex < 0 || nextIndex >= galleryImages.length) return;

      const from = layerRefs.current[viewRef.current];
      const to = layerRefs.current[nextIndex];
      const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];
      const gsap = await loadGsap();
      if (!from?.isConnected || !to?.isConnected) return;

      if (reduceMotion || instant) {
        gsap.killTweensOf(layers);
        layers.forEach((layer, i) => {
          gsap.set(layer, {
            opacity: i === nextIndex ? 1 : 0,
            zIndex: i === nextIndex ? 2 : 1,
          });
        });
        viewRef.current = nextIndex;
        setActiveView(nextIndex);
        busyRef.current = false;
        return;
      }

      busyRef.current = true;
      gsap.killTweensOf([from, to]);
      gsap.set(to, { opacity: 0, zIndex: 3 });
      gsap.set(from, { zIndex: 2 });

      gsap
        .timeline({
          defaults: { ease: "power2.inOut", duration: 0.4 },
          onComplete: () => {
            if (!from.isConnected || !to.isConnected) {
              busyRef.current = false;
              return;
            }
            gsap.set(from, { opacity: 0, zIndex: 1 });
            gsap.set(to, { opacity: 1, zIndex: 2 });
            viewRef.current = nextIndex;
            setActiveView(nextIndex);
            busyRef.current = false;
          },
        })
        .to(from, { opacity: 0 }, 0)
        .to(to, { opacity: 1 }, 0);
    },
    [galleryImages.length, reduceMotion]
  );

  useEffect(() => {
    const shouldCycle =
      allowCycle &&
      !reduceMotion &&
      galleryImages.length >= 2 &&
      (isTouch || cardHover);

    if (!shouldCycle) {
      if (!isTouch) {
        const resetId = window.requestAnimationFrame(() => {
          void morphTo(0, true);
        });
        return () => window.cancelAnimationFrame(resetId);
      }
      return;
    }

    const id = window.setInterval(() => {
      if (busyRef.current) return;
      morphTo((viewRef.current + 1) % galleryImages.length);
    }, CARD_VIEW_MS);
    return () => window.clearInterval(id);
  }, [allowCycle, cardHover, isTouch, reduceMotion, galleryImages, morphTo]);

  const onMediaTouchStart = (event: React.TouchEvent) => {
    if (galleryImages.length < 2) return;
    const touch = event.touches[0];
    if (!touch) return;
    didSwipeRef.current = false;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onMediaTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || galleryImages.length < 2 || busyRef.current) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;

    didSwipeRef.current = true;
    if (dx < 0) morphTo((viewRef.current + 1) % galleryImages.length);
    else
      morphTo(
        (viewRef.current - 1 + galleryImages.length) % galleryImages.length
      );
  };

  const onMediaClick = (event: React.MouseEvent) => {
    if (!didSwipeRef.current) return;
    event.preventDefault();
    didSwipeRef.current = false;
  };

  return (
    <Link
      href={`/product/${productId}?color=${colorId}`}
      scroll
      data-award-media
      onTouchStart={onMediaTouchStart}
      onTouchEnd={onMediaTouchEnd}
      onClick={onMediaClick}
      className={cn(
        "relative mx-auto mt-1 block aspect-square cursor-pointer touch-pan-y overflow-hidden will-change-transform",
        largeImage
          ? "w-[96%] max-w-[300px] sm:w-[98%] sm:max-w-[320px]"
          : "w-[86%] max-w-[228px] sm:w-[88%] sm:max-w-[236px]"
      )}
      aria-label={`View ${name}`}
    >
      <div
        className="pointer-events-none absolute inset-x-[8%] top-[4%] z-[1] h-[42%] rounded-[100%] bg-white/45 blur-2xl"
        aria-hidden
      />
      {galleryImages.map((src, index) => (
        <div
          key={index}
          ref={setLayerRef(index)}
          className="absolute inset-0"
          style={{
            opacity: index === 0 ? 1 : 0,
            zIndex: index === 0 ? 2 : 1,
          }}
          aria-hidden={index !== activeView}
        >
          <Image
            src={src}
            alt={index === activeView ? name : ""}
            fill
            fetchPriority={priority && index === 0 ? "high" : "auto"}
            loading={priority && index === 0 ? "eager" : "lazy"}
            className={cn(
              "object-contain object-center",
              largeImage
                ? "scale-[1.08] p-1.5 sm:p-2"
                : "p-3 sm:p-3.5"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ))}
    </Link>
  );
}
