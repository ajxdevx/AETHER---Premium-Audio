"use client";

import { useLayoutEffect } from "react";
import { SIGNATURE_THEMES, type SignatureThemeId } from "@/constants/brand";
import { useSignatureTheme } from "@/providers/SignatureThemeProvider";
import {
  buildThemeFaviconDataUrl,
  getThemeAccent,
} from "@/lib/themeFavicon";

/**
 * Only touch links we own. Never removeChild arbitrary head icons — that races
 * React 19 HostHoistable / next/image preload cleanup on soft navigations.
 */
function applyFaviconLinks(href: string) {
  const owned = document.head.querySelectorAll<HTMLLinkElement>(
    'link[data-theme-favicon="true"]'
  );

  if (owned.length > 0) {
    owned[0].href = href;
    owned[0].type = "image/svg+xml";
    owned[0].sizes = "any";
    return;
  }

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.sizes = "any";
  link.dataset.themeFavicon = "true";
  link.href = href;
  document.head.appendChild(link);
}

function applyThemeColor(color: string) {
  const owned = document.head.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"][data-theme-color="true"]'
  );

  if (owned) {
    owned.content = color;
    return;
  }

  const existing = document.head.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]'
  );
  if (existing) {
    existing.content = color;
    existing.dataset.themeColor = "true";
    return;
  }

  const meta = document.createElement("meta");
  meta.name = "theme-color";
  meta.content = color;
  meta.dataset.themeColor = "true";
  document.head.appendChild(meta);
}

/** Keeps favicon + theme-color in sync with the active signature theme. */
export function ThemeFavicon() {
  const { themeId } = useSignatureTheme();

  useLayoutEffect(() => {
    // Boot script may already have the real theme; don't overwrite with stale default
    const boot = document.documentElement.dataset.signature;
    const id: SignatureThemeId =
      boot && boot in SIGNATURE_THEMES && boot !== themeId
        ? (boot as SignatureThemeId)
        : themeId;

    applyFaviconLinks(buildThemeFaviconDataUrl(id));
    applyThemeColor(getThemeAccent(id));
  }, [themeId]);

  return null;
}
