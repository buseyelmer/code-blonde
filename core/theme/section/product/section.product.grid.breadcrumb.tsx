import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function SectionProductGridBreadcrumb() {
  return (
    <nav
      className="mb-8 flex flex-wrap items-center gap-2 border-b border-stone/50 pb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted"
      aria-label="Breadcrumb"
    >
      <Link href="/" className="inline-flex items-center gap-2 transition-colors hover:text-charcoal">
        <Home className="h-3.5 w-3.5" strokeWidth={1.5} />
        Ana Sayfa
      </Link>
      <ChevronRight className="h-3 w-3 shrink-0 text-stone" />
      <span className="text-charcoal">Ürünler</span>
    </nav>
  );
}
