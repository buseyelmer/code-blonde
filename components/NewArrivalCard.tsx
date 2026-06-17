import type { Product } from "@/lib/data";
import { HeartIcon, PlusIcon } from "./icons";
import { StarRating } from "./StarRating";
import Image from "next/image";

type NewArrivalCardProps = {
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

export function NewArrivalCard({ product }: NewArrivalCardProps) {
  return (
    <article className="group relative flex flex-col rounded-2xl bg-cream p-3 shadow-sm ring-1 ring-stone/50 transition-shadow hover:shadow-md sm:p-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-powder/50">
        {product.isDeal && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-charcoal px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-cream">
            Yeni
          </span>
        )}
        <button
          type="button"
          className="absolute right-2 top-2 z-10 rounded-full bg-cream/90 p-1.5 text-charcoal opacity-0 transition-opacity group-hover:opacity-100"
          aria-label={`${product.name} istek listesine ekle`}
        >
          <HeartIcon className="h-4 w-4" />
        </button>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-medium leading-snug text-charcoal sm:text-sm">
          {product.name}
        </h3>
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          className="mt-2"
        />
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            {product.originalPrice && (
              <p className="text-[0.65rem] text-muted line-through sm:text-xs">
                {formatPrice(product.originalPrice)}
              </p>
            )}
            <p className="text-sm font-bold text-charcoal sm:text-base">
              {formatPrice(product.price)}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-charcoal text-cream transition-colors hover:bg-gold"
            aria-label={`${product.name} sepete ekle`}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
