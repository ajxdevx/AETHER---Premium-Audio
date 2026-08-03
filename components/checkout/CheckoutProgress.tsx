import Link from "next/link";
import { CheckCircle2, CreditCard, ShoppingBag } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  checkoutIconBoxClassName,
  checkoutIconBoxMutedClassName,
} from "@/components/checkout/checkoutStyles";

export type CheckoutFlowStep = "cart" | "checkout" | "confirmation";

const STEPS = [
  { id: "cart", label: "Cart", href: "/cart", icon: ShoppingBag },
  { id: "checkout", label: "Checkout", href: "/checkout", icon: CreditCard },
  { id: "confirmation", label: "Confirmation", href: "#", icon: CheckCircle2 },
] as const;

interface CheckoutProgressProps {
  currentStep?: CheckoutFlowStep;
}

export function CheckoutProgress({ currentStep = "checkout" }: CheckoutProgressProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Checkout progress" className="mb-8 md:mb-12">
      <ol className="flex w-full min-w-0 items-center">
        {STEPS.map((step, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;
          const StepIcon = step.icon;

          return (
            <li
              key={step.label}
              className={cn("flex min-w-0 items-center", index < STEPS.length - 1 && "flex-1")}
            >
              <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
                <span
                  className={cn(
                    (isPast || isCurrent) && checkoutIconBoxClassName,
                    isUpcoming && checkoutIconBoxMutedClassName
                  )}
                  aria-hidden
                >
                  <StepIcon size={16} strokeWidth={2} />
                </span>
                {step.href === "#" || isCurrent ? (
                  <span
                    className={cn(
                      "hidden truncate text-sm font-semibold sm:inline",
                      isCurrent
                        ? "text-ink"
                        : isPast
                          ? "text-ink-warm"
                          : "text-ink-soft"
                    )}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {step.label}
                  </span>
                ) : (
                  <Link
                    href={step.href}
                    className={cn(
                      "hidden truncate text-sm font-semibold transition-colors sm:inline",
                      isPast
                        ? "text-ink-warm hover:text-brand"
                        : "text-ink-soft hover:text-brand"
                    )}
                  >
                    {step.label}
                  </Link>
                )}
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1.5 h-px min-w-3 flex-1 sm:mx-5 sm:min-w-6",
                    index < currentIndex ? "bg-brand" : "bg-brand-soft"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
