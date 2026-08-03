"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface HeaderIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const HeaderIconButton = forwardRef<HTMLButtonElement, HeaderIconButtonProps>(
  ({ className, label, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        "group relative inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full md:h-12 md:w-12",
        "bg-white text-brand brand-icon-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-soft",
        className
      )}
      {...props}
    >
      <span className="relative text-current transition-colors duration-300">
        {children}
      </span>
    </button>
  )
);
HeaderIconButton.displayName = "HeaderIconButton";
