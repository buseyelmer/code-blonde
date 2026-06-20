'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRaxon } from '@raxonltd/raxon-core';
import { Collection, MediaRelated } from '@raxonltd/raxon-core/interface/prisma.interface';
import first from 'lodash/first';

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

  const collectionImage = defaultMedia ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${defaultMedia}` : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop';
  
  const collectionUrl = `/koleksiyon/${collection.id}`;

  return (
    <Link href={collectionUrl} className="group relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[4/3] block">
      <div className="relative w-full h-full">
        <Image
          src={collectionImage}
          alt={collectionTitle}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>
      
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl mb-2">
          {collectionTitle}
        </h3>
        {collectionDescription && (
          <p className="text-sm text-white/90 line-clamp-2 mb-4">
            {collectionDescription}
          </p>
        )}
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
          Koleksiyonu İncele
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

export default function CollectionsPage() {
  const { collection: collections, isLoading } = useRaxon();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl mb-2">
              Koleksiyonlar
            </h1>
            {collections.length > 0 && (
              <p className="text-sm text-neutral-600">
                {collections.length} koleksiyon bulundu
              </p>
            )}
          </div>

          {collections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-neutral-600 mb-4">Koleksiyon bulunamadı</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-neutral-700"
              >
                Ana sayfaya dön <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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

