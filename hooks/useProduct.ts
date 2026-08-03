"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct } from "@/services/products";
import { CATALOG_PRODUCTS_QUERY_KEY } from "@/hooks/useCatalogProducts";
import type { Product } from "@/types/product";

export function useProduct(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: id > 0,
    staleTime: 1000 * 60 * 30,
    initialData: () => {
      const catalog = queryClient.getQueryData<Product[]>(CATALOG_PRODUCTS_QUERY_KEY);
      return catalog?.find((product) => product.id === id);
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(CATALOG_PRODUCTS_QUERY_KEY)?.dataUpdatedAt,
  });
}
