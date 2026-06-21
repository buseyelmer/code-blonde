import { Star } from "lucide-react";
import { HOME_DATA } from "@/core/constant/home.constant";

export default function SectionHomeTestimonials() {
  return (
    <section id="yorumlar" className="relative overflow-hidden bg-[#5C4638] py-16 text-[#F8F1E9] sm:py-14 lg:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#F8F1E9 0.6px, transparent 0.6px)",
          backgroundSize: "12px 12px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#4A3728]/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-10">
          <p className="text-[10px] tracking-[0.38em] uppercase text-[#C9A99A]">Müşteri Yorumları</p>
          <h2 className="mt-3 font-serif text-2xl sm:mt-3 sm:text-3xl lg:text-4xl xl:text-5xl">
            Code Blonde Deneyimi
          </h2>
          <p className="mx-auto mt-4 max-w-lg px-2 text-sm leading-relaxed text-[#E8D5C4]/85 sm:mt-4">
            Gerçek kullanıcılarımızın saç, cilt ve vücut bakım ritualinde Code Blonde ile yaşadıkları.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {(HOME_DATA?.TESTIMONIALS ?? []).map((t) => (
            <article
              key={t.name}
              className="rounded-2xl border border-[#C9A99A]/30 bg-[#4A3728]/35 p-5 backdrop-blur-sm sm:p-6 lg:p-8"
            >
              <div className="mb-3 flex gap-0.5 sm:mb-4" aria-label={`${t.rating} yıldız`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#D9C5B0] text-[#D9C5B0]" />
                ))}
              </div>
              <p className="text-sm leading-relaxed tracking-tight text-[#F8F1E9]/95 sm:text-[15px]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-[#C9A99A]/25 pt-5">
                <p className="font-medium tracking-tight text-[#F8F1E9]">{t.name}</p>
                <p className="mt-1 text-xs tracking-widest text-[#C9A99A]">{t.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
