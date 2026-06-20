"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { getSafeImageUrl } from "@/core/util/util";
import { formatPrice } from "@/lib/product-utils";

export function SectionProductGrid() {
  const { data, isLoading, error } = useProduct().fetch({
    page: 1,
    amount: 24,
  });

  const products = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-charcoal" strokeWidth={1.5} />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-12 text-center text-sm text-muted">
        Ürünler yüklenirken bir sorun oluştu.
      </p>
    );
  }

  if (!products.length) {
    return (
      <p className="py-12 text-center text-sm text-muted">
        Şu anda listelenecek ürün bulunmuyor.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Koleksiyon
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-charcoal">
          Tüm Ürünler
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => {
          const price =
            product.price?.payPrice ?? product.price?.mainPrice ?? 0;
          const image = product.images?.[0]?.relativePath
            ? getSafeImageUrl(product.images[0].relativePath, "product")
            : null;

          return (
            <Link
              key={product.id}
              href={`/urunler/${product.id}`}
              className="group overflow-hidden rounded-2xl border border-stone/70 bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/5] bg-powder/30">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={product.name}
                    className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    Görsel yok
                  </div>
                )}
              </div>
              <div className="space-y-2 px-4 py-4">
                <p className="line-clamp-2 text-sm font-semibold text-charcoal">
                  {product.name}
                </p>
                <p className="text-base font-bold text-primary">
                  {formatPrice(price)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
