"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "@/lib/icons";
import {
  getMaxColorGalleryImages,
  MAX_COLOR_PRODUCTS,
} from "@/lib/products";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWishlist } from "@/hooks/useWishlist";
import { NewBadge } from "@/components/ui/NewBadge";
import { loadGsap } from "@/lib/gsapClient";
import { cn } from "@/lib/utils";

const VIEW_LABELS = [
  "product shot",
  "alternate view",
  "stand view",
  "smart case view",
  "studio angle",
] as const;

const AUTO_MS = 2500;
const FADE_MS = 0.45;

interface ProductGalleryProps {
  productId: number;
  colorId: string;
  title: string;
  isNew?: boolean;
}

export function ProductGallery({
  productId,
  colorId,
  title,
  isNew = false,
}: ProductGalleryProps) {
  const [activeView, setActiveView] = useState(0);
  const [autoKey, setAutoKey] = useState(0);
  const [loadedSrcs, setLoadedSrcs] = useState<Record<string, boolean>>({});
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const { isFavorite, toggleFavorite } = useWishlist();
  const colorProduct =
    MAX_COLOR_PRODUCTS.find((item) => item.colorId === colorId) ??
    MAX_COLOR_PRODUCTS[0];
  const liked = isFavorite(productId, colorId);

  const galleryImages = useMemo(
    () => getMaxColorGalleryImages(colorId),
    [colorId]
  );
  const thumbCount = galleryImages.length;
  const primarySrc = galleryImages[0];
  const primaryLoaded = Boolean(primarySrc && loadedSrcs[primarySrc]);

  const markLoaded = useCallback((src: string) => {
    setLoadedSrcs((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  }, []);

  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const busyRef = useRef(false);
  const autoTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const setLayerRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      layerRefs.current[index] = el;
    },
    []
  );


  const transitionTo = useCallback(
    async (nextIndex: number) => {
      if (busyRef.current || nextIndex === activeRef.current) return;
      if (nextIndex < 0 || nextIndex >= galleryImages.length) return;

      const from = layerRefs.current[activeRef.current];
      const to = layerRefs.current[nextIndex];
      const gsap = await loadGsap();
      if (!from?.isConnected || !to?.isConnected) return;

      if (reduceMotion) {
        const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];
        gsap.killTweensOf(layers);
        layers.forEach((layer, i) => {
          gsap.set(layer, {
            opacity: i === nextIndex ? 1 : 0,
            zIndex: i === nextIndex ? 2 : 1,
          });
        });
        activeRef.current = nextIndex;
        setActiveView(nextIndex);
        return;
      }

      busyRef.current = true;
      activeRef.current = nextIndex;
      setActiveView(nextIndex);
      gsap.killTweensOf([from, to]);

      gsap.set(to, { opacity: 0, zIndex: 3 });
      gsap.set(from, { zIndex: 2 });

      gsap
        .timeline({
          defaults: { ease: "power2.inOut", duration: FADE_MS },
          onComplete: () => {
            // Guard: node may already be gone after a fast finish switch.
            if (!from.isConnected || !to.isConnected) {
              busyRef.current = false;
              return;
            }
            gsap.set(from, { opacity: 0, zIndex: 1 });
            gsap.set(to, { opacity: 1, zIndex: 2 });
            busyRef.current = false;
          },
        })
        .to(from, { opacity: 0 }, 0)
        .to(to, { opacity: 1 }, 0);
    },
    [galleryImages.length, reduceMotion]
  );

  const goTo = useCallback(
    (index: number) => {
      transitionTo(index);
      setAutoKey((key) => key + 1);
    },
    [transitionTo]
  );

  const goPrev = () => {
    goTo((activeRef.current - 1 + thumbCount) % thumbCount);
  };

  const goNext = () => {
    goTo((activeRef.current + 1) % thumbCount);
  };

  const onTouchStart = (event: React.TouchEvent) => {
    if (thumbCount < 2) return;
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || thumbCount < 2 || busyRef.current) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;

    if (dx < 0) goNext();
    else goPrev();
  };

  useEffect(() => {
    if (reduceMotion || thumbCount < 2) {
      if (autoTimerRef.current != null) {
        window.clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
      return;
    }

    const schedule = () => {
      autoTimerRef.current = window.setTimeout(() => {
        if (!busyRef.current) {
          transitionTo((activeRef.current + 1) % thumbCount);
        }
        schedule();
      }, AUTO_MS);
    };

    schedule();

    return () => {
      if (autoTimerRef.current != null) {
        window.clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [reduceMotion, thumbCount, transitionTo, colorId, autoKey]);

  // Soft finish switches must NOT remount this gallery (React head hoistable
  // removeChild crash). Reset layers in place when the color changes.
  useEffect(() => {
    let cancelled = false;
    activeRef.current = 0;
    busyRef.current = false;
    setActiveView(0);
    setLoadedSrcs({});
    setAutoKey((key) => key + 1);

    void loadGsap().then((gsap) => {
      if (cancelled) return;
      const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.killTweensOf(layers);
      layers.forEach((layer, index) => {
        if (!layer.isConnected) return;
        gsap.set(layer, {
          opacity: index === 0 ? 1 : 0,
          zIndex: index === 0 ? 2 : 1,
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, [colorId]);

  useEffect(() => {
    const layerNodes = [...layerRefs.current];
    return () => {
      if (autoTimerRef.current != null) {
        window.clearTimeout(autoTimerRef.current);
      }
      const layers = layerNodes.filter(Boolean) as HTMLDivElement[];
      void loadGsap().then((gsap) => gsap.killTweensOf(layers));
    };
  }, []);

  const viewLabel = VIEW_LABELS[activeView] ?? "view";

  return (
    <div className="flex items-stretch gap-3 md:gap-4 lg:items-start lg:min-h-[min(72vh,720px)]">
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeView}`}
        className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] lg:min-h-[min(72vh,720px)]"
        style={{ backgroundColor: colorProduct.pastel }}
      >
        <div
          className="relative aspect-square w-full min-h-0 flex-1 touch-pan-y overflow-hidden lg:aspect-auto"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {isNew ? <NewBadge className="absolute left-4 top-4 z-10" /> : null}

          <button
            type="button"
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={liked}
            onClick={() =>
              toggleFavorite({
                productId,
                title: colorProduct.name,
                colorLabel: colorProduct.colorLabel,
                colorId,
                price: colorProduct.price,
                image: colorProduct.image,
                href: `/product/${productId}?color=${colorId}`,
                pastel: colorProduct.pastel,
              })
            }
            className={cn(
              "absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-[2px] transition-colors duration-300 hover:text-brand",
              liked && "text-brand"
            )}
          >
            <Heart
              size={18}
              strokeWidth={1.75}
              className={cn(liked && "fill-brand")}
              aria-hidden
            />
          </button>

          {!primaryLoaded ? (
            <div
              className="absolute inset-0 z-[5] animate-pulse bg-[#E8E8EA]"
              aria-hidden
            />
          ) : null}

          {galleryImages.map((src, index) => (
            <div
              key={src}
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
                alt={
                  index === activeView
                    ? `${title} — ${viewLabel}`
                    : ""
                }
                fill
                // Never use next/image `priority` here — preload hoistables in
                // <head> race removeChild when finishes switch quickly.
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
                onLoad={() => markLoaded(src)}
                className={cn(
                  "object-contain object-center p-8 sm:p-10 md:p-12 transition-opacity duration-300",
                  loadedSrcs[src] ? "opacity-100" : "opacity-0"
                )}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-center px-4 pb-4 pt-1 sm:pb-5">
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-2 py-1.5 shadow-sm backdrop-blur-[2px]">
            <button
              type="button"
              aria-label="Previous image"
              onClick={goPrev}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-ink transition-colors brand-soft-hover"
            >
              <ChevronLeft size={16} strokeWidth={2.25} aria-hidden />
            </button>
            <div className="flex items-center gap-1.5 px-1">
              {Array.from({ length: thumbCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === activeView
                      ? "w-4 bg-brand"
                      : "w-1.5 bg-brand-border hover:bg-brand/50"
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next image"
              onClick={goNext}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-ink transition-colors brand-soft-hover"
            >
              <ChevronRight size={16} strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div
        className="flex w-14 shrink-0 flex-col justify-between self-stretch sm:w-16 md:w-[4.5rem] lg:w-[4.5rem] lg:justify-start lg:gap-2 lg:self-start"
        role="tablist"
        aria-label={`${title} gallery views`}
        aria-orientation="vertical"
        onKeyDown={(event) => {
          if (thumbCount < 2) return;
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          const delta = event.key === "ArrowDown" ? 1 : -1;
          const next =
            (activeView + delta + thumbCount) % thumbCount;
          goTo(next);
          window.requestAnimationFrame(() => {
            document.getElementById(`${baseId}-tab-${next}`)?.focus();
          });
        }}
      >
        {galleryImages.map((thumbSrc, index) => {
          const isActive = activeView === index;
          return (
            <button
              key={thumbSrc}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel`}
              aria-label={`${title} ${VIEW_LABELS[index] ?? "view"}`}
              onClick={() => goTo(index)}
              className={cn(
                "relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl border-2 transition-colors lg:h-[4.5rem] lg:w-[4.5rem]",
                isActive
                  ? "border-brand"
                  : "border-transparent hover:border-brand-border"
              )}
              style={{ backgroundColor: colorProduct.pastel }}
            >
              <Image
                src={thumbSrc}
                alt=""
                fill
                className="object-contain p-1.5"
                sizes="72px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
