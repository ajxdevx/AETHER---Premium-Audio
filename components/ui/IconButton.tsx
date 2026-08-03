import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import {
  BRAND_SOFT_HOVER,
  COMPACT_RADIUS,
  MOTION,
} from "@/lib/buttonStyles";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "light" | "dark";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, variant = "light", children, ...props }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      className={cn(
        "inline-flex h-10 w-10 cursor-pointer items-center justify-center transition-all",
        MOTION.fast,
        COMPACT_RADIUS,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variant === "light" &&
          cn(
            "bg-white text-ink",
            BRAND_SOFT_HOVER,
            "focus-visible:ring-brand/35"
          ),
        variant === "dark" &&
          cn(
            "bg-transparent text-white hover:bg-white/10",
            "focus-visible:ring-white/30"
          ),
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
IconButton.displayName = "IconButton";
