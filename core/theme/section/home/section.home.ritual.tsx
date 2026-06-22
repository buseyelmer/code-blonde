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

function RitualStep({ item }: { item: (typeof STEPS)[number] }) {
  const Icon = item.icon;

  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left">
      <div className="mb-5 w-full">
        <p className="font-mono text-[10px] tracking-[0.3em] text-[#A17E65]/80">Adım {item.step}</p>
        <div className="mt-3 h-px w-full bg-[#D9C5B0]/50" aria-hidden />
      </div>

      <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center border border-[#D9C5B0]/60 bg-[#F8F1E9]">
        <Icon className="h-5 w-5 text-[#5C4638]" strokeWidth={1} aria-hidden />
      </div>

      <h3 className="font-serif text-2xl tracking-tight text-[#5C4638]">{item.title}</h3>
      <p className="mt-3 max-w-[240px] text-sm leading-relaxed text-[#8B6B57]">{item.description}</p>
    </div>
  );
}

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

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3 md:items-start md:gap-8 lg:gap-14">
          {STEPS.map((item) => (
            <RitualStep key={item.step} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
