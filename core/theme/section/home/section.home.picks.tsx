"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import ItemListingProduct, { ProductListingSkeleton } from "@/core/theme/item/item.listing.product";
import { takeProductsWithListingImages } from "@/core/util/product.image";
import "@/core/util/util";

const PICK_COUNT = 8;
const FETCH_AMOUNT = 48;

const TABS = [
  { id: "new", label: "Yeni Gelenler" },
  { id: "popular", label: "En Popüler" },
  { id: "deals", label: "Fırsat Ürünleri" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function getTabFetchParams(tab: TabId) {
  switch (tab) {
    case "popular":
      return {
        order: { column: "createdAt" as const, direction: "desc" as const },
        page: 1,
        amount: FETCH_AMOUNT,
      };
    case "deals":
      return {
        isDiscountBasket: true,
        page: 1,
        amount: FETCH_AMOUNT,
      };
    default:
      return {
        order: { column: "createdAt" as const, direction: "desc" as const },
        page: 1,
        amount: FETCH_AMOUNT,
      };
  }
}

export default function SectionHomePicks() {
  const [activeTab, setActiveTab] = useState<TabId>("new");
  const fetchParams = useMemo(() => getTabFetchParams(activeTab), [activeTab]);

  const { data, isLoading, isFetching } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    ...fetchParams,
  });

  const products = useMemo(() => {
    return takeProductsWithListingImages(data?.data ?? [], PICK_COUNT);
  }, [data?.data]);
  const showSkeleton = isLoading && products.length === 0;

  return (
    <section id="one-cikanlar" className="bg-[#F8F1E9] py-16 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-10">
          <p className="text-[10px] tracking-[0.38em] uppercase text-[#A17E65]">Öne Çıkanlar</p>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-[#5C4638] sm:text-4xl lg:text-[2.75rem]">
            Sizin İçin Seçtiklerimiz
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#8B6B57]">
            En yeni trendler, vazgeçilmez favoriler ve kaçırılmayacak fırsatlar
          </p>
        </div>

        <div className="mb-10 flex justify-center sm:mb-10">
          <div
            className="inline-flex max-w-full flex-wrap justify-center gap-1 border border-[#D9C5B0]/50 bg-[#FDFAF6]/80 p-1"
            role="tablist"
            aria-label="Ürün kategorileri"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-[10px] tracking-[0.24em] uppercase transition-all duration-300 sm:px-6 sm:py-2.5 ${
                  activeTab === tab.id
                    ? "bg-[#5C4638] text-[#F8F1E9]"
                    : "text-[#8B6B57] hover:text-[#5C4638]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {showSkeleton ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            <ProductListingSkeleton count={PICK_COUNT} />
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-serif text-xl text-[#5C4638]">Bu kategoride henüz ürün yok</p>
            <p className="mt-2 text-sm text-[#8B6B57]">Yakında yeni parçalar eklenecek.</p>
          </div>
        ) : (
          <div
            key={activeTab}
            className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 transition-opacity duration-300 ${
              isFetching ? "opacity-70" : "opacity-100"
            }`}
          >
            {products.map((product, index) => (
              <ItemListingProduct key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/urunler"
            className="group inline-flex items-center gap-3 border border-[#5C4638]/30 px-6 py-3 text-[10px] tracking-[0.28em] uppercase text-[#5C4638] transition-colors hover:border-[#5C4638] hover:bg-[#5C4638] hover:text-[#F8F1E9] sm:px-8 sm:py-3.5"
          >
            Tüm Koleksiyonu Gör
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
