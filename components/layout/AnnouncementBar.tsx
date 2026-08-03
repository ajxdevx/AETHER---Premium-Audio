"use client";

import { motion } from "framer-motion";
import type { AppIcon } from "@/lib/icons";
import { Headphones, Shield, Star, Truck, Zap } from "@/lib/icons";
import { premiumEase } from "@/components/home/SectionReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ANNOUNCEMENTS: { icon: AppIcon; text: string }[] = [
  { icon: Truck, text: "FREE SHIPPING ON ORDERS OVER 999 MAD" },
  { icon: Zap, text: "UP TO 30% OFF AETHER PODS" },
  { icon: Headphones, text: "NEW MATCHA GREEN AETHER PODS" },
  { icon: Shield, text: "2-YEAR WARRANTY ON EVERY PAIR" },
  { icon: Star, text: "4.7/5 FROM 50,000+ LISTENERS" },
];

/** Three identical strips — animate by 1/3 so the loop seam stays seamless. */
const TRACK_KEYS = ["a", "b", "c"] as const;

function AnnouncementItems({
  duplicateKey,
  inert = false,
}: {
  duplicateKey: string;
  inert?: boolean;
}) {
  return (
    <div className="announcement-track" aria-hidden={inert || undefined}>
      {ANNOUNCEMENTS.map(({ icon: Icon, text }) => (
        <span
          key={`${duplicateKey}-${text}`}
          className="announcement-item inline-flex items-center gap-2 whitespace-nowrap leading-none"
        >
          <Icon
            size={14}
            strokeWidth={2.25}
            className="shrink-0 text-brand"
            aria-hidden
          />
          <span>{text}</span>
          <span className="text-brand/35" aria-hidden>
            •
          </span>
        </span>
      ))}
    </div>
  );
}

export function AnnouncementBar() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="announcement-bar relative flex h-8 items-center overflow-hidden bg-brand-soft text-brand"
      role="region"
      aria-label="Site announcements"
      // Opacity only — a parent transform fights the CSS marquee and can flash a blank gap at the loop.
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: premiumEase }}
    >
      <div className="announcement-marquee flex h-full w-max items-center font-[family-name:var(--font-announce)] text-[12px] font-semibold uppercase tracking-[0.08em] sm:text-[13px]">
        {TRACK_KEYS.map((key, index) => (
          <AnnouncementItems
            key={key}
            duplicateKey={key}
            inert={index > 0}
          />
        ))}
      </div>
    </motion.div>
  );
}
