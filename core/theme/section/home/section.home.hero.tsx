import Image from "next/image";
import Link from "next/link";
import { SITE_SLOGAN } from "@/core/constant/site.constant";

export default function SectionHomeHero() {
    const HERO_STATS = [
        { value: "92%", label: "Bitkisel İçerik" },
        { value: "100%", label: "Vegan Formül" },
        { value: "12K", label: "Mutlu Müşteri" },
      ];
      
  return <>
        <section className='relative min-h-[100dvh] overflow-hidden pt-4 lg:pt-8'>
        <div className='absolute inset-0 bg-[radial-gradient(#D9C5B0_0.6px,transparent_1px)] bg-[length:5px_5px] opacity-25' />
        <div className='absolute -right-32 top-20 h-[500px] w-[500px] rounded-full bg-[#D9C5B0]/25 blur-3xl' />
        <div className='absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#C9A99A]/15 blur-3xl' />

        <div className='relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 lg:min-h-[calc(100dvh-7rem)] lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-24'>
          <div className='order-2 lg:order-1'>
            <div className='mb-6 inline-block rounded-full border border-[#C9A99A]/60 px-5 py-1 text-[10px] tracking-[0.3em] uppercase'>Yeni Sezon · 2026</div>
            <h1 className='font-serif text-5xl leading-[0.95] tracking-tight text-[#5C4638] lg:text-[92px] lg:leading-[0.86]'>
              Doğal
              <br />
              <span className='italic text-[#A17E65]'>Güzelliğin</span>
              <br />
              Kodu
            </h1>
            <p className='mt-6 max-w-md text-base leading-relaxed text-[#8B6B57] lg:text-lg'>
              {SITE_SLOGAN}
            </p>
            <div className='mt-10 flex flex-wrap gap-4'>
              <Link
                href='/koleksiyon'
                className='group inline-flex items-center gap-3 rounded-full bg-[#5C4638] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#F8F1E9] transition-all hover:bg-[#3F2F25] hover:scale-[1.02]'>
                Koleksiyonu Keşfet
                <svg className='h-4 w-4 transition-transform group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                </svg>
              </Link>
              <Link
                href='/hakkimizda'
                className='inline-flex items-center rounded-full border border-[#C9A99A] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#5C4638] transition-all hover:bg-[#EDE0D1] hover:border-[#5C4638]'>
                Hikayemiz
              </Link>
            </div>

            <div className='mt-14 flex gap-10 border-t border-[#D9C5B0]/50 pt-10'>
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className='font-serif text-3xl text-[#5C4638]'>{stat.value}</p>
                  <p className='mt-1 text-xs tracking-widest uppercase text-[#8B6B57]'>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='order-1 lg:order-2'>
            <div className='relative mx-auto aspect-[4/5] max-w-md lg:max-w-none'>
              <div className='absolute inset-4 rounded-[2rem] bg-[#D9C5B0]/25' />
              <div className='relative h-full'>
                <Image
                  src='/hero-product.png'
                  alt='Code Blonde premium kozmetik koleksiyonu'
                  fill
                  priority
                  className='object-contain drop-shadow-2xl'
                  sizes='(max-width: 1024px) 100vw, 50vw'
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
}