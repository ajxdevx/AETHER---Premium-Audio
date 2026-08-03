import { ASSETS } from "@/constants/assets";
import { cn } from "@/lib/utils";

export const PAYMENT_METHODS = [
  {
    id: "visa",
    label: "Visa",
    src: ASSETS.payments.visa,
  },
  {
    id: "mastercard",
    label: "Mastercard",
    src: ASSETS.payments.mastercard,
  },
  {
    id: "apple-pay",
    label: "Apple Pay",
    src: ASSETS.payments.applePay,
  },
  {
    id: "google-pay",
    label: "Google Pay",
    src: ASSETS.payments.googlePay,
  },
  {
    id: "paypal",
    label: "PayPal",
    src: ASSETS.payments.paypal,
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

type PaymentMethod = (typeof PAYMENT_METHODS)[number];

const FOOTER_LOGO_SCALE: Partial<Record<PaymentMethodId, string>> = {
  visa: "scale-[1.32]",
  paypal: "scale-[1.32]",
  mastercard: "scale-[1.12]",
  "apple-pay": "scale-[0.96]",
  "google-pay": "scale-[1.12]",
};

interface PaymentLogoProps {
  method: PaymentMethod;
  variant?: "light" | "selector";
  className?: string;
}

export function PaymentLogo({
  method,
  variant = "light",
  className,
}: PaymentLogoProps) {
  const isSelector = variant === "selector";

  // Plain public paths — next/image optimizer URLs often break after long idle tabs.
  const image = (
    // eslint-disable-next-line @next/next/no-img-element -- small static payment marks; avoid /_next/image
    <img
      src={method.src}
      alt={method.label}
      width={56}
      height={36}
      decoding="async"
      className={cn(
        "h-6 w-auto object-contain sm:h-8",
        FOOTER_LOGO_SCALE[method.id] ?? "scale-[1.32]",
        className
      )}
    />
  );

  if (isSelector) {
    return (
      <span className="inline-flex h-9 w-14 shrink-0 items-center justify-center bg-transparent">
        {image}
      </span>
    );
  }

  return (
    <span className="inline-flex h-7 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white px-0.5 sm:h-9 sm:w-14">
      {image}
    </span>
  );
}

interface PaymentBadgesProps {
  variant?: "light";
}

export function PaymentBadges({ variant = "light" }: PaymentBadgesProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        variant === "light"
          ? "w-full flex-nowrap justify-between gap-1 sm:w-auto sm:justify-start sm:gap-2"
          : "flex-wrap gap-2"
      )}
    >
      {PAYMENT_METHODS.map((method) => (
        <PaymentLogo key={method.id} method={method} variant={variant} />
      ))}
    </div>
  );
}
