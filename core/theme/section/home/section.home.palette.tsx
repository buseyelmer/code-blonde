"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import ItemListingProduct, { ProductListingSkeleton } from "@/core/theme/item/item.listing.product";
import { takeProductsWithListingImages } from "@/core/util/product.image";
import "@/core/util/util";

const FEATURED_COUNT = 4;
const FETCH_AMOUNT = 64;

export default function SectionHomePalette() {
  const { data, isLoading } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    page: 1,
    amount: FETCH_AMOUNT,
    order: { column: "createdAt", direction: "desc" },
  });

  const products = useMemo(() => {
    return takeProductsWithListingImages(data?.data ?? [], FEATURED_COUNT);
  }, [data?.data]);

  const showSkeleton = isLoading && products.length === 0;

  return (
    <section id="rituel-favorileri" className="relative overflow-hidden border-t border-[#D9C5B0]/40 bg-[#F8F1E9] py-16 sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#D9C5B0]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#C9A99A]/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="text-center lg:col-span-4 lg:pb-2 lg:text-left">
            <p className="text-[10px] tracking-[0.38em] uppercase text-[#A17E65]">Editör Seçimi</p>
            <h2 className="mt-3 font-serif text-2xl leading-[1.1] tracking-tight text-[#5C4638] sm:mt-3 sm:text-3xl lg:text-4xl xl:text-5xl">
              Ritüel <span className="italic text-[#A17E65]">Favorileri</span>
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#8B6B57] sm:mt-4 sm:text-base lg:mx-0">
              Saç bakımından parfüme, peelingden vücut bakımına — günlük ritualiniz için özenle seçilmiş dört
              ürün.
            </p>
            <Link
              href="/urunler"
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#5C4638]/25 px-6 py-3 text-[10px] uppercase tracking-[0.24em] text-[#5C4638] transition-all hover:border-[#5C4638] hover:bg-[#5C4638] hover:text-[#F8F1E9] sm:mt-6 sm:w-auto lg:inline-flex"
            >
              Tüm Ürünleri Gör
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="lg:col-span-8">
            {showSkeleton ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-4 lg:grid-cols-4">
                <ProductListingSkeleton count={4} />
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/40 px-6 py-12 text-center">
                <p className="text-sm text-[#8B6B57]">Ürünler yakında burada listelenecek.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-4 lg:grid-cols-4">
                {products.map((product, index) => (
                  <ItemListingProduct key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
