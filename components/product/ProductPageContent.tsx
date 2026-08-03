"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Star, Tag } from "@/lib/icons";
import {
  getMaxColorGalleryImages,
  getProductPreviewDescription,
  MAX_COLOR_PRODUCTS,
  resolveProductColorId,
} from "@/lib/products";
import { useProduct } from "@/hooks/useProduct";
import { useProductPurchase } from "@/hooks/useProductPurchase";
import { ProductGallery } from "@/components/product/ProductGallery";
import {
  KEY_FEATURES,
  ProductDetailsTabs,
  TRUST_ITEMS,
  formatInstallment,
} from "@/components/product/ProductDetailsTabs";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { RelatedFinishes } from "@/components/product/RelatedFinishes";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { NewBadge } from "@/components/ui/NewBadge";
import { ProductPageSkeleton } from "@/components/ui/LoadingSkeleton";
import { PageShell, PAGE_SHELL_PADDING } from "@/components/layout/PageShell";
import { useSignatureTheme } from "@/providers/SignatureThemeProvider";
import type { SignatureThemeId } from "@/constants/brand";
import { cn, formatPrice } from "@/lib/utils";
import { loadOptimizedImage } from "@/lib/preloadImage";
import { getLenis } from "@/lib/smoothScroll";

interface ProductPageContentProps {
  params: Promise<{ id: string }>;
}

function MiniStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = rating - i >= 0.5;
        return (
          <Star
            key={i}
            size={14}
            className={cn(
              filled
                ? "fill-star text-star"
                : "fill-none text-[#C5D6B5]"
            )}
          />
        );
      })}
    </span>
  );
}

