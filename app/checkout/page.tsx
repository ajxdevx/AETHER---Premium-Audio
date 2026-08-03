"use client";

import { LOCALE } from "@/constants/locale";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { CreditCard, Lock, MapPin, User } from "@/lib/icons";
import { useCart } from "@/hooks/useCart";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import {
  CheckoutEmptyState,
  CheckoutSuccessState,
} from "@/components/checkout/CheckoutEmptyState";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutSectionHeading } from "@/components/checkout/CheckoutSectionHeading";
import { Container } from "@/components/ui/Container";
import { PageTransition } from "@/components/layout/PageTransition";
import { PageShell, PAGE_SHELL_PADDING } from "@/components/layout/PageShell";
import type { PaymentMethodId } from "@/components/ui/PaymentBadges";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { PAGE_TITLE_CLASS } from "@/lib/buttonStyles";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { checkoutInputClassName } from "@/components/checkout/checkoutStyles";

type FieldName =
  | "email"
  | "firstName"
  | "lastName"
  | "street"
  | "city"
  | "postal"
  | "country";

const FIELD_LABELS: Record<FieldName, string> = {
  email: "Email",
  firstName: "First name",
  lastName: "Last name",
  street: "Street address",
  city: "City",
  postal: "Postal code",
  country: "Country",
};

