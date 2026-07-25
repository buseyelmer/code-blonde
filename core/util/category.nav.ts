import capitalize from "lodash/capitalize";
import type { Category, Dictionary } from "@raxonltd/raxon-core/interface/prisma.interface";
import "@/core/util/util";

export function categoryNavLabel(cat: Category): string {
  if (Array.isArray(cat.name) && cat.name.length > 0) {
    return cat.name[0]?.value || "";
  }
  const raw = (cat.name as unknown as { getName?: () => string })?.getName?.() ?? "";
  return raw ? capitalize(raw) : "";
}

export function categoryNavSlug(cat: Category): string {
  if (Array.isArray(cat.name) && cat.name.length > 0) {
    const slug = (cat.name as Dictionary[]).getSlug();
    if (slug && slug !== "----") return slug;
  }
  const nameWithMethods = cat.name as unknown as { getSlug?: () => string };
  const slug = nameWithMethods?.getSlug?.();
  if (slug && slug !== "----") return slug;
  return cat.id;
}

export function categoryNavHref(
  cat: Category,
  extra?: Record<string, string | undefined | null>,
): string {
  const params = new URLSearchParams();
  params.set("category", categoryNavSlug(cat));
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value != null && value !== "") params.set(key, value);
    }
  }
  return `/urunler?${params.toString()}`;
}

export function findCategoryByNavParam(
  param: string | null | undefined,
  flatCategory: Category[],
): Category | undefined {
  if (!param) return undefined;
  const byId = flatCategory.find((c) => c.id === param);
  if (byId) return byId;
  return flatCategory.find((c) => categoryNavSlug(c) === param);
}

export function categoryNavParamMatches(cat: Category, param: string | null): boolean {
  if (!param) return false;
  return cat.id === param || categoryNavSlug(cat) === param;
}
