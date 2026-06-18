"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { HeaderAuthLinks } from "./HeaderAuthLinks";
import { HeaderCartLink } from "./HeaderCartLink";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { HeartIcon, MenuIcon, SearchIcon } from "./icons";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="max-w-full overflow-hidden border-b border-stone/50 bg-white">
      <div className="mx-auto flex min-h-[4.25rem] max-w-7xl items-center gap-2 px-3 py-2 sm:min-h-[5.25rem] sm:gap-4 sm:px-6 sm:py-2.5 lg:px-8">
        <Logo variant="header" />

        <div className="relative hidden min-w-0 flex-1 md:block">
          <label htmlFor="site-search" className="sr-only">
            Ürün ara
          </label>
          <input
            id="site-search"
            type="search"
            placeholder="Ürün, kategori ya da marka ara"
            className="w-full max-w-full rounded-full border border-stone/80 bg-stone/20 py-2.5 pl-5 pr-12 text-sm text-charcoal outline-none transition-colors placeholder:text-muted focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10"
          />
          <SearchIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
          <HeaderAuthLinks className="hidden md:flex" />

          <Link
            href="/favorites"
            className="rounded-full p-2 text-charcoal transition-colors hover:bg-stone/30 md:p-2.5"
            aria-label="Favoriler"
          >
            <HeartIcon />
          </Link>

          <HeaderCartLink />

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-full p-2 text-charcoal transition-colors hover:bg-stone/30 md:hidden"
            aria-label="Menüyü aç"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <div className="border-t border-stone/40 px-3 pb-3 md:hidden">
        <div className="relative mt-3 max-w-full">
          <label htmlFor="site-search-mobile" className="sr-only">
            Ürün ara
          </label>
          <input
            id="site-search-mobile"
            type="search"
            placeholder="Ürün, kategori ya da marka ara"
            className="w-full max-w-full rounded-full border border-stone/80 bg-stone/20 py-2.5 pl-4 pr-11 text-sm text-charcoal outline-none placeholder:text-muted focus:border-primary/40 focus:bg-white"
          />
          <SearchIcon className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <HeaderMobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
