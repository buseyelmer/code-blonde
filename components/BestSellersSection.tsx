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
    <div className="w-full">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-charcoal sm:text-2xl">
          ÇOK SATAN ÜRÜNLER
        </h2>
        <Link
          href="/products"
          className="shrink-0 text-sm font-medium text-charcoal underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Tümünü Gör
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
