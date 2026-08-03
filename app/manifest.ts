import type { MetadataRoute } from "next";
import { ASSETS, withBrandIconVersion } from "@/constants/assets";
import { SITE } from "@/constants/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.title,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F7FBF4",
    theme_color: "#6B9B45",
    lang: SITE.locale.replace("_", "-"),
    icons: [
      {
        src: withBrandIconVersion(ASSETS.brand.icons.svg),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: withBrandIconVersion(ASSETS.brand.icons.icon192),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBrandIconVersion(ASSETS.brand.icons.icon512),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBrandIconVersion(ASSETS.brand.icons.icon512),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: withBrandIconVersion(ASSETS.brand.icons.apple),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
