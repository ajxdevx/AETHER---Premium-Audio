import { getCatalogEntry, getMaxColorImage } from "@/lib/products";
import { LOCALE } from "@/constants/locale";
import { SITE, getSiteUrl } from "@/constants/seo";
import { absoluteUrl } from "@/lib/seo";

type ProductJsonLdProps = {
  productId: number;
};

export function ProductJsonLd({ productId }: ProductJsonLdProps) {
  const siteUrl = getSiteUrl();
  const product = getCatalogEntry(productId);
  if (!product || !siteUrl) return null;

  const image = absoluteUrl(getMaxColorImage("black"));
  const offerUrl = absoluteUrl(`/product/${productId}`);

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(image ? { image: [image] } : {}),
    sku: `AETHER-${product.slug.toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: SITE.name,
    },
    offers: {
      "@type": "Offer",
      ...(offerUrl ? { url: offerUrl } : {}),
      priceCurrency: LOCALE.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE.name,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
