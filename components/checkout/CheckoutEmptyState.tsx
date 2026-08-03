import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "@/lib/icons";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { checkoutIconBoxLargeClassName } from "@/components/checkout/checkoutStyles";
import { Container } from "@/components/ui/Container";
import { PageTransition } from "@/components/layout/PageTransition";
import { PageShell, PAGE_SHELL_PADDING } from "@/components/layout/PageShell";
import { buttonVariants } from "@/components/ui/Button";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { cn } from "@/lib/utils";

export function CheckoutEmptyState() {
  return (
    <PageShell className={PAGE_SHELL_PADDING}>
      <PageTransition>
        <Container className="flex flex-1 flex-col justify-center text-center">
          <div className="mx-auto flex w-full max-w-md flex-col items-center rounded-[1.75rem] bg-brand-mist px-6 py-12">
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
              <ShoppingBag size={28} strokeWidth={1.75} aria-hidden />
            </span>
            <h1 className="font-[family-name:var(--font-announce)] text-2xl font-bold text-ink">
              Nothing to checkout
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Add items to your cart first.
            </p>
            <Link
              href="/shop"
              className={cn(buttonVariants({ size: "lg" }), "mt-6 inline-flex")}
            >
              <ButtonWipeFill />
              <span className="relative z-[1]">Browse Products</span>
            </Link>
          </div>
        </Container>
      </PageTransition>
    </PageShell>
  );
}

export function CheckoutSuccessState() {
  return (
    <PageShell className={PAGE_SHELL_PADDING}>
      <PageTransition>
        <Container wide className="min-w-0">
          <CheckoutProgress currentStep="confirmation" />

          <div className="mx-auto max-w-lg rounded-[1.75rem] bg-brand-mist px-6 py-12 text-center sm:px-10">
            <span
              className={cn(checkoutIconBoxLargeClassName, "mx-auto mb-6")}
              aria-hidden
            >
              <CheckCircle2 size={28} strokeWidth={2} />
            </span>
            <h1 className="font-[family-name:var(--font-announce)] text-xl font-bold tracking-tight text-ink md:text-2xl">
              Order placed
            </h1>
            <p className="mt-3 text-sm text-ink-warm md:text-base">
              Thanks for your order. We&apos;ll send a confirmation email shortly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/shop" className={cn(buttonVariants({ size: "lg" }))}>
                <ButtonWipeFill />
                <span className="relative z-[1]">Continue Shopping</span>
              </Link>
              <Link
                href="/"
                className="btn-outline-brand h-12 px-6 text-[14px]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </PageTransition>
    </PageShell>
  );
}
