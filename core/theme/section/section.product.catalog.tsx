import { SectionProductGrid } from "@/theme/section/section.product.grid";
import { SectionProductGridBreadcrumb } from "@/theme/section/section.product.grid.breadcrumb";

export function SectionProductCatalog() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <SectionProductGridBreadcrumb />
        <SectionProductGrid />
      </div>
    </main>
  );
}
