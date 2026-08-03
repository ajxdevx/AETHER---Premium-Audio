"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(
  () =>
    import("@/components/layout/CartDrawer").then((module) => ({
      default: module.CartDrawer,
    })),
  { ssr: false }
);

export function LazyCartDrawer() {
  return <CartDrawer />;
}
