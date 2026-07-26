"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import ItemListingProduct, { ProductListingSkeleton } from "@/core/theme/item/item.listing.product";
import {
  filterProductsWithListingImages,
} from "@/core/util/product.image";
import {
  getProductPriceInfo,
  sortProductsByBestsellers,
  sortProductsByPopular,
} from "@/core/util/product.price";
import "@/core/util/util";

const PICK_COUNT = 8;
const FETCH_AMOUNT = 100;

const TABS = [
  { id: "new", label: "Yeni Gelenler" },
  { id: "popular", label: "En Popüler" },
  { id: "deals", label: "Fırsat Ürünleri" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function getCreatedAtTime(product: Product) {
  const value = product.createdAt ?? product.updatedAt;
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

function sortByNewest(products: Product[]) {
  return [...products].sort((a, b) => getCreatedAtTime(b) - getCreatedAtTime(a));
}

function hasReviewSignal(products: Product[]) {
  return products.some((product) => (product.review?.count ?? 0) > 0);
}

function sortForPopular(products: Product[]) {
  if (hasReviewSignal(products)) {
    return sortProductsByPopular(products);
  }
  return sortProductsByBestsellers(products);
}

function collectProductPrices(product: Product) {
  const prices = [
    product.price,
    ...(product.variant?.map((variant) => variant.price) ?? []),
    ...(product.productUnit?.map((unit) => unit.price) ?? []),
  ];
  return prices.filter(Boolean);
}

/** İndirim veya sepet fiyatı avantajı olan ürünler */
function isDealProduct(product: Product) {
  if (getProductPriceInfo(product).hasDiscount) return true;

  return collectProductPrices(product).some((price) => {
    const main = price?.mainPrice ?? 0;
    const discount = price?.discountPrice ?? 0;
    const basket = price?.basketPrice ?? 0;
    return (
      (main > 0 && discount > 0 && discount < main) ||
      (main > 0 && basket > 0 && basket < main)
    );
  });
}

function getDealPercent(product: Product) {
  const info = getProductPriceInfo(product);
  if (info.hasDiscount && info.price > 0) {
    return ((info.price - info.bestPrice) / info.price) * 100;
  }

  let best = 0;
  for (const price of collectProductPrices(product)) {
    const main = price?.mainPrice ?? 0;
    if (main <= 0) continue;
    const discount = price?.discountPrice ?? 0;
    const basket = price?.basketPrice ?? 0;
    const dealPrice =
      discount > 0 && discount < main
        ? discount
        : basket > 0 && basket < main
          ? basket
          : 0;
    if (dealPrice > 0) {
      best = Math.max(best, ((main - dealPrice) / main) * 100);
    }
  }
  return best;
}

function takeUnique(products: Product[], count: number, excludeIds?: Set<string>) {
  const selected: Product[] = [];
  for (const product of products) {
    if (excludeIds?.has(product.id)) continue;
    selected.push(product);
    if (selected.length >= count) break;
  }
  return selected;
}

function mergeUniqueProducts(...lists: Product[][]) {
  const seen = new Set<string>();
  const merged: Product[] = [];
  for (const list of lists) {
    for (const product of list) {
      if (seen.has(product.id)) continue;
      seen.add(product.id);
      merged.push(product);
    }
  }
  return merged;
}

function buildTabProducts(items: Product[], dealItems: Product[]) {
  const withImages = filterProductsWithListingImages(items);
  const newest = sortByNewest(withImages);
  const newArrivals = newest.slice(0, PICK_COUNT);
  const newestIds = new Set(newArrivals.map((product) => product.id));

  const popularRanked = sortForPopular(withImages);
  // Yeni gelenlerle birebir aynı olmasın diye önce onları hariç tut
  let popular = takeUnique(popularRanked, PICK_COUNT, newestIds);
  if (popular.length < PICK_COUNT) {
    popular = [
      ...popular,
      ...takeUnique(popularRanked, PICK_COUNT - popular.length, new Set(popular.map((p) => p.id))),
    ];
  }

  const popularIds = new Set(popular.map((product) => product.id));
  const excludeFromDeals = new Set([...newestIds, ...popularIds]);

  const dealPool = filterProductsWithListingImages(
    mergeUniqueProducts(dealItems, withImages.filter(isDealProduct)),
  ).sort((a, b) => getDealPercent(b) - getDealPercent(a));

  let deals = takeUnique(dealPool, PICK_COUNT, excludeFromDeals);
  if (deals.length < PICK_COUNT) {
    deals = [
      ...deals,
      ...takeUnique(dealPool, PICK_COUNT - deals.length, new Set(deals.map((p) => p.id))),
    ];
  }

  // Hiç fırsat yoksa: diğer sekmelerle çakışmayan uygun fiyatlı ürünler
  if (deals.length === 0) {
    const pricedFallback = [...withImages]
      .filter((product) => getProductPriceInfo(product).bestPrice > 0)
      .sort(
        (a, b) =>
          getProductPriceInfo(a).bestPrice - getProductPriceInfo(b).bestPrice,
      );
    deals = takeUnique(pricedFallback, PICK_COUNT, excludeFromDeals);
    if (deals.length < PICK_COUNT) {
      deals = [
        ...deals,
        ...takeUnique(
          pricedFallback,
          PICK_COUNT - deals.length,
          new Set(deals.map((p) => p.id)),
        ),
      ];
    }
  }

  return {
    new: newArrivals,
    popular,
    deals,
  } satisfies Record<TabId, Product[]>;
}

export default function SectionHomePicks() {
  const [activeTab, setActiveTab] = useState<TabId>("new");

  const { data, isLoading, isFetching } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    order: { column: "createdAt", direction: "desc" },
    page: 1,
    amount: FETCH_AMOUNT,
  });

  const { data: dealData, isLoading: isDealLoading, isFetching: isDealFetching } =
    useProduct().fetch({
      materialType: "product",
      status: Status.PUBLISHED,
      isDiscountBasket: true,
      page: 1,
      amount: FETCH_AMOUNT,
    });

  const tabProducts = useMemo(
    () => buildTabProducts(data?.data ?? [], dealData?.data ?? []),
    [data?.data, dealData?.data],
  );
  const products = tabProducts[activeTab];
  const showSkeleton =
    (isLoading || (activeTab === "deals" && isDealLoading)) && products.length === 0;
  const tabFetching = isFetching || (activeTab === "deals" && isDealFetching);

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
              tabFetching ? "opacity-70" : "opacity-100"
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
