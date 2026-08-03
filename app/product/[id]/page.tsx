import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { ProductPageSkeleton } from "@/components/ui/LoadingSkeleton";
import { PageShell, PAGE_SHELL_PADDING } from "@/components/layout/PageShell";
import { getMaxColorProduct, resolveProductColorId } from "@/lib/products";

const ProductPageContent = dynamic(
  () =>
    import("@/components/product/ProductPageContent").then((m) => ({
      default: m.ProductPageContent,
    }))
);

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color?: string | string[] }>;
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const resolvedSearch = await searchParams;
  const colorParam = Array.isArray(resolvedSearch.color)
    ? resolvedSearch.color[0]
    : resolvedSearch.color;
  const pastel = getMaxColorProduct(resolveProductColorId(colorParam)).pastel;

  return (
    <Suspense
      fallback={
        <PageShell className={PAGE_SHELL_PADDING}>
          <Container wide>
            <ProductPageSkeleton pastel={pastel} />
          </Container>
        </PageShell>
      }
    >
      <ProductPageContent params={params} />
    </Suspense>
  );
}
