"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CartItem } from "@/lib/context/CartContext";
import { formatPrice, PLACEHOLDER_IMAGE } from "@/lib/product-utils";
import { MinusIcon, PlusIcon } from "@/components/icons";

type CartLineItemProps = {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

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

export function CartLineItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartLineItemProps) {
  const lineTotal = Number(item.price) * item.quantity;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-stone/50 px-4 py-5 last:border-b-0 sm:grid-cols-[96px_1fr_140px_120px_auto] sm:gap-6">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-powder/40 sm:h-24 sm:w-24">
        <CartLineImage src={item.image} alt={item.name} />
      </div>

      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold">
          Code Blonde
        </p>
        <Link
          href={`/product/${item.id}`}
          className="mt-1 line-clamp-2 text-sm font-semibold text-charcoal hover:text-brand-purple sm:text-base"
        >
          {item.name}
        </Link>
        <p className="mt-2 text-xs text-muted sm:hidden">
          Birim: {formatPrice(Number(item.price))}
        </p>
      </div>

      <div className="col-span-3 flex items-center justify-between gap-4 sm:col-span-1 sm:justify-center">
        <div className="inline-flex items-center gap-2 rounded-lg border border-stone bg-cream px-2 py-1">
          <button
            type="button"
            onClick={onDecrement}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-charcoal hover:bg-powder"
            aria-label="Adedi azalt"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={onIncrement}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-charcoal hover:bg-powder"
            aria-label="Adedi artır"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="text-right sm:hidden">
          <p className="text-sm font-bold text-charcoal">
            {formatPrice(lineTotal)}
          </p>
        </div>
      </div>

      <p className="hidden text-sm text-muted sm:block">
        {formatPrice(Number(item.price))}
      </p>

      <p className="hidden text-right text-base font-bold text-charcoal sm:block">
        {formatPrice(lineTotal)}
      </p>

      <button
        type="button"
        onClick={onRemove}
        className="hidden text-xl leading-none text-muted transition-colors hover:text-charcoal sm:block"
        aria-label="Ürünü kaldır"
      >
        ×
      </button>
    </div>
  );
}
