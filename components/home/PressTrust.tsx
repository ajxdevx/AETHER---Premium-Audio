"use client";

import type { AppIcon } from "@/lib/icons";
import {
  AudioWaveform,
  Battery,
  Bluetooth,
  Ear,
  Headphones,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  Zap,
} from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { SectionReveal } from "@/components/home/SectionReveal";

const FEATURES: {
  title: string;
  description: string;
  icon: AppIcon;
  tone: string;
}[] = [
  {
    title: "Premium Sound",
    description: "High-fidelity audio with deep bass.",
    icon: AudioWaveform,
    tone: "#6B9B45",
  },
  {
    title: "All-Day Comfort",
    description: "Breathable cushions for long wear.",
    icon: Ear,
    tone: "#C47A94",
  },
  {
    title: "Long Battery Life",
    description: "Up to 40 hours of listening.",
    icon: Battery,
    tone: "#B8963E",
  },
  {
    title: "Seamless Connection",
    description: "Effortless pairing on all devices.",
    icon: Bluetooth,
    tone: "#5A9BB8",
  },
  {
    title: "Active Noise Cancel",
    description: "Block noise so you can focus.",
    icon: Shield,
    tone: "#7A8B6E",
  },
  {
    title: "Spatial Audio",
    description: "Theater-like sound that moves.",
    icon: Sparkles,
    tone: "#8A7EAE",
  },
  {
    title: "Transparency Mode",
    description: "Hear the world around you.",
    icon: Volume2,
    tone: "#5A9A8E",
  },
  {
    title: "Intuitive Controls",
    description: "Music, calls, and volume easily.",
    icon: SlidersHorizontal,
    tone: "#7A7E8C",
  },
  {
    title: "Adaptive EQ",
    description: "Tuned automatically to your ear.",
    icon: Zap,
    tone: "#C48A6A",
  },
  {
    title: "Built to Last",
    description: "Premium materials built to last.",
    icon: Headphones,
    tone: "#6B9A6E",
  },
];

function FeatureItems({ duplicateKey }: { duplicateKey: string }) {
  return (
    <>
      {FEATURES.map(({ title, description, icon: Icon, tone }) => (
        <li
          key={`${duplicateKey}-${title}`}
          className="inline-flex shrink-0 items-start gap-3 pr-2"
        >
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-[0_6px_14px_-8px_rgba(40,35,20,0.35)]"
            style={{ backgroundColor: tone }}
            aria-hidden
          >
            <Icon size={16} strokeWidth={2} />
          </span>
          <div>
            <h3 className="whitespace-nowrap text-[13px] font-bold leading-tight tracking-tight text-ink">
              {title}
            </h3>
            <p className="mt-1 whitespace-nowrap text-[12px] leading-snug text-ink-muted">
              {description}
            </p>
          </div>
        </li>
      ))}
    </>
  );
}

export function PressTrust() {
  return (
    <section
      id="features"
      className="bg-white pb-10 pt-2 md:pb-12 md:pt-3"
      aria-label="Product benefits"
    >
      <Container wide>
        <SectionReveal y={28}>
          <div className="overflow-hidden rounded-[1.25rem] bg-surface-warm py-5 sm:rounded-[1.5rem] sm:py-7 md:py-8">
            <div className="features-marquee flex w-max">
              <ul className="flex shrink-0 items-start gap-6 px-4 sm:gap-10 sm:px-8">
                <FeatureItems duplicateKey="a" />
              </ul>
              <ul className="flex shrink-0 items-start gap-6 px-4 sm:gap-10 sm:px-8" aria-hidden>
                <FeatureItems duplicateKey="b" />
              </ul>
            </div>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
