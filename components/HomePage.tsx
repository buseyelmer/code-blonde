"use client";

import { HeroSlider } from "@/components/HeroSlider";
import { CategoryNav } from "@/components/CategoryNav";
import { BestSellersSection } from "@/components/BestSellersSection";
import { ProductGrid } from "@/components/ProductGrid";
import { NewArrivalsSection } from "@/components/NewArrivalsSection";
import { PromoSection } from "@/components/PromoSection";
import { HomeSection } from "@/components/HomeSection";
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
    <div className="w-full max-w-full overflow-x-hidden">
      <HomeSection className="mt-6 sm:mt-8 lg:mt-10">
        <HeroSlider />
      </HomeSection>

      <HomeSection bleed bleedClassName="border-b border-stone/40 bg-cream">
        <CategoryNav productCategories={data?.productCategories} />
      </HomeSection>

      <HomeSection>
        <BestSellersSection
          products={
            data?.bestSeller?.length ? data.bestSeller : data?.products
          }
        />
      </HomeSection>

      <HomeSection>
        <NewArrivalsSection
          products={data?.products}
          productCategories={data?.productCategories}
        />
      </HomeSection>

      <HomeSection>
        <ProductGrid products={data?.products} />
      </HomeSection>

      <HomeSection>
        <PromoSection />
      </HomeSection>
    </div>
  );
}
