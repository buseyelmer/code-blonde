'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRaxon } from '@raxonltd/raxon-core';
import { Product } from '@raxonltd/raxon-core/interface/product.interface';
import ItemProduct from '@/core/theme/item/item.sqaure.product';

export function SectionHomeFeatureProduct() {
  const { product } = useRaxon();

  const featuredProducts = (product as Product[])?.slice(0, 8) || [];

  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-sm text-neutral-600">Müşterilerimizin en çok sevdiği ürünler</p>
          </div>
          <Link href="/urunler" className="text-[12px] font-semibold uppercase tracking-[0.22em] text-neutral-600 transition hover:text-neutral-900 flex items-center gap-2 hover:gap-3">
            Tümünü Gör
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map(product => (
            <ItemProduct key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
