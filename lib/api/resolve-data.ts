import type { Product as ApiProduct } from "@/core/interface/product.interface";
import type { Category } from "@/core/interface/prisma.interface";
import type { ProductCategoryOption } from "@/lib/api/group-products";
import {
  mapApiCategoriesToNav,
  mapApiProductsToCards,
} from "@/lib/api/mappers";
import { bestSellerProducts } from "@/lib/data";
import type { Product } from "@/lib/data";

export function resolveBestSellerProducts(apiProducts?: ApiProduct[]): Product[] {
  const mapped = mapApiProductsToCards(apiProducts);
  return mapped.length > 0 ? mapped.slice(0, 16) : bestSellerProducts;
}

export function resolveNavCategories(
  apiCategories?: Category[],
  productCategories?: ProductCategoryOption[],
) {
  return mapApiCategoriesToNav(apiCategories, productCategories) ?? [];
}
