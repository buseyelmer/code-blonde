"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { mapApiProductsToCards } from "@/lib/api/mappers";
import { useSandboxProducts } from "@/hooks/useHomeData";
import { formatPrice, PLACEHOLDER_IMAGE, resolveProductImageUrl } from "@/lib/product-utils";
import { ProductImageZoom } from "@/components/product/ProductImageZoom";
import { ProductTabs } from "@/components/product/ProductTabs";

type ProductDetailProps = {
  productId: string;
};

type ProductWithMedia = ReturnType<typeof mapApiProductsToCards>[number] & {
  media?: { path?: string } | null;
};

export function ProductDetail({ productId }: ProductDetailProps) {
  const { data, isLoading, isError } = useSandboxProducts();
  const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMAGE);

  const products = useMemo(
    () => mapApiProductsToCards(data?.products),
    [data?.products],
  );

  const product = useMemo(
    () => products.find((item) => item.id === productId),
    [products, productId],
  );

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (item) =>
          item.id !== product.id && item.categoryId === product.categoryId,
      )
      .slice(0, 4);
  }, [product, products]);

  useEffect(() => {
    if (!product) return;
    setImageUrl(resolveProductImageUrl(product as ProductWithMedia));
  }, [product]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-powder/60" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-powder/60" />
            <div className="h-12 w-1/3 animate-pulse rounded bg-powder/60" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-charcoal">Ürün bulunamadı</h1>
        <p className="mt-3 text-sm text-muted">
          Aradığınız ürün mevcut değil veya kaldırılmış olabilir.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full border border-charcoal px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12 lg:px-8">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-charcoal">
          Ana Sayfa
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
        <ProductImageZoom src={imageUrl} alt={product.name} />

        <div className="lg:sticky lg:top-24">
          {product.category && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {product.category}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-6 flex items-end gap-3">
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-lg text-muted line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
            <p className="text-3xl font-bold text-charcoal">
              {formatPrice(Number(product.price))}
            </p>
          </div>

          <p className="mt-4 text-sm leading-7 text-muted">
            {product.description ||
              "Code Blonde ile günlük bakım rutininize doğal bir dokunuş katın."}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantitySelector product={product} variant="detail" />

            <Link
              href="/cart"
              className="rounded-full border border-charcoal px-6 py-3.5 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
            >
              Sepete Git
            </Link>
          </div>
        </div>
      </div>

      <ProductTabs product={product} similarProducts={similarProducts} />
    </div>
  );
}
