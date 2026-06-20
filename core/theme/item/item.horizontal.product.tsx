'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Product } from '@raxonltd/raxon-core/interface/product.interface';

interface ItemProductProps {
  product: Product;
}

function getUniqueOptions(product: Product, optionKey: 'attributeOption1' | 'attributeOption2') {
  const seen = new Set<string>();
  return (
    product.variant
      ?.map(v => v[optionKey])
      .filter(opt => {
        if (!opt || seen.has(opt.id)) return false;
        seen.add(opt.id);
        return true;
      }) || []
  );
}

function isVariantAvailable(product: Product, option1Id?: string, option2Id?: string) {
  return product.variant?.some(v => {
    const match1 = !option1Id || v.attributeOption1?.id === option1Id;
    const match2 = !option2Id || v.attributeOption2?.id === option2Id;
    return match1 && match2 && v.stock > 0;
  });
}

export default function ItemProduct({ product }: ItemProductProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const selectedVariant = useMemo(() => {
    if (!selectedVariantId) return null;
    return product.variant?.find(v => v.id === selectedVariantId);
  }, [product.variant, selectedVariantId]);

  const productTitle = product.name;
  const price = selectedVariant?.price?.mainPrice || product.price?.mainPrice || 0;
  const discountPrice = selectedVariant?.price?.discountPrice || product.price?.discountPrice;
  const bestPrice = discountPrice && discountPrice > 0 ? discountPrice : price;
  const hasDiscount = discountPrice && discountPrice > 0 && discountPrice < price;
  const discountPct = hasDiscount ? Math.round(((price - discountPrice!) / price) * 100) : 0;
  const productUrl = `/urunler/${product.id}`;
  const isNew = product.createdAt ? Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 : false;
  const hasVariants = product.variant && product.variant.length > 0;
  const option1List = hasVariants ? getUniqueOptions(product, 'attributeOption1') : [];
  const option2List = hasVariants ? getUniqueOptions(product, 'attributeOption2') : [];

  // Rozet belirleme
  let badge = null;
  if (isNew) badge = { text: 'Yeni', color: 'bg-green-500' };
  else if (hasDiscount) badge = { text: `%${discountPct}`, color: 'bg-red-500' };
  else if (product.tags?.includes('BESTSELLER')) badge = { text: 'Çok Satan', color: 'bg-rose-900' };
  else if (product.tags?.includes('PREMIUM')) badge = { text: 'Premium', color: 'bg-purple-500' };

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Beğeni fonksiyonu - gerekirse context'e bağlanabilir
  };

  const selectVariant = (e: React.MouseEvent, optionId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const currentVariant = selectedVariant;

    const matchingVariant = product.variant?.find(v => {
      return (
        (v.attributeOption1?.id === optionId || v.attributeOption2?.id === optionId) &&
        (currentVariant ? v.attributeOption1?.id === currentVariant.attributeOption1?.id || v.attributeOption2?.id === currentVariant.attributeOption2?.id || v.attributeOption1?.id === optionId || v.attributeOption2?.id === optionId : true)
      );
    });

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
    }
  };

  const formatTRY = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);

  const listImageUrl = product.images?.[0]?.relativePath ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${product.images[0].relativePath}` : 'https://placehold.co/360x440';

  return (
    <Link href={productUrl} className="group flex gap-6 border-b border-gray-100 py-8 transition-colors hover:bg-gray-50/50 rounded-xl px-4">
      <div className="relative h-44 w-36 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
        <Image src={listImageUrl} alt={productTitle} fill sizes="144px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        {badge && <span className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-medium rounded-full text-white ${badge.color}`}>{badge.text}</span>}
      </div>
      <div className="flex flex-1 flex-col justify-center min-w-0">
        <h3 className="font-serif text-xl md:text-2xl text-gray-900 leading-tight line-clamp-2 group-hover:text-rose-900 transition-colors">{productTitle}</h3>
        {product.review?.count > 0 && (
          <div className="mt-2 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < Math.floor(product.review?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.review?.count})</span>
          </div>
        )}

        {/* Varyant Seçimi - Liste */}
        {hasVariants && (
          <div className="mt-3 space-y-2">
            {option1List.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {option1List.map(opt => {
                  const isSelected = selectedVariant?.attributeOption1?.id === opt.id;
                  const isAvailable = isVariantAvailable(product, opt.id, selectedVariant?.attributeOption2?.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={e => selectVariant(e, opt.id)}
                      disabled={!isAvailable}
                      className={`min-w-[3rem] px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                        isSelected ? 'bg-rose-900 text-white border-rose-900' : isAvailable ? 'bg-white text-gray-700 border-gray-200 hover:border-rose-900' : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
            {option2List.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {option2List.map(opt => {
                  const isSelected = selectedVariant?.attributeOption2?.id === opt.id;
                  const isAvailable = isVariantAvailable(product, selectedVariant?.attributeOption1?.id, opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={e => selectVariant(e, opt.id)}
                      disabled={!isAvailable}
                      className={`min-w-[3rem] px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                        isSelected ? 'bg-rose-900 text-white border-rose-900' : isAvailable ? 'bg-white text-gray-700 border-gray-200 hover:border-rose-900' : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="mt-2 flex items-baseline gap-3">
          <p className="text-base font-bold text-gray-900">{bestPrice ? (bestPrice as any).toTry() : formatTRY(0)}</p>
          {hasDiscount && price > bestPrice && <p className="text-sm text-gray-400 line-through">{price ? (price as any).toTry() : formatTRY(0)}</p>}
        </div>

        {selectedVariant && <p className="mt-1 text-sm text-gray-500">Stok: {selectedVariant.stock} adet</p>}

        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-rose-900 group-hover:gap-3 transition-all">
          İncele <span className="w-4 h-4">→</span>
        </span>
      </div>
    </Link>
  );
}
