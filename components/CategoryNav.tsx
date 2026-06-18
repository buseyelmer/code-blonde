"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/core/interface/prisma.interface";
import { resolveNavCategories } from "@/lib/api/resolve-data";
import type { ShopCategory } from "@/lib/data";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

function CategoryItem({
  category,
  index,
}: {
  category: ShopCategory;
  index: number;
}) {
  const label = String(category.label ?? "Kategori");
  const image = String(category.image ?? "/images/categories/vucut-peeling.svg");
  const href = String(category.href ?? "#");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex w-[5rem] shrink-0 flex-col items-center sm:w-[5.5rem] md:w-auto md:shrink md:flex-1 md:basis-0 lg:max-w-[9.5rem]"
    >
      <Link href={href} className="group flex w-full flex-col items-center">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-gold-light/60 bg-powder transition-all duration-300 group-hover:border-gold group-hover:shadow-md md:h-24 md:w-24 lg:h-32 lg:w-32">
          <Image
            src={image}
            alt={label}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 128px"
          />
        </div>
        <p className="mt-2 line-clamp-2 w-full text-center text-[0.7rem] font-semibold leading-tight text-charcoal sm:mt-3 sm:text-xs md:text-sm">
          {label}
        </p>
        {category.subtitle ? (
          <p className="mt-0.5 hidden text-center text-[0.65rem] text-muted md:block">
            {String(category.subtitle)}
          </p>
        ) : null}
      </Link>
    </motion.div>
  );
}

type CategoryNavProps = {
  categories?: Category[];
};

export function CategoryNav({ categories }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const list = resolveNavCategories(categories);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full overflow-hidden">
      <section
        className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 lg:px-8"
        aria-label="Kategori gezintisi"
      >
        <div className="flex min-w-0 items-center gap-1 sm:gap-2 lg:gap-0">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="inline-flex shrink-0 rounded-md border border-stone bg-cream p-1.5 text-charcoal transition-colors hover:bg-white sm:p-2 lg:hidden"
            aria-label="Önceki kategoriler"
          >
            <ChevronLeftIcon />
          </button>

          <div
            ref={scrollRef}
            className="flex min-w-0 flex-1 flex-nowrap items-start justify-start gap-3 overflow-x-auto scroll-smooth py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 md:gap-5 lg:flex-wrap lg:justify-between lg:overflow-visible lg:gap-x-3 lg:gap-y-6 xl:gap-x-6 [&::-webkit-scrollbar]:hidden"
          >
            {list.map((category, index) => (
              <CategoryItem
                key={`nav-${category.id}-${index}`}
                category={category}
                index={index}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            className="inline-flex shrink-0 rounded-md border border-stone bg-cream p-1.5 text-charcoal transition-colors hover:bg-white sm:p-2 lg:hidden"
            aria-label="Sonraki kategoriler"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </section>
    </div>
  );
}
