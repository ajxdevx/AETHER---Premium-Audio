"use client";

import { Container } from "@/components/ui/Container";
import {
  StaggerItem,
  StaggerReveal,
} from "@/components/home/SectionReveal";
import { DesktopReviews } from "@/components/home/testimonials/DesktopReviews";
import { MobileReviews } from "@/components/home/testimonials/MobileReviews";
import { Stars } from "@/components/home/testimonials/ReviewCard";

function TitleAccent() {
  return (
    <svg
      width="42"
      height="14"
      viewBox="0 0 42 14"
      fill="none"
      aria-hidden
      className="mt-1 shrink-0 sm:mt-1.5"
    >
      <path
        d="M2 8.5C6.5 3.5 11 3.5 15.5 8.5C20 13.5 24.5 13.5 29 8.5C33.5 3.5 37 4.5 40 8"
        stroke="var(--brand-accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section
      id="reviews"
      className="section-space scroll-mt-3 bg-white md:scroll-mt-5"
      aria-labelledby="testimonials-heading"
    >
      <Container wide>
        <StaggerReveal stagger={0.12} delay={0.04}>
          <StaggerItem>
            <div className="mb-6 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div className="flex items-start gap-2.5 sm:items-center">
                <h2
                  id="testimonials-heading"
                  className="section-heading"
                >
                  Loved By Thousands
                </h2>
                <TitleAccent />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <p className="text-[15px] font-bold text-ink">4.7/5</p>
                <Stars rating={4.7} size={13} />
                <p className="text-[13px] text-ink-soft">(50K+ reviews)</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <MobileReviews />
            <DesktopReviews />
          </StaggerItem>
        </StaggerReveal>
      </Container>
    </section>
  );
}
