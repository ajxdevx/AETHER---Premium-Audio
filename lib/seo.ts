import type { Metadata } from "next";
import { ASSETS, withBrandIconVersion } from "@/constants/assets";
import { SITE, getSiteUrl, DEFAULT_OG_IMAGE } from "@/constants/seo";

type PageMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = ""): string {
  const siteUrl = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized === "/" ? "" : normalized}`;
}

export function createPageMetadata({
  title,
  description = SITE.description,
  path = "",
  image,
  imageAlt = DEFAULT_OG_IMAGE.alt,
  noIndex = false,
}: PageMetadataInput = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE.name}` : SITE.title;
  const canonical = absoluteUrl(path);
  const ogImage = {
    url: image ?? DEFAULT_OG_IMAGE.url,
    width: DEFAULT_OG_IMAGE.width,
    height: DEFAULT_OG_IMAGE.height,
    alt: imageAlt,
  };

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      title: pageTitle,
      description,
      url: canonical,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage.url],
    },
  };
}

export function createRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(getSiteUrl()),
    ...createPageMetadata(),
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: siteUrl }],
    creator: SITE.name,
    publisher: SITE.name,
    category: "shopping",
    keywords: [
      "AETHER",
      "AETHER Pro Pods",
      "premium over-ear headphones",
      "Matcha Green headphones",
      "noise cancelling headphones",
      "wireless headphones Morocco",
      "Space Dark",
      "Blush Pink",
      "Sky Blue",
      "high fidelity audio",
    ],
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        {
          url: withBrandIconVersion(ASSETS.brand.icons.favicon),
          type: "image/x-icon",
        },
        {
          url: withBrandIconVersion(ASSETS.brand.icons.svg),
          type: "image/svg+xml",
        },
      ],
      apple: [
        {
          url: withBrandIconVersion(ASSETS.brand.icons.apple),
          type: "image/png",
          sizes: "180x180",
        },
      ],
      shortcut: [
        {
          url: withBrandIconVersion(ASSETS.brand.icons.favicon),
          type: "image/x-icon",
        },
      ],
    },
    manifest: "/manifest.webmanifest",
  };
}
