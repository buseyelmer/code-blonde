"use client";

import { HeroSlider } from "@/components/HeroSlider";
import { CategoryNav } from "@/components/CategoryNav";
import { BestSellersSection } from "@/components/BestSellersSection";
import { ProductGrid } from "@/components/ProductGrid";
import { NewArrivalsSection } from "@/components/NewArrivalsSection";
import { PromoSection } from "@/components/PromoSection";
import { HomePageError, HomePageLoader } from "@/components/HomePageStatus";
import { useSandboxData } from "@/hooks/useHomeData";

export function HomePage() {
  const { data, isLoading, isError, error, refetch } = useSandboxData();

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
    <>
      <div className="py-6 sm:py-8 lg:py-10">
        <HeroSlider />
      </div>
      <CategoryNav categories={data?.category} />
      <BestSellersSection
        products={
          data?.bestSeller?.length ? data.bestSeller : data?.products
        }
      />
      <ProductGrid products={data?.products} />
      <NewArrivalsSection products={data?.products} />
      <PromoSection />
    </>
  );
}
