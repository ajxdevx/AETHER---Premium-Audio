import { applyCatalogToProduct, getAllCatalogIds } from "@/lib/products";
import type { Product, ProductsResponse } from "@/types/product";

const BASE_URL = "https://dummyjson.com";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return res.json() as Promise<T>;
}

function mergeCatalogProducts(products: Product[]): Product[] {
  return products.map(applyCatalogToProduct);
}

export async function getProducts(limit = 100): Promise<Product[]> {
  const response = await fetchJson<ProductsResponse>(`${BASE_URL}/products?limit=${limit}`);
  return mergeCatalogProducts(response.products);
}

export async function getCatalogProducts(): Promise<Product[]> {
  const catalogIds = new Set(getAllCatalogIds());
  const products = await getProducts(100);
  return products.filter((product) => catalogIds.has(product.id));
}

export async function getProduct(id: number): Promise<Product> {
  const catalogIds = new Set(getAllCatalogIds());
  if (!catalogIds.has(id)) {
    throw new Error(`Product not in catalog: ${id}`);
  }
  const apiProduct = await fetchJson<Product>(`${BASE_URL}/products/${id}`);
  return applyCatalogToProduct(apiProduct);
}
