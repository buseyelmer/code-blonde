"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/context/FavoritesContext";
import { ItemProductCard } from "@/theme/item/item.product.card";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-charcoal">Favorilerim</h1>
        <p className="mt-4 text-sm text-muted">
          Favorilerinizde henüz ürün bulunmuyor
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-brand-purple"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal sm:text-3xl">
            Favorilerim
          </h1>
          <p className="mt-2 text-sm text-muted">
            {favorites.length} ürün listeleniyor
          </p>
        </div>
        <Link
          href="/products"
          className="text-sm font-medium text-charcoal underline-offset-4 hover:underline"
        >
          Ürünlere Git
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {favorites.map((product) => (
          <ItemProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
