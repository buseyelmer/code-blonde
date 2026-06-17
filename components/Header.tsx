import Link from "next/link";
import { Logo } from "./Logo";
import { CartIcon, HeartIcon, SearchIcon } from "./icons";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone/50 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-[4.5rem] sm:gap-5 sm:px-6 lg:gap-8 lg:px-8">
        <Logo className="shrink-0" variant="compact" crossColor="#ffffff" />

        <div className="relative mx-auto hidden min-w-0 flex-1 sm:block sm:max-w-xl lg:max-w-2xl">
          <label htmlFor="site-search" className="sr-only">
            Ürün ara
          </label>
          <input
            id="site-search"
            type="search"
            placeholder="Ürün, kategori veya marka ara..."
            className="w-full rounded-xl border border-stone/80 bg-stone/20 py-2.5 pl-4 pr-11 text-sm text-charcoal outline-none transition-colors placeholder:text-muted focus:border-brand-purple/40 focus:bg-white focus:ring-2 focus:ring-brand-purple/10"
          />
          <SearchIcon className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/favoriler"
            className="rounded-full p-2.5 text-charcoal transition-colors hover:bg-stone/30"
            aria-label="Favoriler"
          >
            <HeartIcon />
          </Link>
          <Link
            href="/sepet"
            className="rounded-full p-2.5 text-charcoal transition-colors hover:bg-stone/30"
            aria-label="Sepet"
          >
            <CartIcon />
          </Link>
        </div>
      </div>

      <div className="border-t border-stone/40 px-4 pb-3 sm:hidden">
        <div className="relative">
          <label htmlFor="site-search-mobile" className="sr-only">
            Ürün ara
          </label>
          <input
            id="site-search-mobile"
            type="search"
            placeholder="Ürün ara..."
            className="w-full rounded-xl border border-stone/80 bg-stone/20 py-2.5 pl-4 pr-11 text-sm text-charcoal outline-none placeholder:text-muted focus:border-brand-purple/40 focus:bg-white"
          />
          <SearchIcon className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        </div>
      </div>
    </header>
  );
}
