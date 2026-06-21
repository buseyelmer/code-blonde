'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useRaxon } from '@raxonltd/raxon-core';
import { useCart, useProduct } from '@raxonltd/raxon-core/hook';
import { Status } from '@raxonltd/raxon-core/interface/prisma.interface';
import type { BasketItemSummaryInterface } from '@raxonltd/raxon-core/interface/basket.interface';
import { InputQuantity } from '@/core/component/input.quantity';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { formatBasketItemVariantLine, getBasketItemDisplayName } from '@/core/util/basket.item.display';
import {
  buildProductMap,
  buildStorageImageUrl,
  getBasketItemImagePath,
  getBasketItemLinePay,
  getBasketItemUnitPrice,
} from '@/core/util/basket.enrichment';
import CartPromoCode from '@/core/component/cart.promo.code';
import { useCartPriceEnrichment } from '@/core/hook/use.cart.price.enrichment';
import { useCartPricing } from '@/core/hook/use.cart.pricing';
import '@/core/util/util';

export default function CartPage() {
  useCartPriceEnrichment();
  const { cart, cartLoading } = useRaxon();
  const cartApi = useCart();
  const { mutate: insertCart, isPending: isInsertPending } = cartApi.insert();
  const { mutate: removeCartItem, isPending: isRemovePending } = cartApi.remove();
  const router = useRouter();

  const { data: productList } = useProduct().fetch({
    materialType: 'product',
    status: Status.PUBLISHED,
    page: 1,
    amount: 200,
    enabled: (cart?.items?.length ?? 0) > 0,
  });

  const productMap = useMemo(() => buildProductMap(productList?.data), [productList?.data]);
  const { subtotal, discount, delivery, total: totalPrice } = useCartPricing();

  const getItemPricing = (item: BasketItemSummaryInterface) => {
    const product = productMap.get(item.productId);
    const unitPrice = getBasketItemUnitPrice(item, product);
    const linePay = getBasketItemLinePay(item, product);
    const listGross = (item.lineTotal ?? 0) + (item.lineTax ?? 0);
    const showListStrike = linePay != null && linePay > 0 && listGross - linePay > 0.01;

    return { linePay, unitPrice: unitPrice > 0 ? unitPrice : null, listGross, showListStrike };
  };

  const handleQuantityChange = (item: BasketItemSummaryInterface, newQuantity: number) => {
    const productId = item.productId ?? item.product?.id;
    const variantId = item.variantId ?? item.variant?.id;
    const productUnitId = item.productUnit?.id;
    if (!productId || (!variantId && !productUnitId)) return;

    const maxQty = item.stock > 0 ? item.stock : newQuantity;
    const clamped = Math.max(1, Math.min(newQuantity, maxQty));
    if (clamped === item.quantity) return;

    insertCart({
      productId,
      variantId: variantId ?? undefined,
      productUnitId: !variantId ? productUnitId : undefined,
      quantity: clamped,
      type: 'set',
      deposit: 'disable',
    });
  };

  const handleRemoveItem = (item: BasketItemSummaryInterface) => {
    if (!item.id) return;
    removeCartItem(item.id);
  };

  const handleCheckout = () => {
    router.push('/sepet/odeme');
  };

  if (cartLoading && !cart) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E9]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
      </div>
    );
  }

  const isEmpty = !cart?.items?.length;

  if (isEmpty) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E9] px-4 py-16 sm:py-24 text-[#5C4638]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#D9C5B0] bg-white/50 backdrop-blur-sm shadow-sm">
            <ShoppingBag className="h-10 w-10 text-[#A17E65]" strokeWidth={1} />
          </div>
          <h2 className="mb-3 font-serif text-3xl tracking-tight text-[#5C4638] sm:text-4xl">Sepetiniz boş</h2>
          <p className="mb-10 max-w-sm text-[15px] leading-relaxed text-[#8B6B57]">
            Code Blonde koleksiyonundan seçerek güzellik ritualinize başlayın.
          </p>
          <Link href="/urunler" className="inline-flex items-center gap-3 rounded-full bg-[#5C4638] px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-[#F8F1E9] shadow-lg transition-all hover:bg-black hover:shadow-xl active:scale-[0.98]">
            Koleksiyonu Keşfet
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-[#F8F1E9] text-[#5C4638] selection:bg-[#C9A99A] selection:text-[#F8F1E9]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-[4px] text-[#A17E65]">ALIŞVERİŞ ÇANTASI</div>
            <h1 className="font-serif text-4xl tracking-tight text-[#5C4638] sm:text-5xl">Sepetim</h1>
          </div>
          <Link href="/urunler" className="group inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#A17E65] transition-colors hover:text-[#5C4638]">
            Alışverişe devam et
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
          <div className="space-y-6">
            {cartLoading ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-[#D9C5B0]/50 bg-white/30 py-32">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
                <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#A17E65]">Yükleniyor...</p>
              </div>
            ) : (
              <div className="space-y-5">
                {(cart?.items ?? []).map((item: BasketItemSummaryInterface) => {
                  const product = productMap.get(item.productId);
                  const productName = getBasketItemDisplayName(item);
                  const variantLine = formatBasketItemVariantLine(item);
                  const { linePay, unitPrice, listGross, showListStrike } = getItemPricing(item);
                  const imageUrl = buildStorageImageUrl(getBasketItemImagePath(item, product));

                  return (
                    <div key={item.id} className="group flex gap-5 rounded-2xl border border-[#EDE0D1] bg-white p-5 transition-all duration-300 hover:border-[#C9A99A] hover:shadow-lg sm:gap-6">
                      <Link
                        href={item.productId ? `/urunler/${item.productId}` : '#'}
                        className="relative h-32 w-28 shrink-0 overflow-hidden rounded-xl bg-[#F8F1E9] sm:h-36 sm:w-32"
                      >
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={productName}
                            fill
                            unoptimized
                            sizes="128px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#F8F1E9]">
                            <ShoppingBag className="h-10 w-10 text-[#D9C5B0]" strokeWidth={1} />
                          </div>
                        )}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <Link href={item.productId ? `/urunler/${item.productId}` : '#'} className="block">
                              <h3 className="line-clamp-2 font-serif text-xl leading-tight text-[#5C4638] transition-colors hover:text-[#A17E65]">
                                {productName}
                              </h3>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item)}
                              disabled={isRemovePending}
                              className="text-[#A17E65] transition-colors hover:text-[#5C4638] disabled:opacity-30"
                              title="Ürünü kaldır"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </div>
                          {variantLine ? (
                            <p className="mt-2 text-[11px] font-medium uppercase tracking-widest text-[#A17E65]">{variantLine}</p>
                          ) : null}
                        </div>

                        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                          <InputQuantity
                            quantity={item.quantity}
                            onChange={(newQuantity) => handleQuantityChange(item, newQuantity)}
                            disabled={isInsertPending || isRemovePending}
                            min={1}
                            max={item.stock > 0 ? item.stock : undefined}
                            size="sm"
                          />
                          <div className="text-right">
                            {linePay == null ? (
                              <p className="text-xs uppercase tracking-widest text-[#A17E65]">Fiyat bilgisi yok</p>
                            ) : (
                              <div className="flex flex-col items-end">
                                <div className="flex items-center gap-3">
                                  {showListStrike ? (
                                    <span className="text-sm text-[#A17E65]/60 line-through tabular-nums">{listGross.toTry()}</span>
                                  ) : null}
                                  <p className="font-mono text-xl tabular-nums text-[#5C4638]">{linePay.toTry()}</p>
                                </div>
                                {unitPrice != null && unitPrice > 0 ? (
                                  <p className="mt-1 text-[10px] uppercase tracking-widest text-[#A17E65]">
                                    Birim: {unitPrice.toTry()}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {cart && cart.items && cart.items.length > 0 && (
            <div className="h-fit lg:sticky lg:top-28">
              <div className="rounded-[2rem] border border-[#D9C5B0]/50 bg-white/60 p-8 shadow-sm backdrop-blur-sm sm:p-10">
                <h2 className="mb-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A17E65]">Sipariş özeti</h2>

                <div className="mb-8 space-y-4">
                  <div className="flex justify-between text-sm tracking-tight">
                    <span className="text-[#8B6B57]">Ara toplam</span>
                    <span className="font-mono tabular-nums text-[#5C4638]">{subtotal > 0 ? subtotal.toTry() : '0,00 ₺'}</span>
                  </div>
                  {cart.info?.tax && cart.info.tax.length > 0 && (
                    <div className="flex justify-between text-sm tracking-tight">
                      <span className="text-[#8B6B57]">KDV</span>
                      <span className="font-mono tabular-nums text-[#5C4638]">
                        {cart.info.tax.reduce((acc, curr) => acc + curr.tax, 0).toTry()}
                      </span>
                    </div>
                  )}
                  {delivery > 0 && (
                    <div className="flex justify-between text-sm tracking-tight">
                      <span className="text-[#8B6B57]">Kargo</span>
                      <span className="font-mono tabular-nums text-[#5C4638]">{delivery.toTry()}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm tracking-tight">
                      <span className="text-[#A17E65]">
                        {cart.promoCode?.code ? `Promosyon (${cart.promoCode.code})` : "İndirim"}
                      </span>
                      <span className="font-mono tabular-nums text-[#A17E65]">-{discount.toTry()}</span>
                    </div>
                  )}
                </div>

                <CartPromoCode />

                <div className="flex items-center justify-between border-t border-[#D9C5B0]/40 pb-8 pt-6">
                  <span className="text-sm uppercase tracking-[0.2em] text-[#5C4638]">Toplam</span>
                  <span className="font-serif text-3xl tabular-nums text-[#5C4638]">{totalPrice.toTry()}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full rounded-full bg-[#5C4638] px-8 py-5 text-sm font-medium uppercase tracking-[0.25em] text-[#F8F1E9] shadow-lg transition-all hover:bg-black hover:shadow-xl active:scale-[0.985]"
                >
                  Ödemeye geç
                </button>

                <div className="mt-8 text-center">
                  <Link href="/urunler" className="group inline-flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#A17E65] transition-colors hover:text-[#5C4638]">
                    Alışverişe devam et
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 border-t border-[#D9C5B0]/20 pt-6 text-[9px] uppercase tracking-[0.15em] text-[#A17E65]/70">
                  <span>Güvenli Ödeme</span>
                  <div className="h-1 w-1 rounded-full bg-[#D9C5B0]" />
                  <span>30 Gün İade</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
