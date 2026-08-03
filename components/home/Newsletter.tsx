"use client";

import Image from "next/image";
import { ASSETS } from "@/constants/assets";
import { Container } from "@/components/ui/Container";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { buttonBlackWipeClass } from "@/lib/buttonStyles";
import { cn } from "@/lib/utils";
import { SectionReveal } from "@/components/home/SectionReveal";
import { useSignatureTheme } from "@/providers/SignatureThemeProvider";

export function Newsletter() {
  const { themeId } = useSignatureTheme();
  const envelopeSrc =
    ASSETS.marketing.spotlights.newsletter[themeId] ??
    ASSETS.marketing.spotlights.newsletter.green;

  return (
    <section id="discover" className="bg-white py-8 md:py-14">
      <Container wide>
        <SectionReveal y={36}>
          <div className="overflow-hidden rounded-[22px] bg-brand-soft transition-colors duration-500 sm:rounded-[28px] lg:px-12 lg:py-9">
            <div className="flex flex-col lg:hidden">
              <div className="relative mx-auto h-[min(48vw,260px)] w-full max-w-sm sm:h-[280px]">
                <Image
                  src={envelopeSrc}
                  alt="Newsletter offer envelope"
                  fill
                  className="object-contain object-center scale-[1.2] drop-shadow-[0_12px_24px_rgba(40,40,40,0.16)] sm:scale-[1.3]"
                  sizes="90vw"
                />
              </div>

              <div className="px-5 pb-6 pt-2 sm:px-8 sm:pb-8 sm:pt-3">
                <h2 className="font-[family-name:var(--font-announce)] text-[clamp(1.35rem,5vw+0.4rem,1.75rem)] font-bold leading-[1.15] tracking-[-0.03em] text-ink">
                  Get 10% Off Your First Order
                </h2>
                <p className="mt-2 max-w-[36ch] text-[13px] leading-relaxed text-ink-muted sm:text-[14px]">
                  Subscribe to get exclusive offers, early access, and the latest
                  product drops.
                </p>

                <form
                  className="group/form mt-5 flex w-full min-w-0 items-stretch overflow-hidden rounded-full bg-white shadow-[0_1px_2px_rgba(26,26,26,0.04)]"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label className="sr-only" htmlFor="newsletter-email-mobile">
                    Email address
                  </label>
                  <input
                    id="newsletter-email-mobile"
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="h-11 w-full min-w-0 flex-1 bg-transparent px-4 text-[13px] text-ink outline-none placeholder:text-ink-soft sm:h-12 sm:px-5"
                  />
                  <button
                    type="submit"
                    className={cn(
                      buttonBlackWipeClass,
                      "h-11 shrink-0 cursor-pointer rounded-none rounded-r-full px-4 text-[13px] font-semibold sm:h-12 sm:px-5"
                    )}
                  >
                    <ButtonWipeFill />
                    <span className="relative z-[1]">Subscribe</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="hidden items-center gap-8 lg:flex xl:gap-10">
              <div className="relative z-[1] h-[120px] w-[140px] shrink-0">
                <Image
                  src={envelopeSrc}
                  alt="Newsletter offer envelope"
                  fill
                  className="scale-[1.75] object-contain object-center drop-shadow-[0_12px_24px_rgba(40,40,40,0.16)]"
                  sizes="140px"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-[family-name:var(--font-announce)] text-[clamp(1.45rem,1.6vw+0.85rem,2rem)] font-bold leading-[1.15] tracking-[-0.03em] text-ink">
                  Get 10% Off Your First Order
                </h2>
                <p className="mt-2 max-w-[40ch] text-[15px] leading-relaxed text-ink-muted">
                  Subscribe to get exclusive offers, early access, and the latest
                  product drops.
                </p>
              </div>

              <form
                className="group/form flex w-full min-w-0 flex-1 overflow-hidden rounded-full bg-white shadow-[0_1px_2px_rgba(26,26,26,0.04)] transition-[box-shadow,transform] duration-300 ease-out focus-within:shadow-[0_8px_28px_rgba(26,26,26,0.1)]"
                onSubmit={(e) => e.preventDefault()}
              >
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="h-[52px] w-full min-w-0 flex-1 bg-transparent px-6 text-[14px] text-ink outline-none placeholder:text-ink-soft"
                />
                <button
                  type="submit"
                  className={cn(
                    buttonBlackWipeClass,
                    "h-[52px] shrink-0 cursor-pointer rounded-none rounded-r-full px-8 text-[14px] font-semibold"
                  )}
                >
                  <ButtonWipeFill />
                  <span className="relative z-[1]">Subscribe</span>
                </button>
              </form>
            </div>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
