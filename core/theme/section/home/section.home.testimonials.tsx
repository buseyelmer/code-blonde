import { HOME_DATA } from "@/core/constant/home.constant";

export default function SectionHomeTestimonials() {
  return (
    <section id='yorumlar' className='py-20 lg:py-28'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mb-14 text-center'>
          <p className='text-xs tracking-[0.3em] uppercase text-[#A17E65]'>Yorumlar</p>
          <h2 className='mt-3 font-serif text-4xl text-[#5C4638] lg:text-5xl'>Müşterilerimiz Ne Diyor</h2>
        </div>
        <div className='grid gap-6 md:grid-cols-3'>
          {(HOME_DATA?.TESTIMONIALS ?? []).map((t, index) => (
            <div key={index} className='rounded-2xl border border-[#D9C5B0]/50 bg-white/50 p-8 backdrop-blur-sm'>
              <p className='mt-5 text-[15px] leading-relaxed text-[#5C4638] tracking-tight'>&ldquo;{t.quote}&rdquo;</p>
              <div className='mt-8 pt-6 border-t border-[#C9A99A]/30'>
                <div className='font-medium tracking-tight text-[#5C4638]'>{t.name}</div>
                <div className='text-[#A17E65] text-xs tracking-widest mt-px'>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}