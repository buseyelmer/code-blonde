import { HeroSlider } from "@/components/HeroSlider";
import { CategoryNav } from "@/components/CategoryNav";
import { BestSellersSection } from "@/components/BestSellersSection";
import { ProductGrid } from "@/components/ProductGrid";
import { NewArrivalsSection } from "@/components/NewArrivalsSection";
import { PromoSection } from "@/components/PromoSection";

export default function Home() {
  return (
    <>
      <div className="py-6 sm:py-8 lg:py-10">
        <HeroSlider />
      </div>
      <CategoryNav />
      <BestSellersSection />
      <ProductGrid />
      <NewArrivalsSection />
      <PromoSection />
    </>
  );
}
