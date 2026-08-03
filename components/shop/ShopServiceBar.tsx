import { SectionReveal } from "@/components/home/SectionReveal";
import { SERVICE_ITEMS } from "@/components/shop/shopConstants";

export function ShopServiceBar() {
  return (
    <SectionReveal y={28} className="mt-12 lg:mt-14">
      <ul className="grid grid-cols-1 gap-3 border-t border-brand-soft pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:pt-10">
        {SERVICE_ITEMS.map(({ label, hint, icon: Icon }) => (
          <li
            key={label}
            className="flex items-start gap-3 rounded-2xl bg-surface-soft p-3.5 sm:p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand">
              <Icon size={18} strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[13px] font-bold leading-tight text-ink sm:text-[14px]">
                {label}
              </p>
              <p className="mt-1 text-[11px] font-medium leading-snug text-ink-soft sm:text-[12px]">
                {hint}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </SectionReveal>
  );
}
