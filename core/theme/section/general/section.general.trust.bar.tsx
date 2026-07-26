import { Heart, ShieldCheck, Truck, UserRoundCheck } from "lucide-react";

const TRUST_ITEMS = [
  {
    label: "GÜVENLİ ÜRÜNLER",
    icon: ShieldCheck,
  },
  {
    label: "UZMAN DANIŞMANLIK",
    icon: UserRoundCheck,
  },
  {
    label: "HIZLI TESLİMAT",
    icon: Truck,
  },
  {
    label: "MÜŞTERİ MEMNUNİYETİ",
    icon: Heart,
  },
] as const;

export default function SectionGeneralTrustBar() {
  return (
    <section className="bg-[#5C4638]" aria-label="Hizmet avantajları">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 lg:grid-cols-4 lg:gap-0 lg:py-10">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-center gap-3 text-[#A17E65] lg:justify-center"
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden />
                <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#F8F1E9]">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
