"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import { useInView } from "@/core/hook/use.in-view";
import { useProductCart } from "@/core/hook/use.product.cart";
import { useProductFavorite } from "@/core/hook/use.product.favorite";
import { getDefaultProductUnitId, getDefaultVariantId } from "@/core/util/cart.insert";
import { getProductPriceInfo } from "@/core/util/product.price";
import { getProductListingImageUrl } from "@/core/util/product.image";
import "@/core/util/util";

interface Props {
  product: Product;
  index?: number;
}

export default function ItemListingProduct({ product, index = 0 }: Props) {
  const instantReveal = index < 12;
  const { ref, inView } = useInView({ disabled: instantReveal });
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedProductUnitId, setSelectedProductUnitId] = useState<string | null>(null);
  const [isResolvingCart, setIsResolvingCart] = useState(false);
  const { cart, addProduct, setProductQuantity, removeItem, isCartBusy } = useProductCart();
  const { isFavorite, toggle: toggleFavorite, isPending: isTogglingFavorite } = useProductFavorite(
    product.id,
    product.isFavorite ?? false,
  );

  useEffect(() => {
    const variantId = getDefaultVariantId(product);
    setSelectedVariantId(variantId);
    setSelectedProductUnitId(variantId ? null : getDefaultProductUnitId(product));
  }, [product.id, product.variant, product.productUnit]);

  const { price, bestPrice, hasDiscount, stock } = useMemo(
    () => getProductPriceInfo(product, selectedVariantId),
    [product, selectedVariantId],
  );


  const canAddToCart = bestPrice > 0;

  const cartItem = useMemo(
    () =>
      cart?.items?.find((item) => {
        if (item.productId !== product.id) return false;
        if (selectedVariantId) return item.variant?.id === selectedVariantId;
        if (selectedProductUnitId) return item.productUnit?.id === selectedProductUnitId;
        return !item.variant?.id;
      }),
    [cart?.items, product.id, selectedVariantId, selectedProductUnitId],
  );

  const cartQuantity = cartItem?.quantity ?? 0;
  const isInCart = cartQuantity > 0;
  const isBusy = isCartBusy || isResolvingCart;

  const primaryUrl = useMemo(
    () => getProductListingImageUrl(product, 0, selectedVariantId),
    [product, selectedVariantId],
  );
  const secondaryUrl = useMemo(() => {
    const url = getProductListingImageUrl(product, 1, selectedVariantId);
    return url !== primaryUrl ? url : null;
  }, [product, primaryUrl, selectedVariantId]);

  const categoryName = product.categories?.[0]?.name ?? "";
  const productUrl = `/urunler/${product.id}`;
  const visible = instantReveal || inView;
  const maxQuantity = stock > 0 ? stock : 10;

  const handleAddToCart = async () => {
    if (!canAddToCart || isInCart || isBusy) return;

    setIsResolvingCart(true);
    try {
      const ok = await addProduct(product, 1, {
        variantId: selectedVariantId,
        productUnitId: selectedProductUnitId,
        linePay: bestPrice,
      });
      if (!ok) return;
      if (!selectedVariantId && !selectedProductUnitId) {
        const variantId = getDefaultVariantId(product);
        const productUnitId = variantId ? null : getDefaultProductUnitId(product);
        if (variantId) setSelectedVariantId(variantId);
        if (productUnitId) setSelectedProductUnitId(productUnitId);
      }
    } finally {
      setIsResolvingCart(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    if (!canAddToCart || isBusy || !cartItem) return;

    const newQty = cartQuantity + delta;
    if (newQty > maxQuantity) return;

    if (newQty < 1) {
      removeItem(cartItem.id);
      return;
    }

    void setProductQuantity(
      product,
      cartItem,
      newQty,
      {
        variantId: selectedVariantId,
        productUnitId: selectedProductUnitId,
      },
    );
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: visible ? `${Math.min(index * 40, 280)}ms` : "0ms" }}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-sm border border-[#D9C5B0]/40 bg-[#FDFAF6] shadow-[0_1px_3px_rgba(92,70,56,0.04)] transition-all duration-500 hover:border-[#C9A99A]/70 hover:shadow-[0_8px_24px_rgba(92,70,56,0.07)]">
        <div className="relative px-4 pb-2 pt-5 sm:px-5 sm:pt-6">
          <button
            type="button"
            onClick={toggleFavorite}
            disabled={isTogglingFavorite}
            aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
            className={`absolute right-6 top-7 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition sm:right-7 sm:top-8 ${
              isFavorite
                ? "border-[#5C4638] bg-[#5C4638] text-[#F8F1E9]"
                : "border-[#D9C5B0]/80 bg-[#FDFAF6]/95 text-[#5C4638] hover:border-[#A17E65]"
            } disabled:opacity-60`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} strokeWidth={1.5} />
          </button>

          <Link href={productUrl} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#F5EDE4]/60">
              <div className="absolute inset-0 p-4 sm:p-5">
                <Image
                  src={primaryUrl}
                  alt={product.name}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className={`object-contain object-center transition-all duration-700 ease-out ${
                    secondaryUrl ? "group-hover:opacity-0" : "group-hover:scale-[1.03]"
                  }`}
                />
              </div>
              {secondaryUrl && (
                <div className="absolute inset-0 p-4 opacity-0 transition-opacity duration-700 group-hover:opacity-100 sm:p-5">
                  <Image
                    src={secondaryUrl}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-contain object-center"
                    aria-hidden
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col px-0 pt-3 sm:pt-4">
            {categoryName && (
              <p className="mb-2 text-[9px] tracking-[0.35em] uppercase text-[#A17E65]/90">{categoryName}</p>
            )}
            <h3 className="font-serif text-base leading-[1.3] tracking-[-0.01em] text-[#5C4638] transition-colors duration-300 group-hover:text-[#A17E65] sm:text-lg">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2.5 pt-3">
              {bestPrice > 0 ? (
                <>
                  <span className="font-mono text-[13px] tabular-nums tracking-tight text-[#A17E65]">
                    {bestPrice.toTry()}
                  </span>
                  {hasDiscount && (
                    <span className="font-mono text-[11px] tabular-nums text-[#8B6B57]/50 line-through">
                      {price.toTry()}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[11px] tracking-wide text-[#8B6B57]/70">Fiyat bilgisi yok</span>
              )}
            </div>
            </div>
          </Link>
        </div>

        <div className="mt-auto px-4 pb-5 pt-3 sm:px-5 sm:pb-6">
          {isInCart ? (
            <div className="flex w-full items-center border border-[#D9C5B0]/80 bg-[#F8F1E9]">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={isBusy}
                aria-label="Adedi azalt"
                className="flex h-10 flex-1 cursor-pointer items-center justify-center text-[#5C4638] transition hover:bg-[#F5EDE4] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <span className="flex h-10 min-w-[2.5rem] items-center justify-center border-x border-[#D9C5B0]/80 px-2 font-mono text-sm tabular-nums text-[#5C4638]">
                {isBusy ? (
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
                ) : (
                  cartQuantity
                )}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={isBusy || cartQuantity >= maxQuantity}
                aria-label="Adedi artır"
                className="flex h-10 flex-1 cursor-pointer items-center justify-center text-[#5C4638] transition hover:bg-[#F5EDE4] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void handleAddToCart()}
              disabled={!canAddToCart || isBusy}
              className="flex w-full cursor-pointer items-center justify-center gap-2 border border-[#5C4638]/30 py-2.5 text-[9px] tracking-[0.28em] uppercase text-[#5C4638] transition-colors hover:border-[#5C4638] hover:bg-[#5C4638] hover:text-[#F8F1E9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isCartBusy ? (
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Sepete Ekle
                </>
              )}
            </button>
          )}
        </div>
      </article>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm border border-[#D9C5B0]/30 bg-[#FDFAF6] shadow-[0_1px_3px_rgba(92,70,56,0.04)]">
      <div className="px-5 pt-6">
        <div className="aspect-[4/5] animate-pulse rounded-sm bg-[#F0E8DE]/80" />
      </div>
      <div className="space-y-3 px-5 pb-6 pt-4">
        <div className="h-2 w-14 animate-pulse bg-[#EDE0D1]/80" />
        <div className="h-5 w-4/5 animate-pulse bg-[#EDE0D1]/80" />
        <div className="h-4 w-16 animate-pulse bg-[#EDE0D1]/60" />
        <div className="mt-2 h-10 animate-pulse bg-[#EDE0D1]/60" />
      </div>
    </div>
  );
}

export function ProductListingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}
