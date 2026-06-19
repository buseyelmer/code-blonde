import Link from "next/link";
import type { ProductCategoryOption } from "@/lib/api/group-products";
import { resolveBannerGrid, type ResolvedBanner } from "@/lib/banner-config";

type BannerGridProps = {
  productCategories?: ProductCategoryOption[];
};

function BannerCard({ banner }: { banner: ResolvedBanner }) {
  const isLarge = banner.layout === "large";

  return (
    <Link
      href={banner.href}
      className={`group relative flex overflow-hidden rounded-lg bg-stone ${
        isLarge
          ? "min-h-[18rem] md:col-start-2 md:row-span-2 md:row-start-1 md:min-h-full"
          : "min-h-[11rem] md:min-h-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-stone via-powder to-stone/80 transition-transform duration-500 group-hover:scale-[1.02]"
        aria-hidden
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

      <div
        className={`relative flex w-full flex-col justify-end ${
          isLarge ? "p-6 sm:p-8" : "p-5 sm:p-6"
        }`}
      >
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-xs">
          {banner.label}
        </p>

        <h3
          className={`mt-2 font-bold leading-tight text-white ${
            isLarge ? "text-2xl sm:text-3xl lg:text-4xl" : "text-lg sm:text-xl"
          }`}
        >
          {banner.title}
        </h3>

        {isLarge ? (
          <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors group-hover:bg-primary-accent group-hover:text-white">
            Şimdi Keşfet
            <span aria-hidden>→</span>
          </span>
        ) : (
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white transition-colors group-hover:text-primary-muted">
            Keşfet
            <span aria-hidden>→</span>
          </span>
        )}
      </div>
    </Link>
  );
}

export function BannerGrid({ productCategories }: BannerGridProps) {
  const banners = resolveBannerGrid(productCategories);
  const [first, second, featured] = banners;

  if (!first || !second || !featured) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2 md:gap-5">
        <BannerCard banner={first} />
        <BannerCard banner={second} />
        <BannerCard banner={featured} />
      </div>
    </div>
  );
}
