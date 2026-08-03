"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "@/lib/icons";
import { ASSETS } from "@/constants/assets";
import { Container } from "@/components/ui/Container";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { NavLink } from "@/components/layout/NavLink";

export function FinalCTA() {
  return (
    <section
      id="get-yours"
      className="bg-white pb-4 pt-6 md:pb-6 md:pt-8 lg:pb-8 lg:pt-10"
      aria-labelledby="final-cta-heading"
    >
      <Container wide>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[22px] bg-surface-warm sm:rounded-[28px]"
        >
          <div className="pointer-events-none absolute inset-y-0 left-[28%] right-0 z-0 hidden lg:block">
            <div className="absolute inset-0">
              <Image
                src={ASSETS.marketing.spotlights.ctaBanner}
                alt="Aether Pods in Pink, Matcha Green, Sky Blue, and Space Dark"
                fill
                className="object-contain object-center scale-[1.9]"
                sizes="70vw"
              />
            </div>
            <div
              className="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-surface-warm via-surface-warm/55 to-transparent"
              aria-hidden
            />
          </div>

          <div className="relative z-10 flex flex-col lg:min-h-[420px] lg:max-w-[48%] lg:justify-center lg:px-14 lg:py-14">
            <div className="px-5 py-7 sm:px-10 sm:py-10 md:px-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand sm:text-[12px]">
                Aether Pods
              </p>
              <h2
                id="final-cta-heading"
                className="mt-3 max-w-[14ch] font-[family-name:var(--font-announce)] text-[clamp(1.75rem,5vw+0.6rem,3.15rem)] font-bold leading-[1.05] tracking-[-0.03em] text-ink"
              >
                Find Your Color. Own Your Sound.
              </h2>
              <p className="mt-3 max-w-[36ch] text-[14px] leading-relaxed text-ink-label sm:mt-4 sm:text-[15px] md:text-[16px]">
                Four finishes. One immersive experience. Shop Aether Pods and hear
                every detail the way it was meant to be heard.
              </p>
              <NavLink
                href="/shop"
                className="group/btn relative mt-6 inline-flex h-11 w-full max-w-xs items-center justify-between gap-2 overflow-hidden rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-[14px] font-semibold text-white sm:mt-8 sm:h-[3.5rem] sm:w-fit sm:justify-center sm:gap-2.5 sm:pl-8 sm:text-[15px] md:h-[3.75rem] md:gap-3 md:pl-9 md:pr-2 md:text-[16px]"
              >
                <ButtonWipeFill />
                <span className="relative z-[1]">Shop Aether Pods</span>
                <span className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors duration-500 group-hover/btn:bg-white group-hover/btn:text-brand md:h-11 md:w-11">
                  <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
                </span>
              </NavLink>
            </div>

            <div className="pointer-events-none relative -mx-2 h-36 w-[calc(100%+1rem)] sm:-mx-3 sm:h-40 sm:w-[calc(100%+1.5rem)] lg:hidden">
              <Image
                src={ASSETS.marketing.spotlights.ctaBanner}
                alt="Aether Pods in Pink, Matcha Green, Sky Blue, and Space Dark"
                fill
                className="object-contain object-center scale-[1.9] sm:scale-[2]"
                sizes="100vw"
              />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
