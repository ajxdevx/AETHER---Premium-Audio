import { cn } from "@/lib/utils";

/** Shared radius scale — use these instead of one-off rounded-[…] values. */
export const RADIUS = {
  pill: "rounded-full",
  control: "rounded-2xl",
  compact: "rounded-xl",
  tight: "rounded-lg",
  /** Product / shop / checkout cards */
  card: "rounded-[1.75rem]",
  /** Nested cards inside panels */
  nested: "rounded-[1.35rem]",
  /** Marketing / menu panels */
  panel: "rounded-[22px] sm:rounded-[28px]",
  /** Compact testimonial-style cards */
  panelSm: "rounded-[20px] sm:rounded-[22px]",
  /** Filter / sort popovers */
  popover: "rounded-[1.25rem]",
} as const;

export const BUTTON_BORDER = "border border-border";
export const BUTTON_BORDER_HOVER = "hover:border-primary/25";
export const BUTTON_RADIUS = RADIUS.control;
export const CONTROL_RADIUS = RADIUS.compact;
export const COMPACT_RADIUS = RADIUS.tight;
export const CARD_RADIUS = RADIUS.card;
export const NESTED_RADIUS = RADIUS.nested;
export const PANEL_RADIUS = RADIUS.panel;
export const PANEL_SM_RADIUS = RADIUS.panelSm;
export const POPOVER_RADIUS = RADIUS.popover;

export const BUTTON_SOFT_HOVER = "hover:bg-card";
export const BRAND_SOFT_HOVER = "hover:bg-brand-soft hover:text-brand";

/** Header / chrome icon invert hover */
export const BRAND_ICON_SHADOW =
  "hover:shadow-[0_4px_16px_-6px_rgba(var(--brand-accent-rgb),0.35)]";
export const BRAND_ICON_HOVER = cn(
  "hover:bg-brand hover:text-white",
  BRAND_ICON_SHADOW
);
export const BRAND_ICON_TRANSITION =
  "transition-[background-color,color,box-shadow] duration-300 ease-out";

export const MOTION = {
  fast: "duration-200",
  base: "duration-300",
  wipe: "duration-500",
} as const;

export const FONT_ANNOUNCE = "font-[family-name:var(--font-announce)]";

/** Page / section titles (Space Grotesk) */
export const SECTION_HEADING_CLASS = cn(
  FONT_ANNOUNCE,
  "text-[clamp(1.65rem,4vw+0.7rem,2.5rem)] font-bold leading-[1.15] tracking-[-0.03em] text-ink"
);

export const SECTION_LEAD_CLASS =
  "text-[15px] leading-relaxed text-ink-muted sm:text-base";

export const PAGE_TITLE_CLASS = cn(
  FONT_ANNOUNCE,
  "text-xl font-bold tracking-tight text-ink md:text-2xl"
);

export const EYEBROW_CLASS =
  "text-[12px] font-semibold uppercase tracking-[0.14em] text-brand";

export const buttonBaseClass = cn(
  "inline-flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold transition-all",
  MOTION.fast,
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-2",
  "disabled:opacity-50",
  BUTTON_RADIUS
);

/** Primary black CTA — pair with ButtonWipeFill inside. */
export const buttonBlackWipeClass = cn(
  "group/btn relative inline-flex cursor-pointer items-center justify-center overflow-hidden",
  RADIUS.pill,
  "border-0 bg-ink text-white"
);

/** Secondary outline — brand border fills on hover (cart / product Buy Now). */
export const buttonOutlineBrandClass = cn(
  "inline-flex cursor-pointer items-center justify-center",
  RADIUS.pill,
  "border border-brand bg-white text-brand",
  "transition-colors",
  MOTION.fast,
  "hover:border-brand hover:bg-brand hover:text-white"
);

/** Soft outline — starts muted, fills brand on hover (Hero secondary). */
export const buttonOutlineSoftClass = cn(
  "inline-flex cursor-pointer items-center justify-center",
  RADIUS.pill,
  "border border-brand-border bg-white text-ink",
  "transition-colors",
  MOTION.fast,
  "hover:border-brand hover:bg-brand hover:text-white"
);

/** Chrome circular icon button (header, cart close, footer social). */
export const brandIconButtonClass = cn(
  "inline-flex cursor-pointer items-center justify-center",
  RADIUS.pill,
  "bg-white text-brand",
  BRAND_ICON_TRANSITION,
  BRAND_ICON_HOVER,
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35"
);
