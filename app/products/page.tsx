import { Suspense } from "react";
import { HomePageLoader } from "@/components/HomePageStatus";
import ProductsPageContent from "./ProductsPageContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<HomePageLoader />}>
      <ProductsPageContent />
    </Suspense>
  );
}
