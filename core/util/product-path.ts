import type { Product } from "@raxonltd/raxon-core/interface/product.interface";

type ProductPathInput = Pick<Product, "id" | "slug"> & {
  outsideLegacyId?: string | null;
};

export function getProductSlug(product: ProductPathInput): string {
  const slug = product.slug?.trim();
  const legacyId = product.outsideLegacyId?.trim();

  if (slug && legacyId) {
    return `${slug}-${legacyId}`;
  }

  if (slug && slug !== "----") {
    return slug;
  }

  return product.id;
}

export function getProductPath(product: ProductPathInput, prefix = "/urunler"): string {
  const slug = getProductSlug(product);
  const normalizedPrefix = prefix.replace(/\/$/, "");
  return `${normalizedPrefix}/${slug}`;
}
