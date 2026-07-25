"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRaxon } from "@raxonltd/raxon-core";
import { useQueryStates } from "nuqs";
import { ChevronRight } from "lucide-react";
import { SectionProductFiltersBar } from "@/core/theme/section/product/section.product.filters.bar";
import { SectionProductGrid, SortDropdown } from "@/core/theme/section/product/section.product.grid";
import { productListingQueryParsers } from "@/core/theme/section/product/product-listing.nuqs";
import { categoryNavHref, findCategoryByNavParam } from "@/core/util/category.nav";
import { getCategorySlug, getCategoryName, findCategoryBySlug } from "@/core/util/category";

type UrunlerPageClientProps = {
  categorySlug?: string;
};

export default function UrunlerPageClient({ categorySlug }: UrunlerPageClientProps) {
  const { flatCategory = [], category = [] } = useRaxon();
  const [params, setParams] = useQueryStates(productListingQueryParsers);

  const allCategories = useMemo(() => {
    const byId = new Map<string, (typeof flatCategory)[number]>();
    [...category, ...flatCategory].forEach((item) => byId.set(item.id, item));
    return Array.from(byId.values());
  }, [category, flatCategory]);

  useEffect(() => {
    if (!categorySlug || allCategories.length === 0) return;
    const match = findCategoryBySlug(allCategories, categorySlug);
    if (!match) return;
    const slug = getCategorySlug(match, allCategories);
    if (params.category !== slug) {
      setParams({ category: slug, page: 1 });
    }
  }, [categorySlug, allCategories, params.category, setParams]);

  const selectedCategory = useMemo(() => {
    if (!params.category) return null;
    return findCategoryByNavParam(params.category, flatCategory) ?? null;
  }, [params.category, flatCategory]);

  const breadcrumbs = useMemo(() => {
    if (!selectedCategory) return [];

    const items = [selectedCategory];
    let current = selectedCategory;

    while (current.parentId) {
      const parent = flatCategory.find((c) => c.id === current.parentId);
      if (parent) {
        items.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }

    return items;
  }, [selectedCategory, flatCategory]);

  const pageTitle = selectedCategory ? getCategoryName(selectedCategory) : "Tüm Ürünler";

  return (
    <div className="min-h-screen bg-[#F8F1E9]">
      <header className="border-b border-[#D9C5B0]/40">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-[#8B6B57]">
            <Link href="/" className="transition hover:text-[#5C4638]">
              Ana Sayfa
            </Link>
            <ChevronRight size={12} className="text-[#D9C5B0]" />
            {selectedCategory ? (
              <Link href="/urunler" className="transition hover:text-[#5C4638]">
                Ürünler
              </Link>
            ) : (
              <span className="text-[#5C4638]">Tüm Ürünler</span>
            )}
            {breadcrumbs.map((item, index) => (
              <span key={item.id} className="contents">
                <ChevronRight size={12} className="text-[#D9C5B0]" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-[#5C4638]">{getCategoryName(item)}</span>
                ) : (
                  <Link href={categoryNavHref(item)} className="transition hover:text-[#5C4638]">
                    {getCategoryName(item)}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-serif text-2xl tracking-tight text-[#5C4638] sm:text-3xl lg:text-4xl">
              {pageTitle}
            </h1>
            <div className="hidden sm:block">
              <SectionProductFiltersBar besideCategory trailingSlot={<SortDropdown />} />
            </div>
          </div>
        </div>
      </header>

      <div className="sm:hidden">
        <SectionProductFiltersBar trailingSlot={<SortDropdown />} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <SectionProductGrid />
      </div>
    </div>
  );
}
