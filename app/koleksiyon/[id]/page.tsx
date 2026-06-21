"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useRaxon } from "@raxonltd/raxon-core";
import { useCollection } from "@raxonltd/raxon-core/hook";
import {
  COLLECTION_PAGE_SIZE,
  useCollectionProducts,
} from "@/core/hook/use.collection.products";
import { getCollectionImageUrl } from "@/core/constant/collection.constant";
import ItemListingProduct, { ProductListingSkeleton } from "@/core/theme/item/item.listing.product";
import "@/core/util/util";

export default function CollectionDetailPage() {
  const params = useParams();
  const collectionId = typeof params.id === "string" ? params.id : "";
  const [page, setPage] = useState(1);

  const { category = [], flatCategory = [] } = useRaxon();
  const categories = flatCategory.length > 0 ? flatCategory : category;

  const { data: collection, isLoading: collectionLoading } = useCollection().detail(collectionId);

  const {
    products,
    totalCount,
    isLoading: productsLoading,
    isFetching,
    productFilter,
    keywordSearch,
  } = useCollectionProducts(collectionId, collection, categories, page);

  useEffect(() => {
    setPage(1);
  }, [collectionId, productFilter.categoryId, productFilter.subCategoryId, productFilter.search, keywordSearch]);

  const totalPages = Math.ceil(totalCount / COLLECTION_PAGE_SIZE);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const collectionTitle = collection?.title || "Koleksiyon";
  const collectionDescription = collection?.description || collection?.shortDescription || "";
  const collectionImage = collection ? getCollectionImageUrl(collection) : "";

  const productsPageHref = useMemo(() => {
    const query = new URLSearchParams();
    const categoryParam = productFilter.subCategoryId ?? productFilter.categoryId;
    if (categoryParam) query.set("categoryId", categoryParam);
    if (productFilter.search) query.set("search", productFilter.search);
    else if (keywordSearch) query.set("search", keywordSearch);
    const qs = query.toString();
    return qs ? `/urunler?${qs}` : "/urunler";
  }, [productFilter, keywordSearch]);

  if (collectionLoading) {
    return (
      <div className="min-h-screen bg-[#F8F1E9]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-[#8B6B57]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
            <span className="text-xs tracking-[0.15em] uppercase">Koleksiyon yükleniyor…</span>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#F8F1E9]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center">
            <p className="mb-4 text-lg text-[#8B6B57]">Koleksiyon bulunamadı</p>
            <Link
              href="/koleksiyon"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#5C4638] hover:text-[#A17E65]"
            >
              Koleksiyonlara dön <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const showSkeleton = productsLoading && products.length === 0;

  return (
    <div className="min-h-screen bg-[#F8F1E9] text-[#5C4638]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-12">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B6B57]">
            <Link href="/" className="transition-colors hover:text-[#5C4638]">
              Ana Sayfa
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <Link href="/koleksiyon" className="transition-colors hover:text-[#5C4638]">
              Koleksiyonlar
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="text-[#5C4638]">{collectionTitle}</span>
          </nav>

          <div className="relative mb-10 aspect-[16/7] overflow-hidden rounded-2xl bg-[#EDE0D1] sm:aspect-[16/6]">
            <Image src={collectionImage} alt={collectionTitle} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5C4638]/75 via-[#5C4638]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12">
              <h1 className="font-serif text-3xl text-white sm:text-4xl lg:text-5xl">{collectionTitle}</h1>
              {collectionDescription && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
                  {collectionDescription}
                </p>
              )}
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-[#5C4638] sm:text-3xl">Koleksiyon Ürünleri</h2>
              {totalCount > 0 && (
                <p className="mt-2 text-sm text-[#8B6B57]">{totalCount} ürün bulundu</p>
              )}
            </div>
            {totalCount > 0 && (
              <Link
                href={productsPageHref}
                className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B6B57] transition-all hover:gap-3 hover:text-[#5C4638]"
              >
                Tümünü Gör
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {showSkeleton ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              <ProductListingSkeleton count={8} />
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 px-6 py-16 text-center">
              <p className="mb-4 text-[#8B6B57]">Bu koleksiyonda ürün bulunamadı.</p>
              <Link
                href={productsPageHref}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#5C4638] hover:text-[#A17E65]"
              >
                İlgili ürünlere git <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                {products.map((product, index) => (
                  <ItemListingProduct key={product.id} product={product} index={index} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrevPage || isFetching}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D9C5B0] bg-[#FDFAF6] px-5 py-2.5 text-sm text-[#5C4638] transition hover:bg-[#EDE0D1]/50 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Önceki
                  </button>
                  <span className="text-sm text-[#8B6B57]">
                    Sayfa {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={!hasNextPage || isFetching}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D9C5B0] bg-[#FDFAF6] px-5 py-2.5 text-sm text-[#5C4638] transition hover:bg-[#EDE0D1]/50 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Sonraki
                  </button>
                </div>
              )}

              {isFetching && products.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center gap-2 text-sm text-[#8B6B57]">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
                    <span>Yükleniyor…</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
