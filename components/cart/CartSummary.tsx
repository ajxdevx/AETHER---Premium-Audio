"use client";

import Link from "next/link";
import { PaymentBadges } from "@/components/ui/PaymentBadges";
import { buttonVariants } from "@/components/ui/Button";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { checkoutCardClassName } from "@/components/checkout/checkoutStyles";
import { PAGE_TITLE_CLASS } from "@/lib/buttonStyles";
import { formatPrice, cn } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  variant?: "drawer" | "page";
  onNavigate?: () => void;
  className?: string;
}

export function CartSummary({
  subtotal,
  itemCount,
  variant = "page",
  onNavigate,
  className,
}: CartSummaryProps) {
  const isDrawer = variant === "drawer";

  const totals = (
    <div className="space-y-2 text-sm">
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
  );

  if (isDrawer) {
    return (
      <div className={cn("space-y-4", className)}>
        {totals}
        <Link
          href="/checkout"
          onClick={onNavigate}
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          <ButtonWipeFill />
          <span className="relative z-[1]">Checkout</span>
        </Link>
        <button
          type="button"
          onClick={onNavigate}
          className="w-full text-center text-sm font-semibold text-ink transition-colors hover:text-brand"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className={cn(checkoutCardClassName, className)}>
      <div className="border-b border-brand-soft bg-brand-mist px-6 py-5">
        <h2 className={PAGE_TITLE_CLASS}>
          Order summary
        </h2>
        <p className="mt-1 text-sm text-ink-warm">Free shipping</p>
      </div>

      <div className="border-b border-brand-soft px-6 py-5">{totals}</div>

      <div className="space-y-4 px-6 py-5">
        <Link
          href="/checkout"
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          <ButtonWipeFill />
          <span className="relative z-[1]">Proceed to Checkout</span>
        </Link>
        <Link
          href="/shop"
          className="btn-outline-brand h-12 w-full text-[14px]"
        >
          Continue Shopping
        </Link>
        <div className="border-t border-brand-soft pt-4">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-warm">
            Secure checkout
          </p>
          <PaymentBadges variant="light" />
        </div>
      </div>
    </div>
  );
}
