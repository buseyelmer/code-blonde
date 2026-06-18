"use client";

import { useState } from "react";
import type { Product } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

type ProductTabsProps = {
  product: Product;
  similarProducts: Product[];
};

type TabId = "description" | "specs" | "similar";

const TABS: { id: TabId; label: string }[] = [
  { id: "description", label: "Ürün Açıklaması" },
  { id: "specs", label: "Teknik Özellikler" },
  { id: "similar", label: "Benzer Ürünler" },
];

export function ProductTabs({ product, similarProducts }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  return (
    <section className="mt-12 border-t border-stone/60 pt-8">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-charcoal bg-charcoal text-cream"
                  : "border-stone bg-white text-charcoal hover:border-gold"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-stone/60 bg-white p-6">
        {activeTab === "description" && (
          <div className="prose prose-sm max-w-none text-charcoal">
            <p className="text-sm leading-7 text-muted">
              {product.description?.trim() ||
                `${product.name} — Code Blonde bakım koleksiyonunun özenle formüle edilmiş bir parçasıdır. Cildinize doğal içeriklerle nazik bakım sunar.`}
            </p>
          </div>
        )}

        {activeTab === "specs" && (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Marka
              </dt>
              <dd className="mt-1 text-sm text-charcoal">Code Blonde</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Kategori
              </dt>
              <dd className="mt-1 text-sm text-charcoal">
                {product.category || "Genel"}
              </dd>
            </div>
            {product.articleNumber && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Ürün Kodu
                </dt>
                <dd className="mt-1 text-sm text-charcoal">
                  {product.articleNumber}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Ürün ID
              </dt>
              <dd className="mt-1 break-all text-sm text-charcoal">{product.id}</dd>
            </div>
          </dl>
        )}

        {activeTab === "similar" && (
          <>
            {similarProducts.length === 0 ? (
              <p className="text-sm text-muted">
                Bu kategori için benzer ürün bulunamadı.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {similarProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
