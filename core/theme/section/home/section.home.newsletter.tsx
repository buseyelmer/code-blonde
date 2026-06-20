export default function SectionHomeNewsletter() {
    return (
      <section id='iletisim' className='border-t border-[#D9C5B0]/40 py-20 lg:py-24 bg-[#F5EDE4]/30'>
        <div className='mx-auto max-w-2xl px-6 text-center lg:px-8'>
          <p className='text-xs tracking-[0.3em] uppercase text-[#A17E65]'>Bülten</p>
          <h2 className='mt-3 font-serif text-3xl text-[#5C4638] lg:text-4xl'>Nude dünyasına katılın</h2>
          <p className='mt-4 text-sm text-[#8B6B57]'>Yeni ürünler, özel indirimler ve güzellik ipuçları için abone olun.</p>
          <form className='mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0' onSubmit={(e) => e.preventDefault()}>
            <input type='email' placeholder='E-posta adresiniz' className='flex-1 rounded-full border border-[#D9C5B0] bg-white/50 px-6 py-4 text-sm text-[#5C4638] focus:outline-none sm:rounded-r-none' />
            <button type='submit' className='rounded-full bg-[#5C4638] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#F8F1E9] transition-colors hover:bg-[#3F2F25] sm:rounded-l-none'>
              Abone Ol
            </button>
          </form>
        </div>
      </section>
    );
  }