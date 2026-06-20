import { Suspense } from "react";
import { SectionHomePageLoader } from "@/theme/section/home/section.home.page.status";
import ProductsPageContent from "./ProductsPageContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<SectionHomePageLoader />}>
      <ProductsPageContent />
    </Suspense>
  );
}
