"use client";

import { Suspense } from "react";
import UrunlerPageClient from "@/core/component/urunler.page.client";

export default function UrunlerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E9]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
        </div>
      }
    >
      <UrunlerPageClient />
    </Suspense>
  );
}
