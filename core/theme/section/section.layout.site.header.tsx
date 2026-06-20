import { SectionHomeCategoryBar } from "@/theme/section/section.home.category.bar";
import { SectionLayoutHeader } from "@/theme/section/section.layout.header";

export function SectionLayoutSiteHeader() {
  return (
    <div className="sticky top-0 z-50 w-full min-w-0 max-w-full overflow-hidden">
      <SectionLayoutHeader />
      <SectionHomeCategoryBar />
    </div>
  );
}
