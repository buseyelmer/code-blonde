import { useRaxon } from "@raxonltd/raxon-core";
import { Truck, Sparkles, Globe, Zap, Headphones } from "lucide-react";

export function SectionAnnouncement() {
  const { defaultDeliveryMethod } = useRaxon();
  const limit = defaultDeliveryMethod?.minimumOrderAmount;

  return (
    <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex items-center justify-between h-11 text-[11px] uppercase tracking-[0.15em] font-semibold">
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 text-rose-100 hover:text-white transition-colors duration-300 cursor-default">
              <Globe className="w-3.5 h-3.5" />
              <span>Dünya Çapında</span>
            </div>
            <div className="flex items-center gap-2 text-rose-100 hover:text-white transition-colors duration-300 cursor-default">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Kalite</span>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center px-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-default whitespace-nowrap">
              <Zap className="w-3.5 h-3.5 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-white font-bold">{limit}</span>
              <span className="text-white/90">TL üzeri</span>
              <span className="text-rose-100">ücretsiz kargo</span>
              <Truck className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 text-rose-100 hover:text-white transition-colors duration-300 cursor-default">
              <Headphones className="w-3.5 h-3.5" />
              <span>7/24 Destek</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-100 hover:text-white transition-colors duration-300 cursor-pointer">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold">TR</span>
              <span>Türkçe</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  );
}
