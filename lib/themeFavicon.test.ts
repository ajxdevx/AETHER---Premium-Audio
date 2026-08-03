import { describe, expect, it } from "vitest";
import {
  buildThemeFaviconDataUrl,
  getThemeAccent,
  isSignatureThemeId,
} from "@/lib/themeFavicon";
import {
  DEFAULT_SIGNATURE_THEME,
  SIGNATURE_THEMES,
} from "@/constants/brand";

describe("themeFavicon helpers", () => {
  it("recognizes valid signature theme ids", () => {
    expect(isSignatureThemeId("green")).toBe(true);
    expect(isSignatureThemeId("pink")).toBe(true);
    expect(isSignatureThemeId("not-a-theme")).toBe(false);
    expect(isSignatureThemeId(null)).toBe(false);
  });

  it("returns the theme accent color", () => {
    expect(getThemeAccent("green")).toBe(SIGNATURE_THEMES.green.accent);
    expect(getThemeAccent(DEFAULT_SIGNATURE_THEME)).toBe(
      SIGNATURE_THEMES[DEFAULT_SIGNATURE_THEME].accent
    );
  });

  it("builds a themed SVG data URL favicon", () => {
    const url = buildThemeFaviconDataUrl("blue");
    expect(url.startsWith("data:image/svg+xml;charset=utf-8,")).toBe(true);

    const svg = decodeURIComponent(url.split(",")[1] ?? "");
    expect(svg).toContain("<svg");
    expect(svg).toContain(SIGNATURE_THEMES.blue.accent);
    expect(svg).toContain('fill="#FFFFFF"');
  });
});
