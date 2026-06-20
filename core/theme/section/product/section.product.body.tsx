'use client';
import { useProduct } from "@raxonltd/raxon-core/hook";
import { ArrowRight, Filter } from "lucide-react";
import Link from "next/link";
import { Product as CustomProduct } from "@raxonltd/raxon-core/interface/product.interface";
import { useQueryStates } from 'nuqs';
import { productListSearchParams } from '@/core/util/product-list.search-params';
import ItemSquareProduct from "@/core/theme/item/item.sqaure.product";
import ItemHorizontalProduct from "@/core/theme/item/item.horizontal.product";
import { useEffect, useMemo, useRef, useState } from "react";

export function SectionProductBody() {

  const [params, setParams] = useQueryStates(productListSearchParams);

  const { data: products, isFetching } = useProduct().fetch({
    categoryId: params.category ?? undefined,
    tags: params.tags as string[] | undefined,
    order: params.order ? {
      column: params.order.column as 'createdAt' | 'reviewCount' | 'avgRating',
      direction: params.orderDirection as 'asc' | 'desc',
    } : undefined,
    search: params.search ?? undefined,
    page: params.page,
    amount: params.amount,
    outOfStock: false,
    attributeOptionId: params.attributeOptionId ? [params.attributeOptionId] : undefined,
  });

  const [accumulated, setAccumulated] = useState<CustomProduct[]>([]);

  const listKey = useMemo(
    () =>
      JSON.stringify({
        c: params.category,
        t: params.tags,
        s: params.search,
        o: params.order,
        od: params.orderDirection,
        a: params.attributeOptionId,
        amt: params.amount,
      }),
    [
      params.category,
      params.tags,
      params.search,
      params.order,
      params.orderDirection,
      params.attributeOptionId,
      params.amount,
    ]
  );

  const prevListKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (isFetching || products?.data === undefined) return;

    const page = params.page ?? 1;

    if (listKey !== prevListKeyRef.current) {
      prevListKeyRef.current = listKey;
      setAccumulated(products.data);
      return;
    }

    if (page === 1) {
      setAccumulated(products.data);
      return;
    }

    setAccumulated((prev) => {
      const ids = new Set(prev.map((p) => p.id));
      const fresh = products.data.filter((p) => !ids.has(p.id));
      if (fresh.length === 0) return prev;
      return [...prev, ...fresh];
    });
  }, [isFetching, products?.data, listKey, params.page]);

  const hasNextPage = (products?.count ?? 0) > accumulated.length;

  return <>
  {/* Ürün Listesi */}

        <div className=" mt-8">
          {isFetching && accumulated.length === 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] rounded-xl bg-gray-100 mb-4" />
                  <div className="h-4 w-3/4 rounded-full bg-gray-100 mb-2" />
                  <div className="h-4 w-1/2 rounded-full bg-gray-100" />
                </div>
              ))}
            </div>
          ) : accumulated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-400">
                <Filter className="h-8 w-8" />
              </div>
              <p className="mb-2 text-xl font-medium text-gray-900">Ürün bulunamadı</p>
              <p className="mb-8 text-sm text-gray-500">Farklı filtreler deneyerek aradığınızı bulabilirsiniz.</p>
              <Link href="/urunler" className="inline-flex items-center gap-2 bg-rose-900 px-8 py-4 text-white font-medium hover:bg-rose-800 transition-colors">
                Tüm ürünleri görüntüle <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className={params.viewMode === 'grid' ? 'grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12' : 'grid grid-cols-1 gap-8 lg:grid-cols-2'}>
                {accumulated.map((product: CustomProduct) => {
                  return params.viewMode === 'grid' ? <ItemSquareProduct key={product.id} product={product} /> : <ItemHorizontalProduct key={product.id} product={product} />;
                })}
              </div>
              {hasNextPage && (
                <div className="mt-12 flex justify-center mb-12">
                  <button
                    type="button"
                    disabled={isFetching}
                    onClick={() => setParams({ ...params, page: (params.page ?? 1) + 1 })}
                    className="inline-flex min-h-12 min-w-[200px] items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-medium text-gray-900 transition-colors hover:border-rose-900 hover:text-rose-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isFetching ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-rose-900" />
                        <span>Yükleniyor...</span>
                      </>
                    ) : (
                      <span>Daha fazla ürün yükle</span>
                    )}
                  </button>
                </div>
              )}
              {!hasNextPage && accumulated.length > 0 && (
                <div className="mt-16 text-center mb-12">
                  <span className="inline-flex items-center rounded-full bg-gray-50 px-6 py-2.5 text-sm font-medium text-gray-500">Tüm ürünleri görüntülediniz</span>
                </div>
              )}
            </>
          )}
        </div>
     
  </>
}