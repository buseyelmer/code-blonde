"use client";

import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { ItemCartLineItem } from "@/theme/item/item.cart.line.item";
import { ItemCartCheckoutButton } from "@/theme/item/item.cart.checkout.button";
import { ViewCartOrdersSummary } from "@/theme/view/view.cart.orders.summary";

export default function CartPage() {
  const {
    items,
    incrementItem,
    decrementItem,
    removeItem,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-charcoal">Sepetiniz boş</h1>
        <p className="mt-3 text-sm text-muted">
          Henüz sepetinize ürün eklemediniz.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-stone/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-[0.12em] text-charcoal sm:text-3xl">
            Alışveriş Sepetim
          </h1>
          <p className="mt-2 text-sm text-muted">
            {totalItems} ürün listeleniyor
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-muted transition-colors hover:text-charcoal"
          >
            Sepeti Temizle
          </button>
          <Link
            href="/"
            className="text-sm font-medium text-charcoal underline-offset-4 hover:underline"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-2xl border border-stone/70 bg-white">
          <div className="hidden grid-cols-[96px_1fr_140px_120px_auto] gap-6 border-b border-stone/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:grid">
            <span>Ürün</span>
            <span />
            <span className="text-center">Adet</span>
            <span>Birim Fiyat</span>
            <span className="text-right">Toplam</span>
            <span />
          </div>

          {items.map((item) => (
            <ItemCartLineItem
              key={item.id}
              item={item}
              onIncrement={() => incrementItem(item.id)}
              onDecrement={() => decrementItem(item.id)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </section>

        <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <ViewCartOrdersSummary
            subtotal={totalPrice}
            showCheckoutButton={false}
          />
          <ItemCartCheckoutButton />
        </div>
      </div>
    </div>
  );
}
