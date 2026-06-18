"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ProductCategoryOption } from "@/lib/api/group-products";
import {
  resolveCategoryImage,
  toCategoryHref,
} from "@/lib/category-utils";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

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
  return (productCategories ?? []).map((category) => ({
    id: category.id,
    label: category.name,
    subtitle: `${category.count} ürün`,
    image: resolveCategoryImage(category.name),
    href: toCategoryHref(category.id),
  }));
}

function CategoryItem({
  category,
  index,
}: {
  category: NavCategory;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex w-[5.5rem] shrink-0 flex-col items-center sm:w-[6rem] md:w-auto md:shrink md:flex-1 md:basis-0 lg:max-w-[10rem]"
    >
      <Link href={category.href} className="group flex w-full flex-col items-center">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-primary-muted/40 bg-primary-light transition-all duration-300 group-hover:border-primary group-hover:shadow-md md:h-24 md:w-24 lg:h-28 lg:w-28">
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
    </motion.div>
  );
}

type CategoryNavProps = {
  productCategories?: ProductCategoryOption[];
};

export function CategoryNav({ productCategories }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const list = toNavCategories(productCategories);

  if (!list.length) {
    return null;
  }

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full py-2 sm:py-3" aria-label="Ürün kategorileri">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-charcoal">
          Kategoriler
        </h2>
        <Link
          href="/products"
          className="text-xs font-medium text-primary underline-offset-4 hover:underline sm:text-sm"
        >
          Tüm Ürünler
        </Link>
      </div>

      <div className="flex min-w-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="inline-flex shrink-0 rounded-md border border-stone bg-white p-1.5 text-charcoal transition-colors hover:bg-powder sm:p-2 lg:hidden"
          aria-label="Önceki kategoriler"
        >
          <ChevronLeftIcon />
        </button>

        <div
          ref={scrollRef}
          className="flex min-w-0 flex-1 flex-nowrap items-start justify-center gap-4 overflow-x-auto scroll-smooth py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 lg:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {list.map((category, index) => (
            <CategoryItem
              key={`nav-${category.id}-${category.label}`}
              category={category}
              index={index}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="inline-flex shrink-0 rounded-md border border-stone bg-white p-1.5 text-charcoal transition-colors hover:bg-powder sm:p-2 lg:hidden"
          aria-label="Sonraki kategoriler"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
