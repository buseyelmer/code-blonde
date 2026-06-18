"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product as ApiProduct } from "@/core/interface/product.interface";
import type { ProductCategoryOption } from "@/lib/api/group-products";
import { getProductCategoryMeta } from "@/lib/api/group-products";
import { mapApiProductsToCards } from "@/lib/api/mappers";
import type { Product } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

const VISIBLE_COUNT = 8;

type NewArrivalsSectionProps = {
  products?: ApiProduct[];
  productCategories?: ProductCategoryOption[];
};

function toArrivalProducts(apiProducts?: ApiProduct[]): Product[] {
  return mapApiProductsToCards(apiProducts);
}

function buildCategoryOptions(
  apiCategories: ProductCategoryOption[] | undefined,
  products: Product[],
) {
  if (!apiCategories?.length) {
    return [{ id: "all", name: "Tüm Ürünler", count: products.length }];
  }

  return [
    { id: "all", name: "Tüm Ürünler", count: products.length },
    ...apiCategories,
  ];
}

export function NewArrivalsSection({
  products: apiProducts,
  productCategories,
}: NewArrivalsSectionProps) {
  const sourceProducts = useMemo(
    () => toArrivalProducts(apiProducts),
    [apiProducts],
  );

  const categoryOptions = useMemo(
    () => buildCategoryOptions(productCategories, sourceProducts),
    [productCategories, sourceProducts],
  );

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(0);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return sourceProducts;

    const activeCategory = categoryOptions.find(
      (category) => category.id === selectedCategory,
    );

    if (!activeCategory) return sourceProducts;

    return sourceProducts.filter((product) => {
      const meta = getProductCategoryMeta(
        apiProducts?.find((item) => item.id === product.id) ?? {
          id: product.id,
          category: product.category,
          categoryId: product.categoryId,
        },
      );

      return (
        meta.categoryId === selectedCategory ||
        meta.categoryName === activeCategory.name ||
        product.category === activeCategory.name
      );
    });
  }, [
    selectedCategory,
    sourceProducts,
    categoryOptions,
    apiProducts,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / VISIBLE_COUNT),
  );
  const currentPage = Math.min(page, totalPages - 1);
  const visibleProducts = filteredProducts.slice(
    currentPage * VISIBLE_COUNT,
    currentPage * VISIBLE_COUNT + VISIBLE_COUNT,
  );

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(0);
  };

  return (
    <div className="w-full">
      <div className="rounded-3xl bg-gradient-to-br from-powder via-cream to-powder/60 p-5 sm:p-8">
        <h2 className="text-lg font-bold tracking-tight text-charcoal sm:text-xl">
          YENİ GELEN ÜRÜNLER
        </h2>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoryOptions.map((option) => {
            const isActive = selectedCategory === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleCategoryChange(option.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 sm:text-sm ${
                  isActive
                    ? "border-charcoal bg-charcoal text-cream shadow-sm"
                    : "border-stone bg-cream text-charcoal hover:border-gold hover:text-gold"
                }`}
              >
                {option.name}
                {option.id !== "all" && (
                  <span className="ml-1 text-[0.65rem] opacity-70">
                    ({option.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="mt-8 text-center text-sm text-muted">
            Bu kategoride ürün bulunamadı
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${currentPage}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
            >
              {visibleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
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
    </div>
  );
}
