"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRaxon } from "@raxonltd/raxon-core";
import type { Category } from "@raxonltd/raxon-core/interface/prisma.interface";
import { ChevronRight, ChevronDown, Search, X, Folder, FolderOpen } from "lucide-react";
import { useQueryStates } from "nuqs";
import { productListingQueryParsers } from "@/core/theme/section/product/product-listing.nuqs";
import { categoryNavParamMatches, categoryNavSlug } from "@/core/util/category.nav";

interface CategoryTreeItemProps {
  category: Category;
  level: number;
  selectedId: string | null;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onSelect: (id: string) => void;
}

function CategoryTreeItem({
  category,
  level,
  selectedId,
  expandedIds,
  onToggleExpand,
  onSelect,
}: CategoryTreeItemProps) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const isSelected = categoryNavParamMatches(category, selectedId);
  const productCount = (category as Category & { _count?: { products?: number } })._count?.products || 0;

  const childCategories = useMemo(() => category.children ?? [], [category.children]);

  return (
    <div>
      <div
        className={`group flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2.5 transition-all duration-200 ${
          isSelected
            ? "bg-[#5C4638] text-[#F8F1E9] shadow-sm"
            : "text-[#8B6B57] hover:bg-[#F8F1E9]"
        } ${level > 0 ? "ml-4 border-l border-[#D9C5B0]/40" : ""}`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(category.id);
            }}
            className={`rounded p-0.5 transition-colors ${isSelected ? "hover:bg-white/20" : "hover:bg-[#F5EDE4]"}`}
          >
            {isExpanded ? (
              <ChevronDown size={16} className={isSelected ? "text-[#F8F1E9]" : "text-[#8B6B57]"} />
            ) : (
              <ChevronRight size={16} className={isSelected ? "text-[#F8F1E9]" : "text-[#8B6B57]"} />
            )}
          </button>
        )}
        {!hasChildren && <span className="w-5" />}

        <div onClick={() => onSelect(category.id)} className="flex min-w-0 flex-1 items-center gap-2">
          {isExpanded ? (
            <FolderOpen size={16} className={isSelected ? "text-[#F8F1E9]" : "text-[#D9C5B0]"} />
          ) : (
            <Folder size={16} className={isSelected ? "text-[#F8F1E9]" : "text-[#D9C5B0]"} />
          )}
          <span className={`truncate text-sm font-medium ${isSelected ? "text-[#F8F1E9]" : "text-[#5C4638]"}`}>
            {category.name?.getName?.() || category.name?.toString()}
          </span>
          {productCount > 0 && (
            <span
              className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-xs ${
                isSelected ? "bg-white/20 text-[#F8F1E9]" : "bg-[#F5EDE4] text-[#8B6B57]"
              }`}
            >
              {productCount}
            </span>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {childCategories.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface SectionProductTreeProps {
  open: boolean;
  onClose: () => void;
}

export function SectionProductTree({ open, onClose }: SectionProductTreeProps) {
  const { category, flatCategory } = useRaxon();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [params, setParams] = useQueryStates(productListingQueryParsers);

  const selectedId = params.category || null;

  const selectedCategoryId = useMemo(() => {
    if (!selectedId) return null;
    const cat = flatCategory.find((c) => categoryNavParamMatches(c, selectedId));
    return cat?.id ?? selectedId;
  }, [selectedId, flatCategory]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return flatCategory.filter((cat) => {
      const name = (cat.name?.getName?.() || cat.name?.toString() || "").toLowerCase();
      return name.includes(query);
    });
  }, [searchQuery, flatCategory]);

  const expandPathToSelection = useCallback(
    (catId: string | null) => {
      if (!catId) return;

      const findParentChain = (targetId: string): string[] => {
        const target = flatCategory.find((c) => c.id === targetId);
        if (!target?.parentId) return [];

        const parent = flatCategory.find((c) => c.id === target.parentId);
        if (!parent) return [];

        return [parent.id, ...findParentChain(parent.id)];
      };

      const parents = findParentChain(catId);
      setExpandedIds((prev) => {
        const newSet = new Set(prev);
        parents.forEach((id) => newSet.add(id));
        return newSet;
      });
    },
    [flatCategory],
  );

  useEffect(() => {
    expandPathToSelection(selectedCategoryId);
  }, [selectedCategoryId, open, expandPathToSelection]);

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSelect = (id: string) => {
    const cat = flatCategory.find((c) => c.id === id);
    setParams({ category: cat ? categoryNavSlug(cat) : id, page: 1, attributeOptions: null });
    onClose();
  };

  const clearCategory = () => {
    setParams({ category: null, page: 1, attributeOptions: null });
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#5C4638]/40" onClick={onClose} aria-hidden />
      <div
        className="fixed bottom-0 left-0 top-0 z-50 flex w-[min(100%,22rem)] max-w-[90vw] flex-col bg-[#FDFAF6] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-category-drawer-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#D9C5B0]/40 p-4">
          <div className="flex items-center gap-2">
            <Folder size={20} className="text-[#A17E65]" />
            <h2 id="product-category-drawer-title" className="font-serif text-lg text-[#5C4638]">
              Kategori seçimi
            </h2>
          </div>
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
          <div className="shrink-0 border-b border-[#D9C5B0]/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[10px] tracking-[0.24em] uppercase text-[#A17E65]">Kategoriler</h3>
              {selectedId && (
                <button
                  type="button"
                  onClick={clearCategory}
                  className="text-xs font-medium text-[#A17E65] hover:underline"
                >
                  Tümünü Göster
                </button>
              )}
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D9C5B0]" />
              <input
                type="text"
                placeholder="Kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-sm border border-[#D9C5B0]/60 bg-[#F8F1E9] py-2 pl-9 pr-8 text-sm text-[#5C4638] focus:border-[#A17E65] focus:outline-none focus:ring-1 focus:ring-[#A17E65]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-[#F5EDE4]"
                >
                  <X size={14} className="text-[#8B6B57]" />
                </button>
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {searchQuery && searchResults ? (
              <div className="space-y-1">
                <p className="px-3 py-2 text-xs text-[#8B6B57]">{searchResults.length} sonuç bulundu</p>
                {searchResults.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.id)}
                    className={`w-full rounded-sm px-3 py-2 text-left text-sm transition-colors ${
                      categoryNavParamMatches(cat, selectedId)
                        ? "bg-[#5C4638] text-[#F8F1E9]"
                        : "text-[#5C4638] hover:bg-[#F8F1E9]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Folder
                        size={14}
                        className={categoryNavParamMatches(cat, selectedId) ? "text-[#F8F1E9]" : "text-[#D9C5B0]"}
                      />
                      <span className="truncate">{cat.name?.getName?.() || cat.name?.toString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    clearCategory();
                    onClose();
                  }}
                  className={`w-full rounded-sm px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    !selectedId ? "bg-[#5C4638] text-[#F8F1E9] shadow-sm" : "text-[#5C4638] hover:bg-[#F8F1E9]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder size={16} className={!selectedId ? "text-[#F8F1E9]" : "text-[#D9C5B0]"} />
                    <span>Tüm Ürünler</span>
                  </div>
                </button>

                {category.map((cat) => (
                  <CategoryTreeItem
                    key={cat.id}
                    category={cat}
                    level={0}
                    selectedId={selectedId}
                    expandedIds={expandedIds}
                    onToggleExpand={handleToggleExpand}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </div>
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
