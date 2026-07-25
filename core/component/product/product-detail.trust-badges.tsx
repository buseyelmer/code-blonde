import { RefreshCcw, ShieldCheck, Truck } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "2500₺ ve üzeri kargo ücretsiz",
    description: "Türkiye geneli teslimat",
  },
  {
    icon: RefreshCcw,
    title: "Kolay iade",
    description: "30 gün içinde",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli ödeme",
    description: "Şifreli işlem",
  },
] as const;

export function ProductDetailTrustBadges() {
  return (
    <div className="rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="group/feat flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#D9C5B0]/60 bg-[#F8F1E9] text-[#8B6B57] transition-colors group-hover/feat:border-[#A17E65] group-hover/feat:text-[#A17E65]">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-sm font-medium text-[#5C4638]">{title}</p>
              <p className="mt-0.5 text-xs text-[#8B6B57]">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const PRODUCT_TRUST_LABELS = ["100% Vegan", "Cruelty Free", "Parabensiz"];