function Field({
  name,
  label,
  error,
  className,
  children,
}: {
  name: FieldName;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const errorId = `${name}-error`;
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium text-ink-label">{label}</span>
      {children}
      {error ? (
        <span
          id={errorId}
          role="alert"
          className="block text-[12px] font-medium text-brand"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}

function validateEmail(value: string) {
  if (!value.trim()) return "Please fill out this field.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return "Enter a valid email address.";
  }
  return "";
}

function validateRequired(value: string) {
  return value.trim() ? "" : "Please fill out this field.";
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, clearCart, isHydrated } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("visa");
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const clearFieldError = useCallback((name: FieldName) => {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const nextErrors: Partial<Record<FieldName, string>> = {
      email: validateEmail(String(data.get("email") ?? "")),
      firstName: validateRequired(String(data.get("firstName") ?? "")),
      lastName: validateRequired(String(data.get("lastName") ?? "")),
      street: validateRequired(String(data.get("street") ?? "")),
      city: validateRequired(String(data.get("city") ?? "")),
      postal: validateRequired(String(data.get("postal") ?? "")),
      country: validateRequired(String(data.get("country") ?? "")),
    };

    const invalid = (Object.keys(nextErrors) as FieldName[]).filter(
      (key) => nextErrors[key]
    );

    if (invalid.length > 0) {
      setErrors(nextErrors);
      const first = form.elements.namedItem(invalid[0]);
      if (first instanceof HTMLElement) {
        first.focus();
        first.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    window.setTimeout(() => {
      clearCart();
      setIsComplete(true);
      setIsSubmitting(false);
    }, 900);
  };

  // Cart data is already available from browsing — no checkout skeleton.
  if (!isHydrated) {
    return (
      <PageShell className={PAGE_SHELL_PADDING}>
        <Container wide className="min-w-0" aria-busy="true" aria-label="Loading checkout">
          <div className="mb-8 space-y-2">
            <div className="h-7 w-48 animate-pulse rounded-lg bg-card/70" />
            <div className="h-4 w-64 animate-pulse rounded-lg bg-card/70" />
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="h-80 animate-pulse rounded-[1.75rem] bg-card/70" />
            <div className="h-64 animate-pulse rounded-[1.75rem] bg-card/70" />
          </div>
        </Container>
      </PageShell>
    );
  }

  if (isComplete) {
    return <CheckoutSuccessState />;
  }

  if (items.length === 0) {
    return <CheckoutEmptyState />;
  }

  return (
    <PageShell className={PAGE_SHELL_PADDING}>
      <PageTransition>
        <Container wide className="min-w-0">
          <CheckoutProgress currentStep="checkout" />

          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className={PAGE_TITLE_CLASS}>
                Checkout
              </h1>
              <p className="mt-1 text-sm text-ink-warm">
                Complete your details below to place your order.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-ink-warm">
              <Lock size={15} className="shrink-0 text-brand" aria-hidden />
              <span>SSL encrypted · Secure checkout</span>
            </div>
          </div>

          <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10"
          >
            <div className="space-y-5">
              <CheckoutSectionHeading icon={User} title="Contact information">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    name="email"
                    label={FIELD_LABELS.email}
                    error={errors.email}
                    className="sm:col-span-2"
                  >
                    <Input
                      invalid={Boolean(errors.email)}
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-describedby={errors.email ? "email-error" : undefined}
                      onChange={() => clearFieldError("email")}
                      className={cn(
                        checkoutInputClassName,
                        errors.email && "border-brand"
                      )}
                  />
                  </Field>
                  <Field
                    name="firstName"
                    label={FIELD_LABELS.firstName}
                    error={errors.firstName}
                  >
                    <Input
                      invalid={Boolean(errors.firstName)}
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      aria-describedby={
                        errors.firstName ? "firstName-error" : undefined
                      }
                      onChange={() => clearFieldError("firstName")}
                      className={cn(
                        checkoutInputClassName,
                        errors.firstName && "border-brand"
                      )}
                  />
                  </Field>
                  <Field
                    name="lastName"
                    label={FIELD_LABELS.lastName}
                    error={errors.lastName}
                  >
                    <Input
                      invalid={Boolean(errors.lastName)}
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      aria-describedby={
                        errors.lastName ? "lastName-error" : undefined
                      }
                      onChange={() => clearFieldError("lastName")}
                      className={cn(
                        checkoutInputClassName,
                        errors.lastName && "border-brand"
                      )}
                  />
                  </Field>
                  <label className="block space-y-1.5 sm:col-span-2">
                    <span className="text-sm font-medium text-ink-label">Phone</span>
                    <Input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder={LOCALE.phonePlaceholder}
                      className={checkoutInputClassName}
                  />
                  </label>
                </div>
              </CheckoutSectionHeading>

              <CheckoutSectionHeading icon={MapPin} title="Shipping address">
                <div className="grid gap-4">
                  <Field
                    name="street"
                    label={FIELD_LABELS.street}
                    error={errors.street}
                  >
                    <Input
                      invalid={Boolean(errors.street)}
                      name="street"
                      type="text"
                      autoComplete="street-address"
                      aria-describedby={
                        errors.street ? "street-error" : undefined
                      }
                      onChange={() => clearFieldError("street")}
                      className={cn(
                        checkoutInputClassName,
                        errors.street && "border-brand"
                      )}
                  />
                  </Field>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-ink-label">
                      Apartment, suite, etc. (optional)
                    </span>
                    <Input
                      name="apartment"
                      type="text"
                      autoComplete="address-line2"
                      className={checkoutInputClassName}
                  />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field name="city" label={FIELD_LABELS.city} error={errors.city}>
                      <Input
                      invalid={Boolean(errors.city)}
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        aria-describedby={errors.city ? "city-error" : undefined}
                        onChange={() => clearFieldError("city")}
                        className={cn(
                          checkoutInputClassName,
                          errors.city && "border-brand"
                        )}
                    />
                    </Field>
                    <Field
                      name="postal"
                      label={FIELD_LABELS.postal}
                      error={errors.postal}
                    >
                      <Input
                      invalid={Boolean(errors.postal)}
                        name="postal"
                        type="text"
                        autoComplete="postal-code"
                        aria-describedby={
                          errors.postal ? "postal-error" : undefined
                        }
                        onChange={() => clearFieldError("postal")}
                        className={cn(
                          checkoutInputClassName,
                          errors.postal && "border-brand"
                        )}
                    />
                    </Field>
                    <Field
                      name="country"
                      label={FIELD_LABELS.country}
                      error={errors.country}
                    >
                      <Input
                      invalid={Boolean(errors.country)}
                        name="country"
                        type="text"
                        defaultValue={LOCALE.countryLabel}
                        autoComplete="country-name"
                        aria-describedby={
                          errors.country ? "country-error" : undefined
                        }
                        onChange={() => clearFieldError("country")}
                        className={cn(
                          checkoutInputClassName,
                          errors.country && "border-brand"
                        )}
                    />
                    </Field>
                  </div>
                </div>
              </CheckoutSectionHeading>

              <CheckoutSectionHeading icon={CreditCard} title="Payment">
                <p className="mb-4 text-sm text-ink-warm">
                  All transactions are secure. Select your preferred payment method.
                </p>
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                />
                <div className="mt-5 flex items-start gap-2 border-t border-brand-soft pt-5">
                  <Lock size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                  <p className="text-sm leading-relaxed text-ink-warm">
                    <span className="font-medium text-ink">Secure payment.</span>{" "}
                    Your information is encrypted and protected throughout checkout.
                  </p>
                </div>
              </CheckoutSectionHeading>
            </div>

            <CheckoutOrderSummary
              items={items}
              itemCount={itemCount}
              subtotal={subtotal}
              isSubmitting={isSubmitting}
              onReturnToCart={() => router.push("/cart")}
            />
          </form>
        </Container>
      </PageTransition>
    </PageShell>
  );
}
