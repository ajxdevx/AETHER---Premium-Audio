"use client";

import { useRef, useState } from "react";
import { BUTTON_RADIUS } from "@/lib/buttonStyles";
import { cn } from "@/lib/utils";

const CART_ITEM_IMAGE_SIZE_CLASS = "h-24 w-24";

interface CartItemThumbnailProps {
  src: string;
  alt?: string;
  surface?: "drawer" | "page" | "checkout-dark";
  /** Product pastel behind the thumbnail */
  pastel?: string;
  className?: string;
}

const MAX_RETRIES = 3;

export function CartItemThumbnail({
  src,
  alt = "",
  surface = "page",
  pastel,
  className,
}: CartItemThumbnailProps) {
  const retriesRef = useRef({ src, count: 0 });
  const [nonce, setNonce] = useState(0);

  const fallbackClass =
    surface === "checkout-dark" ? "bg-white/[0.08]" : "bg-brand-soft";


  return (
    <div
      className={cn(
        CART_ITEM_IMAGE_SIZE_CLASS,
        "relative shrink-0 overflow-hidden",
        BUTTON_RADIUS,
        !pastel && fallbackClass,
        className
      )}
      style={pastel ? { backgroundColor: pastel } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- cart thumbs use stable public paths; next/image optimizer URLs break after long idle tabs */}
      <img
        key={`${src}-${nonce}`}
        src={src}
        alt={alt}
        className="h-full w-full object-contain p-1.5"
        loading="eager"
        decoding="async"
        onError={() => {
          if (retriesRef.current.src !== src) {
            retriesRef.current = { src, count: 0 };
          }
          if (retriesRef.current.count >= MAX_RETRIES) return;
          retriesRef.current.count += 1;
          window.setTimeout(() => setNonce((n) => n + 1), 200);
        }}
      />
    </div>
  );
}
