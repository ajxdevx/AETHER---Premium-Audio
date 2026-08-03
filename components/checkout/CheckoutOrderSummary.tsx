"use client";

import { CartItemThumbnail } from "@/components/cart/CartItemThumbnail";
import { Button } from "@/components/ui/Button";
import { checkoutCardClassName } from "@/components/checkout/checkoutStyles";
import { PAGE_TITLE_CLASS } from "@/lib/buttonStyles";
import { formatPrice } from "@/lib/utils";
import { resolveToastTheme } from "@/providers/ToastProvider";
import type { CartItem } from "@/types/product";

type CheckoutOrderSummaryProps = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isSubmitting: boolean;
  onReturnToCart: () => void;
};

export function CheckoutOrderSummary({
  items,
  itemCount,
  subtotal,
  isSubmitting,
  onReturnToCart,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="lg:sticky lg:top-[104px] lg:self-start">
      <div className={checkoutCardClassName}>
        <div className="border-b border-brand-soft bg-brand-mist px-6 py-5">
          <h2 className={PAGE_TITLE_CLASS}>
            Order summary
          </h2>
          <p className="mt-1 text-sm text-ink-warm">Free shipping</p>
        </div>

        <ul
          data-lenis-prevent
          className="checkout-order-list max-h-[320px] space-y-3 overflow-y-auto px-6 py-5"
        >
          {items.map((item) => {
            const theme = resolveToastTheme(item.variant);
            return (
              <li
                key={item.lineKey}
                className="flex gap-3 rounded-2xl p-3"
                style={{ backgroundColor: theme.bg }}
              >
                <CartItemThumbnail
                  src={item.thumbnail}
                  alt={item.title}
                  surface="drawer"
                  pastel={theme.imageBg}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs font-medium">
                    {item.variant ? (
                      <span style={{ color: theme.accent }}>
                        {theme.label ?? item.variant}
                        <span className="text-ink-warm"> · </span>
                      </span>
                    ) : null}
                    <span className="text-ink-warm">
                      Qty{" "}
                      <span className="tabular-nums">{item.quantity}</span>
                    </span>
                  </p>
                  <p className="mt-1 text-sm font-bold tabular-nums text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="space-y-2 border-t border-brand-soft px-6 py-5 text-sm">
          <div className="flex justify-between text-ink-muted">
            <span>Subtotal ({itemCount} items)</span>
            <span className="font-semibold tabular-nums text-ink">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-ink-muted">
            <span>Shipping</span>
            <span className="font-semibold text-brand">Free</span>
          </div>
          <div className="flex justify-between border-t border-brand-soft pt-3 text-base font-bold text-ink">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(subtotal)}</span>
          </div>
        </div>

        <div className="border-t border-brand-soft bg-brand-mist px-6 py-5">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing…"
              : `Place Order — ${formatPrice(subtotal)}`}
          </Button>
          <button
            type="button"
            onClick={onReturnToCart}
            className="mt-3 w-full text-center text-sm font-semibold text-ink transition-colors hover:text-brand"
          >
            Return to cart
          </button>
        </div>
      </div>
    </div>
  );
}
