"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "@/lib/icons";
import { SITE_FAQS } from "@/constants/faqs";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionReveal } from "@/components/home/SectionReveal";
import { cn } from "@/lib/utils";

export function ShopFaqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash.startsWith("faq-")) return;
      const faqId = hash.slice(4);
      const index = SITE_FAQS.findIndex((item) => item.id === faqId);
      if (index >= 0) {
        setOpenIndex(index);
        window.requestAnimationFrame(() => {
          document.getElementById(`faq-${faqId}`)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <SectionReveal y={32} className="mt-14 lg:mt-16" id="shop-faqs">
      <div className="mb-8 max-w-2xl md:mb-10">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
          Help center
        </p>
        <h2 className="section-heading mt-2">
          Frequently asked questions
        </h2>
        <p className="section-lead mt-3">
          Everything you need to know about Aether Pods, shipping, returns, and
          trade-in — answered clearly.
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-brand-border bg-white">
        {SITE_FAQS.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `${baseId}-q-${index}`;
          const panelId = `${baseId}-a-${index}`;

          return (
            <div
              key={item.id}
              id={`faq-${item.id}`}
              className={cn(
                "scroll-mt-28",
                index > 0 && "border-t border-brand-soft"
              )}
            >
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={cn(
                  "flex min-h-[4.25rem] w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 sm:min-h-[4.75rem] sm:px-6 sm:py-5",
                  isOpen ? "bg-brand-soft" : "hover:bg-brand-soft/60"
                )}
              >
                <span className="flex min-h-[2rem] flex-1 items-center text-[14px] font-semibold leading-snug text-ink sm:text-[15px]">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full transition-colors duration-200",
                    isOpen
                      ? "bg-brand text-white"
                      : "bg-brand-mist text-brand"
                  )}
                  aria-hidden
                >
                  {isOpen ? (
                    <Minus size={15} strokeWidth={2.25} />
                  ) : (
                    <Plus size={15} strokeWidth={2.25} />
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  reduceMotion ? (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="flex min-h-[5.5rem] items-center px-5 py-5 sm:min-h-[6rem] sm:px-6 sm:py-6"
                    >
                      <p className="max-w-[58ch] text-[14px] leading-relaxed text-ink-muted">
                        {item.answer}
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex min-h-[5.5rem] items-center px-5 py-5 sm:min-h-[6rem] sm:px-6 sm:py-6">
                        <p className="max-w-[58ch] text-[14px] leading-relaxed text-ink-muted">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </SectionReveal>
  );
}
