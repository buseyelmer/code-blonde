"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import ItemListingProduct from "@/core/theme/item/item.listing.product";
import { getProductPath } from "@/core/util/product-path";
import { getProductPriceInfo } from "@/core/util/product.price";
import { getProductListingImageUrl } from "@/core/util/product.image";
import { mergeRelatedProducts } from "@/core/util/blog.products";
import "@/core/util/util";

function SidebarProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="text-xs text-[#8B6B57]">Bu yazıyla ilişkili ürün bulunmuyor.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {products.map((product) => {
        const { bestPrice } = getProductPriceInfo(product);
        const imageUrl = getProductListingImageUrl(product);

        return (
          <Link
            key={product.id}
            href={getProductPath(product)}
            className="group flex gap-3 rounded-xl p-2 transition-colors hover:bg-[#EDE0D1]/50"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#EDE0D1]">
              <Image
                src={imageUrl}
                alt={product.name ?? ""}
                fill
                unoptimized
                sizes="80px"
                className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-2 text-sm font-medium leading-snug text-[#5C4638] transition-colors group-hover:text-[#A17E65]">
                {product.name}
              </h4>
              {bestPrice > 0 && (
                <p className="mt-1 font-mono text-[11px] tabular-nums text-[#A17E65]">
                  {bestPrice.toTry()}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function BlogSidebarProducts({
  products,
  isLoading,
}: {
  products: Product[];
  isLoading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 p-6">
      <p className="text-[10px] tracking-[0.32em] uppercase text-[#A17E65]">Yazıyla ilgili</p>
      <h3 className="mt-1 font-serif text-xl text-[#5C4638]">İlişkili Ürünler</h3>
      <div className="mt-5">
        {isLoading ? (
          <p className="text-xs text-[#8B6B57]">Ürünler yükleniyor…</p>
        ) : (
          <SidebarProductList products={products} />
        )}
      </div>
    </div>
  );
}

export function BlogRecommendedProducts({
  title = "Önerilen Ürünler",
  eyebrow = "Keşfet",
  products,
  isLoading,
  emptyMessage = "Şu an önerilecek ürün bulunmuyor.",
  limit = 8,
}: {
  title?: string;
  eyebrow?: string;
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
  limit?: number;
}) {
  const list = products.slice(0, limit);

  if (!isLoading && list.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#D9C5B0]/50 pt-12">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.38em] uppercase text-[#A17E65]">{eyebrow}</p>
          <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#5C4638] sm:text-3xl">{title}</h2>
        </div>
        <Link
          href="/urunler"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#5C4638] transition hover:text-[#A17E65]"
        >
          Tümünü Gör
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-sm bg-[#EDE0D1]/80" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-xs text-[#8B6B57]">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {list.map((product, index) => (
            <ItemListingProduct key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

export function BlogArticleRelatedProducts({
  sourceProductIds,
  excludeIds = [],
  linkedProducts,
  linkedLoading,
}: {
  sourceProductIds: string[];
  excludeIds?: string[];
  linkedProducts: Product[];
  linkedLoading?: boolean;
}) {
  const relatedQueries = useProduct().relatedMany(sourceProductIds, {
    enabled: sourceProductIds.length > 0,
  });
  const relatedLoading = relatedQueries.some((query) => query.isLoading);
  const recommendedProducts = mergeRelatedProducts(relatedQueries, excludeIds);

  return (
    <>
      {(linkedLoading || linkedProducts.length > 0) && (
        <BlogRecommendedProducts
          title={linkedProducts.length > 0 ? "Bu Yazıdaki Ürünler" : "İlginizi Çekebilir"}
          eyebrow="Yazıyla ilgili"
          products={linkedProducts}
          isLoading={linkedLoading}
          limit={8}
        />
      )}
      {sourceProductIds.length > 0 && (relatedLoading || recommendedProducts.length > 0) && (
        <BlogRecommendedProducts
          title="Bunları da İnceleyin"
          eyebrow="Öneriler"
          products={recommendedProducts}
          isLoading={relatedLoading}
          limit={8}
        />
      )}
    </>
  );
}

export function BlogListRecommendedProducts() {
  const { data, isLoading } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    page: 1,
    amount: 8,
    sortBy: "reviewCount",
    order: { column: "createdAt", direction: "desc" },
    outOfStock: false,
  });

  return (
    <BlogRecommendedProducts
      title="Önerilen Ürünler"
      eyebrow="Alışveriş"
      products={data?.data ?? []}
      isLoading={isLoading}
    />
  );
}
