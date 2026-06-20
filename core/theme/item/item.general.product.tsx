import { useRaxon } from "@raxonltd/raxon-core";
import { useCart, useFavorite, useNewsletter } from "@raxonltd/raxon-core/hook";
import { useEffect, useMemo, useState } from "react";
import { Product } from "@raxonltd/raxon-core/interface/product.interface";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
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
  
export default function ItemProduct({ product }: { product: Product }) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [email, setEmail] = useState('');
    const { mutate: insertCart, isPending: isAddingToCart } = useCart().insert();
    const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useFavorite().toggle();
    const { subscribeByVariant: subscribeByVariantMutation } = useNewsletter();
    const { cart, modalAuthRef, isAuthenticated } = useRaxon();
  
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
        return (
          (v.attributeOption1?.id === optionId || v.attributeOption2?.id === optionId) &&
          (currentVariant
            ? v.attributeOption1?.id === currentVariant.attributeOption1?.id ||
              v.attributeOption2?.id === currentVariant.attributeOption2?.id ||
              v.attributeOption1?.id === optionId ||
              v.attributeOption2?.id === optionId
            : true)
        );
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
  
    const formatTRY = (amount: number) =>
      new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);
  
    const gridImageUrl = product.images?.[0]?.relativePath
      ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${product.images[0].relativePath}`
      : 'https://placehold.co/600x800';
  
    return (
      <Link href={productUrl} key={product.id} className="group flex h-full flex-col">
        <div className="relative mb-4 aspect-[3/4] shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={gridImageUrl}
            alt={productTitle}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {badge && (
            <span className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-medium text-white ${badge.color}`}>
              {badge.text}
            </span>
          )}
          <button
            onClick={toggleLike}
            disabled={isTogglingFavorite}
            aria-label={isFavorite ? `${productTitle} favorilerden çıkar` : `${productTitle} favorilere ekle`}
            className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-all hover:shadow-lg ${isFavorite ? 'bg-rose-900' : 'bg-white'}`}
          >
            <Heart size={18} className={isFavorite ? 'fill-white text-white' : 'text-gray-600'} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariantId || isInCart || isAddingToCart || bestPrice === 0}
              aria-label={isInCart ? `${productTitle} sepette` : `${productTitle} sepete ekle`}
              className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-medium shadow-lg transition-colors ${
                isInCart
                  ? 'cursor-default bg-green-700 text-white'
                  : bestPrice === 0
                    ? 'cursor-not-allowed bg-gray-300 text-gray-500'
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
  
        <div className="flex flex-grow flex-col space-y-2">
          {product.review?.count > 0 && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.review?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
              <span className="ml-1 text-xs text-gray-500">({product.review?.count})</span>
            </div>
          )}
  
          <h3 className="line-clamp-1 font-medium text-gray-900 transition-colors group-hover:text-rose-900">{productTitle}</h3>
  
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
                        className={`min-w-[2.5rem] rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-rose-900 bg-rose-900 text-white'
                            : isAvailable
                              ? 'border-gray-200 bg-white text-gray-700 hover:border-rose-900'
                              : 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
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
                        className={`min-w-[2.5rem] rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-rose-900 bg-rose-900 text-white'
                            : isAvailable
                              ? 'border-gray-200 bg-white text-gray-700 hover:border-rose-900'
                              : 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
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
                {selectedVariant && <p className="mt-1 text-xs text-gray-500">Stok: {selectedVariant.stock} adet</p>}
              </>
            ) : showEmailInput ? (
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-rose-900"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleNotifyWhenAvailable}
                    disabled={subscribeByVariantMutation.isPending || !email.includes('@')}
                    className="flex-1 rounded-lg bg-rose-900 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {subscribeByVariantMutation.isPending ? (
                      <span className="mx-auto inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      'Kaydet'
                    )}
                  </button>
                  <button
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowEmailInput(false);
                      setEmail('');
                    }}
                    className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowEmailInput(true);
                }}
                className="w-full rounded-lg bg-rose-900 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-800"
              >
                Gelince Haber Ver
              </button>
            )}
          </div>
        </div>
      </Link>
    );
  }
  