"use client";

import { Minus, Plus } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  className?: string;
  hideLabel?: boolean;
}

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  className,
  hideLabel = false,
}: QuantitySelectorProps) {
  return (
    <div className={cn(!hideLabel && "space-y-2", className)}>
      {!hideLabel ? (
        <p className="text-sm font-medium text-ink-label">Quantity</p>
      ) : null}
      <div
        className={cn(
          "flex h-12 w-full items-center justify-between gap-1 rounded-full border border-brand bg-white px-1.5"
        )}
      >
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onChange(Math.max(min, quantity - 1))}
          disabled={quantity <= min}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink transition-colors brand-soft-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus size={16} strokeWidth={2.25} aria-hidden />
        </button>
        <span
          className="min-w-8 text-center text-[14px] font-semibold leading-none tabular-nums text-ink"
          aria-live="polite"
        >
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink transition-colors brand-soft-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={16} strokeWidth={2.25} aria-hidden />
        </button>
      </div>
    </div>
  );
}
