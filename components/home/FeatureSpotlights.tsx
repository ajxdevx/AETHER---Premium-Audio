"use client";

import { Container } from "@/components/ui/Container";
import { HeroWearSpotlight } from "@/components/home/HeroWearSpotlight";
import {
  KIT_SPOTLIGHT_VARIANTS,
  KitSpotlightCard,
} from "@/components/home/KitSpotlightCard";
import { KitCardSyncProvider } from "@/components/home/KitCardSync";

export function FeatureSpotlights() {
  return (
    <section
      className="bg-white pb-10 pt-6 md:pb-12 md:pt-8 lg:pb-14 lg:pt-10"
      aria-labelledby="spotlights-heading"
    >
      <Container wide>
        <h2 id="spotlights-heading" className="sr-only">
          Product highlights
        </h2>

        <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr] lg:items-stretch lg:gap-5">
          <div className="max-lg:h-auto scroll-mt-3 lg:h-full lg:scroll-mt-5">
            <HeroWearSpotlight />
          </div>

          <div className="max-lg:h-auto lg:h-full">
            <KitCardSyncProvider>
              <div className="grid gap-4 sm:grid-cols-2 max-lg:h-auto lg:grid-cols-1 lg:h-full lg:gap-5">
                <KitSpotlightCard
                  cardId="kit-a"
                  title="The Full Kit."
                  body="Case, cable, stand, and cushions — every finish, every piece that ships with your pods."
                  variants={KIT_SPOTLIGHT_VARIANTS}
                  startIndex={0}
                  cycleOffsetMs={0}
                  className="grid grid-cols-1 max-lg:h-auto lg:grid-cols-2 lg:min-h-[140px] lg:h-full"
                />

                <KitSpotlightCard
                  cardId="kit-b"
                  title="Every Detail Matches."
                  body="All sixteen kit shots in signature colors, so the whole setup feels intentional."
                  variants={KIT_SPOTLIGHT_VARIANTS}
                  startIndex={2}
                  cycleOffsetMs={1800}
                  reverse
                  className="grid grid-cols-1 max-lg:h-auto lg:grid-cols-2 lg:min-h-[140px] lg:h-full"
                />
              </div>
            </KitCardSyncProvider>
          </div>
        </div>
      </Container>
    </section>
  );
}
