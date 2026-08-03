"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  getMaxColorProductsForTheme,
  MAX_PRODUCT_ID,
} from "@/lib/products";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSignatureTheme } from "@/providers/SignatureThemeProvider";
import { Container } from "@/components/ui/Container";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { MaxColorProductCard } from "@/components/product/MaxColorProductCard";
import {
  SectionReveal,
  StaggerItem,
  StaggerReveal,
} from "@/components/home/SectionReveal";

function TitleWave({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const show = active || reduceMotion;

  return (
    <div className="mt-0.5 h-3 w-24 overflow-hidden">
      <motion.div
        className="h-full w-24 origin-left"
        initial={false}
        animate={{ scaleX: show ? 1 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }
        }
      >
        <svg
          width="96"
          height="12"
          viewBox="0 0 96 12"
          fill="none"
          aria-hidden
          className="block overflow-visible"
        >
          <path
            d="M2 7.5C10 2.5 18 2.5 26 7.5C34 12.5 42 12.5 50 7.5C58 2.5 66 2.5 74 7.5C82 12.5 88 11.5 94 7"
            stroke="var(--brand-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  );
}

export function FeaturedProductsSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, {
    once: false,
    amount: 0.4,
    margin: "0px 0px -10% 0px",
  });
  const { themeId } = useSignatureTheme();
  const orderedProducts = useMemo(
    () => getMaxColorProductsForTheme(themeId),
    [themeId]
  );
  const { products, isLoading, isError, refetch } = useCatalogProducts([
    MAX_PRODUCT_ID,
  ]);
  const product = products[0];

  const showSkeleton = isLoading;

  return (
    <section
      id="featured"
      className="section-space bg-white"
    >
      <Container wide>
        <SectionReveal>
          <div className="mb-6 md:mb-10" ref={headingRef}>
            <h2 className="section-heading">
              Our Products
            </h2>
            <TitleWave active={headingInView} />
          </div>
        </SectionReveal>

        {showSkeleton && <ProductGridSkeleton count={4} variant="featured" />}
        {!showSkeleton && isError && <ErrorState onRetry={refetch} />}
        {!showSkeleton && !isError && !product && (
          <ErrorState
            message="Products unavailable. Please try again."
            onRetry={refetch}
          />
        )}
        {!showSkeleton && !isError && product && (
          <StaggerReveal
            className="grid grid-cols-1 gap-4 [perspective:1200px] sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
            stagger={0.09}
            delay={0.12}
          >
            {orderedProducts.map((item, index) => (
              <StaggerItem key={item.colorId}>
                <MaxColorProductCard
                  product={product}
                  name={item.name}
                  colorLabel={item.colorLabel}
                  colorId={item.colorId}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                  price={item.price}
                  compareAt={item.compareAt}
                  image={item.image}
                  pastel={item.pastel}
                  isNew={item.isNew}
                  promo={item.promo}
                  priority={index === 0}
                />
              </StaggerItem>
            ))}
          </StaggerReveal>
        )}
      </Container>
    </section>
  );
}
