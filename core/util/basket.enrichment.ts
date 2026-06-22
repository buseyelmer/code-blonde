import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import type { BasketItemSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";
import { getProductImageRelativePath } from "@/core/util/product.image";
import { getProductPriceInfo } from "@/core/util/product.price";

function normalizeImagePath(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim().replace(/^\//, "");
  }

  if (value && typeof value === "object") {
    const obj = value as { relativePath?: string | null; path?: string | null; url?: string | null };
    const path = obj.relativePath?.trim() || obj.path?.trim() || obj.url?.trim();
    return path ? path.replace(/^\//, "") : null;
  }

  return null;
}

export function buildStorageImageUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath?.trim()) return null;

  const trimmed = relativePath.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const base = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
  if (!base) return null;

  return `${base.replace(/\/$/, "")}/${trimmed.replace(/^\//, "")}`;
}

export function getBasketItemImagePath(
  item: BasketItemSummaryInterface,
  product?: Product | null,
): string | null {
  const variantId = item.variantId ?? item.variant?.id ?? null;

  const fromItem = normalizeImagePath(item.images?.[0]);
  if (fromItem) return fromItem;

  const fromVariant = normalizeImagePath(item.variant?.images?.[0]);
  if (fromVariant) return fromVariant;

  if (product) {
    const fromProduct = getProductImageRelativePath(product, variantId);
    if (fromProduct) return fromProduct.replace(/^\//, "");
  }

  return null;
}

export function getBasketItemImageUrl(
  item: BasketItemSummaryInterface,
  product?: Product | null,
): string | null {
  return buildStorageImageUrl(getBasketItemImagePath(item, product));
}

export function getBasketItemUnitPrice(
  item: BasketItemSummaryInterface,
  product?: Product | null,
): number {
  const fromApi = item.discountPrice > 0 && item.discountPrice < item.basePrice
    ? item.discountPrice
    : item.basePrice;
  if (fromApi > 0) return fromApi;

  if (!product) return 0;
  const { bestPrice } = getProductPriceInfo(product, item.variantId ?? item.variant?.id);
  return bestPrice;
}

export function getBasketItemLinePay(
  item: BasketItemSummaryInterface,
  product?: Product | null,
): number | null {
  if (item.linePay > 0) return item.linePay;

  const unit = getBasketItemUnitPrice(item, product);
  if (unit > 0) return unit * Math.max(1, item.quantity ?? 1);

  return null;
}

export function buildProductMap(products: Product[] | undefined) {
  return new Map((products ?? []).map((product) => [product.id, product]));
}
