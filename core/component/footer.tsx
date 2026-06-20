export default function Footer() {
    return (
      <footer className='border-t border-[#D9C5B0]/40 bg-[#F5EDE4]/30 pt-16 pb-12 text-xs tracking-widest text-[#8B6B57]'>
        <div className='max-w-7xl mx-auto px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-y-10'>
            <div className='md:col-span-1'>
              <div className='font-serif text-[#5C4638] text-base tracking-normal mb-4'>code blonde</div>
              <p className='max-w-xs text-sm leading-relaxed text-[#8B6B57]'>Doğal güzelliğin kodu. Nude tonlarda premium kozmetik deneyimi.</p>
              <div className='mt-4 text-[10px]'>Paris • İstanbul • New York</div>
            </div>
            
            <div className='space-y-[5px]'>
              <div className='font-medium text-[#5C4638] mb-2'>KOLEKSİYONLAR</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>Velvet Nude</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>Silk Glow</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>Bare Essence</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>Limited Editions</div>
            </div>
            
            <div className='space-y-[5px]'>
              <div className='font-medium text-[#5C4638] mb-2'>KEŞFET</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>Ton Rehberi</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>İçindekiler</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>Sürdürülebilirlik</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>Blog</div>
            </div>
            
            <div className='space-y-[5px]'>
              <div className='font-medium text-[#5C4638] mb-2'>DESTEK</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>İletişim</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>SSS</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>Kargo & İade</div>
              <div className='hover:text-[#5C4638] cursor-pointer'>Gizlilik</div>
            </div>
          </div>
  
          <div className='mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#D9C5B0]/40 pt-8 sm:flex-row'>
            <p className='text-[10px] text-[#A17E65] tracking-[2px]'>© 2026 Code Blonde. Tüm hakları saklıdır.</p>
            <div className='flex gap-6'>
              {["Instagram", "Pinterest", "TikTok"].map((social) => (
                <a key={social} href='#' className='text-[10px] tracking-[2px] text-[#A17E65] transition-colors hover:text-[#5C4638]'>
                  {social.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }
