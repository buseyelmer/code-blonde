import type { ProductDetail } from "@raxonltd/raxon-core/interface/product.interface";
import type { Property } from "@raxonltd/raxon-core/interface/prisma.interface";

export interface ProductReviewSummary {
  count: number;
  rating: number;
}

export interface ProductVariantAttributeGroup {
  name: string;
  values: string[];
}

function hasText(value: string | null | undefined): boolean {
  if (value == null) return false;
  const stripped = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length > 0;
}

export function getProductDescriptionHtml(product: ProductDetail): string | null {
  const candidates = [product.richContent, product.description, product.shortDescription];
  for (const candidate of candidates) {
    if (hasText(candidate)) return candidate!.trim();
  }
  return null;
}

export function getDisplayableProperties(product: ProductDetail): Property[] {
  return (product.property ?? []).filter((item) => {
    if (item.isRichContent) return false;
    return hasText(item.name) && hasText(item.description);
  });
}

export function getProductAttributes(product: ProductDetail): { name: string; value: string }[] {
  const fromApi =
    (product as ProductDetail & { attributes?: { name: string; value: string }[] }).attributes ?? [];
  return fromApi.filter((row) => hasText(row.name) && hasText(row.value));
}

export function getVariantAttributeGroups(product: ProductDetail): ProductVariantAttributeGroup[] {
  const groups = new Map<string, Set<string>>();

  for (const variant of product.variant ?? []) {
    for (const opt of [variant.attributeOption1, variant.attributeOption2]) {
      const label = opt?.label?.trim();
      if (!label) continue;
      const groupName = opt.attributeId ? "Varyant" : "Seçenek";
      const bucket = groups.get(groupName) ?? new Set<string>();
      bucket.add(label);
      groups.set(groupName, bucket);
    }
  }

  return [...groups.entries()].map(([name, values]) => ({
    name,
    values: [...values],
  }));
}

export function resolveProductReviewSummary(
  product: ProductDetail | undefined,
  options?: {
    fallbackReviews?: Array<{ rating?: number | null }>;
    fallbackCount?: number;
  },
): ProductReviewSummary | null {
  const count = product?.review?.count ?? 0;
  const rating = product?.review?.rating ?? 0;
  if (count > 0 && rating > 0) {
    return { count, rating };
  }

  const fallback = options?.fallbackReviews?.filter((r) => typeof r.rating === "number" && r.rating > 0) ?? [];
  if (fallback.length === 0) return null;

  const fallbackCount = options?.fallbackCount ?? fallback.length;
  const fallbackRating =
    fallback.reduce((sum, review) => sum + (review.rating ?? 0), 0) / fallback.length;

  return {
    count: fallbackCount,
    rating: Math.round(fallbackRating * 10) / 10,
  };
}
