"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  newArrivalProducts,
  productFilterOptions,
  type ProductCategoryId,
} from "@/lib/data";
import { NewArrivalCard } from "./NewArrivalCard";

type FilterId = "all" | ProductCategoryId;

const VISIBLE_COUNT = 6;

export function NewArrivalsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [page, setPage] = useState(0);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return newArrivalProducts;
    return newArrivalProducts.filter((p) => p.categoryId === activeFilter);
  }, [activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / VISIBLE_COUNT));
  const currentPage = Math.min(page, totalPages - 1);
  const visibleProducts = filteredProducts.slice(
    currentPage * VISIBLE_COUNT,
    currentPage * VISIBLE_COUNT + VISIBLE_COUNT,
  );

  const handleFilterChange = (filter: FilterId) => {
    setActiveFilter(filter);
    setPage(0);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-br from-powder via-cream to-powder/60 p-5 sm:p-8">
        <h2 className="text-lg font-bold tracking-tight text-charcoal sm:text-xl">
          YENİ GELEN ÜRÜNLER
        </h2>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {productFilterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleFilterChange(option.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 sm:text-sm ${
                  isActive
                    ? "border-charcoal bg-charcoal text-cream shadow-sm"
                    : "border-stone bg-cream text-charcoal hover:border-gold hover:text-gold"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${currentPage}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
          >
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NewArrivalCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted">
            Bu kategoride henüz ürün bulunmuyor.
          </p>
        )}

        {filteredProducts.length > VISIBLE_COUNT && (
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm tabular-nums text-muted">
              {currentPage + 1}/{totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stone bg-cream text-charcoal transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Önceki ürünler"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stone bg-cream text-charcoal transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Sonraki ürünler"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
