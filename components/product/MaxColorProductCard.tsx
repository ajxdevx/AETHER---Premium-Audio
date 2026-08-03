"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Heart, ShoppingBag, Tag, Shield, Truck } from "@/lib/icons";
import { useAwardCardHover } from "@/hooks/useAwardCardHover";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import {
  MaxColorProductCardGallery,
  productAccent,
} from "@/components/product/MaxColorProductCardGallery";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { NewBadge } from "@/components/ui/NewBadge";
import { StarRating } from "@/components/ui/StarRating";
import { cn, formatPrice } from "@/lib/utils";
import { getCartLineKey, type Product } from "@/types/product";

export interface MaxColorProductCardProps {
  product: Product;
  name: string;
  colorLabel: string;
  colorId: string;
  rating: number;
  reviewCount: number;
  price: number;
  compareAt?: number;
  image: string;
  pastel: string;
  isNew: boolean;
  promo: boolean;
  showPerks?: boolean;
  /** Larger product image — shop grid only. */
  largeImage?: boolean;
  /** Eager-load the first gallery frame (above-the-fold only). */
  priority?: boolean;
  /**
   * Disable GSAP tilt + hover gallery cycling. Use on product-page related
   * cards so soft finish switches don’t tear motion trees mid-flight.
   */
  quietMotion?: boolean;
}

export function MaxColorProductCard({
  product,
  name,
  colorLabel,
  colorId,
  rating,
  reviewCount,
  price,
  compareAt,
  image,
  pastel,
  isNew,
  promo,
  showPerks = false,
  largeImage = false,
  priority = false,
  quietMotion = false,
}: MaxColorProductCardProps) {
  const { addItem, items } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const [cartHover, setCartHover] = useState(false);
  const [cardHover, setCardHover] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const liked = isFavorite(product.id, colorId);
  const accent = productAccent(colorId);
  const cartLineKey = getCartLineKey(product.id, colorId);
  const inCartQty =
    items.find((item) => item.lineKey === cartLineKey)?.quantity ?? 0;
  const remainingStock = Math.max(product.stock - inCartQty, 0);
  const canAddToCart = product.stock > 0 && remainingStock > 0;
  const compactReviews =
    reviewCount >= 1000
      ? `${(reviewCount / 1000).toFixed(1).replace(/\.0$/, "")}k`
      : String(reviewCount);
  const discountPercent =
    compareAt != null && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : null;

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setIsTouch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useAwardCardHover(cardRef, {
    enabled: !quietMotion && !cartHover && !isTouch,
    maxTilt: 8,
    lift: -4,
    mediaScale: 1.04,
  });

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canAddToCart) return;
    addItem(product, {
      quantity: 1,
      displayTitle: name,
      displayPrice: price,
      displayThumbnail: image,
      variant: colorId,
    });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      productId: product.id,
      title: name,
      colorLabel,
      colorId,
      price,
      image,
      href: `/product/${product.id}?color=${colorId}`,
      pastel,
    });
  };

  return (
    <article
      ref={cardRef}
      className="group/card relative flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-[1.75rem] will-change-transform [transform-style:preserve-3d]"
      style={{ backgroundColor: pastel }}
      onPointerEnter={() => setCardHover(true)}
      onPointerLeave={() => setCardHover(false)}
    >
      <div
        data-award-shine
        className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-soft-light"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-70"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex items-start justify-between gap-2 px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {isNew ? <NewBadge style={{ color: accent }} /> : null}
          {promo ? (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] shadow-[0_4px_14px_-8px_rgba(40,35,20,0.35)] backdrop-blur-[2px]"
              style={{ color: accent }}
            >
              <Tag size={10} strokeWidth={2.5} aria-hidden />
              {discountPercent != null ? `${discountPercent}% off` : "Promo"}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={liked}
          onClick={handleFavorite}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-[0_4px_14px_-8px_rgba(40,35,20,0.35)] backdrop-blur-[2px] transition-colors duration-300"
          style={liked ? { color: accent } : undefined}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = liked ? accent : "#1A1A1A";
          }}
        >
          <Heart
            size={17}
            strokeWidth={1.75}
            className={cn(liked && "fill-current")}
            aria-hidden
          />
        </button>
      </div>

      <MaxColorProductCardGallery
        key={colorId}
        productId={product.id}
        name={name}
        colorId={colorId}
        largeImage={largeImage}
        priority={priority}
        isTouch={isTouch}
        cardHover={quietMotion ? false : cardHover}
        allowCycle={!quietMotion}
      />

      <div className="relative z-10 mt-auto px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="rounded-[1.35rem] bg-white/85 p-4 shadow-[0_12px_32px_-22px_rgba(40,35,20,0.35)] backdrop-blur-[6px]">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: accent }}
          >
            Aether Pods · {colorLabel}
          </p>

          <Link
            href={`/product/${product.id}?color=${colorId}`}
            scroll
            className="cursor-pointer"
          >
            <h3 className="mt-1.5 text-[1.05rem] font-bold leading-tight tracking-tight text-ink sm:text-[1.125rem]">
              {name}
            </h3>
          </Link>

          <div className="mt-2.5 flex items-center gap-1.5">
            <StarRating rating={rating} />
            <span className="text-[12px] font-medium tabular-nums text-ink-soft">
              {rating.toFixed(1)} · {compactReviews}
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-3">
            <div className="min-w-0">
              <p className="text-[1.15rem] font-extrabold tabular-nums tracking-tight text-ink">
                {formatPrice(price)}
              </p>
              {compareAt != null && compareAt > price ? (
                <p className="mt-0.5 text-[12px] tabular-nums text-ink-soft line-through">
                  {formatPrice(compareAt)}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              disabled={!canAddToCart}
              onClick={handleAdd}
              onMouseEnter={() => {
                if (!canAddToCart) return;
                setCartHover(true);
              }}
              onMouseLeave={() => setCartHover(false)}
              onFocus={() => {
                if (!canAddToCart) return;
                setCartHover(true);
              }}
              onBlur={() => setCartHover(false)}
              aria-label={
                canAddToCart ? `Add ${name} to cart` : `${name} is out of stock`
              }
              className={cn(
                "group/btn relative inline-flex h-11 w-full shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink px-5 text-[13px] font-semibold text-white",
                canAddToCart
                  ? "cursor-pointer"
                  : "pointer-events-none cursor-not-allowed opacity-50"
              )}
            >
              {canAddToCart ? <ButtonWipeFill /> : null}
              <span className="relative z-[1] inline-flex items-center gap-2">
                {canAddToCart ? "Add to Cart" : "Out of Stock"}
                {canAddToCart ? (
                  <ShoppingBag
                    size={15}
                    strokeWidth={2.25}
                    className="transition-transform duration-300 group-hover/btn:scale-105"
                    aria-hidden
                  />
                ) : null}
              </span>
            </button>
          </div>

          {showPerks ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#E8E8EA] pt-3 text-[11px] font-medium text-ink-warm">
              <span className="inline-flex items-center gap-1">
                <Truck
                  size={12}
                  strokeWidth={2}
                  style={{ color: accent }}
                  aria-hidden
                />
                Free Shipping
              </span>
              <span className="inline-flex items-center gap-1">
                <Shield
                  size={12}
                  strokeWidth={2}
                  style={{ color: accent }}
                  aria-hidden
                />
                2-Year Warranty
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
