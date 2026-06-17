import Link from "next/link";
import { highlightedProducts } from "@/lib/data";
import { ProductCard } from "./ProductCard";

const FEATURED_PRODUCT_COUNT = 8;

export function ProductGrid() {
  const products = highlightedProducts.slice(0, FEATURED_PRODUCT_COUNT);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Koleksiyon
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
            Öne Çıkanlar
          </h2>
        </div>
        <Link
          href="/urunler"
          className="text-sm font-medium text-charcoal underline-offset-4 transition-colors hover:text-brand-purple hover:underline"
        >
          Tümünü Gör
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
