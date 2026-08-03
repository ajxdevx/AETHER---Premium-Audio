"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_SIGNATURE_THEME,
  SIGNATURE_THEMES,
  type SignatureThemeId,
} from "@/constants/brand";

const STORAGE_KEY = "aether-signature-theme";
const THEME_TRANSITION_MS = 450;

type SignatureThemeContextValue = {
  themeId: SignatureThemeId;
  theme: (typeof SIGNATURE_THEMES)[SignatureThemeId];
  setThemeId: (id: SignatureThemeId) => void;
};

const SignatureThemeContext =
  createContext<SignatureThemeContextValue | null>(null);

function applyThemeVars(id: SignatureThemeId) {
  const theme = SIGNATURE_THEMES[id];
  const root = document.documentElement;
  root.dataset.signature = id;
  root.style.setProperty("--brand-accent", theme.accent);
  root.style.setProperty("--brand-accent-rgb", theme.accentRgb);
  root.style.setProperty("--brand-soft", theme.soft);
  root.style.setProperty("--brand-mist", theme.mist);
  root.style.setProperty("--brand-border", theme.border);
}

function readStoredTheme(): SignatureThemeId {
  if (typeof window === "undefined") return DEFAULT_SIGNATURE_THEME;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && stored in SIGNATURE_THEMES) {
    return stored as SignatureThemeId;
  }
  // Prefer boot script value if present
  const boot = document.documentElement.dataset.signature;
  if (boot && boot in SIGNATURE_THEMES) {
    return boot as SignatureThemeId;
  }
  return DEFAULT_SIGNATURE_THEME;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SignatureThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<SignatureThemeId>(readStoredTheme);
  const clearAnimTimerRef = useRef<number | null>(null);

  // Sync from localStorage / boot script before paint so favicon never flashes wrong
  useLayoutEffect(() => {
    applyThemeVars(themeId);
  }, [themeId]);

  const setThemeId = useCallback((id: SignatureThemeId) => {
    setThemeIdState((current) => {
      if (current === id) return current;

      const root = document.documentElement;
      if (!prefersReducedMotion()) {
        root.classList.add("theme-switching");
        if (clearAnimTimerRef.current != null) {
          window.clearTimeout(clearAnimTimerRef.current);
        }
        clearAnimTimerRef.current = window.setTimeout(() => {
          root.classList.remove("theme-switching");
          clearAnimTimerRef.current = null;
        }, THEME_TRANSITION_MS);
      }

      applyThemeVars(id);
      window.localStorage.setItem(STORAGE_KEY, id);
      return id;
    });
  }, []);

  useLayoutEffect(() => {
    return () => {
      if (clearAnimTimerRef.current != null) {
        window.clearTimeout(clearAnimTimerRef.current);
      }
      document.documentElement.classList.remove("theme-switching");
    };
  }, []);

  const value = useMemo(
    () => ({
      themeId,
      theme: SIGNATURE_THEMES[themeId],
      setThemeId,
    }),
    [themeId, setThemeId]
  );

  return (
    <SignatureThemeContext.Provider value={value}>
      {children}
    </SignatureThemeContext.Provider>
  );
}

export function useSignatureTheme() {
  const ctx = useContext(SignatureThemeContext);
  if (!ctx) {
    throw new Error(
      "useSignatureTheme must be used within SignatureThemeProvider"
    );
  }
  return ctx;
}
