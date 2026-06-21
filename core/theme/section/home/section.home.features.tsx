const FEATURES = [
  { value: "100% VEGAN", label: "Doğal İçerik" },
  { value: "30+ TON", label: "Ten Uyumu" },
  { value: "CRUELTY FREE", label: "Etik Üretim" },
  { value: "12K+ MUTLU", label: "Kullanıcı Deneyimi" },
] as const;

export default function SectionFeatures() {
  return (
    <section className="border-y border-[#D9C5B0]/40 bg-[#F5EDE4]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-x divide-y divide-[#D9C5B0]/50 py-12 lg:grid-cols-4 lg:divide-y-0 lg:py-16">
          {FEATURES.map((feature) => (
            <div key={feature.value} className="flex flex-col items-center justify-center px-6 py-6 text-center lg:px-10">
              <p className="font-serif text-xl tracking-tight text-[#5C4638] sm:text-2xl lg:text-[1.75rem]">
                {feature.value}
              </p>
              <p className="mt-3 text-[10px] tracking-[0.35em] uppercase text-[#A17E65]">
                {feature.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex w-full items-center justify-center gap-2.5 border-t border-[#D9C5B0]/40 py-8 lg:py-10">
          <svg
            className="h-3.5 w-3.5 shrink-0 text-[#A17E65]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-[11px] tracking-[0.22em] uppercase text-[#8B6B57]">
            Tüm ürünlerimizde doğallık ve kalite garantisi.
          </p>
        </div>
      </div>
    </section>
  );
}
