import type { ProductCategoryOption } from "@/lib/api/group-products";

const CATEGORY_IMAGES: Record<string, string> = {
  "sac-bakim": "/images/categories/sac-bakim.svg",
  "sac-sekillendirme": "/images/categories/sac-sekillendirme.svg",
  epilasyon: "/images/categories/epilasyon.svg",
  "vucut-peeling": "/images/categories/vucut-peeling.svg",
  parfumeri: "/images/categories/parfumeri.svg",
  "manikur-pedikur": "/images/categories/manikur-pedikur.svg",
};

export function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function resolveCategoryImage(categoryName: string): string {
  const normalized = normalizeSearchText(categoryName);

  const rules: { keywords: string[]; image: string }[] = [
    { keywords: ["sac", "serum", "sampuan"], image: CATEGORY_IMAGES["sac-bakim"] },
    { keywords: ["sekillendir", "kopuk"], image: CATEGORY_IMAGES["sac-sekillendirme"] },
    { keywords: ["epilasyon", "agda", "kartus"], image: CATEGORY_IMAGES.epilasyon },
    { keywords: ["peel"], image: CATEGORY_IMAGES["vucut-peeling"] },
    { keywords: ["parfum", "edp"], image: CATEGORY_IMAGES.parfumeri },
    { keywords: ["manikur", "pedikur", "oje"], image: CATEGORY_IMAGES["manikur-pedikur"] },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.image;
    }
  }

  return CATEGORY_IMAGES["vucut-peeling"];
}

export function toCategoryHref(categoryId: string): string {
  return `/products?category=${encodeURIComponent(categoryId)}`;
}

export function limitCategories(
  categories: ProductCategoryOption[] | undefined,
  max = 8,
): ProductCategoryOption[] {
  return (categories ?? []).slice(0, max);
}
