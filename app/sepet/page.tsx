'use client';

import React from 'react';
import { Button } from 'rizzui/button';
import { useRaxon } from '@raxonltd/raxon-core';
import { useCart } from '@raxonltd/raxon-core/hook';
import { InputQuantity } from '@/core/component/input.quantity';
import { GeneralImage } from '@raxonltd/raxon-core/component'
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { BasketItemSummaryInterface } from '@raxonltd/raxon-core/interface/basket.interface';
import { formatBasketItemVariantLine } from '@/core/util/basket.item.display';

export default function CartPage() {
  const { cart, cartLoading } = useRaxon();
  const cartApi = useCart();
  const { mutate: insertCart, isPending: isInsertPending } = cartApi.insert();
  const { mutate: removeCartItem, isPending: isRemovePending } = cartApi.remove();
  const router = useRouter();

  const handleQuantityChange = (item: BasketItemSummaryInterface, newQuantity: number) => {
    const productId = item.productId ?? item.product?.id;
    const variantId = item.variantId ?? item.variant?.id;
    if (!productId || !variantId) return;

    const maxQty = item.stock > 0 ? item.stock : newQuantity;
    const clamped = Math.max(1, Math.min(newQuantity, maxQty));
    if (clamped === item.quantity) return;

    insertCart({
      productId,
      variantId,
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

  const totalPrice = cart?.info?.payPrice.pay || 0;
  const itemCount = cart?.items?.length || 0;
  const isEmpty = !cartLoading && (!cart || !cart.items || cart.items.length === 0);

  if (isEmpty) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white px-4 py-16 sm:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-white">
            <ShoppingBag className="h-10 w-10 text-gray-400" strokeWidth={1.5} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">Sepetiniz boş</h2>
          <p className="mb-8 max-w-sm text-sm leading-relaxed text-gray-600">Sepetinize ürün ekleyerek alışverişe başlayın.</p>
          <Link href="/urunler" className="inline-flex items-center gap-2 rounded-lg bg-rose-900 px-6 py-4 text-sm font-medium uppercase tracking-wide text-white shadow-md transition hover:bg-rose-800 hover:shadow-lg">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            Alışverişe başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8 lg:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sepetim</h1>
          </div>
          <Link href="/urunler" className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-gray-900 hover:text-rose-900 transition-colors w-fit">
            Alışverişe devam et
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
          <div className="rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="p-4 sm:p-6">
              {cartLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-rose-900" />
                  <p className="mt-4 text-sm text-gray-600">Yükleniyor...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(cart?.items ?? []).map((item: BasketItemSummaryInterface) => {
                    const variantLine = formatBasketItemVariantLine(item);
                    const linePay = item.linePay ?? (item.lineTotal != null ? (item.lineTotal ?? 0) + (item.lineTax ?? 0) : null);
                    const listGross = (item.lineTotal ?? 0) + (item.lineTax ?? 0);
                    const showListStrike = linePay != null && listGross - linePay > 0.01;
                    return (
                      <div key={item.id} className="group flex gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300">
                        <Link href={item.productId ? `/urunler/${item.productId}` : '#'} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-28">
                          {item.images ? (
                            <GeneralImage src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.images[0]}`} alt={item.product.name} fill objectFit="cover" className="rounded-xl" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <ShoppingBag className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
                            </div>
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <Link href={item.productId ? `/urunler/${item.productId}` : '#'} className="block">
                              <h3 className="text-base font-semibold text-gray-900 leading-snug transition-colors hover:text-rose-900 line-clamp-2">{item.product.name}</h3>
                            </Link>
                            {variantLine ? <p className="mt-1.5 text-[12px] font-medium text-gray-500">{variantLine}</p> : null}
                          </div>
                          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <InputQuantity quantity={item.quantity} onChange={newQuantity => handleQuantityChange(item, newQuantity)} disabled={isInsertPending || isRemovePending} min={1} max={item.stock > 0 ? item.stock : undefined} />
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item)}
                                disabled={isRemovePending}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all hover:border-rose-900 hover:bg-rose-50 hover:text-rose-900 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Ürünü kaldır"
                              >
                                <Trash2 className="h-4 w-4" strokeWidth={2} />
                              </button>
                            </div>
                            <div className="text-right">
                              {linePay == null ? (
                                <p className="text-sm font-medium text-gray-400">Fiyat bilgisi yok</p>
                              ) : (
                                <>
                                  <div className="flex flex-wrap items-center justify-end gap-2">
                                    {showListStrike ? <span className="text-sm text-gray-400 line-through tabular-nums leading-none">{listGross.toTry()}</span> : null}
                                    <p className="text-lg font-bold text-gray-900 leading-none tabular-nums">{linePay.toTry()}</p>
                                  </div>
                                  {item.basePrice != null && item.basePrice !== undefined ? <p className="mt-1.5 text-xs font-medium text-gray-500 tabular-nums">Birim: {item.basePrice.toTry()}</p> : null}
                                </>
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
          </div>

          {cart && cart.items && cart.items.length > 0 && (
            <div className="h-fit lg:sticky lg:top-24">
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6">
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500 mb-6">Sipariş özeti</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Ara toplam</span>
                    <span className="text-gray-900 font-semibold tabular-nums">{cart.info?.basePrice.total ? cart.info.basePrice.total.toTry() : '0,00 ₺'}</span>
                  </div>
                  {cart.info?.tax && cart.info.tax.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">KDV</span>
                      <span className="text-gray-900 font-semibold tabular-nums">{cart.info.tax.reduce((acc, curr) => acc + curr.tax, 0).toTry()}</span>
                    </div>
                  )}
                  {cart.info?.delivery?.pay && cart.info.delivery.pay > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">Kargo</span>
                      <span className="text-gray-900 font-semibold tabular-nums">{cart.info.delivery.pay.toTry()}</span>
                    </div>
                  )}
                  {cart.info?.discount?.pay && cart.info.discount.pay > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-red-600">İndirim</span>
                      <span className="font-semibold text-red-600 tabular-nums">-{cart.info.discount.pay.toTry()}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-5 pb-6">
                  <span className="text-base font-semibold text-gray-900">Toplam</span>
                  <span className="text-2xl font-bold text-gray-900 tabular-nums">{totalPrice.toTry()}</span>
                </div>

                <Button onClick={handleCheckout} className="w-full rounded-lg bg-rose-900 py-4 px-6 text-sm font-medium uppercase tracking-wide text-white shadow-md transition hover:bg-rose-800 hover:shadow-lg">
                  Ödemeye geç
                </Button>

                <div className="mt-5 text-center">
                  <Link href="/urunler" className="group inline-flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-gray-600 hover:text-rose-900 transition-colors">
                    Alışverişe devam et
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
