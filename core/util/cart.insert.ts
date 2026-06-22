import type { Product } from "@raxonltd/raxon-core/interface/product.interface";

function unitHasPrice(price?: Product["price"]) {
  if (!price) return false;
  return (price.mainPrice ?? 0) > 0 || (price.payPrice ?? 0) > 0 || (price.basketPrice ?? 0) > 0;
}

export function getDefaultProductUnitId(product: Product): string | null {
  const units = product.productUnit ?? [];
  const withPrice = units.find((unit) => unitHasPrice(unit.price));
  if (withPrice) return withPrice.id;
  return units[0]?.id ?? null;
}

export function getDefaultVariantId(product: Product): string | null {
  const variants = product.variant ?? [];
  if (variants.length === 0) return null;

  const hasVariantPrice = (variant: (typeof variants)[number]) => unitHasPrice(variant.price);

  const inStockWithPrice = variants.find((v) => v.stock > 0 && hasVariantPrice(v));
  if (inStockWithPrice) return inStockWithPrice.id;

  const withPrice = variants.find(hasVariantPrice);
  if (withPrice) return withPrice.id;

  const inStock = variants.find((v) => v.stock > 0);
  return inStock?.id ?? variants[0]?.id ?? null;
}

export async function fetchProductDetailForCart(productId: string): Promise<Product | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (!apiUrl || !apiKey) return null;

  try {
    const response = await fetch(
      `${apiUrl}/customer/product/${productId}?status=PUBLISHED`,
      { headers: { "x-api-key": apiKey } },
    );
    if (!response.ok) return null;
    const json = await response.json();
    return (json?.data ?? json) as Product;
  } catch {
    return null;
  }
}

export function resolveCartInsertIdsSync(product: Product, options?: { allowProductOnly?: boolean }) {
  const variantId = getDefaultVariantId(product);
  const productUnitId = variantId ? null : getDefaultProductUnitId(product);

  return {
    variantId,
    productUnitId,
    productOnly: options?.allowProductOnly && !variantId && !productUnitId,
  };
}

export async function resolveCartInsertIds(product: Product, options?: { allowProductOnly?: boolean }) {
  const sync = resolveCartInsertIdsSync(product, options);
  if (sync.variantId || sync.productUnitId || sync.productOnly) {
    return sync;
  }

  const detail = await fetchProductDetailForCart(product.id);
  if (!detail) return sync;

  const variantId = getDefaultVariantId(detail);
  const productUnitId = variantId ? null : getDefaultProductUnitId(detail);

  return {
    variantId,
    productUnitId,
    productOnly: options?.allowProductOnly && !variantId && !productUnitId,
  };
}
