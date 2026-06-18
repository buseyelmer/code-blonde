"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/context/CartContext";
import { mapApiProductsToCards } from "@/lib/api/mappers";
import { useSandboxProducts } from "@/hooks/useHomeData";
import {
  formatPrice,
  PLACEHOLDER_IMAGE,
  resolveProductImageUrl,
} from "@/lib/product-utils";
import { MinusIcon, PlusIcon } from "@/components/icons";

type ProductDetailProps = {
  productId: string;
};

type ProductWithMedia = ReturnType<typeof mapApiProductsToCards>[number] & {
  media?: { path?: string } | null;
};

export function ProductDetail({ productId }: ProductDetailProps) {
  const { data, isLoading, isError } = useSandboxProducts();
  const { addItem, incrementItem, decrementItem, getQuantity } = useCart();
  const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMAGE);

  const product = useMemo(() => {
    const products = mapApiProductsToCards(data?.products);
    return products.find((item) => item.id === productId);
  }, [data?.products, productId]);

  useEffect(() => {
    if (!product) return;
    setImageUrl(resolveProductImageUrl(product as ProductWithMedia));
  }, [product]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-[480px] animate-pulse rounded-3xl bg-powder/60" />
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

  const quantity = getQuantity(product.id);
  const safeImageSrc = imageUrl?.trim() || PLACEHOLDER_IMAGE;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-powder/40">
          <Image
            src={safeImageSrc}
            alt={product.name}
            fill
            className="object-contain p-8"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            onError={() => setImageUrl(PLACEHOLDER_IMAGE)}
          />
        </div>

        <div>
          {product.category && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              {product.category}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-charcoal">
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

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {quantity === 0 ? (
              <button
                type="button"
                onClick={() => addItem(product)}
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-brand-purple"
              >
                <PlusIcon className="h-4 w-4" />
                Sepete Ekle
              </button>
            ) : (
              <div className="inline-flex items-center gap-3 rounded-full bg-brand-purple px-4 py-2 text-white">
                <button
                  type="button"
                  onClick={() => decrementItem(product.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                  aria-label="Adedi azalt"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-lg font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => incrementItem(product.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                  aria-label="Adedi artır"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            <Link
              href="/sepet"
              className="rounded-full border border-charcoal px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
            >
              Sepete Git
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
