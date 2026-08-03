import {
  DEFAULT_SIGNATURE_THEME,
  SIGNATURE_THEMES,
  type SignatureThemeId,
} from "@/constants/brand";

const STORAGE_KEY = "aether-signature-theme";

const A_DOTS = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
] as const;

function buildThemeFaviconSvg(themeId: SignatureThemeId, size = 32): string {
  const { accent } = SIGNATURE_THEMES[themeId];
  const pad = size * 0.14;
  const gridW = size - pad * 2;
  const cell = gridW / 5;
  const r = cell * 0.32;
  const offsetX = pad + cell / 2;
  const offsetY = pad + (size - pad * 2) / 7 / 2;
  const stepY = (size - pad * 2) / 7;
  const rx = size * 0.25;

  const circles = A_DOTS.flatMap((row, rowIndex) =>
    row.flatMap((on, colIndex) =>
      on
        ? `<circle cx="${(offsetX + colIndex * cell).toFixed(2)}" cy="${(offsetY + rowIndex * stepY).toFixed(2)}" r="${r.toFixed(2)}" fill="#FFFFFF"/>`
        : []
    )
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none"><rect width="${size}" height="${size}" rx="${rx.toFixed(2)}" fill="${accent}"/>${circles}</svg>`;
}

/** Build a themed dotted-A favicon as an SVG data URL. */
export function buildThemeFaviconDataUrl(
  themeId: SignatureThemeId,
  size = 32
): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    buildThemeFaviconSvg(themeId, size)
  )}`;
}

export function getThemeAccent(themeId: SignatureThemeId): string {
  return SIGNATURE_THEMES[themeId].accent;
}

export function isSignatureThemeId(id: string | null | undefined): id is SignatureThemeId {
  return Boolean(id && id in SIGNATURE_THEMES);
}

/**
 * Blocking boot script: sets CSS vars + favicon + theme-color from localStorage
 * BEFORE React hydrates, using the same dotted-A SVG as ThemeFavicon.
 */
export function getThemeBootScript(): string {
  const accents = Object.fromEntries(
    (Object.keys(SIGNATURE_THEMES) as SignatureThemeId[]).map((id) => [
      id,
      {
        accent: SIGNATURE_THEMES[id].accent,
        accentRgb: SIGNATURE_THEMES[id].accentRgb,
        soft: SIGNATURE_THEMES[id].soft,
        mist: SIGNATURE_THEMES[id].mist,
        border: SIGNATURE_THEMES[id].border,
      },
    ])
  );

  // Precompute favicon data URLs so the boot script matches React exactly
  const favicons = Object.fromEntries(
    (Object.keys(SIGNATURE_THEMES) as SignatureThemeId[]).map((id) => [
      id,
      buildThemeFaviconDataUrl(id),
    ])
  );

  return `(function(){try{var k=${JSON.stringify(STORAGE_KEY)},t=${JSON.stringify(accents)},f=${JSON.stringify(favicons)},d=${JSON.stringify(DEFAULT_SIGNATURE_THEME)},id=localStorage.getItem(k);if(!id||!t[id])id=d;var th=t[id],r=document.documentElement;r.dataset.signature=id;r.style.setProperty("--brand-accent",th.accent);r.style.setProperty("--brand-accent-rgb",th.accentRgb);r.style.setProperty("--brand-soft",th.soft);r.style.setProperty("--brand-mist",th.mist);r.style.setProperty("--brand-border",th.border);var h=f[id],links=document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]');if(links.length){links.forEach(function(l,i){if(i===0){l.type="image/svg+xml";l.sizes="any";l.href=h;l.dataset.themeFavicon="true"}else{l.remove()}})}else{var l=document.createElement("link");l.rel="icon";l.type="image/svg+xml";l.sizes="any";l.href=h;l.dataset.themeFavicon="true";document.head.appendChild(l)}var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=th.accent;else{m=document.createElement("meta");m.name="theme-color";m.content=th.accent;document.head.appendChild(m)}}catch(e){}})();`;
}
