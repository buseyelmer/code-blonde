import type { Product } from "@/core/interface/product.interface";

export type ProductCategoryOption = {
  id: string;
  name: string;
  count: number;
};

export type ProductGroup = {
  categoryId: string;
  categoryName: string;
  products: Product[];
};

const FALLBACK_CATEGORY_ID = "genel";
const FALLBACK_CATEGORY_NAME = "Genel";

function slugifyCategoryName(name: string): string {
  return name
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidCategoryName(name?: string): name is string {
  if (!name?.trim()) return false;
  const normalized = name.trim();
  return normalized !== "----" && normalized !== "-" && normalized !== "—";
}

export function getProductCategoryMeta(product: Product): {
  categoryId: string;
  categoryName: string;
} {
  const apiCategory = product.categories?.[0];
  const apiName = apiCategory?.name;
  const apiId = apiCategory?.id;

  if (isValidCategoryName(apiName)) {
    return {
      categoryId: apiId?.trim() || slugifyCategoryName(apiName) || FALLBACK_CATEGORY_ID,
      categoryName: apiName.trim(),
    };
  }

  if (product.categoryId) {
    return {
      categoryId: String(product.categoryId),
      categoryName:
        typeof product.category === "string" && product.category.trim()
          ? product.category.trim()
          : FALLBACK_CATEGORY_NAME,
    };
  }

  if (typeof product.category === "string" && isValidCategoryName(product.category)) {
    return {
      categoryId: slugifyCategoryName(product.category),
      categoryName: product.category.trim(),
    };
  }

  return {
    categoryId: FALLBACK_CATEGORY_ID,
    categoryName: FALLBACK_CATEGORY_NAME,
  };
}

export function groupProductsByCategory(products: Product[]): {
  groups: ProductGroup[];
  productCategories: ProductCategoryOption[];
} {
  const groupMap = new Map<string, ProductGroup>();

  for (const product of products) {
    const { categoryId, categoryName } = getProductCategoryMeta(product);
    const existing = groupMap.get(categoryId);

    if (existing) {
      existing.products.push(product);
      continue;
    }

    groupMap.set(categoryId, {
      categoryId,
      categoryName,
      products: [product],
    });
  }

  const groups = Array.from(groupMap.values()).sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName, "tr"),
  );

  const productCategories = groups.map((group) => ({
    id: group.categoryId,
    name: group.categoryName,
    count: group.products.length,
  }));

  return { groups, productCategories };
}
