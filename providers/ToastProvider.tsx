"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { SIGNATURE_THEMES, type SignatureThemeId } from "@/constants/brand";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastOptions {
  message: string;
  title?: string;
  color?: string;
  image?: string;
  /** Product pastel / soft surface color */
  bg?: string;
  /** Accent for labels / CTA (matches product finish) */
  accent?: string;
  /** Tinted surface behind the product thumbnail */
  imageBg?: string;
  action?: ToastAction;
  duration?: number;
}

interface ToastState extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 3500;
const DEFAULT_BG = SIGNATURE_THEMES.green.soft;
const DEFAULT_ACCENT = SIGNATURE_THEMES.green.accent;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  const clearTimer = useCallback(() => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const dismissToast = useCallback(() => {
    clearTimer();
    setToast(null);
  }, [clearTimer]);

  const showToast = useCallback(
    ({
      message,
      title,
      color,
      image,
      bg,
      accent,
      imageBg,
      action,
      duration = DEFAULT_DURATION,
    }: ToastOptions) => {
      clearTimer();
      setToast({
        id: Date.now(),
        message,
        title,
        color,
        image,
        bg,
        accent,
        imageBg,
        action,
        duration,
      });
      timeoutRef.current = window.setTimeout(() => {
        setToast(null);
        timeoutRef.current = null;
      }, duration);
    },
    [clearTimer]
  );

  useEffect(() => clearTimer, [clearTimer]);

  const value = useMemo(() => ({ showToast }), [showToast]);
  const surface = toast?.bg ?? DEFAULT_BG;
  const accent = toast?.accent ?? DEFAULT_ACCENT;
  const imageSurface = toast?.imageBg ?? SIGNATURE_THEMES.green.mist;

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex justify-center px-4 sm:bottom-6 sm:justify-end sm:px-6"
      >
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div
              key={toast.id}
              initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-3 text-ink shadow-[0_20px_50px_-24px_rgba(40,35,20,0.45)]"
              style={{ backgroundColor: surface }}
              role="status"
              aria-label={toast.message}
            >
              {toast.image && (
                <div
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl"
                  style={{ backgroundColor: imageSurface }}
                >
                  <Image
                    src={toast.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-contain p-1.5"
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.08em]"
                  style={{ color: accent }}
                >
                  Added to cart
                </p>
                {toast.title ? (
                  <p className="mt-1 truncate text-sm font-semibold leading-snug text-ink">
                    {toast.title}
                    {toast.color && (
                      <>
                        <span className="mx-2 text-ink/35" aria-hidden>
                          •
                        </span>
                        <span className="font-medium text-ink/70">
                          {toast.color}
                        </span>
                      </>
                    )}
                  </p>
                ) : (
                  <p className="mt-1 text-sm font-semibold leading-snug text-ink">
                    {toast.message}
                  </p>
                )}
                {toast.action && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.action?.onClick();
                      dismissToast();
                    }}
                    className={cn(
                      "mt-2 text-sm font-semibold underline-offset-4",
                      "transition-opacity hover:underline hover:opacity-80",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    )}
                    style={
                      {
                        color: accent,
                        "--tw-ring-color": accent,
                        "--tw-ring-offset-color": surface,
                      } as CSSProperties
                    }
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={dismissToast}
                aria-label="Dismiss notification"
                className={cn(
                  "shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-ink/55",
                  "transition-opacity hover:text-ink hover:opacity-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                )}
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

/** Resolve pastel + accent from a cart variant (colorId or finish name). */
export function resolveToastTheme(variant?: string): {
  bg: string;
  accent: string;
  /** Soft product-tinted surface for image tiles (not white) */
  imageBg: string;
  label?: string;
} {
  if (!variant?.trim()) {
    return {
      bg: DEFAULT_BG,
      accent: DEFAULT_ACCENT,
      imageBg: SIGNATURE_THEMES.green.mist,
    };
  }

  const key = variant.trim().toLowerCase();
  const themeIds = Object.keys(SIGNATURE_THEMES) as SignatureThemeId[];

  for (const id of themeIds) {
    const theme = SIGNATURE_THEMES[id];
    const label = theme.label.toLowerCase();
    if (id === key || label === key || key === label.replace(/\s+/g, " ")) {
      return {
        bg: theme.soft,
        accent: theme.accent,
        imageBg: theme.mist,
        label: theme.label,
      };
    }
  }

  for (const id of themeIds) {
    const theme = SIGNATURE_THEMES[id];
    const label = theme.label.toLowerCase();
    if (key.includes(id) || label.includes(key) || key.includes(label)) {
      return {
        bg: theme.soft,
        accent: theme.accent,
        imageBg: theme.mist,
        label: theme.label,
      };
    }
  }

  return {
    bg: DEFAULT_BG,
    accent: DEFAULT_ACCENT,
    imageBg: SIGNATURE_THEMES.green.mist,
    label: variant,
  };
}
