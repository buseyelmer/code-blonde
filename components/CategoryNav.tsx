"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductCategoryOption } from "@/lib/api/group-products";
import {
  limitCategories,
  resolveCategoryImage,
  toCategoryHref,
} from "@/lib/category-utils";

type NavCategory = {
  id: string;
  label: string;
  subtitle: string;
  image: string;
  href: string;
};

function toNavCategories(
  productCategories?: ProductCategoryOption[],
): NavCategory[] {
  return limitCategories(productCategories, 6).map((category) => ({
    id: category.id,
    label: category.name,
    subtitle: `${category.count} ürün`,
    image: resolveCategoryImage(category.name),
    href: toCategoryHref(category.id),
  }));
}

function CategoryItem({ category }: { category: NavCategory }) {
  return (
    <Link
      href={category.href}
      className="group flex w-full max-w-[9.5rem] flex-col items-center border-b-2 border-transparent px-1 pb-3 transition-colors hover:border-primary-accent sm:max-w-none"
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-full border border-primary-muted/40 bg-primary-light transition-all duration-300 group-hover:border-primary-accent group-hover:shadow-md sm:h-24 sm:w-24 lg:h-28 lg:w-28">
        <Image
          src={category.image}
          alt={category.label}
          fill
          loading="lazy"
          className="object-cover p-3 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 80px, 112px"
        />
      </div>
      <p className="mt-2 line-clamp-2 w-full text-center text-[0.7rem] font-semibold leading-tight text-charcoal sm:mt-3 sm:text-xs md:text-sm">
        {category.label}
      </p>
      <p className="mt-0.5 text-center text-[0.65rem] text-muted">
        {category.subtitle}
      </p>
    </Link>
  );
}

type CategoryNavProps = {
  productCategories?: ProductCategoryOption[];
};

export function CategoryNav({ productCategories }: CategoryNavProps) {
  const list = toNavCategories(productCategories);

  if (!list.length) {
    return null;
  }

  return (
    <div
      className="w-full overflow-hidden py-2 sm:py-3"
      aria-label="Editörün Özel Kategori seçkileri"
    >
      <div className="mb-8 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-charcoal">Editörün Seçkileri</h2>
        <Link
          href="/products"
          className="shrink-0 text-xs font-medium text-primary-accent underline-offset-4 transition-colors hover:text-primary hover:underline sm:text-sm"
        >
          Tüm Ürünler
        </Link>
      </div>

      <div className="grid grid-cols-2 justify-items-center gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-6">
        {list.map((category) => (
          <CategoryItem key={`nav-${category.id}-${category.label}`} category={category} />
        ))}
      </div>
    </div>
  );
}
