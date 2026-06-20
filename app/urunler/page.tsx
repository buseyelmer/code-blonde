'use client';

import SectionProductGrid from '@/core/theme/section/product/section.product.grid';
import { SectionProductGridBreadcrumb } from '@/core/theme/section/product/section.product.grid.breadcrumb';

export default function UrunlerPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <SectionProductGridBreadcrumb />
        <SectionProductGrid />
      </div>
    </main>
  );
}
