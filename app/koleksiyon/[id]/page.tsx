"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useProduct, useCollection } from "@raxonltd/raxon-core/hook";
import { MediaRelated, Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import "@/core/util/util";
import { Product } from "@raxonltd/raxon-core/interface/product.interface";
import first from "lodash/first";
import ItemProduct from "@/core/theme/item/item.general.product";

const PAGE_SIZE = 24;

export default function CollectionDetailPage() {
  const params = useParams();
  const collectionId = params.id as string;
  const [page, setPage] = useState(1);

  const { data: collectionData, isLoading: collectionLoading } = useCollection().detail(collectionId);
  const collection = collectionData;

  const collectionTags = collection?.tags || [];

  useEffect(() => {
    setPage(1);
  }, [collectionId]);

  const { data: productData, isFetching } = useProduct().fetch({
    tags: collectionTags.length > 0 ? collectionTags : undefined,
    materialType: "product",
    status: Status.PUBLISHED,
    outOfStock: false,
    collectionId: collectionId,
    page,
    amount: PAGE_SIZE,
    enabled: !!collection,
  });

  const products = productData?.data ?? [];
  const totalCount = productData?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  if (collectionLoading) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='py-20 text-center'>
            <div className='inline-block h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin' />
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='py-20 text-center'>
            <p className='text-lg text-neutral-600 mb-4'>Koleksiyon bulunamadı</p>
            <Link href='/koleksiyon' className='inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-neutral-700'>
              Koleksiyonlara dön <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const collectionTitle = collection.title || "Koleksiyon";
  const collectionDescription = collection.description || collection.shortDescription || "";

  function hasTag(it: MediaRelated, value: string) {
    return Array.isArray(it?.tag) ? it.tag.includes(value) : typeof it?.tag === "string" && it.tag === value;
  }

  const mobileMedia = collection.mediaRelateds?.find((it: MediaRelated) => hasTag(it, "mobile"))?.media?.relativePath;
  const webMedia = collection.mediaRelateds?.find((it: MediaRelated) => hasTag(it, "web"))?.media?.relativePath;
  const defaultMedia = mobileMedia ?? webMedia ?? first(collection.mediaRelateds)?.media?.relativePath;

  const collectionImage = defaultMedia ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${defaultMedia}` : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='py-8 sm:py-12'>
          <div className='mb-6'>
            <nav className='flex items-center gap-2 text-sm text-neutral-600'>
              <Link href='/' className='hover:text-neutral-900'>
                Ana Sayfa
              </Link>
              <ChevronRight className='h-4 w-4' />
              <Link href='/koleksiyon' className='hover:text-neutral-900'>
                Koleksiyonlar
              </Link>
              <ChevronRight className='h-4 w-4' />
              <span className='text-neutral-900'>{collectionTitle}</span>
            </nav>
          </div>

          <div className='mb-10'>
            <div className='relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[16/6] mb-8'>
              <Image src={collectionImage} alt={collectionTitle} fill sizes='100vw' className='object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent' />
              <div className='absolute inset-x-0 bottom-0 p-8 sm:p-12'>
                <h1 className='text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl mb-4'>{collectionTitle}</h1>
                {collectionDescription && <p className='text-base text-white/90 max-w-2xl'>{collectionDescription}</p>}
              </div>
            </div>
          </div>

          <div className='mb-10'>
            <h2 className='text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl mb-2'>Koleksiyon Ürünleri</h2>
            {totalCount > 0 && <p className='text-sm text-neutral-600'>{totalCount} ürün bulundu</p>}
          </div>

          {isFetching && products.length === 0 ? (
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className='animate-pulse'>
                  <div className='aspect-[4/5] bg-neutral-200 rounded-2xl mb-5' />
                  <div className='h-4 bg-neutral-200 rounded w-3/4 mb-2' />
                  <div className='h-4 bg-neutral-200 rounded w-1/2' />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className='text-center py-20'>
              <p className='text-lg text-neutral-600 mb-4'>Bu koleksiyonda ürün bulunamadı</p>
              <Link href='/urunler' className='inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-neutral-700'>
                Tüm ürünleri görüntüle <ArrowRight className='h-4 w-4' />
              </Link>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
                {products.map((product: Product) => (
                  <ItemProduct key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className='mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6'>
                  <button
                    type='button'
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrevPage || isFetching}
                    className='inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-50'>
                    Önceki
                  </button>
                  <span className='text-sm text-neutral-600'>
                    Sayfa {page} / {totalPages}
                  </span>
                  <button
                    type='button'
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={!hasNextPage || isFetching}
                    className='inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-50'>
                    Sonraki
                  </button>
                </div>
              )}

              {isFetching && (
                <div className='mt-6 flex justify-center'>
                  <div className='flex items-center gap-2 text-sm text-neutral-600'>
                    <div className='h-4 w-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin' />
                    <span>Yükleniyor...</span>
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
