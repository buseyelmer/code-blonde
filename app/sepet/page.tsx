"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/context/CartContext";
import { formatPrice, PLACEHOLDER_IMAGE } from "@/lib/product-utils";
import { MinusIcon, PlusIcon } from "@/components/icons";

function CartLineImage({ src, alt }: { src: string; alt: string }) {
  const [imageUrl, setImageUrl] = useState(src || PLACEHOLDER_IMAGE);

  return (
    <Image
      src={imageUrl || PLACEHOLDER_IMAGE}
      alt={alt}
      fill
      className="object-contain p-2"
      sizes="96px"
      onError={() => setImageUrl(PLACEHOLDER_IMAGE)}
    />
  );
}

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
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-brand-purple"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Sepetim</h1>
          <p className="mt-1 text-sm text-muted">{totalItems} ürün</p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-muted transition-colors hover:text-charcoal"
        >
          Sepeti Temizle
        </button>
      </div>

      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 rounded-2xl border border-stone/70 bg-white p-4"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-powder/40">
              <CartLineImage src={item.image} alt={item.name} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <Link
                  href={`/product/${item.id}`}
                  className="line-clamp-2 text-sm font-semibold text-charcoal hover:text-brand-purple"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm font-bold text-charcoal">
                  {formatPrice(Number(item.price))}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-lg bg-brand-purple px-2 py-1 text-white">
                  <button
                    type="button"
                    onClick={() => decrementItem(item.id)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-white/15"
                    aria-label="Adedi azalt"
                  >
                    <MinusIcon className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => incrementItem(item.id)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-white/15"
                    aria-label="Adedi artır"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-muted transition-colors hover:text-charcoal"
                >
                  Kaldır
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-2xl border border-stone/70 bg-white p-6">
        <div className="flex items-center justify-between text-lg font-semibold text-charcoal">
          <span>Toplam</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <button
          type="button"
          className="mt-6 w-full rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-brand-purple"
        >
          Ödemeye Geç
        </button>
      </div>
    </div>
  );
}
