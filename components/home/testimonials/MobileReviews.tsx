"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AUTO_MS, TESTIMONIALS } from "./data";
import { ReviewCard } from "./ReviewCard";

const REVIEW_GAP_PX = 12;

export function MobileReviews() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const pauseUntilRef = useRef(0);
  const getStride = useCallback((el: HTMLDivElement) => {
    const slide = el.children[0] as HTMLElement | undefined;
    return slide ? slide.offsetWidth + REVIEW_GAP_PX : el.clientWidth;
  }, []);
  const syncActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const stride = getStride(el);
    if (stride > 0) setActive(Math.max(0, Math.min(TESTIMONIALS.length - 1, Math.round(el.scrollLeft / stride))));
  }, [getStride]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncActive);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    syncActive();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [syncActive]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      if (performance.now() < pauseUntilRef.current) return;
      const el = scrollerRef.current;
      if (!el) return;
      const stride = getStride(el);
      const current = Math.round(el.scrollLeft / stride);
      el.scrollTo({ left: (current >= TESTIMONIALS.length - 1 ? 0 : current + 1) * stride, behavior: "smooth" });
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [getStride, reduceMotion]);

  const pauseAuto = (pausedAt: number) => {
    pauseUntilRef.current = pausedAt + AUTO_MS * 2;
  };
  const goTo = (index: number, pausedAt: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    pauseAuto(pausedAt);
    el.scrollTo({ left: index * getStride(el), behavior: reduceMotion ? "auto" : "smooth" });
    setActive(index);
  };

  return (
    <div className="md:hidden">
      <div ref={scrollerRef} data-lenis-prevent onPointerDown={(event) => pauseAuto(event.timeStamp)} onTouchStart={(event) => pauseAuto(event.timeStamp)} onFocusCapture={(event) => pauseAuto(event.timeStamp)} className="flex gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ WebkitOverflowScrolling: "touch" }} aria-live="polite">
        {TESTIMONIALS.map((item, index) => (
          <div key={`m-${item.name}-${index}`} className="w-[calc(100%-0.75rem)] min-w-[calc(100%-0.75rem)] shrink-0 snap-start snap-always">
            <ReviewCard {...item} />
          </div>
        ))}
      </div>
      <div className="mt-5 flex max-w-full flex-wrap items-center justify-center gap-1.5">
        {TESTIMONIALS.map((item, index) => (
          <button key={`dot-${item.name}-${index}`} type="button" aria-label={`Show review ${index + 1} by ${item.name}`} aria-current={index === active ? "true" : undefined} onClick={(event) => goTo(index, event.timeStamp)} className={`h-1.5 rounded-full transition-all duration-300 ${index === active ? "w-6 bg-brand" : "w-1.5 bg-[#D9D3C8]"}`} />
        ))}
      </div>
    </div>
  );
}
