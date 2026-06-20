import { HOME_DATA } from "@/core/constant/home.constant";

export default function SectionHomeStory() {
  return (
    <section id='hikaye' className='relative overflow-hidden bg-[#5C4638] py-20 text-[#F8F1E9] lg:py-28'>
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#C9A99A] to-transparent' />
      </div>
      <div className='relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8'>
        <div>
          <p className='text-xs tracking-[0.3em] uppercase text-[#C9A99A]'>Hikayemiz</p>
          <h2 className='mt-3 font-serif text-4xl leading-tight lg:text-5xl'>
            Güzellik, <br />
            <span className='italic text-[#E8D5C4]'>doğallıktan</span> gelir
          </h2>
          <p className='mt-6 leading-relaxed text-[#E8D5C4]/80'>
            Code Blonde, her kadının kendine özgü güzelliğini öne çıkarmak için doğdu. Nude tonlarımız, farklı ten renklerine uyum sağlayacak şekilde özenle formüle edildi — abartısız, zarif ve zamansız.
          </p>
          <button className='mt-10 rounded-full border border-[#C9A99A] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#E8D5C4] transition-colors hover:bg-[#C9A99A] hover:text-[#5C4638]'>
            Daha Fazla Oku
          </button>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          {(HOME_DATA?.INGREDIENTS ?? []).map((item) => (
            <div key={item.title} className='rounded-2xl border border-[#C9A99A]/20 bg-[#F8F1E9]/5 p-6 backdrop-blur-sm'>
              <span className='text-2xl'>{item.icon}</span>
              <h3 className='mt-4 text-sm tracking-wide text-[#F8F1E9]'>{item.title}</h3>
              <p className='mt-2 text-xs leading-relaxed text-[#E8D5C4]/60'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}