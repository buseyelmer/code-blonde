"use client";

import Link from "next/link";
import { useSandboxData } from "@/hooks/useHomeData";
import { toCategoryHref } from "@/lib/category-utils";

const DESKTOP_CATEGORY_LIMIT = 8;

const linkBaseClass =
  "inline-flex shrink-0 items-center whitespace-nowrap border-b-2 border-transparent px-2 py-2.5 text-[0.7rem] font-semibold uppercase tracking-wide text-white transition-colors hover:border-primary-accent sm:px-3 sm:text-xs";

export function CategoryBar() {
  const { data, isLoading } = useSandboxData();
  const categories = (data?.productCategories ?? []).slice(0, DESKTOP_CATEGORY_LIMIT);

  if (isLoading) {
    return (
      <nav
        aria-label="Kategori menüsü"
        className="hidden w-full border-b border-black/20 bg-charcoal md:flex"
      >
        <div className="mx-auto flex h-12 w-full max-w-7xl flex-nowrap items-center justify-center gap-8 overflow-hidden px-4 lg:gap-10">
          <div className="h-4 w-24 shrink-0 animate-pulse rounded bg-white/25" />
          <div className="h-4 w-20 shrink-0 animate-pulse rounded bg-white/25" />
          <div className="h-4 w-28 shrink-0 animate-pulse rounded bg-white/25" />
        </div>
      </nav>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <nav
      aria-label="Kategori menüsü"
      className="hidden w-full border-b border-black/20 bg-charcoal md:flex"
    >
      <div
        className="mx-auto flex h-12 w-full max-w-7xl flex-nowrap items-center justify-center gap-8 overflow-hidden px-4 lg:gap-10"
        role="list"
      >
        <Link
          href="/products"
          role="listitem"
          className={`${linkBaseClass} bg-primary-accent font-bold hover:bg-primary hover:border-white`}
        >
          Tüm Ürünler
        </Link>

        {categories.map((category) => (
          <Link
            key={category.id}
            href={toCategoryHref(category.id)}
            role="listitem"
            className={`${linkBaseClass} hover:bg-white/5`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
