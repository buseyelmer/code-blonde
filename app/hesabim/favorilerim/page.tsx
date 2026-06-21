"use client";

import { useProduct, PRODUCT_PAGE_SIZE } from "@raxonltd/raxon-core/hook";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import ItemListingProduct, { ProductListingSkeleton } from "@/core/theme/item/item.listing.product";

const FAVORITES_PAGE_SIZE = Math.max(PRODUCT_PAGE_SIZE, 48);

export default function FavorilerimPage() {
  const productApi = useProduct();

  const { data: favoritesData, isLoading } = productApi.fetch({
    isFavorite: true,
    page: 1,
    amount: FAVORITES_PAGE_SIZE,
    status: Status.PUBLISHED,
    materialType: "product",
    enabled: true,
  });

  const favoritesList: Product[] = favoritesData?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
        <ProductListingSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.32em] uppercase text-[#A17E65]">Hesabım</p>
        <h1 className="mt-2 font-serif text-2xl tracking-tight text-[#5C4638] sm:text-3xl">Favorilerim</h1>
        <p className="mt-2 text-sm text-[#8B6B57]">
          Beğendiğiniz ürünleri görüntüleyin ve sepete ekleyin.
        </p>
      </div>

      {favoritesList.length === 0 ? (
        <div className="rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] px-6 py-16 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-[#D9C5B0]" strokeWidth={1.25} />
          <h2 className="font-serif text-xl text-[#5C4638]">Favori ürününüz yok</h2>
          <p className="mt-2 text-sm text-[#8B6B57]">Beğendiğiniz ürünleri kalp ikonuyla favorilere ekleyin.</p>
          <Link
            href="/urunler"
            className="mt-8 inline-flex items-center gap-2 border border-[#5C4638] px-6 py-3 text-[10px] tracking-[0.24em] uppercase text-[#5C4638] transition hover:bg-[#5C4638] hover:text-[#F8F1E9]"
          >
            Ürünleri Keşfet
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      ) : (
        <>
          <p className="font-mono text-[11px] tabular-nums tracking-wider text-[#8B6B57]/70">
            {favoritesList.length.toLocaleString("tr-TR")} ürün
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
            {favoritesList.map((product, index) => (
              <ItemListingProduct key={product.id} product={{ ...product, isFavorite: true }} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
