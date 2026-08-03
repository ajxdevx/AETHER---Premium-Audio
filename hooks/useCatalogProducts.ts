"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCatalogIds } from "@/lib/products";
import { getCatalogProducts } from "@/services/products";
import type { Product } from "@/types/product";

export const CATALOG_PRODUCTS_QUERY_KEY = ["catalog-products"] as const;

export function useCatalogProducts(ids?: number[]) {
  const catalogIds = ids ?? getAllCatalogIds();

  const { data: allProducts = [], isLoading, isError, refetch } = useQuery({
    queryKey: CATALOG_PRODUCTS_QUERY_KEY,
    queryFn: getCatalogProducts,
    staleTime: 1000 * 60 * 30,
  });

  const products = useMemo(() => {
    const byId = new Map(allProducts.map((product) => [product.id, product]));
    return catalogIds
      .map((id) => byId.get(id))
      .filter((product): product is Product => !!product);
  }, [allProducts, catalogIds]);

  return { products, isLoading, isError, refetch };
}
