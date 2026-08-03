/** Bump when replacing favicons/brand icons so browsers skip stale caches. */
export const BRAND_ICON_VERSION = "20260801";

/** Append a cache-bust query to a brand icon path. */
export function withBrandIconVersion(path: string): string {
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}v=${BRAND_ICON_VERSION}`;
}

/** Central registry for static public assets. Paths have no cache-bust query strings. */
export const ASSETS = {
  brand: {
    og: "/brand/og.png",
    icons: {
      favicon: "/favicon.ico",
      svg: "/icon.svg",
      apple: "/apple-icon.png",
      icon192: "/brand/icons/icon-192.png",
      icon512: "/brand/icons/icon-512.png",
    },
  },
  avatars: {
    listeners: [
      "/avatars/listener-1.jpg",
      "/avatars/listener-2.jpg",
      "/avatars/listener-3.jpg",
      "/avatars/listener-4.jpg",
    ],
    profile: "/avatars/profile.jpg",
  },
  products: {
    max: {
      primary: {
        green: "/products/max/primary/green.png",
        black: "/products/max/primary/black.png",
        pink: "/products/max/primary/pink.png",
        blue: "/products/max/primary/blue.png",
      },
      views: {
        "02": {
          green: "/products/max/view-02/green.png",
          black: "/products/max/view-02/black.png",
          pink: "/products/max/view-02/pink.png",
          blue: "/products/max/view-02/blue.png",
        },
        "03": {
          green: "/products/max/view-03/green.png",
          black: "/products/max/view-03/black.png",
          pink: "/products/max/view-03/pink.png",
          blue: "/products/max/view-03/blue.png",
        },
        "04": {
          green: "/products/max/view-04/green.png",
          black: "/products/max/view-04/black.png",
          pink: "/products/max/view-04/pink.png",
          blue: "/products/max/view-04/blue.png",
        },
        "05": {
          green: "/products/max/view-05/green.png",
          black: "/products/max/view-05/black.png",
          pink: "/products/max/view-05/pink.png",
          blue: "/products/max/view-05/blue.png",
        },
      },
    },
  },
  marketing: {
    hero: {
      stand: "/marketing/hero/stand.png",
      pods: {
        green: "/marketing/hero/pods-green.png",
        black: "/marketing/hero/pods-black.png",
        blue: "/marketing/hero/pods-blue.png",
        pink: "/marketing/hero/pods-pink.png",
      },
    },
    kit: {
      cases: {
        green: "/marketing/kit/cases-green.png",
        black: "/marketing/kit/cases-black.png",
        pink: "/marketing/kit/cases-pink.png",
        blue: "/marketing/kit/cases-blue.png",
      },
      cables: {
        green: "/marketing/kit/cables-green.png",
        black: "/marketing/kit/cables-black.png",
        pink: "/marketing/kit/cables-pink.png",
        blue: "/marketing/kit/cables-blue.png",
      },
      stands: {
        green: "/marketing/kit/stands-green.png",
        black: "/marketing/kit/stands-black.png",
        pink: "/marketing/kit/stands-pink.png",
        blue: "/marketing/kit/stands-blue.png",
      },
      accessories: {
        green: "/marketing/kit/accessories-green.png",
        black: "/marketing/kit/accessories-black.png",
        pink: "/marketing/kit/accessories-pink.png",
        blue: "/marketing/kit/accessories-blue.png",
      },
    },
    spotlights: {
      wear: {
        green: "/marketing/spotlights/wear-green.png",
        blue: "/marketing/spotlights/wear-blue.png",
        pink: "/marketing/spotlights/wear-pink.png",
        black: "/marketing/spotlights/wear-black.png",
      },
      wearVideo: {
        green: "/marketing/spotlights/wear-green.mp4",
        blue: "/marketing/spotlights/wear-blue.mp4",
        pink: "/marketing/spotlights/wear-pink.mp4",
        black: "/marketing/spotlights/wear-black.mp4",
      },
      ctaBanner: "/marketing/spotlights/cta-banner.png",
      newsletter: {
        green: "/marketing/spotlights/newsletter-green.png",
        pink: "/marketing/spotlights/newsletter-pink.png",
        blue: "/marketing/spotlights/newsletter-blue.png",
        black: "/marketing/spotlights/newsletter-black.png",
      },
    },
  },
  payments: {
    visa: "/payments/visa.png",
    mastercard: "/payments/mastercard.png",
    applePay: "/payments/apple-pay.png",
    googlePay: "/payments/google-pay.png",
    paypal: "/payments/paypal.png",
  },
} as const;

export type MaxColorId = keyof typeof ASSETS.products.max.primary;
