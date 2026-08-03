"use client";

import Link from "next/link";
import { ShoppingBag } from "@/lib/icons";
import { useCart } from "@/hooks/useCart";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { Container } from "@/components/ui/Container";
import { PageTransition } from "@/components/layout/PageTransition";
import { PageShell, PAGE_SHELL_PADDING } from "@/components/layout/PageShell";
import { buttonVariants } from "@/components/ui/Button";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { PAGE_TITLE_CLASS } from "@/lib/buttonStyles";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, isHydrated } =
    useCart();

  // Avoid blank flash while cart hydrates from localStorage.
  if (!isHydrated) {
    return (
      <PageShell className={PAGE_SHELL_PADDING}>
        <Container wide className="min-w-0" aria-busy="true" aria-label="Loading cart">
          <div className="mb-8 space-y-2">
            <div className="h-7 w-40 animate-pulse rounded-lg bg-card/70" />
            <div className="h-4 w-56 animate-pulse rounded-lg bg-card/70" />
          </div>
          <div className="h-48 animate-pulse rounded-[1.75rem] bg-card/70" />
        </Container>
      </PageShell>
    );
  }

  return (
    <PageShell className={PAGE_SHELL_PADDING}>
      <PageTransition>
        <Container wide className="min-w-0">
          <CheckoutProgress currentStep="cart" />

          <div className="mb-8">
            <h1 className={cn(PAGE_TITLE_CLASS)}>
              Your Cart
            </h1>
            <p className="mt-1 text-sm text-ink-warm">
              Review your items before checkout.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[1.75rem] bg-brand-mist py-16 text-center">
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
                <ShoppingBag size={28} strokeWidth={1.75} aria-hidden />
              </span>
              <p className="text-[15px] font-semibold text-ink">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Add something you love to get started.
              </p>
              <Link
                href="/shop"
                className={cn(buttonVariants({ size: "lg" }), "mt-6")}
              >
                <ButtonWipeFill />
                <span className="relative z-[1]">Continue Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
              <ul className="space-y-3">
                {items.map((item) => (
                  <CartLineItem
                    key={item.lineKey}
                    item={item}
                    variant="page"
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </ul>
              <div className="lg:sticky lg:top-[104px] lg:self-start">
                <CartSummary
                  subtotal={subtotal}
                  itemCount={itemCount}
                  variant="page"
                />
              </div>
            </div>
          )}
        </Container>
      </PageTransition>
    </PageShell>
  );
}
