import type { Product } from "@raxonltd/raxon-core/interface/product.interface";

export function mergeRelatedProducts(
  relatedQueries: { data?: Product[] }[],
  excludeIds: string[] = [],
  limit = 8,
): Product[] {
  const seen = new Set(excludeIds);
  const merged: Product[] = [];

  for (const query of relatedQueries) {
    for (const product of query.data ?? []) {
      if (seen.has(product.id)) continue;
      seen.add(product.id);
      merged.push(product);
      if (merged.length >= limit) return merged;
    }
  }

  return merged;
}
