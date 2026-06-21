"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Leaf, Sparkles, Heart, Recycle } from "lucide-react";
import { HOME_DATA } from "@/core/constant/home.constant";

const VALUES = [
  {
    icon: Heart,
    title: "Ten odaklı formül",
    description: "Her ürün, cildin doğal ritmini koruyacak şekilde geliştirilir.",
  },
  {
    icon: Sparkles,
    title: "Nude uzmanlığı",
    description: "40'tan fazla nude tonuyla her ten rengine özel çözümler sunuyoruz.",
  },
  {
    icon: Leaf,
    title: "Temiz içerik",
    description: "%92 bitkisel kaynaklı, parabensiz ve cruelty-free formüller.",
  },
  {
    icon: Recycle,
    title: "Sürdürülebilirlik",
    description: "Tekrar doldurulabilir ambalajlar ve çevreye duyarlı üretim.",
  },
];

const STATS = [
  { value: "48+", label: "Nude ton" },
  { value: "12K+", label: "Mutlu müşteri" },
  { value: "100%", label: "Vegan formül" },
  { value: "92%", label: "Bitkisel içerik" },
];

export default function Hakkimizda() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F1E9] text-[#5C4638] selection:bg-[#C9A99A] selection:text-[#F8F1E9]">
      <div className="border-b border-[#D9C5B0]/50 bg-[#EDE0D1]/60 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-14 gap-y-2 px-8 text-[11px] font-light tracking-[2.5px] text-[#8B6B57]/80">
          {(HOME_DATA?.TRUST_ITEMS ?? []).map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:py-16">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B6B57]">
          <Link href="/" className="transition-colors hover:text-[#5C4638]">
            Ana Sayfa
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          <span className="text-[#5C4638]">Hakkımızda</span>
        </nav>

        <header className="mb-16 max-w-3xl lg:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-[#A17E65]">Code Blonde</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-[#5C4638] sm:text-5xl lg:text-6xl">
            Doğal güzelliğin <span className="italic text-[#A17E65]">kodu</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#8B6B57] lg:text-lg">
            Nude tonlarda premium kozmetik deneyimi sunan Code Blonde, her kadının kendine özgü güzelliğini
            abartısız ve zarif bir şekilde öne çıkarmak için doğdu.
          </p>
        </header>

        <section className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#A17E65]">Hikayemiz</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-[#5C4638] lg:text-4xl">
              Güzellik, <span className="italic text-[#A17E65]">doğallıktan</span> gelir
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#8B6B57] sm:text-base">
              <p>
                Code Blonde, Paris ve İstanbul&apos;dan ilham alan bir kozmetik markası olarak, teninizin doğal
                tonlarına saygı duyan formüller geliştiriyor. Nude paletimiz, farklı ten renklerine uyum sağlayacak
                şekilde Fransız laboratuvarlarında özenle formüle edildi.
              </p>
              <p>
                Abartısız, zarif ve zamansız bir güzellik anlayışıyla; rujdan fondötene, aydınlatıcıdan allığa
                kadar her ürünümüz günlük rutininize eşlik edecek şekilde tasarlandı.
              </p>
            </div>
            <Link
              href="/koleksiyon"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-[#C9A99A] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#5C4638] transition-all hover:border-[#5C4638] hover:bg-[#EDE0D1]"
            >
              Koleksiyonları keşfet
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-[#E8D5C4] via-[#D9C5B0] to-[#C4A484]">
            <div className="absolute inset-0 bg-[radial-gradient(#F8F1E9_0.6px,transparent_1px)] bg-[length:5px_5px] opacity-20" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#5C4638]/50 to-transparent p-8">
              <p className="text-xs tracking-[0.25em] uppercase text-white/70">Est. 2026</p>
              <p className="mt-2 font-serif text-2xl text-white">Paris • İstanbul • New York</p>
            </div>
          </div>
        </section>

        <section className="mb-20 border-y border-[#D9C5B0]/50 py-16 lg:py-20">
          <div className="mb-12 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#A17E65]">Değerlerimiz</p>
            <h2 className="mt-3 font-serif text-3xl text-[#5C4638] lg:text-4xl">Bizi yönlendiren prensipler</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/40 p-6 transition-colors hover:border-[#C9A99A]/60"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A99A]/50 text-[#A17E65]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 font-medium text-[#5C4638]">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8B6B57]">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-20">
          <div className="grid gap-12 lg:grid-cols-5 lg:items-center">
            <div className="lg:col-span-2">
              <p className="text-xs tracking-[0.3em] uppercase text-[#A17E65]">Yaklaşımımız</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-[#5C4638] lg:text-4xl">
                Güzellik,
                <br />
                sessizce konuşur.
              </h2>
            </div>
            <div className="space-y-8 lg:col-span-3">
              {(HOME_DATA?.PHILOSOPHY ?? []).map((point, idx) => (
                <div key={idx} className="border-l border-[#C9A99A]/60 pl-8">
                  <div className="text-lg font-medium text-[#5C4638]">{point.title}</div>
                  <p className="mt-1.5 leading-relaxed text-[#8B6B57]">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="grid grid-cols-2 gap-6 rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 px-6 py-10 md:grid-cols-4 md:px-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="block font-serif text-3xl text-[#5C4638] md:text-4xl">{stat.value}</span>
                <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] text-[#A17E65]">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {(HOME_DATA?.INGREDIENTS ?? []).map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#D9C5B0]/30 bg-[#EDE0D1]/40 p-6"
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-4 text-sm tracking-wide text-[#5C4638]">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#8B6B57]">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="relative overflow-hidden rounded-2xl bg-[#5C4638] px-8 py-14 text-center text-[#F8F1E9] sm:px-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#C9A99A] to-transparent" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C9A99A]">Vizyonumuz</p>
            <p className="mt-4 font-serif text-2xl leading-relaxed sm:text-3xl">
              Her kadının kendi nude tonunu bulduğu, güzelliğin doğal ve zamansız olduğu bir dünya.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/urunler"
                className="group inline-flex items-center gap-2 rounded-full bg-[#F8F1E9] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#5C4638] transition-all hover:scale-[1.02]"
              >
                Ürünleri incele
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#E8D5C4] transition-colors hover:text-white"
              >
                İletişime geçin
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
