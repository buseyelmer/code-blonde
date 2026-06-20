'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@raxonltd/raxon-core/interface/product.interface';
import { useCart } from '@raxonltd/raxon-core/hook';
import { useFavorite } from '@raxonltd/raxon-core/hook';
import { useNewsletter } from '@raxonltd/raxon-core/hook';
import { useRaxon } from '@raxonltd/raxon-core';

interface ItemProductProps {
  product: Product;
}

function getUniqueOptions(product: Product, optionKey: 'attributeOption1' | 'attributeOption2') {
  const seen = new Set<string>();
  return product.variant
    ?.map(v => v[optionKey])
    .filter(opt => {
      if (!opt || seen.has(opt.id)) return false;
      seen.add(opt.id);
      return true;
    }) || [];
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
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const { mutate: insertCart, isPending: isAddingToCart } = useCart().insert();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useFavorite().toggle();
  const { subscribeByVariant: subscribeByVariantMutation } = useNewsletter();
  const { cart } = useRaxon();
  const { modalAuthRef, isAuthenticated } = useRaxon();

  // İlk stokta olan variant'ı varsayılan olarak seç
  useEffect(() => {
    if (product.variant && product.variant.length > 0 && !selectedVariantId) {
      const defaultVariant = product.variant.find(v => v.stock > 0);
      if (defaultVariant) {
        setSelectedVariantId(defaultVariant.id);
      }
    }
  }, [product.id, product.variant, selectedVariantId]);

  const selectedVariant = useMemo(() => {
    if (!selectedVariantId) return null;
    return product.variant?.find(v => v.id === selectedVariantId);
  }, [product.variant, selectedVariantId]);

  const isInCart = useMemo(() => {
    return cart?.items?.some(item => item.productId === product.id && item.variant?.id === selectedVariantId);
  }, [cart, product.id, selectedVariantId]);

  const isFavorite = product.isFavorite ?? false;

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
  if (isNew) badge = { text: 'Yeni', color: 'bg-green-700' };
  else if (hasDiscount) badge = { text: `%${discountPct}`, color: 'bg-red-600' };
  else if (product.tags?.includes('BESTSELLER')) badge = { text: 'Çok Satan', color: 'bg-rose-900' };
  else if (product.tags?.includes('PREMIUM')) badge = { text: 'Premium', color: 'bg-purple-700' };

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      modalAuthRef.current?.open();
      return;
    }

    if (!product.id || isTogglingFavorite) return;
    toggleFavorite({ productId: product.id });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedVariantId || isInCart || isAddingToCart) return;

    insertCart({
      productId: product.id,
      variantId: selectedVariantId,
      quantity: 1,
      type: 'increment',
      deposit: 'disable',
    });
  };

  const selectVariant = (e: React.MouseEvent, optionId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const currentVariant = selectedVariant;

    const matchingVariant = product.variant?.find(v => {
      return (v.attributeOption1?.id === optionId || v.attributeOption2?.id === optionId) &&
        (currentVariant ?
          (v.attributeOption1?.id === currentVariant.attributeOption1?.id ||
           v.attributeOption2?.id === currentVariant.attributeOption2?.id ||
           v.attributeOption1?.id === optionId ||
           v.attributeOption2?.id === optionId) : true);
    });

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
    }
  };

  const handleNotifyWhenAvailable = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedVariantId) return;

    if (!email || !email.includes('@')) {
      setShowEmailInput(true);
      return;
    }

    await subscribeByVariantMutation.mutateAsync({
      variantId: selectedVariantId,
      email,
    });
  };

  const formatTRY = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);



    const gridImageUrl = product.images?.[0]?.relativePath ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${product.images[0].relativePath}` : 'https://placehold.co/600x800';

    return (
      <Link href={productUrl} key={product.id} className="group flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-4 shrink-0">
          <Image src={gridImageUrl} alt={productTitle} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          {badge && <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full z-10 text-white ${badge.color}`}>{badge.text}</span>}

          <button
            onClick={e => toggleLike(e)}
            disabled={isTogglingFavorite}
            aria-label={isFavorite ? `${productTitle} favorilerden çıkar` : `${productTitle} favorilere ekle`}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all z-10 ${isFavorite ? 'bg-rose-900' : 'bg-white'}`}
          >
            <Heart size={18} className={isFavorite ? 'text-white fill-white' : 'text-gray-600'} />
          </button>

          {/* Quick Add */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariantId || isInCart || isAddingToCart || bestPrice === 0}
              aria-label={isInCart ? `${productTitle} sepette` : `${productTitle} sepete ekle`}
              className={`w-full py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center justify-center gap-2 ${
                isInCart
                  ? 'bg-green-700 text-white cursor-default'
                  : bestPrice === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-900 hover:bg-rose-900 hover:text-white'
              }`}
            >
              {isAddingToCart ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : isInCart ? (
                <>
                  <Check size={18} />
                  <span>Sepette</span>
                </>
              ) : bestPrice === 0 ? (
                <>
                  <ShoppingBag size={18} />
                  <span>Fiyat Bilgisi Yok</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Sepete Ekle</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-grow space-y-2">
          {product.review?.count > 0 && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < Math.floor(product.review?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.review?.count})</span>
            </div>
          )}

          <h3 className="font-medium text-gray-900 group-hover:text-rose-900 transition-colors line-clamp-1">{productTitle}</h3>

          {/* Varyant Seçimi */}
          {hasVariants && (
            <div className="space-y-2 pt-1">
              {option1List.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {option1List.map(opt => {
                    const isSelected = selectedVariant?.attributeOption1?.id === opt.id;
                    const isAvailable = isVariantAvailable(product, opt.id, selectedVariant?.attributeOption2?.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={e => selectVariant(e, opt.id)}
                        disabled={!isAvailable}
                        className={`min-w-[2.5rem] px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
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
                <div className="flex flex-wrap gap-1.5">
                  {option2List.map(opt => {
                    const isSelected = selectedVariant?.attributeOption2?.id === opt.id;
                    const isAvailable = isVariantAvailable(product, selectedVariant?.attributeOption1?.id, opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={e => selectVariant(e, opt.id)}
                        disabled={!isAvailable}
                        className={`min-w-[2.5rem] px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
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

          <div className="mt-auto pt-2">
            {bestPrice > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{formatTRY(bestPrice)}</span>
                  {hasDiscount && price > bestPrice && <span className="text-sm text-gray-400 line-through">{formatTRY(price)}</span>}
                </div>
                {selectedVariant && <p className="text-xs text-gray-500 mt-1">Stok: {selectedVariant.stock} adet</p>}
              </>
            ) : showEmailInput ? (
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleNotifyWhenAvailable}
                    disabled={subscribeByVariantMutation.isPending || !email.includes('@')}
                    className="flex-1 py-2 rounded-lg font-medium bg-rose-900 text-white hover:bg-rose-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscribeByVariantMutation.isPending ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto" />
                    ) : (
                      'Kaydet'
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowEmailInput(false);
                      setEmail('');
                    }}
                    className="px-3 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowEmailInput(true);
                }}
                className="w-full py-2 rounded-lg font-medium bg-rose-900 text-white hover:bg-rose-800 transition-colors text-sm"
              >
                Gelince Haber Ver
              </button>
            )}
          </div>
        </div>
      </Link>
    );
}
