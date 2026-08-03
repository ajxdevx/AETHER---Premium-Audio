import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/constants/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    ...(siteUrl
      ? {
          sitemap: `${siteUrl}/sitemap.xml`,
          host: siteUrl,
        }
      : {}),
  };
}
