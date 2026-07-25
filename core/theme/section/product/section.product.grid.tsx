"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ArrowRight, ArrowUpDown, ChevronDown, Filter, Loader2 } from "lucide-react";
import { useRaxon } from "@raxonltd/raxon-core";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { useQueryStates } from "nuqs";
import {
  productListingQueryParsers,
  parsePriceQueryParam,
  PRODUCT_SORT_OPTIONS,
  PRODUCT_DEFAULT_PAGE_SIZE,
  findProductSortOption,
  resolveProductSortFromQuery,
  resolveProductListOrder,
  mergeProductListTags,
  resolveProductListHasDiscount,
} from "@/core/theme/section/product/product-listing.nuqs";
import { findCategoryByNavParam } from "@/core/util/category.nav";
import type { ProductListingUrlState, ProductSortPreset } from "@/core/util/product-listing";
import ItemListingProduct, { ProductListingSkeleton } from "@/core/theme/item/item.listing.product";

export function SortDropdown() {
  const [params, setParams] = useQueryStates(productListingQueryParsers);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activePreset = useMemo(
    () => resolveProductSortFromQuery(params),
    [params.sort, params.order, params.orderDirection],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = findProductSortOption(activePreset).label;
  const sortActive = activePreset !== "default";

  const handleSort = (preset: ProductSortPreset) => {
    if (preset === "default") {
      setParams({ sort: null, order: null, orderDirection: null, page: 1 });
    } else {
      setParams({ sort: preset, order: null, orderDirection: null, page: 1 });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium transition-all ${
          sortActive
            ? "border-[#5C4638] bg-[#5C4638] text-[#F8F1E9]"
            : "border-[#D9C5B0]/60 bg-[#FDFAF6] text-[#8B6B57] hover:border-[#A17E65] hover:text-[#5C4638]"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <ArrowUpDown size={14} className={sortActive ? "text-[#F8F1E9]/70" : "text-[#D9C5B0]"} aria-hidden />
        <span className="truncate">{currentLabel}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""} ${sortActive ? "text-[#F8F1E9]/70" : "text-[#D9C5B0]"}`}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-1.5 max-h-80 w-56 overflow-y-auto rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] shadow-lg">
          {PRODUCT_SORT_OPTIONS.map((option) => {
            const isActive = activePreset === option.preset;
            return (
              <button
                key={option.preset}
                type="button"
                onClick={() => handleSort(option.preset)}
                className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                  isActive
                    ? "bg-[#5C4638] font-medium text-[#F8F1E9]"
                    : "text-[#8B6B57] hover:bg-[#F8F1E9] hover:text-[#5C4638]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SectionProductGrid() {
  const [params, setParams] = useQueryStates(productListingQueryParsers);
  const { flatCategory } = useRaxon();
  const page = params.page ?? 1;
  const amount = params.amount ?? PRODUCT_DEFAULT_PAGE_SIZE;
  const skipScrollOnMount = useRef(true);

  useEffect(() => {
    if (skipScrollOnMount.current) {
      skipScrollOnMount.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const listState = useMemo<ProductListingUrlState>(
    () => ({
      page: params.page,
      amount: params.amount,
      category: params.category,
      tags: params.tags,
      search: params.search,
      sort: params.sort,
      order: params.order,
      orderDirection: params.orderDirection,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      brandId: params.brandId,
      attributeOptions: params.attributeOptions,
    }),
    [params],
  );

  const resolvedCategoryId = useMemo(() => {
    return findCategoryByNavParam(params.category, flatCategory)?.id ?? params.category ?? undefined;
  }, [params.category, flatCategory]);

  const minPriceNum = parsePriceQueryParam(params.minPrice);
  const maxPriceNum = parsePriceQueryParam(params.maxPrice);

  const activeSortPreset = useMemo(
    () => resolveProductSortFromQuery(params),
    [params.sort, params.order, params.orderDirection],
  );
  const listOrder = useMemo(() => resolveProductListOrder(activeSortPreset), [activeSortPreset]);
  const listTags = useMemo(
    () => mergeProductListTags(params.tags, activeSortPreset),
    [params.tags, activeSortPreset],
  );
  const listHasDiscount = useMemo(
    () => resolveProductListHasDiscount(activeSortPreset),
    [activeSortPreset],
  );

  const { data: products, isFetching, isLoading } = useProduct().fetch({
    categoryId: resolvedCategoryId,
    tag: listTags,
    hasDiscount: listHasDiscount,
    order: listOrder
      ? {
          column: listOrder.column,
          direction: listOrder.direction,
        }
      : undefined,
    search: params.search ?? undefined,
    page,
    amount,
    outOfStock: false,
    attributeOptionId:
      params.attributeOptions && params.attributeOptions.length > 0 ? params.attributeOptions : undefined,
    minPrice: minPriceNum,
    maxPrice: maxPriceNum,
    brandId: params.brandId?.length ? params.brandId : undefined,
  });

  const productList = products?.data ?? [];
  const totalCount = products?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / amount));
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const showInitialLoading = isLoading && productList.length === 0;

  return (
    <div className="flex-1">
      <div className="mb-6">
        <p className="text-sm text-[#8B6B57]">
          {showInitialLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Yükleniyor...
            </span>
          ) : (
            <>
              <span className="font-mono tabular-nums text-[#5C4638]">{totalCount.toLocaleString("tr-TR")}</span>{" "}
              parça bulundu
            </>
          )}
        </p>
      </div>

      {showInitialLoading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
          <ProductListingSkeleton count={8} />
        </div>
      ) : productList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5EDE4]">
            <Filter size={32} className="text-[#D9C5B0]" />
          </div>
          <h3 className="mb-2 font-serif text-xl text-[#5C4638]">Sonuç bulunamadı</h3>
          <p className="mb-6 max-w-sm text-sm text-[#8B6B57]">
            Seçtiğiniz kriterlere uygun ürün bulunamadı. Filtreleri değiştirmeyi deneyin.
          </p>
          <button
            type="button"
            onClick={() =>
              setParams({
                category: null,
                page: 1,
                sort: null,
                order: null,
                orderDirection: null,
                minPrice: null,
                maxPrice: null,
                brandId: null,
                attributeOptions: null,
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-[#5C4638] px-6 py-3 text-sm font-medium text-[#F8F1E9] transition hover:bg-[#3F2F25]"
          >
            Tüm Ürünleri Göster
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
            {productList.map((product, index) => (
              <ItemListingProduct key={product.id} product={product} index={index} listState={listState} />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
              <button
                type="button"
                onClick={() => setParams({ page: Math.max(1, page - 1) })}
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
                onClick={() => setParams({ page: Math.min(totalPages, page + 1) })}
                disabled={!hasNextPage || isFetching}
                className="text-[10px] tracking-[0.28em] uppercase text-[#8B6B57] transition hover:text-[#5C4638] disabled:pointer-events-none disabled:opacity-30"
              >
                Sonraki →
              </button>
            </div>
          ) : null}

          {isFetching && !showInitialLoading ? (
            <div className="mt-10 flex justify-center">
              <div className="flex items-center gap-2 text-sm text-[#8B6B57]">
                <Loader2 className="h-4 w-4 animate-spin text-[#5C4638]" />
                <span>Güncelleniyor…</span>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
