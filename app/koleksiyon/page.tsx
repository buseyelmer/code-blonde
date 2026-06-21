'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRaxon } from '@raxonltd/raxon-core';
import { Collection, MediaRelated } from '@raxonltd/raxon-core/interface/prisma.interface';
import first from 'lodash/first';
import { buildStorageImageUrl } from '@/core/util/basket.enrichment';

function CollectionCard({ collection }: { collection: Collection }) {
  const collectionTitle = collection.title || 'Koleksiyon';
  const collectionDescription = collection.shortDescription || collection.description || '';

  function hasTag(it: MediaRelated, value: string) {
    return Array.isArray(it?.tag)
      ? it.tag.includes(value)
      : typeof it?.tag === 'string' && it.tag === value;
  }

  const mobileMedia = collection.mediaRelateds?.find((it: MediaRelated) => hasTag(it, 'mobile'))?.media?.relativePath;
  const webMedia = collection.mediaRelateds?.find((it: MediaRelated) => hasTag(it, 'web'))?.media?.relativePath;
  const defaultMedia = mobileMedia ?? webMedia ?? first(collection.mediaRelateds)?.media?.relativePath;

  const collectionImage = defaultMedia
    ? buildStorageImageUrl(defaultMedia) ??
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop';

  const collectionUrl = `/koleksiyon/${collection.id}`;

  return (
    <Link
      href={collectionUrl}
      className="group relative block overflow-hidden rounded-2xl bg-[#F5EDE4] aspect-[4/3] sm:aspect-[3/4]"
    >
      <div className="relative h-full w-full">
        <Image
          src={collectionImage}
          alt={collectionTitle}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#5C4638]/85 via-[#5C4638]/35 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <h3 className="mb-2 font-serif text-xl tracking-tight text-white sm:text-2xl lg:text-3xl">
          {collectionTitle}
        </h3>
        {collectionDescription && (
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-white/85 sm:mb-4">
            {collectionDescription}
          </p>
        )}
        <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/90 transition-all group-hover:gap-3">
          Koleksiyonu İncele
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </span>
      </div>
    </Link>
  );
}

export default function CollectionsPage() {
  const { collection: collections, isLoading } = useRaxon();

  if (isLoading) {
    return (
      <div className="bg-[#F8F1E9]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-[#8B6B57]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
            <span className="text-xs tracking-[0.15em] uppercase">Koleksiyonlar yükleniyor…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F1E9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="pb-10 pt-4 sm:pb-14 sm:pt-6">
          <div className="mb-8 sm:mb-10">
            <p className="text-[10px] tracking-[0.38em] uppercase text-[#A17E65]">Koleksiyonlar</p>
            <h1 className="mt-2 font-serif text-3xl tracking-tight text-[#5C4638] sm:text-4xl lg:text-5xl">
              İmza Serilerimiz
            </h1>
            {collections.length > 0 && (
              <p className="mt-3 text-sm text-[#8B6B57]">
                {collections.length} koleksiyon bulundu
              </p>
            )}
          </div>

          {collections.length === 0 ? (
            <div className="py-16 text-center sm:py-20">
              <p className="mb-4 text-lg text-[#8B6B57]">Koleksiyon bulunamadı</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#5C4638] transition-colors hover:text-[#A17E65]"
              >
                Ana sayfaya dön <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
