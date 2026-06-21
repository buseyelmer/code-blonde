import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import type { BasketItemSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";
import { getProductPriceInfo } from "@/core/util/product.price";

export function getBasketItemImagePath(
  item: BasketItemSummaryInterface,
  product?: Product | null,
): string | null {
  const fromItem = item.images?.[0];
  if (fromItem) return fromItem.replace(/^\//, "");

  const fromVariant = item.variant?.images?.[0];
  if (fromVariant) return fromVariant.replace(/^\//, "");

  const fromProduct = product?.images?.[0]?.relativePath;
  if (fromProduct) return fromProduct.replace(/^\//, "");

  return null;
}

export function buildStorageImageUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null;
  const base = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/${relativePath.replace(/^\//, "")}`;
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
