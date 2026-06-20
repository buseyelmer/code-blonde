'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRaxon } from '@raxonltd/raxon-core';

export function SectionHomeCategory() {
  const { category } = useRaxon();

  const categories = category.map(cat => ({
    id: cat.id,
    name: cat.name?.getName?.() || 'Kategori',
    image: cat.coverMedia?.relativePath ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cat.coverMedia.relativePath}` : 'https://placehold.co/600x600',
    count: (cat as any)._count?.products || 0,
    link: `/urunler?category=${cat.id}`,
  }));

  if (categories.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight mb-4">Kategoriler</h2>
          <p className="text-sm text-neutral-600 max-w-2xl mx-auto">Her zevke ve ihtiyaca uygun, özenle seçilmiş iç çamaşırı koleksiyonumuzu keşfedin</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map(category => (
            <Link key={category.id} href={category.link} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src={category.image} alt={category.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 from-0% to-transparent to-[36%]" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl font-semibold tracking-tight mb-1">{category.name}</h3>
                <p className="text-white/80 text-[12px]">{category.count} Ürün</p>
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={18} className="text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
