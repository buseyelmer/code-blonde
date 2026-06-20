"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { ItemCartQuantitySelector } from "@/theme/item/item.cart.quantity.selector";
import { useCart } from "@/lib/context/CartContext";
import { useFavorites } from "@/lib/context/FavoritesContext";
import type { Product } from "@/lib/data";
import { formatPrice, PLACEHOLDER_IMAGE, resolveProductImageUrl } from "@/lib/product-utils";

type ItemProductCardProps = {
  product: Product;
};

type ProductWithMedia = Product & {
  media?: { path?: string } | null;
};

function FavoriteButton({ product }: { product: Product }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getQuantity } = useCart();
  const favorite = isFavorite(product.id);
  const inCart = getQuantity(product.id) > 0;
  const isActive = favorite || inCart;

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white"
      aria-label={favorite ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          favorite
            ? "fill-red-500 text-red-500"
            : inCart
              ? "fill-primary text-primary"
              : "text-charcoal"
        }`}
        fill={isActive ? "currentColor" : "none"}
        strokeWidth={2}
      />
    </button>
  );
}

export function ItemProductCard({ product }: ItemProductCardProps) {
  const [imageUrl, setImageUrl] = useState(() =>
    resolveProductImageUrl(product as ProductWithMedia),
  );

  useEffect(() => {
    setImageUrl(resolveProductImageUrl(product as ProductWithMedia));
  }, [product]);

  const safeImageSrc = imageUrl?.trim() || PLACEHOLDER_IMAGE;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone/70 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/product/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/5] w-full bg-powder/30">
          <FavoriteButton product={product} />
          <Image
            src={safeImageSrc}
            alt={product.name || "Ürün"}
            fill
            loading="lazy"
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

      <div className="flex items-center justify-between gap-3 border-t border-primary/15 bg-primary-light px-4 py-3">
        <div>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-xs text-muted line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
          <p className="text-base font-bold text-primary">
            {formatPrice(Number(product.price))}
          </p>
        </div>
        <ItemCartQuantitySelector product={product} variant="compact" />
      </div>
    </article>
  );
}
