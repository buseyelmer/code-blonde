import type { Product as ApiProduct } from "@/core/interface/product.interface";
import type { Category } from "@/core/interface/prisma.interface";
import {
  mapApiCategoriesToNav,
  mapApiProductsToCards,
} from "@/lib/api/mappers";
import { bestSellerProducts, shopCategories } from "@/lib/data";
import type { Product } from "@/lib/data";
import type { ShopCategory } from "@/lib/data";

export function resolveBestSellerProducts(apiProducts?: ApiProduct[]): Product[] {
  const mapped = mapApiProductsToCards(apiProducts);
  return mapped.length > 0 ? mapped.slice(0, 16) : bestSellerProducts;
}

export function resolveNavCategories(
  apiCategories?: Category[],
): ShopCategory[] {
  const mapped = mapApiCategoriesToNav(apiCategories);
  return mapped ?? shopCategories;
}
