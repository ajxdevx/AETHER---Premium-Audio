"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AUTO_MS, PER_PAGE_DESKTOP, TESTIMONIALS } from "./data";
import { ReviewCard } from "./ReviewCard";

function buildDesktopPages() {
  const pageCount = Math.ceil(TESTIMONIALS.length / PER_PAGE_DESKTOP);
  const pages = Array.from({ length: pageCount }, (_, page) => {
    const start = page * PER_PAGE_DESKTOP;
    return Array.from({ length: PER_PAGE_DESKTOP }, (_, index) => {
      const item = TESTIMONIALS[(start + index) % TESTIMONIALS.length];
      return { ...item, key: `d-${page}-${start + index}-${item.name}` };
    });
  });
  return {
    pageCount,
    loopPages: [...pages, pages[0].map((item) => ({ ...item, key: `loop-${item.key}` }))],
  };
}

export function DesktopReviews() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);
  const { pageCount, loopPages } = buildDesktopPages();
  const activeDot = index % pageCount;

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      setInstant(false);
      setIndex((current) => current + 1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, index, paused]);

  return (
    <div className="hidden md:block" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
    }}>
      <div className="overflow-hidden" aria-live="polite">
        <motion.div className="flex w-full" animate={{ x: `${-index * 100}%` }} transition={reduceMotion || instant ? { duration: 0 } : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => {
          if (index >= pageCount) {
            setInstant(true);
            setIndex(0);
          }
        }}>
          {loopPages.map((items, pageIndex) => (
            <div key={`d-page-${pageIndex}`} className="grid w-full min-w-full shrink-0 grow-0 basis-full grid-cols-3 gap-5">
              {items.map((item) => {
                const { key, ...card } = item;
                return (
                  <div key={key} className="min-w-0">
                    <ReviewCard {...card} />
                  </div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
      <div className="mt-6 flex max-w-full flex-wrap items-center justify-center gap-2">
        {Array.from({ length: pageCount }).map((_, dotIndex) => (
          <button key={dotIndex} type="button" aria-label={`Show reviews page ${dotIndex + 1}`} aria-current={dotIndex === activeDot ? "true" : undefined} onClick={() => {
            setInstant(false);
            setIndex(dotIndex);
          }} className={`h-1.5 rounded-full transition-all duration-300 ${dotIndex === activeDot ? "w-6 bg-brand" : "w-1.5 bg-[#D9D3C8]"}`} />
        ))}
      </div>
    </div>
  );
}
