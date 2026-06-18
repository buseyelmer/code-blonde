"use client";

import Link from "next/link";
import type { Product as ApiProduct } from "@/core/interface/product.interface";
import { useSandboxProducts } from "@/hooks/useHomeData";
import { mapApiProductsToCards } from "@/lib/api/mappers";
import { ProductCard } from "./ProductCard";

const FEATURED_PRODUCT_COUNT = 8;

type ProductGridProps = {
  /** /api/sandbox üzerinden gelen ürünler; verilmezse bileşen kendi fetch'ini yapar */
  products?: ApiProduct[];
};

function ProductGridSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6">
      {Array.from({ length: FEATURED_PRODUCT_COUNT }).map((_, index) => (
        <div
          key={index}
          className="h-[280px] animate-pulse rounded-lg border border-stone/50 bg-powder/60 sm:h-[300px]"
        />
      ))}
    </div>
  );
}

export function ProductGrid({ products: productsProp }: ProductGridProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useSandboxProducts(!productsProp?.length);

  const apiProducts = productsProp ?? data?.products;
  const displayProducts = mapApiProductsToCards(apiProducts).slice(
    0,
    FEATURED_PRODUCT_COUNT,
  );

  const showLoading = !productsProp && isLoading;
  const showError = !productsProp && isError;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Koleksiyon
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
            Öne Çıkanlar
          </h2>
        </div>
        <Link
          href="/products"
          className="text-sm font-medium text-charcoal underline-offset-4 transition-colors hover:text-brand-brown hover:underline"
        >
          Tümünü Gör
        </Link>
      </div>

      {showLoading && <ProductGridSkeleton />}

      {showError && (
        <div className="mt-8 rounded-xl border border-stone/70 bg-white p-6 text-center">
          <p className="text-sm text-muted">
            {error?.message ?? "Ürünler yüklenirken bir hata oluştu."}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-full border border-charcoal px-5 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {!showLoading && !showError && displayProducts.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          Henüz öne çıkan ürün bulunmuyor.
        </p>
      )}

      {!showLoading && !showError && displayProducts.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
