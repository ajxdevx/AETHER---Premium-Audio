"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShoppingBag, X } from "@/lib/icons";
import { useCart } from "@/hooks/useCart";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { scrollToHash } from "@/lib/navScroll";

export function CartDrawer() {
  const router = useRouter();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  useEscapeKey(isOpen, closeCart);
  useFocusTrap(isOpen, drawerRef, closeButtonRef);

  const continueShopping = () => {
    closeCart();
    if (window.location.pathname === "/") {
      scrollToHash("featured", "smooth");
      return;
    }
    router.push("/shop");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[70] flex h-[100dvh] max-h-[100dvh] w-full max-w-[420px] flex-col overflow-hidden border-l border-brand-border bg-white text-ink shadow-[0_20px_60px_-20px_rgba(80,60,20,0.35)] max-lg:pb-[env(safe-area-inset-bottom,0px)] max-lg:pt-[env(safe-area-inset-top,0px)]"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-brand-soft bg-brand-mist px-6 py-5 max-lg:px-4 max-lg:py-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold tracking-tight text-ink">
                  Your Cart
                </h2>
                {itemCount > 0 && (
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold tabular-nums text-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close cart"
                onClick={closeCart}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand transition-[background-color,color,box-shadow] duration-300 ease-out brand-icon-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35"
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6 text-center max-lg:px-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <ShoppingBag size={28} strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    Add something you love to get started.
                  </p>
                </div>
                <Button onClick={continueShopping} size="lg">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <ul
                  data-lenis-prevent
                  data-hide-scrollbar
                  className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain bg-white px-6 py-4 max-lg:px-4 max-lg:py-3"
                >
                  {items.map((item) => (
                    <CartLineItem
                      key={item.lineKey}
                      item={item}
                      variant="drawer"
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      onNavigate={closeCart}
                    />
                  ))}
                </ul>

                <div className="shrink-0 border-t border-brand-soft bg-brand-mist px-6 py-5 max-lg:px-4 max-lg:py-4">
                  <CartSummary
                    subtotal={subtotal}
                    itemCount={itemCount}
                    variant="drawer"
                    onNavigate={closeCart}
                    className="max-lg:space-y-3"
                  />
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
