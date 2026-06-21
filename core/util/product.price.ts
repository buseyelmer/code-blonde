import type { Price, Product } from "@raxonltd/raxon-core/interface/product.interface";

function pickDisplayPrice(price?: Price | null) {
  if (!price) return { base: 0, best: 0, hasDiscount: false };

  const mainPrice = price.mainPrice ?? 0;
  const discountPrice = price.discountPrice ?? 0;
  const payPrice = price.payPrice ?? 0;
  const basketPrice = price.basketPrice ?? 0;

  const base = mainPrice > 0 ? mainPrice : payPrice > 0 ? payPrice : basketPrice;
  const hasDiscount = mainPrice > 0 && discountPrice > 0 && discountPrice < mainPrice;
  const best = hasDiscount ? discountPrice : base;

  return { base, best, hasDiscount };
}

export function getProductPriceInfo(product: Product, variantId?: string | null) {
  const variant = variantId
    ? product.variant?.find((v) => v.id === variantId)
    : product.variant?.find((v) => v.stock > 0) ?? product.variant?.[0];

  const variantPrice = pickDisplayPrice(variant?.price);
  const productPrice = pickDisplayPrice(product.price);

  let price = variantPrice.base > 0 ? variantPrice.base : productPrice.base;
  let bestPrice = variantPrice.best > 0 ? variantPrice.best : productPrice.best;
  let hasDiscount = variantPrice.base > 0 ? variantPrice.hasDiscount : productPrice.hasDiscount;

  if (bestPrice === 0 && product.productUnit?.length) {
    for (const unit of product.productUnit) {
      const unitPrice = pickDisplayPrice(unit.price);
      if (unitPrice.best > 0) {
        price = unitPrice.base;
        bestPrice = unitPrice.best;
        hasDiscount = unitPrice.hasDiscount;
        break;
      }
    }
  }

  const detailProduct = product as Product & {
    matrix?: { price?: Price }[];
  };
  if (bestPrice === 0 && detailProduct.matrix?.length) {
    for (const row of detailProduct.matrix) {
      const matrixPrice = pickDisplayPrice(row.price);
      if (matrixPrice.best > 0) {
        price = matrixPrice.base;
        bestPrice = matrixPrice.best;
        hasDiscount = matrixPrice.hasDiscount;
        break;
      }
    }
  }

  return {
    price,
    bestPrice,
    hasDiscount,
    stock: variant?.stock ?? product.stock ?? product.currentStock ?? 0,
  };
}

/** Detay endpoint fiyat döndürmezse liste kaydından fiyat alır. */
export function mergeProductListPrice(product: Product, listProduct?: Product | null): Product {
  if (!listProduct || getProductPriceInfo(product).bestPrice > 0) return product;
  if (getProductPriceInfo(listProduct).bestPrice === 0) return product;
  return { ...product, price: listProduct.price };
}

export function sortProductsByPopularity(products: Product[]) {
  return [...products].sort((a, b) => {
    const ratingDiff = (b.review?.rating ?? 0) - (a.review?.rating ?? 0);
    if (ratingDiff !== 0) return ratingDiff;
    return (b.review?.count ?? 0) - (a.review?.count ?? 0);
  });
}

export function getProductSortPrice(product: Product): number {
  const { bestPrice, price } = getProductPriceInfo(product);
  return bestPrice > 0 ? bestPrice : price;
}

export function sortProductsByPrice(products: Product[], direction: "asc" | "desc") {
  return [...products].sort((a, b) => {
    const priceA = getProductSortPrice(a);
    const priceB = getProductSortPrice(b);
    const aMissing = priceA <= 0;
    const bMissing = priceB <= 0;
    if (aMissing && bMissing) return 0;
    if (aMissing) return 1;
    if (bMissing) return -1;
    const diff = priceA - priceB;
    return direction === "asc" ? diff : -diff;
  });
}

export function applyProductListSort(products: Product[], sort: "newest" | "price-asc" | "price-desc" | "rating") {
  switch (sort) {
    case "price-asc":
      return sortProductsByPrice(products, "asc");
    case "price-desc":
      return sortProductsByPrice(products, "desc");
    case "rating":
      return sortProductsByPopularity(products);
    default:
      return products;
  }
}
