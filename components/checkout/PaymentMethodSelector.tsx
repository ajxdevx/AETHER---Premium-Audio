"use client";

import {
  checkoutChoiceClassName,
  checkoutInputClassName,
  checkoutSurfaceClassName,
} from "@/components/checkout/checkoutStyles";
import { cn } from "@/lib/utils";
import {
  PAYMENT_METHODS,
  PaymentLogo,
  type PaymentMethodId,
} from "@/components/ui/PaymentBadges";

interface PaymentMethodSelectorProps {
  selected: PaymentMethodId;
  onChange: (id: PaymentMethodId) => void;
  className?: string;
}

const CARD_METHODS = new Set<PaymentMethodId>(["visa", "mastercard"]);

export function PaymentMethodSelector({
  selected,
  onChange,
  className,
}: PaymentMethodSelectorProps) {
  const showCardFields = CARD_METHODS.has(selected);
  const selectedMethod = PAYMENT_METHODS.find((method) => method.id === selected);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selected === method.id;

          return (
            <label
              key={method.id}
              className={cn(
                checkoutChoiceClassName,
                isSelected && "border-brand bg-brand-mist"
              )}
            >
              <input
                type="radio"
                name="payment-method"
                value={method.id}
                checked={isSelected}
                onChange={() => onChange(method.id)}
                className="sr-only focus:outline-none focus-visible:outline-none"
              />
              <span
                aria-hidden
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                  isSelected
                    ? "border-brand bg-brand"
                    : "border-[#C5D6B5] bg-white"
                )}
              >
                {isSelected ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                ) : null}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                {method.label}
              </span>
              <PaymentLogo method={method} variant="selector" />
            </label>
          );
        })}
      </div>

      {showCardFields ? (
        <div className={cn("space-y-4 p-4", checkoutSurfaceClassName)}>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink-label">Card number</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              className={checkoutInputClassName}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink-label">Expiry date</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM / YY"
                className={checkoutInputClassName}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink-label">Security code</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="CVC"
                className={checkoutInputClassName}
              />
            </label>
          </div>
        </div>
      ) : (
        selectedMethod && (
          <p className={cn("px-4 py-3 text-sm text-ink-label", checkoutSurfaceClassName)}>
            You&apos;ll complete payment with {selectedMethod.label} after placing your order.
          </p>
        )
      )}
    </div>
  );
}

export { CARD_METHODS };
