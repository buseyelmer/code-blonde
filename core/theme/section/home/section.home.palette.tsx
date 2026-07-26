"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import ItemListingProduct, { ProductListingSkeleton } from "@/core/theme/item/item.listing.product";
import { filterProductsWithListingImages } from "@/core/util/product.image";
import {
  sortProductsByBestsellers,
  sortProductsByPopularity,
} from "@/core/util/product.price";
import "@/core/util/util";

const FEATURED_COUNT = 4;
const FETCH_AMOUNT = 100;
/** Yeni gelen / popüler bloklarıyla çakışmayı azaltmak için atlanan ürün sayısı */
const SKIP_HEAD_COUNT = 12;

function getCreatedAtTime(product: Product) {
  const value = product.createdAt ?? product.updatedAt;
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

function getPrimaryCategoryKey(product: Product) {
  const category = product.categories?.[0];
  return category?.id || category?.slug || category?.name || product.id;
}

function getEditorScore(product: Product) {
  const rating = product.review?.rating ?? 0;
  const count = product.review?.count ?? 0;
  const tagBoost =
    product.tags?.some((tag) => /premium|bestseller|editör|editor|favori/i.test(tag))
      ? 5
      : 0;
  return rating * Math.log10(count + 1) + tagBoost;
}

function pickEditorSelection(items: Product[], count: number): Product[] {
  const withImages = filterProductsWithListingImages(items);
  if (withImages.length === 0) return [];

  const newestIds = new Set(
    [...withImages]
      .sort((a, b) => getCreatedAtTime(b) - getCreatedAtTime(a))
      .slice(0, SKIP_HEAD_COUNT)
      .map((product) => product.id),
  );
  const bestsellerIds = new Set(
    sortProductsByBestsellers(withImages)
      .slice(0, SKIP_HEAD_COUNT)
      .map((product) => product.id),
  );

  const preferFresh = withImages.filter(
    (product) => !newestIds.has(product.id) && !bestsellerIds.has(product.id),
  );
  const pool = (preferFresh.length >= count ? preferFresh : withImages)
    .slice()
    .sort((a, b) => {
      const scoreDiff = getEditorScore(b) - getEditorScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return (a.name || "").localeCompare(b.name || "", "tr");
    });

  const selected: Product[] = [];
  const usedCategories = new Set<string>();
  const usedIds = new Set<string>();

  // Önce farklı kategorilerden birer ürün
  for (const product of pool) {
    const categoryKey = getPrimaryCategoryKey(product);
    if (usedCategories.has(categoryKey)) continue;
    selected.push(product);
    usedCategories.add(categoryKey);
    usedIds.add(product.id);
    if (selected.length >= count) return selected;
  }

  // Kategori yetmezse puan / isim sırasıyla tamamla
  const rankedFallback = sortProductsByPopularity(pool);
  for (const product of rankedFallback) {
    if (usedIds.has(product.id)) continue;
    selected.push(product);
    usedIds.add(product.id);
    if (selected.length >= count) break;
  }

  return selected;
}

export default function SectionHomePalette() {
  const { data, isLoading } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    page: 1,
    amount: FETCH_AMOUNT,
    order: { column: "createdAt", direction: "desc" },
  });

  const products = useMemo(
    () => pickEditorSelection(data?.data ?? [], FEATURED_COUNT),
    [data?.data],
  );

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
