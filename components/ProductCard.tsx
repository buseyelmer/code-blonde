import Image from "next/image";
import type { Product } from "@/lib/data";
import { HeartIcon, PlusIcon } from "./icons";
import { StarRating } from "./StarRating";

type ProductCardProps = {
  product: Product;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-stone/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative mb-3">
        {product.isExclusive && (
          <span className="absolute left-0 top-0 z-10 rounded-full bg-brand-purple px-2 py-1 text-[0.6rem] font-semibold leading-tight text-white sm:px-2.5 sm:text-[0.65rem]">
            Code Blonde&apos;a Özel
          </span>
        )}
        {product.isDeal && !product.isExclusive && (
          <span className="absolute left-0 top-0 z-10 rounded-full bg-emerald-600 px-2.5 py-1 text-[0.65rem] font-semibold text-white">
            Fırsat Ürünü
          </span>
        )}

        <div className="relative mx-auto aspect-square w-full max-w-[180px]">
          <button
            type="button"
            className="absolute right-0 top-0 z-10 rounded-full p-1.5 text-stone transition-colors hover:text-brand-purple"
            aria-label={`${product.name} favorilere ekle`}
          >
            <HeartIcon className="h-4 w-4" />
          </button>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
          />
        </div>
      </div>

      <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-semibold leading-snug text-charcoal sm:text-sm">
        {product.name}
      </h3>

      <StarRating
        rating={product.rating}
        reviewCount={product.reviewCount}
        className="mt-2"
      />

      {product.originalPrice && (
        <p className="mt-1.5 text-[0.65rem] text-muted line-through sm:text-xs">
          {formatPrice(product.originalPrice)}
        </p>
      )}

      <div className="-mx-4 -mb-4 mt-3 flex items-center justify-between rounded-b-lg bg-brand-purple-light px-4 py-3">
        <span className="text-base font-bold text-charcoal sm:text-lg">
          {formatPrice(product.price)}
        </span>
        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-purple text-white transition-colors hover:bg-brand-purple/90"
          aria-label={`${product.name} sepete ekle`}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
