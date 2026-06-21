import { Leaf, Heart, Flower2 } from "lucide-react";

const VALUES = [
  {
    icon: Leaf,
    title: "Vegan",
    description: "Hayvansal içerik içermeyen, bitkisel kaynaklı formüller.",
  },
  {
    icon: Heart,
    title: "Cruelty-Free",
    description: "Hiçbir aşamada hayvan testi yapılmaz.",
  },
  {
    icon: Flower2,
    title: "Doğal İçerik",
    description: "Özenle seçilmiş, cilde nazik doğal bileşenler.",
  },
] as const;

export default function SectionHomeValues() {
  return (
    <section className="bg-[#F8F1E9] pt-14 pb-12 lg:pt-16 lg:pb-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 justify-items-center gap-12 sm:grid-cols-3 sm:gap-8 lg:gap-12">
          {VALUES.map((item) => (
            <div
              key={item.title}
              className="flex max-w-[220px] flex-col items-center text-center"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#D9C5B0]/60">
                <item.icon className="h-5 w-5 text-[#5C4638]" strokeWidth={1} aria-hidden />
              </div>
              <h3 className="font-serif text-xl tracking-tight text-[#5C4638] sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#8B6B57]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
