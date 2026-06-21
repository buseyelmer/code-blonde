"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRaxon } from "@raxonltd/raxon-core";
import { useProduct, PRODUCT_PAGE_SIZE } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import {
  ProductListingFiltersMobile,
  ProductListingFiltersSidebar,
  SortControl,
  PRICE_RANGES,
  type ListingFilters,
  type SortOption,
} from "@/core/component/product.listing.filters";
import ItemListingProduct, { ProductListingSkeleton } from "@/core/theme/item/item.listing.product";
import { applyProductListSort } from "@/core/util/product.price";
import "@/core/util/util";

const CLIENT_SORT_FETCH_AMOUNT = 200;

function needsClientSort(sort: SortOption) {
  return sort === "price-asc" || sort === "price-desc" || sort === "rating";
}

const DEFAULT_FILTERS: ListingFilters = {
  categoryId: null,
  subCategoryId: null,
  priceRange: "all",
  tag: null,
  sort: "newest",
  search: null,
};

function getSortOrder(sort: SortOption) {
  switch (sort) {
    case "price-asc":
      return { column: "price", direction: "asc" as const };
    case "price-desc":
      return { column: "price", direction: "desc" as const };
    case "rating":
      return { column: "createdAt", direction: "desc" as const };
    default:
      return { column: "createdAt", direction: "desc" as const };
  }
}

function getPriceBounds(priceRange: ListingFilters["priceRange"]) {
  const range = PRICE_RANGES.find((r) => r.value === priceRange);
  if (!range || range.value === "all") return {};
  return {
    minPrice: range.min,
    maxPrice: range.max,
  };
}

