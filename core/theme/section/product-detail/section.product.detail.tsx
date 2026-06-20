"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight, Home, Loader2 } from "lucide-react";
import { ItemProductDetailGallery } from "@/theme/item/item.product.detail.gallery";
import { ItemProductDetailInfo } from "@/theme/item/item.product.detail.info";
import { mapApiProductsToCards } from "@/lib/api/mappers";
import { useSandboxProducts } from "@/hooks/useHomeData";
import { resolveProductImageUrl } from "@/lib/product-utils";

type SectionProductDetailProps = {
  productId: string;
};

type ProductWithMedia = ReturnType<typeof mapApiProductsToCards>[number] & {
  media?: { path?: string } | null;
};

export function SectionProductDetail({ productId }: SectionProductDetailProps) {
  const { data, isLoading, isError } = useSandboxProducts();

  const products = useMemo(
    () => mapApiProductsToCards(data?.products),
    [data?.products],
  );

  const product = useMemo(
    () => products.find((item) => item.id === productId),
    [products, productId],
  );

  const imageUrl = useMemo(() => {
    if (!product) return undefined;
    return resolveProductImageUrl(product as ProductWithMedia);
  }, [product]);

  if (isLoading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-charcoal" strokeWidth={1.5} />
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-charcoal">Ürün bulunamadı</h1>
          <p className="mt-3 text-sm text-muted">
            Aradığınız ürün mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl border border-charcoal px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <nav className="mb-8 flex flex-wrap items-center gap-2 border-b border-stone/50 pb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-colors hover:text-charcoal"
          >
            <Home className="h-3.5 w-3.5" strokeWidth={1.5} />
            Ana Sayfa
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-stone" />
          <Link href="/products" className="transition-colors hover:text-charcoal">
            Ürünler
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-stone" />
          <span className="max-w-[220px] truncate text-charcoal">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
          <ItemProductDetailGallery src={imageUrl} alt={product.name} />
          <ItemProductDetailInfo product={product} />
        </div>
      </div>
    </main>
  );
}
