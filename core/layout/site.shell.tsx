"use client";

import Footer from "@/core/component/footer";
import SectionGeneralHeader from "@/core/theme/section/general/section.general.header";
import SectionGeneralTrustBar from "@/core/theme/section/general/section.general.trust.bar";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F1E9] text-[#5C4638]">
      <SectionGeneralHeader />
      <main className="flex-1 pt-[8rem] lg:pt-[9.25rem]">{children}</main>
      <SectionGeneralTrustBar />
      <Footer />
    </div>
  );
}
