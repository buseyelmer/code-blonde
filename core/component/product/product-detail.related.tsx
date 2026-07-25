"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import ItemListingProduct from "@/core/theme/item/item.listing.product";
import { buildProductListHref } from "@/core/util/product-listing";
import type { ProductListingUrlState } from "@/core/util/product-listing";

const MAX_RELATED_PRODUCTS = 8;

export function ProductDetailRelated({
  products,
  isLoading,
  listState,
}: {
  products?: Product[];
  isLoading?: boolean;
  listState?: ProductListingUrlState;
}) {
  const displayed = (products ?? []).slice(0, MAX_RELATED_PRODUCTS);
  const productListHref = buildProductListHref(listState ?? {});

  if (!isLoading && displayed.length === 0) return null;

  return (
    <section className="border-t border-[#D9C5B0]/50 pt-16 lg:pt-20">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.38em] uppercase text-[#A17E65]">Keşfetmeye Devam</p>
          <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#5C4638] sm:text-3xl">
            Önerilen Ürünler
          </h2>
        </div>
        <Link
          href={productListHref}
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#5C4638] transition hover:text-[#A17E65]"
        >
          Tümünü Gör
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-sm border border-[#D9C5B0]/30 bg-[#FDFAF6]">
              <div className="aspect-[4/5] animate-pulse bg-[#F0E8DE]/80" />
              <div className="space-y-2 p-5">
                <div className="h-4 w-3/4 animate-pulse bg-[#EDE0D1]/80" />
                <div className="h-3 w-1/2 animate-pulse bg-[#EDE0D1]/60" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-8">
          {displayed.map((item, index) => (
            <ItemListingProduct key={item.id} product={item} index={index} listState={listState} />
          ))}
        </div>
      )}
    </section>
  );
}
