'use client';
import { useRaxon } from '@raxonltd/raxon-core';
import { useAttribute } from '@raxonltd/raxon-core/hook';
import { ChevronDown, Filter, Grid3x3, List, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryStates } from 'nuqs';
import { productListSearchParams } from '@/core/util/product-list.search-params';
const sortOptions = [
    { value: '', label: 'Varsayılan', orderBy: undefined, orderDirection: undefined },
    { value: 'new', label: 'En Yeni', orderBy: 'createdAt' as const, orderDirection: 'desc' as const },
    { value: 'review-count', label: 'En Çok Değerlendirilen', orderBy: 'reviewCount' as const, orderDirection: 'desc' as const },
    { value: 'rating-high', label: 'En Yüksek Puanlı', orderBy: 'avgRating' as const, orderDirection: 'desc' as const },
    { value: 'rating-low', label: 'En Düşük Puanlı', orderBy: 'avgRating' as const, orderDirection: 'asc' as const },
  ];
export function SectionProductFilter() {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const { category, flatCategory } = useRaxon();
  const [params, setParams] = useQueryStates(productListSearchParams);

  const { data: attributes } = useAttribute().fetch({
    categoryId: params.category ?? '',
    enabled: !!params.category,
  });
  let activeFiltersCount = useMemo(() => {
    return (params.category ? 1 : 0) + (params.tags?.length ?? 0) + (params.order ? 1 : 0) + (params.orderDirection ? 1 : 0) + (params.attributeOptionId ? 1 : 0);
  }, [params]);




  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
 
  let currentSortLabel = 'Varsayılan';
  if (params.order && params.order.column) {
    const foundOption = sortOptions.find(opt => opt.value === params.order?.column);
    if (foundOption) {
      currentSortLabel = foundOption.label;
    } else if (params.orderDirection) {
      const foundByOrder = sortOptions.find(
        opt =>
          opt.orderBy === params.order?.column &&
          opt.orderDirection === params.orderDirection
      );
      if (foundByOrder) {
        currentSortLabel = foundByOrder.label;
      }
    }
  }

  return (
    <>
      {/* Filtre ve Sıralama Barı */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsFilterOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-[13px] font-medium text-gray-700 transition-all duration-300 hover:bg-rose-50 hover:text-rose-900">
              <Filter className="h-4 w-4" />
              <span>Filtrele</span>
              {activeFiltersCount > 0 && <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-900 text-[10px] font-bold text-white">{activeFiltersCount}</span>}
            </button>
            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setParams({ category: null, tags: null, order: null, orderDirection: null, attributeOptionId: null });
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 px-4 py-2.5 text-[13px] font-medium text-gray-500 transition-all duration-300 hover:bg-rose-50 hover:text-rose-900"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Temizle</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={sortRef}>
              <button onClick={() => setIsSortOpen(!isSortOpen)} className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-[13px] font-medium text-gray-700 transition-all duration-300 hover:bg-rose-50 hover:text-rose-900">
                <span>{currentSortLabel}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSortOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl bg-white p-1 shadow-xl ring-1 ring-black/5">
                  <div className="flex flex-col gap-0.5">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setParams({ ...params, order: { column: option.value, direction: option.orderDirection! }, orderDirection: option.orderDirection! });
                          setIsSortOpen(false);
                        }}
                        className={`w-full rounded-xl px-4 py-2.5 text-left text-[13px] transition-colors duration-200 ${params.order?.column === option.value || (params.order?.column === option.orderBy && params.orderDirection === option.orderDirection) ? 'bg-rose-900 text-white font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden items-center gap-1 rounded-xl bg-gray-50 p-1 sm:flex">
              <button onClick={() => setParams({ ...params, viewMode: 'grid' })} className={`inline-flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${params.viewMode === 'grid' ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400 hover:bg-white hover:text-gray-900'}`} aria-label="Grid görünümü">
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button onClick={() => setParams({ ...params, viewMode: 'list' })} className={`inline-flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${params.viewMode === 'list' ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400 hover:bg-white hover:text-gray-900'}`} aria-label="Liste görünümü">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {params.category && attributes?.data && attributes?.data?.length && attributes?.data?.length > 0 ? (
          <div className="flex flex-wrap items-end gap-2 border-t border-gray-100 pt-3">
            {attributes?.data?.map(attr => {
              const options = attr.attributeOptions ?? [];
              const paramKey = `attributeOptionId_${attr.id}`;
              const value = params.attributeOptionId === attr.id ? params.attributeOptionId : undefined;
              return (
                <label key={attr.id} className="flex min-w-[140px] flex-1 flex-col gap-1 sm:min-w-[160px] sm:flex-none">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{attr.name}</span>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-900 outline-none transition-colors focus:border-rose-900 focus:ring-1 focus:ring-rose-900"
                    value={value}
                    onChange={e => {
                      setParams({ attributeOptionId: e.target.value || null });
                    }}
                    aria-label={attr.name}
                  >
                    <option value="">Tümü</option>
                    {attr.attributeOptions?.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Filtre paneli: Kategori, Koleksiyon, Sıralama (context verisi) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} role="dialog" aria-modal="true" aria-labelledby="filter-title">
          <div ref={filterRef} className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-6">
              <h2 id="filter-title" className="text-lg font-semibold text-gray-900 sm:text-xl">
                Filtrele
              </h2>
              <button type="button" onClick={() => setIsFilterOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-900" aria-label="Kapat">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              {/* Kategori */}
              {category.length > 0 && (
                <section className="mb-8">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Kategori</h3>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setParams({ category: null });
                          setIsFilterOpen(false);
                        }}
                        className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${!params.category ? 'bg-rose-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        Tümü
                      </button>
                    </li>
                    {category.map(cat => (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setParams({ ...params, category: cat.id });
                            setIsFilterOpen(false);
                          }}
                          className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${params.category === cat.id ? 'bg-rose-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          {cat.name?.getName?.() || cat.name?.toString()}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {params.category && attributes?.data && attributes?.data?.length && attributes?.data?.length > 0 && (
                <section className="mb-8">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Özellikler</h3>
                  <div className="flex flex-col gap-4">
                    {attributes?.data?.map(attr => {
                      const options = attr.attributeOptions ?? [];
                      const paramKey = `attributeOptionId_${attr.id}`;
                      const value = params.attributeOptionId === attr.id ? params.attributeOptionId : undefined;
                      return (
                        <label key={attr.id} className="flex flex-col gap-1.5">
                          <span className="text-sm font-medium text-gray-800">{attr.name}</span>
                          <select
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-rose-900 focus:ring-1 focus:ring-rose-900"
                            value={value}
                            onChange={e => {
                              setParams({ attributeOptionId: e.target.value || null });
                            }}
                            aria-label={attr.name}
                          >
                            <option value="">Tümü</option>
                            {options.map(opt => (
                              <option key={opt.id} value={opt.id}>
                                {opt.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      );
                    })}
                  </div>
                </section>
              )}


              {/* Sıralama */}
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Sıralama</h3>
                <ul className="flex flex-col gap-1">
                  {sortOptions.map(option => {
                    const isActive = (option.value && params.order?.column === option.value) || (params.order?.column === option.orderBy && params.orderDirection === option.orderDirection);
                    return (
                      <li key={option.value || 'default'}>
                        <button
                          type="button"
                          onClick={() => {
                            setParams({ ...params, order: { column: option.value, direction: option.orderDirection! }, orderDirection: option.orderDirection! });
                            setIsFilterOpen(false);
                          }}
                          className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${isActive ? 'bg-rose-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          {option.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
            {activeFiltersCount > 0 && (
              <div className="border-t border-gray-100 p-4 sm:p-6">
                <button
                  type="button"
                  onClick={() => {
                    setParams({ category: null, tags: null, order: null, orderDirection: null, attributeOptionId: null });
                    setIsFilterOpen(false);
                  }}
                  className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Tüm filtreleri temizle
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
