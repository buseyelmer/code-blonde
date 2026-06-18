import Link from "next/link";
import type { Product as ApiProduct } from "@/core/interface/product.interface";
import { resolveBestSellerProducts } from "@/lib/api/resolve-data";
import { ProductCard } from "./ProductCard";

type BestSellersSectionProps = {
  products?: ApiProduct[];
};

export function BestSellersSection({ products }: BestSellersSectionProps) {
  const displayProducts = resolveBestSellerProducts(products);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-charcoal sm:text-2xl">
          ÇOK SATAN ÜRÜNLER
        </h2>
        <Link
          href="/urunler"
          className="shrink-0 text-sm font-medium text-charcoal underline-offset-4 transition-colors hover:text-brand-purple hover:underline"
        >
          Tümünü Gör
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
