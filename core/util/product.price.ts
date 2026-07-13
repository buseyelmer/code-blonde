import type { Price, Product } from "@raxonltd/raxon-core/interface/product.interface";
import { getProductUnits } from "@/core/util/cart.insert";

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

  if (bestPrice === 0) {
    for (const unit of getProductUnits(product)) {
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

/** Detay endpoint fiyat veya birim döndürmezse liste kaydından tamamlar. */
export function mergeProductListPrice(product: Product, listProduct?: Product | null): Product {
  if (!listProduct) return product;

  let merged = product;

  if (getProductPriceInfo(merged).bestPrice === 0 && getProductPriceInfo(listProduct).bestPrice > 0) {
    merged = { ...merged, price: listProduct.price };
  }
  if (!merged.productUnit?.length && listProduct.productUnit?.length) {
    merged = { ...merged, productUnit: listProduct.productUnit };
  }
  if (!merged.variant?.length && listProduct.variant?.length) {
    merged = { ...merged, variant: listProduct.variant };
  }

  return merged;
}

type ProductSalesFields = Product & {
  soldCount?: number;
  salesCount?: number;
  totalSold?: number;
  orderCount?: number;
};

function getProductSalesMetric(product: Product): number {
  const p = product as ProductSalesFields;
  if (typeof p.soldCount === "number") return p.soldCount;
  if (typeof p.salesCount === "number") return p.salesCount;
  if (typeof p.totalSold === "number") return p.totalSold;
  if (typeof p.orderCount === "number") return p.orderCount;
  return Number.NaN;
}

/** Stok hareketinden satış talebi skoru (negatif stok = yüksek talep) */
function getSellThroughScore(product: Product): number {
  const stock = product.currentStock ?? product.stock ?? 0;
  if (stock < 0) return 1_000_000 + Math.abs(stock);
  if (stock === 0) return 0;
  return 100_000 / (stock + 1);
}

/** En Beğenilen: yüksek puan öncelikli (client yedek) */
export function sortProductsByPopularity(products: Product[]) {
  return [...products].sort((a, b) => {
    const ratingDiff = (b.review?.rating ?? 0) - (a.review?.rating ?? 0);
    if (ratingDiff !== 0) return ratingDiff;
    return (b.review?.count ?? 0) - (a.review?.count ?? 0);
  });
}

/** En Popüler: değerlendirme hacmi + puan skoru (client yedek) */
export function sortProductsByPopular(products: Product[]) {
  return [...products].sort((a, b) => {
    const scoreA = (a.review?.rating ?? 0) * Math.log10((a.review?.count ?? 0) + 1);
    const scoreB = (b.review?.rating ?? 0) * Math.log10((b.review?.count ?? 0) + 1);
    if (scoreB !== scoreA) return scoreB - scoreA;
    const countDiff = (b.review?.count ?? 0) - (a.review?.count ?? 0);
    if (countDiff !== 0) return countDiff;
    return (b.review?.rating ?? 0) - (a.review?.rating ?? 0);
  });
}

/** En Çok Satan: satış metriği, yoksa stok/talep skoru */
export function sortProductsByBestsellers(products: Product[]) {
  return [...products].sort((a, b) => {
    const salesA = getProductSalesMetric(a);
    const salesB = getProductSalesMetric(b);
    const hasSalesA = Number.isFinite(salesA);
    const hasSalesB = Number.isFinite(salesB);

    if (hasSalesA || hasSalesB) {
      const diff = (hasSalesB ? salesB : -1) - (hasSalesA ? salesA : -1);
      if (diff !== 0) return diff;
    }

    const demandDiff = getSellThroughScore(b) - getSellThroughScore(a);
    if (demandDiff !== 0) return demandDiff;

    return (a.name || "").localeCompare(b.name || "", "tr");
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

export type ProductListSort =
  | "newest"
  | "popular"
  | "bestsellers"
  | "price-asc"
  | "price-desc"
  | "rating";

export function applyProductListSort(products: Product[], sort: ProductListSort) {
  switch (sort) {
    case "price-asc":
      return sortProductsByPrice(products, "asc");
    case "price-desc":
      return sortProductsByPrice(products, "desc");
    case "popular":
      return sortProductsByPopular(products);
    case "bestsellers":
      return sortProductsByBestsellers(products);
    case "rating":
      return sortProductsByPopularity(products);
    default:
      return products;
  }
}
