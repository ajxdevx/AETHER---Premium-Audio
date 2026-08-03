"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowUpRight, HelpCircle } from "@/lib/icons";
import { MAX_PRODUCT_ID } from "@/lib/products";
import { faqHref, searchSite } from "@/lib/siteSearch";
import { formatPrice, cn } from "@/lib/utils";

interface SearchNavDropdownProps {
  query: string;
  onNavigate: () => void;
  className?: string;
}

export function SearchNavDropdown({
  query,
  onNavigate,
  className,
}: SearchNavDropdownProps) {
  const { products, faqs } = useMemo(() => searchSite(query), [query]);
  const productResults = products.slice(0, 6);
  const faqResults = faqs.slice(0, 4);
  const trimmed = query.trim();
  const shopHref = `/shop?q=${encodeURIComponent(trimmed)}`;
  const totalCount = productResults.length + faqResults.length;

  return (
    <div
      id="header-search-results"
      role="listbox"
      aria-label="Search results"
      className={cn(
        "overflow-hidden rounded-[1.35rem] bg-white shadow-[0_20px_50px_-24px_rgba(80,60,20,0.35)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-brand-soft px-3.5 py-2.5 sm:px-4">
        <p className="min-w-0 truncate text-[12px] font-medium text-ink-soft">
          {totalCount > 0
            ? `${totalCount} result${totalCount === 1 ? "" : "s"} for “${trimmed}”`
            : `No matches for “${trimmed}”`}
        </p>
        <Link
          href={shopHref}
          onClick={onNavigate}
          className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-brand"
        >
          View all
          <ArrowUpRight size={13} strokeWidth={2.25} aria-hidden />
        </Link>
      </div>

      {totalCount > 0 ? (
        <div
          data-hide-scrollbar
          className="max-h-[min(58vh,26rem)] overflow-y-auto overscroll-contain"
        >
          {productResults.length > 0 ? (
            <section aria-label="Products">
              <p className="px-3.5 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft sm:px-4">
                Products
              </p>
              <ul className="pb-1.5">
                {productResults.map((item) => (
                  <li key={item.colorId} role="option" aria-selected="false">
                    <Link
                      href={`/product/${MAX_PRODUCT_ID}?color=${item.colorId}`}
                      onClick={onNavigate}
                      className="flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-brand-mist sm:px-4"
                    >
                      <span
                        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl"
                        style={{ backgroundColor: item.pastel }}
                      >
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className="object-contain object-center p-1"
                          sizes="48px"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-ink">
                          {item.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-ink-soft">
                          Aether Pods · {item.colorLabel}
                        </span>
                      </span>
                      <span className="shrink-0 text-[13px] font-bold tabular-nums text-ink">
                        {formatPrice(item.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {faqResults.length > 0 ? (
            <section
              aria-label="FAQs"
              className={cn(productResults.length > 0 && "border-t border-brand-soft")}
            >
              <p className="px-3.5 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft sm:px-4">
                FAQs
              </p>
              <ul className="pb-1.5">
                {faqResults.map((faq) => (
                  <li key={faq.id} role="option" aria-selected="false">
                    <Link
                      href={faqHref(faq.id)}
                      onClick={onNavigate}
                      className="flex items-start gap-3 px-3.5 py-2.5 transition-colors hover:bg-brand-mist sm:px-4"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-mist text-brand">
                        <HelpCircle size={16} strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold leading-snug text-ink">
                          {faq.question}
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-ink-soft">
                          {faq.answer}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : (
        <div className="px-3.5 py-5 text-center sm:px-4">
          <p className="text-[13px] text-ink-warm">
            Try a finish (matcha, blush), a feature (battery, ANC), or an FAQ
            (shipping, returns).
          </p>
          <Link
            href="/shop"
            onClick={onNavigate}
            className="mt-3 inline-flex text-[13px] font-semibold text-brand"
          >
            Browse shop
          </Link>
        </div>
      )}
    </div>
  );
}
