import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ShopPageSkeleton } from "@/components/ui/LoadingSkeleton";
import { Container } from "@/components/ui/Container";
import { PageShell, PAGE_SHELL_PADDING } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo";

const ShopPageContent = dynamic(
  () =>
    import("@/components/shop/ShopPageContent").then((m) => ({
      default: m.ShopPageContent,
    })),
  {
    loading: () => (
      <PageShell className={PAGE_SHELL_PADDING}>
        <Container wide>
          <ShopPageSkeleton />
        </Container>
      </PageShell>
    ),
  }
);

const Newsletter = dynamic(() =>
  import("@/components/home/Newsletter").then((m) => ({
    default: m.Newsletter,
  }))
);

export const metadata: Metadata = createPageMetadata({
  title: "Shop Pro Pods",
  description:
    "Shop AETHER Pro Pods in Matcha Green, Space Dark, Blush Pink, and Sky Blue. Premium over-ear sound with free shipping across Morocco.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <>
      <Suspense
        fallback={
          <PageShell className={PAGE_SHELL_PADDING}>
            <Container wide>
              <ShopPageSkeleton />
            </Container>
          </PageShell>
        }
      >
        <ShopPageContent />
      </Suspense>
      <Newsletter />
    </>
  );
}
