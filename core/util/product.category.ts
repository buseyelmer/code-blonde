import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import type { Category } from "@raxonltd/raxon-core/interface/prisma.interface";
import "@/core/util/util";

type ProductCategoryRef = {
  id?: string;
  name?: unknown;
  parentId?: string | null;
};

function resolveLocalizedName(name: unknown): string {
  if (Array.isArray(name)) return name.getName();
  if (typeof name === "string") return name.trim();
  return "";
}

function getSiteCategoryLabel(category: Category): string {
  if (Array.isArray(category.name)) return category.name.getName();
  if (typeof category.name === "string") return category.name;
  return category.code?.trim() ?? "";
}

function getPrimaryProductCategory(
  categories: Product["categories"] | ProductCategoryRef | ProductCategoryRef[] | null | undefined,
): ProductCategoryRef | undefined {
  if (!categories) return undefined;
  if (Array.isArray(categories)) return categories[0];
  if (typeof categories === "object") return categories as ProductCategoryRef;
  return undefined;
}

/**
 * Resolve a storefront-friendly category label for product cards.
 * Prefers the top-level site taxonomy (parent), then exact id, then API name.
 */
export function getProductCategoryName(
  product: Pick<Product, "categories">,
  siteCategories: Category[] = [],
): string {
  const entry = getPrimaryProductCategory(product.categories);
  if (!entry) return "";

  if (siteCategories.length > 0) {
    if (entry.parentId) {
      const parent = siteCategories.find((category) => category.id === entry.parentId);
      if (parent) {
        const label = getSiteCategoryLabel(parent);
        if (label) return label;
      }
    }

    if (entry.id) {
      const exact = siteCategories.find((category) => category.id === entry.id);
      if (exact) {
        const label = getSiteCategoryLabel(exact);
        if (label) return label;
      }
    }
  }

  return resolveLocalizedName(entry.name);
}
