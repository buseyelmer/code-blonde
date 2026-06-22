import Image from "next/image";
import Link from "next/link";
import { SITE_SLOGAN } from "@/core/constant/site.constant";

const HERO_STATS = [
  { value: "92%", label: "Bitkisel İçerik" },
  { value: "100%", label: "Vegan Formül" },
  { value: "12K", label: "Mutlu Müşteri" },
] as const;

export default function SectionHomeHero() {
  return (
    <section className="relative overflow-x-clip py-7 sm:py-9 lg:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#D9C5B0_0.6px,transparent_1px)] bg-[length:5px_5px] opacity-25" />
      <div className="pointer-events-none absolute -right-32 top-16 h-[420px] w-[420px] rounded-full bg-[#D9C5B0]/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-1/2 h-[320px] w-[320px] rounded-full bg-[#C9A99A]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-11 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <div className="mb-5 inline-block rounded-full border border-[#C9A99A]/60 px-5 py-1 text-[10px] tracking-[0.3em] uppercase sm:mb-6">
              Yeni Sezon · 2026
            </div>
            <h1 className="font-serif text-5xl leading-[0.95] tracking-tight text-[#5C4638] sm:text-6xl lg:text-[4.5rem] lg:leading-[0.92] xl:text-[5rem]">
              Doğal
              <br />
              <span className="italic text-[#A17E65]">Güzelliğin</span>
              <br />
              Kodu
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#8B6B57] sm:mt-6 lg:max-w-xl lg:text-lg xl:max-w-2xl">
              {SITE_SLOGAN}
            </p>
            <div className="mt-7 flex flex-wrap gap-4 sm:mt-8">
              <Link
                href="/koleksiyon"
                className="group inline-flex items-center gap-3 rounded-full bg-[#5C4638] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#F8F1E9] transition-all hover:scale-[1.02] hover:bg-[#3F2F25]"
              >
                Koleksiyonu Keşfet
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/hakkimizda"
                className="inline-flex items-center rounded-full border border-[#C9A99A] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#5C4638] transition-all hover:border-[#5C4638] hover:bg-[#EDE0D1]"
              >
                Hikayemiz
              </Link>
            </div>

            <div className="mt-9 grid w-full grid-cols-3 gap-4 border-t border-[#D9C5B0]/50 pt-8 sm:mt-10 sm:gap-6 sm:pt-9 lg:max-w-xl xl:max-w-2xl">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <p className="font-serif text-2xl leading-none text-[#5C4638] sm:text-3xl">{stat.value}</p>
                  <p className="mt-2 text-[10px] leading-snug tracking-[0.16em] text-[#8B6B57] sm:text-xs sm:tracking-[0.18em]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-center lg:justify-end">
            <div className="relative aspect-[4/5] w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[400px] xl:max-w-[440px]">
              <Image
                src="/hero-product.png"
                alt="Code Blonde premium kozmetik koleksiyonu"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 90vw, 45vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
