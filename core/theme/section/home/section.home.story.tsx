import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOME_DATA } from "@/core/constant/home.constant";

export default function SectionHomeStory() {
  return (
    <section
      id="hikaye"
      className="relative overflow-hidden border-y border-[#D9C5B0]/50 bg-[#F5EDE4]/80 py-16 sm:py-14 lg:py-16"
    >
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#D9C5B0]/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#C9A99A]/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:gap-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="order-2 lg:order-1">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#A17E65] sm:text-xs">Hikayemiz</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-[#5C4638] sm:mt-3 sm:text-4xl lg:text-5xl">
            Doğal güzelliğin <br />
            <span className="italic text-[#A17E65]">kodu</span>
          </h2>
          <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#8B6B57] sm:mt-6 sm:space-y-4 sm:text-base">
            <p>
              Code Blonde, Paris ve İstanbul&apos;dan ilham alan bir kozmetik markası olarak saç, cilt ve vücut
              bakımında doğal formüller geliştiriyor. Her ürün günlük ritualinize uyum sağlayacak şekilde
              özenle formüle edildi.
            </p>
            <p>
              Abartısız, zarif ve zamansız bir güzellik anlayışıyla parfümden peelinge, saç kreminden ağdaya
              geniş bir yelpaze sunuyoruz.
            </p>
          </div>
          <Link
            href="/hakkimizda"
            className="group mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5C4638] px-6 py-3.5 text-[10px] tracking-[0.2em] uppercase text-[#F8F1E9] transition-colors hover:bg-[#4A3728] sm:mt-10 sm:w-auto sm:px-8 sm:py-4 sm:text-xs"
          >
            Hakkımızda
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="order-1 grid grid-cols-2 gap-4 sm:gap-4 lg:order-2">
          {(HOME_DATA?.INGREDIENTS ?? []).map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#D9C5B0]/50 bg-[#FDFAF6] p-5 shadow-[0_2px_12px_rgba(92,70,56,0.04)] sm:p-6"
            >
              <span className="text-xl sm:text-2xl">{item.icon}</span>
              <h3 className="mt-4 text-xs tracking-wide text-[#5C4638] sm:mt-4 sm:text-sm">{item.title}</h3>
              <p className="mt-2 text-[11px] leading-relaxed text-[#8B6B57] sm:mt-2 sm:text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
