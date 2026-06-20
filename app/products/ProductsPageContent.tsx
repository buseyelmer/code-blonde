"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { mapApiProductsToCards } from "@/lib/api/mappers";
import { getProductCategoryMeta } from "@/lib/api/group-products";
import { useSandboxProducts } from "@/hooks/useHomeData";
import { ItemProductCard } from "@/theme/item/item.product.card";
import { SectionHomePageLoader } from "@/theme/section/home/section.home.page.status";

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const { data, isLoading, isError } = useSandboxProducts();

  const products = useMemo(
    () => mapApiProductsToCards(data?.products),
    [data?.products],
  );

  const filteredProducts = useMemo(() => {
    if (!categoryFilter || categoryFilter === "all") {
      return products;
    }

    return products.filter((product) => {
      const apiProduct = data?.products?.find((item) => item.id === product.id);
      if (!apiProduct) return false;

      const { categoryId } = getProductCategoryMeta(apiProduct);
      return categoryId === categoryFilter;
    });
  }, [products, categoryFilter, data?.products]);

  const activeCategoryName = useMemo(() => {
    if (!categoryFilter) return null;
    return (
      data?.productCategories?.find((category) => category.id === categoryFilter)
        ?.name ?? null
    );
  }, [categoryFilter, data?.productCategories]);

  if (isLoading) {
    return <SectionHomePageLoader />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Koleksiyon
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-charcoal">
          {activeCategoryName ?? "Tüm Ürünler"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          {activeCategoryName
            ? `${activeCategoryName} kategorisindeki Code Blonde ürünleri.`
            : "Code Blonde bakım ürünlerini keşfedin. Peeling, saç bakımı ve daha fazlası."}
        </p>
        {data?.meta?.count != null && (
          <p className="mt-2 text-xs font-medium text-brand-brown">
            {filteredProducts.length} ürün listeleniyor
            {!categoryFilter && data.meta.count !== filteredProducts.length
              ? ` (${data.meta.count} toplam)`
              : ""}
          </p>
        )}
      </div>

      {isError && (
        <p className="mt-8 text-center text-sm text-muted">
          Ürünler yüklenirken bir sorun oluştu.
        </p>
      )}

      {!isError && filteredProducts.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          Şu anda listelenecek ürün bulunmuyor.
        </p>
      )}

      {filteredProducts.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ItemProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
