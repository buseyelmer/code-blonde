import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import { buildStorageImageUrl } from "@/core/util/basket.enrichment";

export const PRODUCT_LISTING_PLACEHOLDER =
  "https://placehold.co/480x600/F5EDE4/8B6B57?text=Code+Blonde&font=playfair-display";

type ProductWithMedia = Product & {
  media?: { relativePath?: string | null; path?: string | null; url?: string | null }[];
  mediaRelateds?: { media?: { relativePath?: string | null; path?: string | null; url?: string | null } | null }[];
  thumbnail?: string | null;
  image?: string | null;
};

type VariantWithImages = {
  images?: Array<string | { relativePath?: string | null; path?: string | null; url?: string | null } | null>;
};

function normalizeImagePath(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();

  if (value && typeof value === "object") {
    const obj = value as { relativePath?: string | null; path?: string | null; url?: string | null };
    return obj.relativePath?.trim() || obj.path?.trim() || obj.url?.trim() || null;
  }

  return null;
}

function collectImagePaths(product: Product, variantId?: string | null): string[] {
  const paths: string[] = [];
  const seen = new Set<string>();

  const push = (value: unknown) => {
    const path = normalizeImagePath(value);
    if (!path || seen.has(path)) return;
    seen.add(path);
    paths.push(path);
  };

  if (variantId) {
    for (const image of product.images ?? []) {
      if (image.variantIds?.includes(variantId)) {
        push(image.relativePath ?? image);
      }
    }
  }

  for (const image of product.images ?? []) {
    push(image);
  }

  const extended = product as ProductWithMedia;
  push(extended.thumbnail);
  push(extended.image);

  for (const media of extended.media ?? []) {
    push(media);
  }

  for (const related of extended.mediaRelateds ?? []) {
    push(related.media);
  }

  for (const variant of product.variant ?? []) {
    for (const image of (variant as VariantWithImages).images ?? []) {
      push(image);
    }
  }

  return paths;
}

export function getProductImageRelativePath(product: Product, variantId?: string | null): string | null {
  return collectImagePaths(product, variantId)[0] ?? null;
}

export function productHasListingImage(product: Product): boolean {
  return getProductListingImageUrl(product, 0) !== PRODUCT_LISTING_PLACEHOLDER;
}

export function getProductListingImageUrl(
  product: Product,
  index = 0,
  variantId?: string | null,
): string {
  const paths = collectImagePaths(product, variantId);
  const relativePath = paths[index] ?? paths[0];
  if (!relativePath) return PRODUCT_LISTING_PLACEHOLDER;

  if (/^https?:\/\//i.test(relativePath)) return relativePath;

  return buildStorageImageUrl(relativePath) ?? PRODUCT_LISTING_PLACEHOLDER;
}

export function filterProductsWithListingImages<T extends Product>(products: T[]): T[] {
  return products.filter(productHasListingImage);
}

export function takeProductsWithListingImages<T extends Product>(products: T[], count: number): T[] {
  return filterProductsWithListingImages(products).slice(0, count);
}