export function ProductPageContent({ params }: ProductPageContentProps) {
  const { id } = use(params);
  const productId = Number(id);
  const searchParams = useSearchParams();
  const { data: product, isLoading, isError, refetch } = useProduct(productId);
  const { setThemeId } = useSignatureTheme();
  const [galleryReady, setGalleryReady] = useState(false);
  const initialRevealDone = useRef(false);
  const colorId = resolveProductColorId(searchParams.get("color"));
  const galleryHeroSrc = useMemo(
    () => getMaxColorGalleryImages(colorId)[0] ?? "",
    [colorId]
  );

  useLayoutEffect(() => {
    if (colorId in { green: 1, pink: 1, blue: 1, black: 1 }) {
      setThemeId(colorId as SignatureThemeId);
    }
  }, [colorId, setThemeId]);

  // Soft finish switches stay on /product/[id] — reset qty and jump to top.
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [colorId]);

  // Block the first paint until the hero image is ready. On later finish
  // switches, keep the page mounted (ProductGallery covers its own load) so
  // rapid You-May-Also-Like clicks don't tear down GSAP/Framer trees mid-flight.
  useEffect(() => {
    let cancelled = false;

    if (!initialRevealDone.current) {
      setGalleryReady(false);
    }

    loadOptimizedImage(galleryHeroSrc).then(() => {
      if (cancelled) return;
      initialRevealDone.current = true;
      setGalleryReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [galleryHeroSrc]);

  const colorProduct = useMemo(
    () =>
      MAX_COLOR_PRODUCTS.find((item) => item.colorId === colorId) ??
      MAX_COLOR_PRODUCTS[0],
    [colorId]
  );
  const {
    quantity,
    setQuantity,
    remainingStock,
    canAddToCart,
    handleAddToCart,
    handleBuyNow,
  } = useProductPurchase(product, colorId, colorProduct);

  if (isError || (!isLoading && !product)) {
    return (
      <PageShell className={PAGE_SHELL_PADDING}>
        <Container wide>
          <ErrorState
            message="Product not found or failed to load."
            onRetry={() => refetch()}
          />
        </Container>
      </PageShell>
    );
  }

  if (isLoading || !galleryReady) {
    return (
      <PageShell className={PAGE_SHELL_PADDING}>
        <Container wide>
          <ProductPageSkeleton pastel={colorProduct.pastel} />
        </Container>
      </PageShell>
    );
  }

  if (!product) {
    return null;
  }

  const name = colorProduct.name;
  const previewDescription = getProductPreviewDescription(product);
  const price = colorProduct.price;
  const compareAt = colorProduct.compareAt;
  const rating = colorProduct.rating;
  const reviewCount = colorProduct.reviewCount;
  const discountPercent =
    compareAt != null && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : null;
  const compactReviews =
    reviewCount >= 1000
      ? `${(reviewCount / 1000).toFixed(1).replace(/\.0$/, "")}k`
      : String(reviewCount);
  return (
    <PageShell className={PAGE_SHELL_PADDING}>
      <div className="flex w-full flex-1 flex-col">
        <Container wide>
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-1.5 text-[13px] text-ink-warm md:mb-6"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span aria-hidden className="text-[#C5D6B5]">
              /
            </span>
            <Link
              href="/shop"
              className="transition-colors hover:text-ink"
            >
              Shop
            </Link>
            <span aria-hidden className="text-[#C5D6B5]">
              /
            </span>
            <span className="min-w-0 truncate font-medium text-ink">
              {name}
            </span>
          </nav>
        </Container>

        <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-3 md:px-4 lg:px-5">
          <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)] xl:gap-12">
            <div className="min-w-0 xl:sticky xl:top-6">
              <ProductGallery
                productId={product.id}
                colorId={colorId}
                title={colorProduct.name}
                isNew={colorProduct.isNew}
              />
            </div>

            <div className="flex min-w-0 flex-col">
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                {colorProduct.isNew ? <NewBadge /> : null}
                {colorProduct.promo ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
                    <Tag size={10} strokeWidth={2.5} aria-hidden />
                    {discountPercent != null
                      ? `${discountPercent}% off`
                      : "Promo"}
                  </span>
                ) : null}
              </div>

              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                Aether Pods
              </p>

              <h1 className="mt-2 font-[family-name:var(--font-announce)] text-[clamp(1.75rem,5vw+0.5rem,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-ink">
                {name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
                <MiniStars rating={rating} />
                <span className="font-medium tabular-nums text-ink-label">
                  {rating.toFixed(1)} ({compactReviews} reviews)
                </span>
                <span className="text-[#C5D6B5]" aria-hidden>
                  |
                </span>
                <Link
                  href="/shop#shop-faqs"
                  className="cursor-pointer font-semibold text-ink transition-colors hover:text-brand"
                >
                  Ask a question
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap items-end gap-3">
                <p className="text-[1.85rem] font-extrabold tabular-nums tracking-tight text-ink">
                  {formatPrice(price)}
                </p>
                {compareAt != null && compareAt > price ? (
                  <p className="pb-1 text-[14px] tabular-nums text-ink-soft line-through">
                    {formatPrice(compareAt)}
                  </p>
                ) : null}
              </div>

              <p className="mt-1.5 text-[13px] text-ink-label">
                or 4 interest-free payments of{" "}
                <span className="font-semibold text-ink">
                  {formatInstallment(price)}
                </span>
              </p>

              <p className="mt-4 text-[14px] leading-relaxed text-ink-label sm:text-[15px]">
                {previewDescription}
              </p>

              <ul className="mt-5 grid grid-cols-1 gap-2.5">
                {KEY_FEATURES.map(({ label, icon: Icon }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2.5 rounded-2xl bg-brand-mist px-3 py-2.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                      <Icon size={15} strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0 text-[12px] font-semibold leading-snug text-ink sm:text-[13px]">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              <ProductPurchasePanel
                quantity={quantity}
                remainingStock={remainingStock}
                canAddToCart={canAddToCart}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>
        </div>

        <Container wide>
          <ul className="mt-12 grid grid-cols-1 gap-3 border-t border-brand-soft pt-8 sm:grid-cols-2 xl:mt-14 xl:grid-cols-4 xl:gap-4 xl:pt-10">
            {TRUST_ITEMS.map(({ label, hint, icon: Icon }) => (
              <li
                key={label}
                className="flex items-start gap-3 rounded-2xl bg-surface-soft p-3.5 sm:p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand">
                  <Icon size={18} strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[13px] font-bold leading-tight text-ink sm:text-[14px]">
                    {label}
                  </p>
                  <p className="mt-1 text-[11px] font-medium leading-snug text-ink-soft sm:text-[12px]">
                    {hint}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <ProductDetailsTabs
            product={product}
            rating={rating}
            reviewCount={reviewCount}
            pastel={colorProduct.pastel}
            image={colorProduct.image}
            colorId={colorId}
            title={name}
          />

          <RelatedFinishes product={product} activeColorId={colorId} />
        </Container>
      </div>
    </PageShell>
  );
}
