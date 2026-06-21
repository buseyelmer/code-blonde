import Footer from "@/core/component/footer";
import SectionGeneralHeader from "@/core/theme/section/general/section.general.header";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F1E9] text-[#5C4638]">
      <SectionGeneralHeader />
      <main className="flex-1 pt-20 lg:pt-24">{children}</main>
      <Footer />
    </div>
  );
}
