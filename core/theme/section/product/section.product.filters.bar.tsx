"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRaxon } from "@raxonltd/raxon-core";
import { useQueryStates } from "nuqs";
import { useAttribute } from "@raxonltd/raxon-core/hook";
import { BadgeTurkishLira, ChevronDown, Folder, X } from "lucide-react";
import { SectionProductTree } from "@/core/theme/section/product/section.product.tree";
import { findCategoryByNavParam } from "@/core/util/category.nav";
import { productListingQueryParsers } from "@/core/theme/section/product/product-listing.nuqs";

type ExtraDrawerId = "price" | string;

interface FilterDrawerShellProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function FilterDrawerShell({ title, open, onClose, children }: FilterDrawerShellProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[45] bg-[#5C4638]/40" onClick={onClose} aria-hidden />
      <div
        className="fixed bottom-0 left-0 top-0 z-[50] flex w-[min(100%,22rem)] max-w-[90vw] flex-col bg-[#FDFAF6] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-filter-drawer-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#D9C5B0]/40 p-4">
          <h2 id="product-filter-drawer-title" className="font-serif text-lg text-[#5C4638]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-[#F8F1E9]"
            aria-label="Kapat"
          >
            <X size={20} className="text-[#8B6B57]" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        </div>
        <div className="shrink-0 border-t border-[#D9C5B0]/40 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-[#5C4638] py-3 text-sm font-medium text-[#F8F1E9] transition hover:bg-[#3F2F25]"
          >
            Kapat
          </button>
        </div>
      </div>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  sublabel,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel?: string | null;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? "border-[#5C4638] bg-[#5C4638] text-[#F8F1E9] shadow-sm"
          : "border-[#D9C5B0]/60 bg-[#FDFAF6] text-[#8B6B57] hover:border-[#A17E65] hover:text-[#5C4638]"
      }`}
    >
      {icon ? <span className="shrink-0 opacity-80">{icon}</span> : null}
      <span className="truncate">{sublabel || label}</span>
      <ChevronDown
        size={14}
        className={`shrink-0 ${active ? "text-[#F8F1E9]/70" : "text-[#D9C5B0]"}`}
        aria-hidden
      />
    </button>
  );
}

export interface SectionProductFiltersBarProps {
  besideCategory?: boolean;
  trailingSlot?: ReactNode;
}

export function SectionProductFiltersBar({ besideCategory = false, trailingSlot }: SectionProductFiltersBarProps) {
  const { flatCategory } = useRaxon();
  const [params, setParams] = useQueryStates(productListingQueryParsers);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [extraDrawer, setExtraDrawer] = useState<ExtraDrawerId | null>(null);

  const resolvedCategory = useMemo(
    () => findCategoryByNavParam(params.category, flatCategory),
    [params.category, flatCategory],
  );
  const resolvedCategoryId = resolvedCategory?.id;

  const { data: attributesResponse } = useAttribute().fetch({
    categoryId: resolvedCategoryId,
    enabled: !!resolvedCategoryId,
  });
  const attributes = attributesResponse?.data ?? [];

  useEffect(() => {
    if (params.brandId?.length) {
      setParams({ brandId: null, page: 1 });
    }
  }, [params.brandId, setParams]);

  useEffect(() => {
    if (!resolvedCategoryId || !params.attributeOptions?.length) return;
    const allowed = new Set(
      attributes.flatMap((attr) => (attr.attributeOptions ?? []).map((opt) => opt.id)),
    );
    const next = params.attributeOptions.filter((id) => allowed.has(id));
    if (next.length !== params.attributeOptions.length) {
      setParams({ attributeOptions: next.length ? next : null, page: 1 });
    }
  }, [resolvedCategoryId, attributes, params.attributeOptions, setParams]);

  const closeExtraDrawer = () => setExtraDrawer(null);

  const openDrawer = (id: ExtraDrawerId) => {
    setExtraDrawer(id);
    setCategoryDrawerOpen(false);
  };

  const openCategory = () => {
    setExtraDrawer(null);
    setCategoryDrawerOpen(true);
  };

  const selectedCategoryLabel = useMemo(() => {
    if (!resolvedCategory) return null;
    return resolvedCategory.name?.getName?.() || resolvedCategory.name?.toString() || null;
  }, [resolvedCategory]);

  const setMinPrice = (v: string) => {
    setParams({ minPrice: v || null, page: 1 });
  };

  const setMaxPrice = (v: string) => {
    setParams({ maxPrice: v || null, page: 1 });
  };

  const setAttributeOptionFor = (attrId: string, optionId: string | undefined) => {
    const opts = attributes.find((a) => a.id === attrId)?.attributeOptions ?? [];
    const optIds = new Set(opts.map((o) => o.id));
    const rest = (params.attributeOptions ?? []).filter((id) => !optIds.has(id));
    if (!optionId) {
      setParams({ attributeOptions: rest.length ? rest : null, page: 1 });
      return;
    }
    setParams({ attributeOptions: [...rest, optionId], page: 1 });
  };

  const selectedOptionForAttribute = (attrId: string): string => {
    const opts = attributes.find((a) => a.id === attrId)?.attributeOptions ?? [];
    const optSet = new Set(opts.map((o) => o.id));
    const hit = (params.attributeOptions ?? []).find((id) => optSet.has(id));
    return hit ?? "";
  };

  const hasNonCategoryFilters = Boolean(
    params.minPrice ||
      params.maxPrice ||
      (params.attributeOptions && params.attributeOptions.length > 0),
  );

  const clearNonCategoryFilters = () => {
    setParams({ minPrice: null, maxPrice: null, brandId: null, attributeOptions: null, page: 1 });
  };

  const priceActive = Boolean(params.minPrice || params.maxPrice);
  const priceSubtitle = priceActive
    ? [params.minPrice ? `≥ ${params.minPrice} ₺` : null, params.maxPrice ? `≤ ${params.maxPrice} ₺` : null]
        .filter(Boolean)
        .join(" · ")
    : undefined;

  const toolbar = (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1.5 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        <FilterChip
          active={Boolean(selectedCategoryLabel)}
          onClick={openCategory}
          label="Kategori"
          sublabel={selectedCategoryLabel ?? "Kategori"}
          icon={<Folder size={14} />}
        />

        <FilterChip
          active={priceActive}
          onClick={() => openDrawer("price")}
          label="Fiyat"
          sublabel={priceActive ? priceSubtitle : "Fiyat"}
          icon={<BadgeTurkishLira size={14} />}
        />

        {params.category &&
          attributes.map((attr) => {
            const sid = attr.id;
            const value = selectedOptionForAttribute(sid);
            const optName = attr.attributeOptions?.find((o) => o.id === value)?.name ?? "";

            return (
              <FilterChip
                key={sid}
                active={Boolean(value)}
                onClick={() => openDrawer(`attr:${sid}`)}
                label={attr.name}
                sublabel={optName || attr.name}
              />
            );
          })}

        {hasNonCategoryFilters && (
          <button
            type="button"
            onClick={clearNonCategoryFilters}
            className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs text-[#8B6B57] transition-colors hover:text-[#A17E65]"
          >
            <X size={12} />
            <span className="hidden sm:inline">Temizle</span>
          </button>
        )}
      </div>

      {trailingSlot ? (
        <div className="ml-2 shrink-0 border-l border-[#D9C5B0]/40 pl-2">{trailingSlot}</div>
      ) : null}
    </div>
  );

  return (
    <>
      {besideCategory ? (
        <div className="shrink-0">{toolbar}</div>
      ) : (
        <div className="sticky top-16 z-30 border-b border-[#D9C5B0]/40 bg-[#F8F1E9]/95 backdrop-blur-sm lg:top-[4.5rem]">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">{toolbar}</div>
        </div>
      )}

      <SectionProductTree open={categoryDrawerOpen} onClose={() => setCategoryDrawerOpen(false)} />

      <FilterDrawerShell title="Fiyat aralığı (₺)" open={extraDrawer === "price"} onClose={closeExtraDrawer}>
        <div className="flex flex-col gap-4">
          <p className="text-xs text-[#8B6B57]">Minimum ve maksimum fiyat girerek listeyi daraltın.</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="En az"
              value={params.minPrice ?? ""}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full min-w-0 rounded-sm border border-[#D9C5B0]/60 bg-[#F8F1E9] px-3 py-2.5 text-sm text-[#5C4638] focus:border-[#A17E65] focus:outline-none focus:ring-1 focus:ring-[#A17E65]"
            />
            <span className="shrink-0 text-sm text-[#D9C5B0]">—</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="En çok"
              value={params.maxPrice ?? ""}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full min-w-0 rounded-sm border border-[#D9C5B0]/60 bg-[#F8F1E9] px-3 py-2.5 text-sm text-[#5C4638] focus:border-[#A17E65] focus:outline-none focus:ring-1 focus:ring-[#A17E65]"
            />
          </div>
        </div>
      </FilterDrawerShell>

      {attributes.map((attr) => {
        const drawerKey = `attr:${attr.id}`;
        const options = attr.attributeOptions ?? [];
        const selected = selectedOptionForAttribute(attr.id);

        return (
          <FilterDrawerShell
            key={attr.id}
            title={attr.name}
            open={extraDrawer === drawerKey}
            onClose={closeExtraDrawer}
          >
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setAttributeOptionFor(attr.id, undefined)}
                className={`w-full rounded-sm px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  !selected ? "bg-[#5C4638] text-[#F8F1E9]" : "text-[#5C4638] hover:bg-[#F8F1E9]"
                }`}
              >
                Tümü
              </button>
              {options.map((opt) => {
                const isSel = selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAttributeOptionFor(attr.id, opt.id)}
                    className={`w-full rounded-sm px-3 py-2.5 text-left text-sm transition-colors ${
                      isSel
                        ? "bg-[#5C4638] font-medium text-[#F8F1E9] shadow-sm"
                        : "text-[#5C4638] hover:bg-[#F8F1E9]"
                    }`}
                  >
                    {opt.name}
                  </button>
                );
              })}
            </div>
          </FilterDrawerShell>
        );
      })}
    </>
  );
}