export default function UrunlerPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ListingFilters>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { category = [], flatCategory = [] } = useRaxon();

  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    setFilters((prev) => {
      const next = {
        ...prev,
        categoryId: categoryId ?? null,
        subCategoryId: categoryId && prev.categoryId !== categoryId ? null : prev.subCategoryId,
        search: search ?? null,
      };
      if (
        prev.categoryId === next.categoryId &&
        prev.subCategoryId === next.subCategoryId &&
        prev.search === next.search
      ) {
        return prev;
      }
      return next;
    });
  }, [searchParams]);

  const topCategories = useMemo(
    () => category.filter((c) => !c.parentId),
    [category],
  );

  const subCategories = useMemo(
    () => flatCategory.filter((c) => c.parentId),
    [flatCategory],
  );

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    flatCategory.forEach((c) => c.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).slice(0, 12);
  }, [flatCategory]);

  const priceBounds = getPriceBounds(filters.priceRange);
  const sortOrder = getSortOrder(filters.sort);
  const useClientSort = needsClientSort(filters.sort);

  useEffect(() => {
    setPage(1);
  }, [filters.categoryId, filters.subCategoryId, filters.priceRange, filters.tag, filters.sort, filters.search]);

  const { data: productData, isLoading, isFetching, isError } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    categoryId: filters.categoryId ?? undefined,
    subCategoryId: filters.subCategoryId ?? undefined,
    tags: filters.tag ? [filters.tag] : undefined,
    search: filters.search ?? undefined,
    ...priceBounds,
    order: useClientSort ? { column: "createdAt", direction: "desc" as const } : sortOrder,
    page: useClientSort ? 1 : page,
    amount: useClientSort ? CLIENT_SORT_FETCH_AMOUNT : PRODUCT_PAGE_SIZE,
  });

  const sortedProducts = useMemo(() => {
    const list = productData?.data ?? [];
    return applyProductListSort(list, filters.sort);
  }, [productData?.data, filters.sort]);

  const products = useMemo(() => {
    if (!useClientSort) return sortedProducts;
    const start = (page - 1) * PRODUCT_PAGE_SIZE;
    return sortedProducts.slice(start, start + PRODUCT_PAGE_SIZE);
  }, [sortedProducts, page, useClientSort]);

  const totalCount = useClientSort ? sortedProducts.length : (productData?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalCount / PRODUCT_PAGE_SIZE));
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const showSkeleton = isLoading && products.length === 0;

  const activeFilterCount = [
    filters.categoryId,
    filters.subCategoryId,
    filters.tag,
    filters.search,
    filters.priceRange !== "all" ? filters.priceRange : null,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8F1E9]">
      {/* Header */}
      <header className="border-b border-[#D9C5B0]/40">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <nav className="mb-3 flex items-center gap-2 text-xs text-[#8B6B57]">
            <Link href="/" className="transition hover:text-[#5C4638]">
              Ana Sayfa
            </Link>
            <span className="text-[#D9C5B0]">/</span>
            <span className="text-[#5C4638]">Ürünler</span>
          </nav>

          <div className="flex items-end justify-between gap-4">
            <h1 className="font-serif text-2xl tracking-tight text-[#5C4638] sm:text-3xl lg:text-4xl">
              Tüm Ürünler
            </h1>

            {!showSkeleton && totalCount > 0 && (
              <p className="shrink-0 font-mono text-[11px] tabular-nums tracking-wider text-[#8B6B57]/60">
                {totalCount.toLocaleString("tr-TR")} parça
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6 lg:py-10">
          <ProductListingFiltersMobile
            filters={filters}
            onChange={setFilters}
            categories={topCategories}
            subCategories={subCategories}
            availableTags={availableTags}
            activeFilterCount={activeFilterCount}
            mobileOpen={mobileFiltersOpen}
            onMobileOpenChange={setMobileFiltersOpen}
          />

          <div className="lg:flex lg:items-start lg:gap-12 xl:gap-16">
            <ProductListingFiltersSidebar
              filters={filters}
              onChange={setFilters}
              categories={topCategories}
              subCategories={subCategories}
              availableTags={availableTags}
            />

            <div className="min-w-0 flex-1">
              <div className="mb-6 hidden border-b border-[#D9C5B0]/30 pb-4 lg:block">
                <SortControl value={filters.sort} onChange={(sort) => setFilters({ ...filters, sort })} />
              </div>

              {isError && !showSkeleton && (
                <div className="mb-8 border border-[#D9C5B0]/50 bg-[#FDFAF6] px-5 py-4 text-sm text-[#8B6B57]">
                  Ürünler yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.
                </div>
              )}

              {showSkeleton ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
                  <ProductListingSkeleton count={8} />
                </div>
              ) : products.length === 0 ? (
                <div className="py-28 text-center">
                  <p className="mb-2 font-serif text-2xl text-[#5C4638]">Sonuç bulunamadı</p>
                  <p className="mb-10 text-sm text-[#8B6B57]">Filtreleri değiştirerek tekrar deneyin.</p>
                  <button
                    type="button"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="mr-4 border border-[#D9C5B0] px-6 py-2.5 text-[10px] tracking-[0.24em] uppercase text-[#5C4638] transition hover:border-[#5C4638]"
                  >
                    Filtreleri Temizle
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-[#5C4638] transition hover:text-[#A17E65]"
                  >
                    Ana sayfaya dön <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
                    {products.map((product: Product, index: number) => (
                      <ItemListingProduct key={product.id} product={product} index={index} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={!hasPrevPage || isFetching}
                        className="text-[10px] tracking-[0.28em] uppercase text-[#8B6B57] transition hover:text-[#5C4638] disabled:pointer-events-none disabled:opacity-30"
                      >
                        ← Önceki
                      </button>
                      <span className="font-mono text-[11px] tabular-nums text-[#8B6B57]/60">
                        {page} / {totalPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={!hasNextPage || isFetching}
                        className="text-[10px] tracking-[0.28em] uppercase text-[#8B6B57] transition hover:text-[#5C4638] disabled:pointer-events-none disabled:opacity-30"
                      >
                        Sonraki →
                      </button>
                    </div>
                  )}

                  {isFetching && products.length > 0 && (
                    <div className="mt-10 flex justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
