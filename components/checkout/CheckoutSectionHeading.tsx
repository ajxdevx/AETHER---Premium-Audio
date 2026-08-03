import type { AppIcon } from "@/lib/icons";
import { checkoutSectionClassName } from "@/components/checkout/checkoutStyles";

export function CheckoutSectionHeading({
  icon: Icon,
  title,
  children,
}: {
  icon: AppIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={checkoutSectionClassName}>
      <div className="mb-5 flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand"
          aria-hidden
        >
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <h2 className="font-[family-name:var(--font-announce)] text-lg font-bold tracking-tight text-ink">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
