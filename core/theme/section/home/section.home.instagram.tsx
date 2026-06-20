'use client';

import { useRaxon } from '@raxonltd/raxon-core';

export function SectionHomeInstagram() {
  const { feed } = useRaxon()

  const instagramPosts = feed?.slice(0, 6) || [];

  if (instagramPosts.length === 0) return null;

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight mb-4">@bulutofficial</h2>
          <p className="text-sm text-neutral-600">Bizi Instagram&apos;da takip edin, #bulut etiketiyle paylaşın</p>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-4">
          {instagramPosts.map((feed, index) => (
            <div key={index} className="relative aspect-[3/4] bg-gradient-to-br from-rose-100 to-pink-200 rounded-lg overflow-hidden group cursor-pointer">
              <img src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${feed.media?.relativePath}`} alt={feed.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
