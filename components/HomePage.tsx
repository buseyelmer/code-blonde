"use client";

import { useMemo } from "react";
import { HeroSlider } from "@/components/HeroSlider";
import { CategoryNav } from "@/components/CategoryNav";
import { BestSellersSection } from "@/components/BestSellersSection";
import { ProductGrid } from "@/components/ProductGrid";
import { NewArrivalsSection } from "@/components/NewArrivalsSection";
import { PromoSection } from "@/components/PromoSection";
import { HomeSection } from "@/components/HomeSection";
import { HomePageError, HomePageLoader } from "@/components/HomePageStatus";
import { useSandboxData } from "@/hooks/useHomeData";
import { mapApiProductsToCards } from "@/lib/api/mappers";

export function HomePage() {
  const { data, isLoading, isError, error, refetch } = useSandboxData();

  const cardProducts = useMemo(
    () => mapApiProductsToCards(data?.products),
    [data?.products],
  );

  const bestSellerSource = useMemo(
    () =>
      data?.bestSeller?.length ? data.bestSeller : data?.products,
    [data?.bestSeller, data?.products],
  );

  if (isLoading) {
    return <HomePageLoader />;
  }

  if (isError) {
    return (
      <HomePageError
        message={error?.message ?? "Veriler yüklenirken bir sorun oluştu."}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <HomeSection className="mt-6 sm:mt-8 lg:mt-10">
        <HeroSlider />
      </HomeSection>

      <HomeSection bleed bleedClassName="border-b border-stone/40 bg-cream">
        <CategoryNav productCategories={data?.productCategories} />
      </HomeSection>

      <HomeSection>
        <BestSellersSection products={bestSellerSource} />
      </HomeSection>

      <HomeSection>
        <NewArrivalsSection
          products={cardProducts}
          productCategories={data?.productCategories}
        />
      </HomeSection>

      <HomeSection>
        <ProductGrid products={cardProducts} />
      </HomeSection>

      <HomeSection>
        <PromoSection />
      </HomeSection>
    </div>
  );
}
