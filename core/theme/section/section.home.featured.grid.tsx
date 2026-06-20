"use client";

import Link from "next/link";
import type { Product } from "@/lib/data";
import { ItemProductCard } from "@/theme/item/item.product.card";

const FEATURED_PRODUCT_COUNT = 8;

type SectionHomeFeaturedGridProps = {
  products?: Product[];
};

export function SectionHomeFeaturedGrid({
  products = [],
}: SectionHomeFeaturedGridProps) {
  const displayProducts = products.slice(0, FEATURED_PRODUCT_COUNT);

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
          className="text-sm font-medium text-charcoal underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Tümünü Gör
        </Link>
      </div>

      {displayProducts.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          Henüz öne çıkan ürün bulunmuyor.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {displayProducts.map((product) => (
            <ItemProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
