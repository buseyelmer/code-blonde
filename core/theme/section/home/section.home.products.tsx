"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRaxon } from "@raxonltd/raxon-core";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import type { Category } from "@raxonltd/raxon-core/interface/prisma.interface";
import ItemListingProduct, { ProductListingSkeleton } from "@/core/theme/item/item.listing.product";
import { sortProductsByPopularity } from "@/core/util/product.price";
import { takeProductsWithListingImages } from "@/core/util/product.image";
import "@/core/util/util";

const PRODUCT_COUNT = 12;
const FETCH_AMOUNT = 80;

function getCategoryName(category: Category) {
  if (Array.isArray(category.name)) return category.name.getName();
  if (typeof category.name === "string") return category.name;
  return category.code ?? "Kategori";
}

export default function SectionHomeProducts() {
  const { category = [] } = useRaxon();
  const topCategories = useMemo(() => category.filter((c) => !c.parentId), [category]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    categoryId: activeCategoryId ?? undefined,
    order: { column: "createdAt", direction: "desc" },
    page: 1,
    amount: FETCH_AMOUNT,
  });

  const products = useMemo(() => {
    const sorted = sortProductsByPopularity(data?.data ?? []);
    return takeProductsWithListingImages(sorted, PRODUCT_COUNT);
  }, [data?.data]);
  const showSkeleton = isLoading && products.length === 0;

  return (
    <section id="urunler" className="bg-[#F5EDE4]/30 py-16 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:mb-10 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] tracking-[0.38em] uppercase text-[#A17E65]">Ürünler</p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#5C4638] sm:text-4xl lg:text-5xl">
              En Sevilenler
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[#8B6B57]">
            Teninizle bütünleşen, doğal görünümlü formüller
          </p>
        </div>

        {topCategories.length > 0 && (
          <div className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="flex w-max min-w-0 gap-2 pb-1 sm:flex-wrap sm:w-full">
              <button
                type="button"
                onClick={() => setActiveCategoryId(null)}
                className={`shrink-0 border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-200 sm:px-5 sm:py-2.5 ${
                  activeCategoryId === null
                    ? "border-[#5C4638] bg-[#5C4638] text-[#F8F1E9]"
                    : "border-[#D9C5B0] bg-[#FDFAF6]/90 text-[#5C4638] hover:border-[#A17E65] hover:bg-[#F5EDE4]/80"
                }`}
              >
                Tümü
              </button>
              {topCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`shrink-0 border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-200 sm:px-5 sm:py-2.5 ${
                    activeCategoryId === cat.id
                      ? "border-[#5C4638] bg-[#5C4638] text-[#F8F1E9]"
                      : "border-[#D9C5B0] bg-[#FDFAF6]/90 text-[#5C4638] hover:border-[#A17E65] hover:bg-[#F5EDE4]/80"
                  }`}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>
          </div>
        )}

        {showSkeleton ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            <ProductListingSkeleton count={8} />
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-serif text-xl text-[#5C4638]">Bu kategoride ürün bulunamadı</p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 transition-opacity duration-300 ${
              isFetching ? "opacity-70" : "opacity-100"
            }`}
          >
            {products.map((product, index) => (
              <ItemListingProduct key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-end sm:mt-12">
          <Link
            href="/urunler"
            className="group inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#5C4638] transition-colors hover:text-[#A17E65]"
          >
            Tümünü Gör
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
