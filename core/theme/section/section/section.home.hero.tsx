"use client";

import { useMemo } from "react";
import { SectionHomePageError, SectionHomePageLoader } from "@/theme/section/home/section.home.page.status";
import { useSandboxData } from "@/hooks/useHomeData";
import { mapApiProductsToCards } from "@/lib/api/mappers";
import { SectionHomeBannerGrid } from "@/theme/section/section.home.banner.grid";
import { SectionHomeCategoryNav } from "@/theme/section/section.home.category.nav";
import { SectionHomeHeroSlider } from "@/theme/section/section.home.hero.slider";
import { SectionHomePromo } from "@/theme/section/section.home.promo";
import { SectionProductBestsellers } from "@/theme/section/section.product.bestsellers";
import { SectionProductNewArrivals } from "@/theme/section/section.product.new.arrivals";
import { SectionHomeFeaturedGrid } from "@/theme/section/section.home.featured.grid";
import { ViewHomeSection } from "@/theme/view/view.home.section";

export function SectionHomeHero() {
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
    return <SectionHomePageLoader />;
  }

  if (isError) {
    return (
      <SectionHomePageError
        message={error?.message ?? "Veriler yüklenirken bir sorun oluştu."}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <ViewHomeSection className="mt-6 sm:mt-8 lg:mt-10">
        <SectionHomeHeroSlider />
      </ViewHomeSection>

      <ViewHomeSection bleed bleedClassName="border-b border-stone/40 bg-cream">
        <SectionHomeCategoryNav productCategories={data?.productCategories} />
      </ViewHomeSection>

      <ViewHomeSection>
        <SectionProductBestsellers products={bestSellerSource} />
      </ViewHomeSection>

      <ViewHomeSection>
        <SectionHomeBannerGrid productCategories={data?.productCategories} />
      </ViewHomeSection>

      <ViewHomeSection>
        <SectionProductNewArrivals
          products={cardProducts}
          productCategories={data?.productCategories}
        />
      </ViewHomeSection>

      <ViewHomeSection>
        <SectionHomeFeaturedGrid products={cardProducts} />
      </ViewHomeSection>

      <ViewHomeSection className="!mb-0">
        <SectionHomePromo />
      </ViewHomeSection>
    </div>
  );
}
