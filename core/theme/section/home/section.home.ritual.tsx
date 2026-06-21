import { Droplets, Flower2, Sparkles } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Droplets,
    title: "Arındır",
    description: "Cildi nazikçe temizleyerek makyaja hazırlayın.",
  },
  {
    step: "02",
    icon: Flower2,
    title: "Besle",
    description: "Teninize nem ve bakım veren formülleri uygulayın.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Işılda",
    description: "Doğal tonlarla zarif ve kalıcı bir bitiş yaratın.",
  },
] as const;

export default function SectionHomeRitual() {
  return (
    <section className="border-y border-[#D9C5B0]/40 bg-[#FDFAF6] py-16 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-12">
          <p className="text-[10px] tracking-[0.38em] uppercase text-[#A17E65]">Kullanım Ritüeli</p>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-[#5C4638] sm:text-4xl lg:text-[2.75rem]">
            Üç Adımda Mükemmel Ten
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#8B6B57]">
            Code Blonde rutininiz, cildinizin doğal ritmine uyum sağlayacak şekilde tasarlandı.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-14">
          {STEPS.map((item, index) => (
            <div key={item.step} className="relative flex flex-col items-center text-center md:items-start md:text-left">
              {index < STEPS.length - 1 && (
                <div
                  className="absolute left-1/2 top-6 hidden h-px w-full -translate-y-1/2 bg-[#D9C5B0]/50 md:left-[calc(50%+2rem)] md:block md:w-[calc(100%-4rem)]"
                  aria-hidden
                />
              )}
              <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-[#A17E65]/80">
                Adım {item.step}
              </p>
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#D9C5B0]/60 bg-[#F8F1E9]">
                <item.icon className="h-5 w-5 text-[#5C4638]" strokeWidth={1} aria-hidden />
              </div>
              <h3 className="font-serif text-2xl tracking-tight text-[#5C4638]">{item.title}</h3>
              <p className="mt-3 max-w-[240px] text-sm leading-relaxed text-[#8B6B57]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
