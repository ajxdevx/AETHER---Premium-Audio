"use client";

import { ShoppingBag } from "@/lib/icons";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { cn } from "@/lib/utils";

interface ProductPurchasePanelProps {
  quantity: number;
  remainingStock: number;
  canAddToCart: boolean;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export function ProductPurchasePanel({
  quantity,
  remainingStock,
  canAddToCart,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
}: ProductPurchasePanelProps) {
  const maxQuantity = Math.max(remainingStock, 1);

  return (
    <div className="mt-6 flex w-full flex-col gap-3">
      <div className="grid w-full grid-cols-[7.75rem_minmax(0,1fr)] gap-2.5 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-3">
        <QuantitySelector
          hideLabel
          quantity={Math.min(quantity, maxQuantity)}
          onChange={(next) => onQuantityChange(Math.min(next, maxQuantity))}
          max={maxQuantity}
          className={!canAddToCart ? "pointer-events-none opacity-50" : undefined}
        />

        <button
          type="button"
          disabled={!canAddToCart}
          onClick={onAddToCart}
          className={cn(
            "group/btn relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-6 text-[14px] font-semibold leading-none text-white",
            canAddToCart
              ? "cursor-pointer"
              : "pointer-events-none cursor-not-allowed opacity-50"
          )}
        >
          {canAddToCart ? <ButtonWipeFill /> : null}
          <span className="relative z-[1]">
            {canAddToCart ? "Add to Cart" : "Out of Stock"}
          </span>
          {canAddToCart ? (
            <ShoppingBag
              size={16}
              strokeWidth={2.25}
              className="relative z-[1] shrink-0"
              aria-hidden
            />
          ) : null}
        </button>
      </div>

      <button
        type="button"
        disabled={!canAddToCart}
        onClick={onBuyNow}
        className={cn(
          "btn-outline-brand h-12 w-full text-[14px] leading-none",
          !canAddToCart &&
            "pointer-events-none cursor-not-allowed border-brand/40 text-brand/40 opacity-50"
        )}
      >
        {canAddToCart ? "Buy Now" : "Out of Stock"}
      </button>
    </div>
  );
}
