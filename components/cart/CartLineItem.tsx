"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "@/lib/icons";
import type { CartItem } from "@/types/product";
import { IconButton } from "@/components/ui/IconButton";
import { CartItemThumbnail } from "@/components/cart/CartItemThumbnail";
import { BUTTON_RADIUS, CONTROL_RADIUS } from "@/lib/buttonStyles";
import { resolveToastTheme } from "@/providers/ToastProvider";
import { formatPrice, cn } from "@/lib/utils";

interface CartLineItemProps {
  item: CartItem;
  onUpdateQuantity: (lineKey: string, quantity: number) => void;
  onRemove: (lineKey: string) => void;
  onNavigate?: () => void;
  variant?: "drawer" | "page";
}

export function CartLineItem({
  item,
  onUpdateQuantity,
  onRemove,
  onNavigate,
}: CartLineItemProps) {
  const theme = resolveToastTheme(item.variant);

  return (
    <li
      className={cn("flex gap-3 p-3", BUTTON_RADIUS)}
      style={{ backgroundColor: theme.bg }}
    >
      <CartItemThumbnail
        src={item.thumbnail}
        alt={item.title}
        surface="drawer"
        pastel={theme.imageBg}
      />
      <div className="flex flex-1 flex-col gap-1.5">
        <Link
          href={`/product/${item.id}`}
          onClick={onNavigate}
          className="text-sm font-semibold text-ink transition-colors hover:text-brand"
        >
          {item.title}
        </Link>
        {item.variant ? (
          <p className="text-xs font-medium" style={{ color: theme.accent }}>
            {theme.label ?? item.variant}
          </p>
        ) : null}
        <p className="text-sm font-bold tabular-nums text-ink">
          {formatPrice(item.price)}
        </p>
        <div className="flex items-center justify-between pt-1">
          <div
            className={cn(
              "flex items-center gap-1.5 border border-black/10 bg-white/80 px-1 py-1 backdrop-blur-[2px]",
              CONTROL_RADIUS
            )}
          >
            <IconButton
              label="Decrease quantity"
              variant="light"
              onClick={() => onUpdateQuantity(item.lineKey, item.quantity - 1)}
              className="h-6 w-6 border-0 bg-transparent shadow-none hover:bg-white/90"
              style={{ color: theme.accent }}
            >
              <Minus size={12} />
            </IconButton>
            <span className="min-w-[1.25rem] text-center text-xs font-semibold tabular-nums text-ink">
              {item.quantity}
            </span>
            <IconButton
              label="Increase quantity"
              variant="light"
              onClick={() => onUpdateQuantity(item.lineKey, item.quantity + 1)}
              disabled={item.quantity >= (item.stock ?? 99)}
              className="h-6 w-6 border-0 bg-transparent shadow-none hover:bg-white/90"
              style={{ color: theme.accent }}
            >
              <Plus size={12} />
            </IconButton>
          </div>
          <IconButton
            label="Remove item"
            variant="light"
            onClick={() => onRemove(item.lineKey)}
            className={cn(
              "h-7 w-7 border-0 bg-transparent text-ink-muted shadow-none transition-colors",
              "hover:bg-danger/10 hover:text-danger"
            )}
          >
            <Trash2 size={14} />
          </IconButton>
        </div>
      </div>
    </li>
  );
}
