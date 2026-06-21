import { Product, Shade } from "@/core/constant/home.constant";
import { palette } from "@/core/constant/home.constant";

interface ProductModalProps {
  product: Product;
  currentShade: Shade;
  onClose: () => void;
  onAddToCart: () => void;
  isAdded: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export default function ProductModal({ product, currentShade, onClose, onAddToCart, isAdded, setIsCartOpen }: ProductModalProps) {
  return (
    <div className='fixed inset-0 z-[70] flex items-center justify-center bg-[#5C4638]/70 p-4' onClick={onClose}>
      <div className='bg-[#F8F1E9] rounded-3xl max-w-[980px] w-full overflow-hidden shadow-2xl' onClick={(e) => e.stopPropagation()}>
        <div className='grid md:grid-cols-5'>
          {/* Sol taraf: Görsel */}
          <div className='md:col-span-3 relative min-h-[420px] flex items-center justify-center p-12' style={{ background: `linear-gradient(160deg, #F8F1E9, ${palette.warmBeige})` }}>
            <div className='relative flex flex-col items-center'>
              <div className='relative'>
                <div className='w-16 h-9 rounded-t-2xl shadow-inner z-10 relative' style={{ backgroundColor: currentShade.hex }} />
                <div className='w-24 h-[210px] rounded-[22px] -mt-1 shadow-xl flex items-end justify-center pb-8' style={{ backgroundColor: "#FBF6F0", boxShadow: "0 25px 50px -12px rgb(92 70 56 / 0.25)" }}>
                  <div className='text-center'>
                    <div className='mx-auto mb-3 w-9 h-9 rounded-full ring-[6px] ring-offset-4 ring-offset-[#FBF6F0] ring-[#D9C5B0]/40' style={{ backgroundColor: currentShade.hex }} />
                    <div className='text-[10px] tracking-[3px] text-[#A17E65]'>{product.volume}</div>
                  </div>
                </div>
              </div>
              <div className='mt-7 text-center'>
                <div className='font-mono text-xs tracking-[4px] text-[#A17E65]'>{currentShade.name.toUpperCase()}</div>
                <div className='font-serif text-4xl tracking-[-1px] mt-px text-[#5C4638]'>{product.name}</div>
              </div>
            </div>
            <button onClick={onClose} className='absolute top-8 right-8 text-xs tracking-[2px] hover:text-[#A17E65] transition'>KAPAT</button>
          </div>

          {/* Sağ taraf: Detaylar */}
          <div className='md:col-span-2 p-10 md:pr-12 flex flex-col'>
            <div>
              <div className='uppercase text-[#A17E65] tracking-[3px] text-xs mb-1'>{product.category}</div>
              <div className='font-serif text-[38px] tracking-[-1.2px] leading-none mb-1'>{product.name}</div>
              <div className='font-mono text-lg tabular-nums text-[#A17E65]'>₺{product.price}</div>
            </div>
            <p className='mt-6 text-[15px] leading-snug tracking-tight text-[#5C4638]'>{product.description}</p>
            <p className='mt-4 text-sm leading-relaxed text-[#8B6B57] tracking-tight'>{product.details}</p>
            
            <div className='mt-auto pt-9'>
               <div className='flex items-center justify-between mb-3'>
                  <div className='text-xs tracking-[2.5px] text-[#A17E65]'>TON SEÇ</div>
                  <div className='font-mono text-xs tracking-widest'>{currentShade.name}</div>
               </div>
               <div className='mt-8 flex gap-3'>
                  <button onClick={onAddToCart} className={`flex-1 py-[17px] rounded-2xl text-sm tracking-[2.5px] transition-all active:scale-[0.985] ${isAdded ? "bg-[#A17E65] text-white" : "bg-[#5C4638] text-[#F8F1E9] hover:bg-black"}`}>
                    {isAdded ? "SEPETE EKLENDİ" : "SEPETE EKLE"}
                  </button>
                  <button onClick={() => { onAddToCart(); setTimeout(() => { onClose(); setIsCartOpen(true); }, 650); }} className='px-8 border border-[#C9A99A] text-[#5C4638] rounded-2xl text-xs tracking-[2px] hover:bg-white transition'>
                    HEMEN AL
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}