'use client';
import { useRaxon } from "@raxonltd/raxon-core";
import { Category } from "@raxonltd/raxon-core/interface/prisma.interface";
import cloneDeep from "lodash/cloneDeep";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { useQueryStates } from 'nuqs';
import { productListSearchParams } from '@/core/util/product-list.search-params';

export function SectionProductCategory() {

  const { category, flatCategory } = useRaxon();

  const [params, setParams] = useQueryStates(productListSearchParams);

  let categoryInfo = useMemo(() => {
    var findCategory = flatCategory.find(it => it.id === params.category);

    let buildTree: Category[] = [];

    if (findCategory) {
      buildTree.push(findCategory);
      let treeFindCategory: Category | undefined = cloneDeep(findCategory);
      while (treeFindCategory?.parentId) {
        treeFindCategory = flatCategory.find(it => it.id === treeFindCategory?.parentId);
        if (treeFindCategory) {
          buildTree.push(treeFindCategory);
        }
      }
      buildTree.reverse();
    }

    return {
      activeCategory: findCategory,
      circleItems: findCategory?.children ?? category ?? [],
      breadCrumbs: buildTree,
    };
  }, [category, params.category]);
 
  return <>
    <div className="bg-neutral-50">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-12">
            <div className="mb-8 text-center">
              <h1 className="text-center text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">{categoryInfo.activeCategory?.name?.getName() || 'Tüm Ürünler'}</h1>

              {/* Breadcrumb */}
              <nav className="mb-4 mt-4 flex flex-wrap items-center justify-center gap-1 text-[12px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                <Link href="/" className="text-neutral-600 transition hover:text-neutral-900">
                  Ana Sayfa
                </Link>
                <ChevronRight className="mx-1 h-4 w-4 text-neutral-300" />
                <Link href="/urunler" className="text-neutral-600 transition hover:text-neutral-900">
                  Ürünler
                </Link>
                {categoryInfo.breadCrumbs.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ChevronRight className="mx-1 h-4 w-4 text-neutral-300" />
                    <Link href={`/urunler?category=${item.id}`} className="text-neutral-600 transition hover:text-neutral-900">
                      {item.name?.getName?.() || item.name?.toString() || ''}
                    </Link>
                  </React.Fragment>
                ))}
              </nav>

              {/* Kategori barı: Tümü + ana/alt kategoriler */}
              <div className=" pt-6">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  {categoryInfo.circleItems.length > 0 && (
                    <div className="flex min-w-0 items-start gap-4 overflow-x-auto scrollbar-hide px-2 py-1 sm:flex-wrap sm:justify-center sm:gap-6 sm:max-h-[300px] sm:overflow-hidden [-webkit-overflow-scrolling:touch]">
                      {categoryInfo.circleItems.map(item => {
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setParams({ category: item.id });
                            }}
                            className="group flex flex-shrink-0 flex-col items-center gap-2 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-900 focus-visible:ring-offset-2"
                            aria-label={item.name?.getName?.() || item.name?.toString() || ''}
                          >
                            <div className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm sm:h-16 sm:w-16 ${params.category === item.id ? 'ring-2 ring-rose-900 ring-offset-2' : ''}`}>
                              {item.coverMedia?.relativePath ? (
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.coverMedia?.relativePath}`}
                                  alt={item.name?.getName?.() || item.name?.toString() || ''}
                                  fill
                                  sizes="(max-width: 640px) 56px, 64px"
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <span className="text-sm font-semibold text-neutral-400 sm:text-base">{item.name?.getName().letterInitial()}</span>
                              )}
                            </div>
                            <span className={`max-w-[5.5rem] truncate text-center text-[12px] font-semibold sm:max-w-[7rem] ${params.category === item.id ? 'text-neutral-900' : 'text-neutral-600 group-hover:text-neutral-900'}`}>{item.name?.getName?.() || item.name?.toString()}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </>
}