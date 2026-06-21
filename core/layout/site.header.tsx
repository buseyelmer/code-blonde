import { Suspense } from "react";
import SectionGeneralHeader from "@/core/theme/section/general/section.general.header";

function HeaderFallback() {
  return (
    <div
      className="fixed inset-x-0 top-0 z-50 border-b border-[#D9C5B0]/30 bg-[#F8F1E9]/85 backdrop-blur-sm"
      aria-hidden
    >
      <div className="mx-auto h-[8rem] max-w-7xl px-4 sm:px-6 lg:h-[9.25rem] lg:px-8" />
    </div>
  );
}

export default function SiteHeader() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <SectionGeneralHeader />
    </Suspense>
  );
}
