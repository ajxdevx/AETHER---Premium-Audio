"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  HelpCircle,
  Package,
  Settings,
  Truck,
  User,
} from "@/lib/icons";
import { ASSETS } from "@/constants/assets";
import { cn } from "@/lib/utils";

const PROFILE = {
  name: "Anass Jid",
  email: "anass@aether.audio",
  avatar: ASSETS.avatars.profile,
} as const;

const MENU_ITEMS = [
  { label: "My account", hint: "Profile & preferences", icon: User },
  { label: "Track order", hint: "Live shipping updates", icon: Truck },
  { label: "Order history", hint: "Past purchases", icon: Package },
  { label: "Wishlist", hint: "Saved products", icon: Heart },
  { label: "Settings", hint: "Notifications & privacy", icon: Settings },
  { label: "Help & support", hint: "FAQs and contact", icon: HelpCircle },
] as const;

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "group inline-flex h-9 items-center gap-2 rounded-full bg-white pl-1 pr-1 text-brand sm:h-11 sm:gap-3 sm:pl-1.5 sm:pr-4 md:h-12 md:pr-5",
          "transition-[background-color,color,box-shadow] duration-300 ease-out",
          "brand-icon-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-soft",
          open &&
            "bg-brand text-white shadow-[0_4px_16px_-6px_rgba(var(--brand-accent-rgb),0.35)]"
        )}
      >
        <span
          className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-brand-soft sm:h-9 sm:w-9"
          style={{
            backgroundImage: `url(${PROFILE.avatar})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <span className="hidden whitespace-nowrap text-[15px] font-medium text-current transition-colors duration-300 md:inline">
          {PROFILE.name}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-[min(18.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_-20px_rgba(80,60,20,0.28)]"
            role="menu"
            aria-label="Account menu"
          >
            <div className="flex items-center gap-3 border-b border-brand-soft bg-brand-mist px-4 py-3.5">
              <span
                className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-brand-soft"
                style={{
                  backgroundImage: `url(${PROFILE.avatar})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {PROFILE.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-ink-muted">
                  {PROFILE.email}
                </p>
              </div>
            </div>

            <ul className="p-2">
              {MENU_ITEMS.map(({ label, hint, icon: Icon }) => (
                <li key={label} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-ink-warm transition-colors duration-200 hover:bg-brand-soft hover:text-ink"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-mist text-brand transition-colors duration-200 group-hover:bg-white group-hover:text-brand">
                      <Icon size={16} strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-ink">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink-muted">
                        {hint}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
