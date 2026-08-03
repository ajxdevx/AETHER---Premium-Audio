"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Trash2, X } from "@/lib/icons";
import { useWishlist } from "@/hooks/useWishlist";
import { HeaderIconButton } from "@/components/layout/HeaderIconButton";
import { Badge } from "@/components/ui/Badge";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { formatPrice, cn } from "@/lib/utils";

const PASTEL_BY_COLOR: Record<string, string> = {
  green: "#DCEFDA",
  pink: "#F6D6E4",
  blue: "#D4E9F7",
  black: "#E4E5EA",
};

const PANEL_GAP = 8;
const VIEWPORT_PAD = 12;

function getItemPastel(item: { colorId: string; pastel?: string }) {
  return item.pastel ?? PASTEL_BY_COLOR[item.colorId] ?? "#DCEFDA";
}

function FavoritesPanel({
  count,
  items,
  onClose,
  removeFavorite,
  className,
  style,
  panelRef,
  closeButtonRef,
  id,
}: {
  count: number;
  items: ReturnType<typeof useWishlist>["items"];
  onClose: () => void;
  removeFavorite: (key: string) => void;
  className?: string;
  style?: React.CSSProperties;
  panelRef?: React.RefObject<HTMLDivElement | null>;
  closeButtonRef?: React.RefObject<HTMLButtonElement | null>;
  id?: string;
}) {
  return (
    <motion.div
      ref={panelRef}
      id={id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className={cn(
        "z-[80] flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_-20px_rgba(80,60,20,0.28)]",
        className
      )}
      style={style}
      role="menu"
      aria-label="Favorites"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-brand-soft bg-brand-mist px-4 py-3.5">
        <div>
          <p className="text-sm font-semibold text-ink">Favorites</p>
          <p className="mt-0.5 text-xs text-ink-muted">
            {count === 0
              ? "No saved products yet"
              : `${count} saved product${count === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close favorites"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors brand-soft-hover"
        >
          <X size={16} aria-hidden />
        </button>
      </div>

      {count === 0 ? (
        <div className="px-4 py-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
            <Heart
              size={20}
              strokeWidth={1.75}
              className="fill-current"
              aria-hidden
            />
          </span>
          <p className="mt-3 text-sm font-medium text-ink">
            Save products you love
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Tap the heart on any product to add it here.
          </p>
        </div>
      ) : (
        <ul
          data-lenis-prevent
          data-hide-scrollbar
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"
        >
          {items.map((item) => (
            <li key={item.key} role="none" className="px-2">
              <div className="group/fav relative flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-brand-soft">
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={onClose}
                  className="absolute inset-0 z-0 rounded-2xl"
                  aria-label={`${item.title}, ${formatPrice(item.price)}`}
                />
                <span
                  className="relative z-[1] pointer-events-none h-14 w-14 shrink-0 overflow-hidden rounded-xl"
                  style={{ backgroundColor: getItemPastel(item) }}
                  aria-hidden
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                  />
                </span>
                <span className="relative z-[1] pointer-events-none min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-ink">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[13px] font-bold tabular-nums text-ink">
                    {formatPrice(item.price)}
                  </span>
                </span>
                <button
                  type="button"
                  role="menuitem"
                  aria-label={`Remove ${item.title} from favorites`}
                  onClick={() => removeFavorite(item.key)}
                  className="relative z-[2] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-[#DC2626]/10 hover:text-[#DC2626]"
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export function FavoritesMenu() {
  const { items, count, removeFavorite } = useWishlist();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobilePos, setMobilePos] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 0,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const desktopPanelRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activePanelRef = isDesktop ? desktopPanelRef : mobilePanelRef;

  useFocusTrap(open, activePanelRef, closeButtonRef);

  useEffect(() => {
    const mountedTimer = window.setTimeout(() => setMounted(true), 0);
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    const desktopTimer = window.setTimeout(sync, 0);
    mq.addEventListener("change", sync);
    return () => {
      window.clearTimeout(mountedTimer);
      window.clearTimeout(desktopTimer);
      mq.removeEventListener("change", sync);
    };
  }, []);

  useLayoutEffect(() => {
    if (!open || isDesktop || !rootRef.current) return;

    const update = () => {
      const rect = rootRef.current!.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = Math.min(20 * 16, vw - VIEWPORT_PAD * 2);
      let left = rect.right - width;
      left = Math.max(VIEWPORT_PAD, Math.min(left, vw - VIEWPORT_PAD - width));
      const top = rect.bottom + PANEL_GAP;
      const maxHeight = Math.max(160, vh - top - VIEWPORT_PAD);

      setMobilePos({ top, left, width, maxHeight });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, isDesktop]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (mobilePanelRef.current?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <div className="relative">
        <HeaderIconButton
          label="Favorites"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="favorites-menu-panel"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12",
            open &&
              "bg-brand text-white shadow-[0_4px_16px_-6px_rgba(var(--brand-accent-rgb),0.35)]"
          )}
        >
          <Heart
            size={20}
            strokeWidth={1.75}
            className={cn(count > 0 && "fill-current")}
          />
        </HeaderIconButton>
        <Badge count={count} />
      </div>

      <AnimatePresence>
        {open && isDesktop ? (
          <FavoritesPanel
            id="favorites-menu-panel"
            panelRef={desktopPanelRef}
            closeButtonRef={closeButtonRef}
            count={count}
            items={items}
            onClose={close}
            removeFavorite={removeFavorite}
            className="absolute right-0 top-[calc(100%+0.5rem)] max-h-[min(22rem,calc(100dvh-8rem))] w-[min(20rem,calc(100vw-1.5rem))]"
          />
        ) : null}
      </AnimatePresence>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open && !isDesktop ? (
                <FavoritesPanel
                  id="favorites-menu-panel"
                  panelRef={mobilePanelRef}
                  closeButtonRef={closeButtonRef}
                  count={count}
                  items={items}
                  onClose={close}
                  removeFavorite={removeFavorite}
                  className="fixed"
                  style={{
                    top: mobilePos.top,
                    left: mobilePos.left,
                    width: mobilePos.width,
                    maxHeight: mobilePos.maxHeight,
                  }}
                />
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}
