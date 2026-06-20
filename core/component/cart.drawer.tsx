interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: any[];
    onRemove: (index: number) => void;
    totalPrice: number; // Sepet toplamı için
    cartCount: number;  // Ürün sayısı için
  }
  
  export default function CartDrawer({ isOpen, onClose, items, onRemove, totalPrice, cartCount }: CartDrawerProps) {
    if (!isOpen) return null;
  
    return (
      <div className='fixed inset-0 z-[80] flex justify-end' onClick={onClose}>
        <div className='absolute inset-0 bg-black/40' />
        <div className='relative bg-[#F8F1E9] w-full max-w-md h-full shadow-2xl flex flex-col' onClick={(e) => e.stopPropagation()}>
          
          {/* Başlık */}
          <div className='flex items-center justify-between px-8 pt-9 pb-6 border-b border-[#D9C5B0]'>
            <div>
              <div className='font-serif text-3xl tracking-tight text-[#5C4638]'>Sepetiniz</div>
              <div className='text-xs text-[#A17E65] tracking-widest mt-px'>{cartCount} ÜRÜN</div>
            </div>
            <button onClick={onClose} className='text-xs tracking-[2px] text-[#A17E65]'>KAPAT</button>
          </div>
  
          {/* Sepet İçeriği */}
          {items.length === 0 ? (
            <div className='flex-1 flex items-center justify-center text-center px-8'>
               {/* ... Sepet boş metni ... */}
            </div>
          ) : (
            <>
              <div className='flex-1 overflow-auto px-8 pt-6 space-y-7 text-sm'>
                {items.map((item, index) => (
                  <div key={index} className='flex gap-5 border-b border-[#D9C5B0]/60 pb-7'>
                    {/* ... Ürün görseli ve bilgileri ... */}
                    <button onClick={() => onRemove(index)} className='text-[10px] text-[#A17E65]'>KALDIR</button>
                  </div>
                ))}
              </div>
              
              {/* Alt Ödeme Kısmı */}
              <div className='p-8 border-t border-[#D9C5B0] bg-white/70'>
                 <div className='flex justify-between font-mono text-sm tracking-widest mb-5 text-[#5C4638]'>
                   <div>TOPLAM</div>
                   <div>₺{totalPrice}</div>
                 </div>
                 <button className='w-full py-4 bg-[#5C4638] text-[#F8F1E9] rounded-2xl'>ÖDEMEYE GEÇ</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }