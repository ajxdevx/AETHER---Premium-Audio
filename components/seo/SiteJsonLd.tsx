import { withBrandIconVersion } from "@/constants/assets";
import { SITE, getSiteUrl } from "@/constants/seo";

export function SiteJsonLd() {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return null;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE.name,
        url: siteUrl,
        logo: `${siteUrl}${withBrandIconVersion("/icon.svg")}`,
        image: `${siteUrl}/og.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE.name,
        description: SITE.description,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: SITE.locale.replace("_", "-"),
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
