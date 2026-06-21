"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@raxonltd/raxon-core/interface/prisma.interface";

export type PriceRange = "all" | "0-500" | "500-1000" | "1000-2000" | "2000+";
export type SortOption = "newest" | "price-asc" | "price-desc" | "rating";

export const PRICE_RANGES: { value: PriceRange; label: string; min?: number; max?: number }[] = [
  { value: "all", label: "Tümü" },
  { value: "0-500", label: "₺0 – ₺500", min: 0, max: 500 },
  { value: "500-1000", label: "₺500 – ₺1.000", min: 500, max: 1000 },
  { value: "1000-2000", label: "₺1.000 – ₺2.000", min: 1000, max: 2000 },
  { value: "2000+", label: "₺2.000+", min: 2000 },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "En Yeniler" },
  { value: "price-asc", label: "Fiyat · Artan" },
  { value: "price-desc", label: "Fiyat · Azalan" },
  { value: "rating", label: "En Beğenilen" },
];

export interface ListingFilters {
  categoryId: string | null;
  subCategoryId: string | null;
  priceRange: PriceRange;
  tag: string | null;
  sort: SortOption;
  search: string | null;
}

interface Props {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  categories: Category[];
  subCategories: Category[];
  availableTags: string[];
  activeFilterCount: number;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

function getCategoryName(category: Category) {
  if (Array.isArray(category.name)) return category.name.getName();
  if (typeof category.name === "string") return category.name;
  return category.code ?? "Kategori";
}

function formatFilterLabel(text: string) {
  if (text === "Tümü") return text;
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/(^|\s|·)\S/g, (char) => char.toLocaleUpperCase("tr-TR"));
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-[#D9C5B0]/40 py-5 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#A17E65] [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          className="h-3 w-3 text-[#8B6B57]/70 transition-transform duration-300 group-open:rotate-180"
          strokeWidth={1.5}
        />
      </summary>
      <div className="mt-3 flex flex-col gap-0.5">{children}</div>
    </details>
  );
}

function FilterOption({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const display = formatFilterLabel(label);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full py-2 text-left text-[13px] tracking-wide transition-colors duration-300 ${
        active ? "text-[#5C4638]" : "text-[#8B6B57] hover:text-[#5C4638]"
      }`}
    >
      <span className="relative inline-block">
        {display}
        <span
          className={`absolute -bottom-0.5 left-0 h-px bg-[#A17E65] transition-all duration-300 ease-out ${
            active ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-70"
          }`}
        />
      </span>
    </button>
  );
}

export function FiltersPanel({
  filters,
  onChange,
  categories,
  subCategories,
  availableTags,
}: Omit<Props, "activeFilterCount" | "mobileOpen" | "onMobileOpenChange">) {
  const visibleSubCategories = filters.categoryId
    ? subCategories.filter((c) => c.parentId === filters.categoryId)
    : subCategories;

  const clearFilters = () => {
    onChange({
      ...filters,
      categoryId: null,
      subCategoryId: null,
      priceRange: "all",
      tag: null,
    });
  };

  const hasActiveFilters =
    filters.categoryId || filters.subCategoryId || filters.priceRange !== "all" || filters.tag;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#A17E65]">Filtrele</p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[10px] tracking-[0.18em] uppercase text-[#8B6B57]/80 transition hover:text-[#5C4638]"
          >
            Temizle
          </button>
        )}
      </div>

      <FilterSection title="Kategori">
        <FilterOption
          active={!filters.categoryId}
          label="Tümü"
          onClick={() => onChange({ ...filters, categoryId: null, subCategoryId: null })}
        />
        {categories.map((cat) => (
          <FilterOption
            key={cat.id}
            active={filters.categoryId === cat.id}
            label={getCategoryName(cat)}
            onClick={() => onChange({ ...filters, categoryId: cat.id, subCategoryId: null })}
          />
        ))}
      </FilterSection>

      {visibleSubCategories.length > 0 && (
        <FilterSection title="İçerik Tipi">
          <FilterOption
            active={!filters.subCategoryId}
            label="Tümü"
            onClick={() => onChange({ ...filters, subCategoryId: null })}
          />
          {visibleSubCategories.map((cat) => (
            <FilterOption
              key={cat.id}
              active={filters.subCategoryId === cat.id}
              label={getCategoryName(cat)}
              onClick={() => onChange({ ...filters, subCategoryId: cat.id })}
            />
          ))}
        </FilterSection>
      )}

      {availableTags.length > 0 && visibleSubCategories.length === 0 && (
        <FilterSection title="İçerik Tipi">
          <FilterOption
            active={!filters.tag}
            label="Tümü"
            onClick={() => onChange({ ...filters, tag: null })}
          />
          {availableTags.map((tag) => (
            <FilterOption
              key={tag}
              active={filters.tag === tag}
              label={tag}
              onClick={() => onChange({ ...filters, tag: tag })}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="Fiyat">
        {PRICE_RANGES.map((range) => (
          <FilterOption
            key={range.value}
            active={filters.priceRange === range.value}
            label={range.label}
            onClick={() => onChange({ ...filters, priceRange: range.value })}
          />
        ))}
      </FilterSection>
    </div>
  );
}

export function SortControl({
  value,
  onChange,
  className = "",
}: {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      <span className="shrink-0 text-[10px] tracking-[0.28em] uppercase text-[#A17E65]/80">Sırala</span>
      <div className="-mx-1 flex max-w-full gap-x-4 overflow-x-auto px-1 pb-0.5 sm:flex-wrap sm:overflow-visible">
        {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`group relative shrink-0 whitespace-nowrap text-[12px] tracking-wide transition-colors ${
            value === opt.value ? "text-[#5C4638]" : "text-[#8B6B57]/80 hover:text-[#5C4638]"
          }`}
        >
          {opt.label}
          <span
            className={`absolute -bottom-0.5 left-0 h-px bg-[#A17E65] transition-all duration-300 ${
              value === opt.value ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </button>
        ))}
      </div>
    </div>
  );
}

