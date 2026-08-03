import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { BRAND } from "@/constants/brand";
import { createPageMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { HomePageBackground } from "@/components/home/HomePageBackground";

const FeatureSpotlights = dynamic(
  () =>
    import("@/components/home/FeatureSpotlights").then((m) => ({
      default: m.FeatureSpotlights,
    })),
  { loading: () => <div className="min-h-[28rem] bg-white" aria-hidden /> }
);

const PressTrust = dynamic(
  () =>
    import("@/components/home/PressTrust").then((m) => ({
      default: m.PressTrust,
    })),
  { loading: () => <div className="min-h-[12rem]" aria-hidden /> }
);

const Testimonials = dynamic(
  () =>
    import("@/components/home/Testimonials").then((m) => ({
      default: m.Testimonials,
    })),
  { loading: () => <div className="min-h-[24rem]" aria-hidden /> }
);

const FinalCTA = dynamic(
  () =>
    import("@/components/home/FinalCTA").then((m) => ({
      default: m.FinalCTA,
    })),
  { loading: () => <div className="min-h-[16rem]" aria-hidden /> }
);

const Newsletter = dynamic(
  () =>
    import("@/components/home/Newsletter").then((m) => ({
      default: m.Newsletter,
    })),
  { loading: () => <div className="min-h-[14rem]" aria-hidden /> }
);

export const metadata: Metadata = createPageMetadata({
  description: `${BRAND.description} Free shipping, 30-day returns, and 2-year warranty — delivery across Morocco.`,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomePageBackground />
      <Hero />
      <FeaturedProductsSection />
      <FeatureSpotlights />
      <PressTrust />
      <Testimonials />
      <FinalCTA />
      <Newsletter />
    </>
  );
}
