import { CARD_RADIUS } from "@/lib/buttonStyles";
import { inputClassName } from "@/components/ui/Input";

/** Checkout fields share the design-system Input styles. */
export const checkoutInputClassName = `checkout-input ${inputClassName}`;

export const checkoutChoiceClassName =
  "flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl border border-brand-border bg-white px-3 py-3 outline-none transition-colors hover:border-brand/40 hover:bg-brand-mist has-[:focus-visible]:border-brand has-[:focus-visible]:outline-none sm:gap-4 sm:px-4 sm:py-3.5";

export const checkoutIconBoxClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white sm:h-10 sm:w-10";

export const checkoutIconBoxMutedClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink-soft sm:h-10 sm:w-10";

export const checkoutIconBoxLargeClassName =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-white sm:h-16 sm:w-16";

export const checkoutSurfaceClassName = "rounded-2xl bg-brand-mist";

export const checkoutCardClassName = `overflow-hidden ${CARD_RADIUS} border border-brand-border bg-white`;

export const checkoutSectionClassName = `min-w-0 ${CARD_RADIUS} border border-brand-border bg-white p-4 sm:p-6`;
