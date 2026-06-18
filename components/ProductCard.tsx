"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { useCart } from "@/lib/context/CartContext";
import type { Product } from "@/lib/data";
import { formatPrice, PLACEHOLDER_IMAGE, resolveProductImageUrl } from "@/lib/product-utils";
import { MinusIcon, PlusIcon } from "./icons";

type ProductCardProps = {
  product: Product;
};

type ProductWithMedia = Product & {
  media?: { path?: string } | null;
};

function CartControls({ product }: { product: Product }) {
  const { addItem, incrementItem, decrementItem, getQuantity } = useCart();
  const quantity = getQuantity(product.id);

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={(event) => {
          handleClick(event);
          addItem(product);
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-purple text-white transition-colors hover:bg-charcoal"
        aria-label={`${product.name} sepete ekle`}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg bg-brand-purple p-1 text-white"
      onClick={handleClick}
    >
      <button
        type="button"
        onClick={() => decrementItem(product.id)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/15"
        aria-label={`${product.name} adedini azalt`}
      >
        <MinusIcon className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => incrementItem(product.id)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/15"
        aria-label={`${product.name} adedini artır`}
      >
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageUrl, setImageUrl] = useState(() =>
    resolveProductImageUrl(product as ProductWithMedia),
  );

  useEffect(() => {
    setImageUrl(resolveProductImageUrl(product as ProductWithMedia));
  }, [product]);

  const safeImageSrc = imageUrl?.trim() || PLACEHOLDER_IMAGE;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone/70 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/product/${product.id}`}
        className="flex flex-1 flex-col"
      >
        <div className="relative aspect-[4/5] w-full bg-powder/30">
          <Image
            src={safeImageSrc}
            alt={product.name || "Ürün"}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            onError={() => setImageUrl(PLACEHOLDER_IMAGE)}
          />
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          {product.category && (
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-muted">
              {product.category}
            </p>
          )}
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-charcoal">
            {product.name || "İsimsiz Ürün"}
          </h3>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-3 border-t border-stone/50 bg-brand-purple-light px-4 py-3">
        <div>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-xs text-muted line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
          <p className="text-base font-bold text-charcoal">
            {formatPrice(Number(product.price))}
          </p>
        </div>
        <CartControls product={product} />
      </div>
    </article>
  );
}
