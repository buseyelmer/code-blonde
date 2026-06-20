import { PHILOSOPHY } from "@/core/constant/home.constant";

export default function SectionHomePhilosophy() {
  return (
    <section className='bg-[#EDE0D1] py-20 border-y border-[#D9C5B0]/70'>
      <div className='max-w-5xl mx-auto px-8'>
        <div className='grid md:grid-cols-5 gap-x-16 gap-y-16 items-center'>
          <div className='md:col-span-2'>
            <div className='uppercase tracking-[4px] text-xs text-[#A17E65] mb-3'>OUR APPROACH</div>
            <h3 className='font-serif text-[54px] leading-none tracking-[-1.6px] text-[#5C4638]'>
              Güzellik,
              <br />
              sessizce konuşur.
            </h3>
          </div>
          <div className='md:col-span-3 space-y-8 text-[15px] text-[#5C4638] tracking-tight'>
            {(PHILOSOPHY ?? []).map((point, idx) => (
              <div key={idx} className='pl-8 border-l border-[#C9A99A]/60'>
                <div className='font-medium text-lg tracking-[-0.1px] mb-1.5'>{point.title}</div>
                <div className='text-[#8B6B57] leading-relaxed'>{point.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}