export function ProductListingFiltersMobile(props: Props) {
  const { filters, onChange, activeFilterCount, mobileOpen, onMobileOpenChange } = props;

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
        <button
          type="button"
          onClick={() => onMobileOpenChange(true)}
          className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.28em] uppercase text-[#5C4638] transition hover:text-[#A17E65]"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
          Filtrele
          {activeFilterCount > 0 && (
            <span className="font-mono text-[10px] tabular-nums text-[#A17E65]">({activeFilterCount})</span>
          )}
        </button>
        <SortControl
          value={filters.sort}
          onChange={(sort) => onChange({ ...filters, sort })}
          className="justify-end"
        />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#5C4638]/30 backdrop-blur-[2px]"
            onClick={() => onMobileOpenChange(false)}
            aria-label="Filtreleri kapat"
          />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-[#F8F1E9] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D9C5B0]/40 px-6 py-5">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#A17E65]">Filtreler</p>
              <button
                type="button"
                onClick={() => onMobileOpenChange(false)}
                className="text-[#8B6B57] transition hover:text-[#5C4638]"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-8">
              <FiltersPanel {...props} />
            </div>
            <div className="border-t border-[#D9C5B0]/40 p-5">
              <button
                type="button"
                onClick={() => onMobileOpenChange(false)}
                className="w-full border border-[#5C4638] py-3.5 text-[10px] tracking-[0.28em] uppercase text-[#5C4638] transition hover:bg-[#5C4638] hover:text-[#F8F1E9]"
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ProductListingFiltersSidebar(
  props: Omit<Props, "activeFilterCount" | "mobileOpen" | "onMobileOpenChange">,
) {
  return (
    <aside className="hidden lg:block lg:w-48 xl:w-52 lg:shrink-0">
      <div className="sticky top-36 pr-6 xl:pr-10">
        <FiltersPanel {...props} />
      </div>
    </aside>
  );
}

export default function ProductListingFilters(props: Props) {
  return (
    <>
      <ProductListingFiltersMobile {...props} />
      <ProductListingFiltersSidebar
        filters={props.filters}
        onChange={props.onChange}
        categories={props.categories}
        subCategories={props.subCategories}
        availableTags={props.availableTags}
      />
    </>
  );
}
