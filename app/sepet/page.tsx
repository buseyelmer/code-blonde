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
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E9] px-4 py-16 sm:py-24 text-[#5C4638]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#D9C5B0] bg-white/50 backdrop-blur-sm shadow-sm">
            <ShoppingBag className="h-10 w-10 text-[#A17E65]" strokeWidth={1} />
          </div>
          <h2 className="mb-3 font-serif text-3xl tracking-tight text-[#5C4638] sm:text-4xl">Sepetiniz boş</h2>
          <p className="mb-10 max-w-sm text-[15px] leading-relaxed text-[#8B6B57]">Sepetinize zarif bir nude seçerek alışverişe başlayın.</p>
          <Link href="/urunler" className="inline-flex items-center gap-3 rounded-full bg-[#5C4638] px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-[#F8F1E9] shadow-lg transition-all hover:bg-black hover:shadow-xl active:scale-[0.98]">
            Koleksiyonu Keşfet
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F1E9] text-[#5C4638] overflow-x-hidden selection:bg-[#C9A99A] selection:text-[#F8F1E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12 lg:mb-16">
          <div>
            <div className="text-[10px] tracking-[4px] text-[#A17E65] mb-2 uppercase">ALIŞVERİŞ ÇANTASI</div>
            <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-[#5C4638]">Sepetim</h1>
          </div>
          <Link href="/urunler" className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#A17E65] hover:text-[#5C4638] transition-colors w-fit">
            Alışverişe devam et
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
          <div className="space-y-6">
            {cartLoading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white/30 rounded-3xl border border-[#D9C5B0]/50">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
                <p className="mt-6 text-xs tracking-[0.2em] text-[#A17E65] uppercase">Yükleniyor...</p>
              </div>
            ) : (
              <div className="space-y-5">
                {(cart?.items ?? []).map((item: BasketItemSummaryInterface) => {
                  const variantLine = formatBasketItemVariantLine(item);
                  const linePay = item.linePay ?? (item.lineTotal != null ? (item.lineTotal ?? 0) + (item.lineTax ?? 0) : null);
                  const listGross = (item.lineTotal ?? 0) + (item.lineTax ?? 0);
                  const showListStrike = linePay != null && listGross - linePay > 0.01;
                  return (
                    <div key={item.id} className="group flex gap-6 rounded-[2rem] border border-[#EDE0D1] bg-white p-5 transition-all duration-300 hover:border-[#C9A99A] hover:shadow-xl">
                      <Link href={item.productId ? `/urunler/${item.productId}` : '#'} className="relative h-32 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#F8F1E9] sm:h-40 sm:w-32">
                        {item.images ? (
                          <GeneralImage src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.images[0]}`} alt={item.product.name} fill objectFit="cover" className="rounded-2xl transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#F8F1E9]">
                            <ShoppingBag className="h-10 w-10 text-[#D9C5B0]" strokeWidth={1} />
                          </div>
                        )}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <Link href={item.productId ? `/urunler/${item.productId}` : '#'} className="block">
                              <h3 className="font-serif text-xl text-[#5C4638] leading-tight transition-colors hover:text-[#A17E65] line-clamp-2">{item.product.name}</h3>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item)}
                              disabled={isRemovePending}
                              className="text-[#A17E65] hover:text-[#5C4638] transition-colors disabled:opacity-30"
                              title="Ürünü kaldır"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </div>
                          {variantLine ? <p className="mt-2 text-[11px] font-medium tracking-widest text-[#A17E65] uppercase">{variantLine}</p> : null}
                        </div>
                        
                        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <InputQuantity 
                              quantity={item.quantity} 
                              onChange={newQuantity => handleQuantityChange(item, newQuantity)} 
                              disabled={isInsertPending || isRemovePending} 
                              min={1} 
                              max={item.stock > 0 ? item.stock : undefined}
                              size="sm"
                            />
                          </div>
                          <div className="text-right">
                            {linePay == null ? (
                              <p className="text-xs tracking-widest text-[#A17E65] uppercase">Fiyat bilgisi yok</p>
                            ) : (
                              <div className="flex flex-col items-end">
                                <div className="flex items-center gap-3">
                                  {showListStrike ? <span className="text-sm text-[#A17E65]/60 line-through tabular-nums">{listGross.toTry()}</span> : null}
                                  <p className="font-mono text-xl text-[#5C4638] tabular-nums">{linePay.toTry()}</p>
                                </div>
                                {item.basePrice != null && item.basePrice !== undefined ? <p className="mt-1 text-[10px] tracking-widest text-[#A17E65] uppercase">Birim: {item.basePrice.toTry()}</p> : null}
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
              <div className="rounded-[2.5rem] border border-[#D9C5B0]/50 bg-white/60 backdrop-blur-sm p-8 sm:p-10 shadow-sm">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A17E65] mb-8">Sipariş özeti</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm tracking-tight">
                    <span className="text-[#8B6B57]">Ara toplam</span>
                    <span className="text-[#5C4638] font-mono tabular-nums">{cart.info?.basePrice.total ? cart.info.basePrice.total.toTry() : '0,00 ₺'}</span>
                  </div>
                  {cart.info?.tax && cart.info.tax.length > 0 && (
                    <div className="flex justify-between text-sm tracking-tight">
                      <span className="text-[#8B6B57]">KDV</span>
                      <span className="text-[#5C4638] font-mono tabular-nums">{cart.info.tax.reduce((acc, curr) => acc + curr.tax, 0).toTry()}</span>
                    </div>
                  )}
                  {cart.info?.delivery?.pay && cart.info.delivery.pay > 0 && (
                    <div className="flex justify-between text-sm tracking-tight">
                      <span className="text-[#8B6B57]">Kargo</span>
                      <span className="text-[#5C4638] font-mono tabular-nums">{cart.info.delivery.pay.toTry()}</span>
                    </div>
                  )}
                  {cart.info?.discount?.pay && cart.info.discount.pay > 0 && (
                    <div className="flex justify-between text-sm tracking-tight">
                      <span className="text-[#A17E65]">İndirim</span>
                      <span className="text-[#A17E65] font-mono tabular-nums">-{cart.info.discount.pay.toTry()}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-[#D9C5B0]/40 pt-6 pb-8">
                  <span className="text-sm tracking-[0.2em] uppercase text-[#5C4638]">Toplam</span>
                  <span className="font-serif text-3xl text-[#5C4638] tabular-nums">{totalPrice.toTry()}</span>
                </div>

                <button 
                  onClick={handleCheckout} 
                  className="w-full rounded-full bg-[#5C4638] py-5 px-8 text-sm font-medium uppercase tracking-[0.25em] text-[#F8F1E9] shadow-lg transition-all hover:bg-black hover:shadow-xl active:scale-[0.985]"
                >
                  Ödemeye geç
                </button>

                <div className="mt-8 text-center">
                  <Link href="/urunler" className="group inline-flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#A17E65] hover:text-[#5C4638] transition-colors">
                    Alışverişe devam et
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                
                <div className="mt-8 flex justify-center items-center gap-4 text-[9px] tracking-[0.15em] text-[#A17E65]/70 uppercase border-t border-[#D9C5B0]/20 pt-6">
                  <span>Güvenli Ödeme</span>
                  <div className="w-1 h-1 rounded-full bg-[#D9C5B0]" />
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
