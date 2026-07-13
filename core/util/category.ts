import type { Category } from "@raxonltd/raxon-core/interface/prisma.interface";

export function getCategoryName(category: Category): string {
  if (Array.isArray(category.name)) return category.name.getName();
  if (typeof category.name === "string") return category.name;
  return category.code ?? "Kategori";
}

export function slugifyCategoryText(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function getCategorySlugBase(category: Category): string {
  const code = category.code?.trim();
  if (code) {
    const fromCode = slugifyCategoryText(code);
    if (fromCode) return fromCode;
  }

  const fromName = slugifyCategoryText(getCategoryName(category));
  if (fromName) return fromName;

  return category.id;
}

/** SEO uyumlu kategori slug’ı; çakışmada kısa id ekler */
export function getCategorySlug(category: Category, allCategories: Category[] = []): string {
  const base = getCategorySlugBase(category);
  if (!allCategories.length) return base;

  const collisions = allCategories.filter((item) => getCategorySlugBase(item) === base);
  if (collisions.length <= 1) return base;

  return `${base}-${category.id.slice(0, 8)}`;
}

export function getCategoryHref(category: Category, allCategories: Category[] = []): string {
  return `/urunler/kategori/${getCategorySlug(category, allCategories)}`;
}

export function findCategoryBySlug(
  categories: Category[],
  slug: string,
): Category | undefined {
  const normalized = decodeURIComponent(slug).trim().toLowerCase();
  if (!normalized) return undefined;

  return (
    categories.find((category) => getCategorySlug(category, categories) === normalized) ??
    categories.find((category) => category.id.toLowerCase() === normalized)
  );
}

export function flattenCategories<T extends { children?: T[] }>(categories: T[]): T[] {
  const result: T[] = [];

  const walk = (items: T[]) => {
    for (const item of items) {
      result.push(item);
      if (item.children?.length) walk(item.children);
    }
  };

  walk(categories);
  return result;
}
