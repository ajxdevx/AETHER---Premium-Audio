import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/lib/icons";
import { ASSETS } from "@/constants/assets";
import { PANEL_RADIUS } from "@/components/shop/shopConstants";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { cn } from "@/lib/utils";

export function TradeInCard() {
  return (
    <div
      className={cn(
        "relative overflow-visible bg-surface-warm p-5 sm:p-6",
        PANEL_RADIUS
      )}
    >
      <p className="relative z-[1] text-[15px] font-bold tracking-tight text-ink">
        Trade in. Upgrade.
      </p>
      <p className="relative z-[1] mt-1.5 max-w-[22ch] text-[13px] leading-relaxed text-ink-warm">
        Save when you trade in eligible headphones for Aether Pods.
      </p>
      <Link
        href="/shop#faq-trade-in"
        className="group/btn relative z-[1] mt-5 inline-flex h-11 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-ink py-1 pl-5 pr-1.5 text-[13px] font-semibold text-white"
      >
        <ButtonWipeFill />
        <span className="relative z-[1]">Learn More</span>
        <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors duration-500 group-hover/btn:bg-white group-hover/btn:text-brand">
          <ArrowRight size={15} strokeWidth={2.25} aria-hidden />
        </span>
      </Link>
      <div className="pointer-events-none relative -mx-2 mt-3 h-36 overflow-hidden sm:-mx-3 sm:h-40 lg:mx-0 lg:h-28 lg:overflow-visible xl:h-32">
        <Image
          src={ASSETS.marketing.spotlights.ctaBanner}
          alt="Aether Pods in Pink, Matcha Green, Sky Blue, and Space Dark"
          fill
          className="object-contain object-center scale-[1.9] sm:scale-[2] lg:scale-[1.55] xl:scale-[1.7]"
          sizes="(max-width: 1024px) 100vw, 270px"
        />
      </div>
    </div>
  );
}
