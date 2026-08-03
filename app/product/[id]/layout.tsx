import type { Metadata } from "next";
import { getCatalogEntry, getMaxColorImage } from "@/lib/products";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { createPageMetadata } from "@/lib/seo";

type ProductLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: Pick<ProductLayoutProps, "params">): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);
  const product = getCatalogEntry(productId);

  if (!product) {
    return createPageMetadata({
      title: "Pro Pods",
      description:
        "Discover AETHER Pro Pods — premium over-ear headphones in four signature finishes.",
      path: `/product/${id}`,
    });
  }

  return createPageMetadata({
    title: product.name,
    description: `${product.description} Available in Matcha Green, Space Dark, Blush Pink, and Sky Blue.`,
    path: `/product/${productId}`,
    image: getMaxColorImage("green"),
    imageAlt: `${product.name} — ${product.type}`,
  });
}

export default async function ProductLayout({
  children,
  params,
}: ProductLayoutProps) {
  const { id } = await params;
  const productId = Number(id);

  return (
    <>
      <ProductJsonLd productId={productId} />
      {children}
    </>
  );
}
