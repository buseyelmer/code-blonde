"use client";

import { HOME_DATA, Product } from "@/core/constant/home.constant";
import ProductVisual from "@/core/component/product.visual";

interface Props {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  setSelectedProduct: (p: Product) => void;
  hoveredProduct: number | null;
  setHoveredProduct: (id: number | null) => void;
}

export default function SectionHomeProducts({ 
  activeCategory, 
  setActiveCategory, 
  setSelectedProduct, 
  hoveredProduct, 
  setHoveredProduct 
}: Props) {
  
  const products = HOME_DATA?.PRODUCTS ?? [];

  const filteredProducts = activeCategory === "Tümü"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section id='urunler' className='py-20 lg:py-28 bg-[#F5EDE4]/30'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end'>
          <div>
            <p className='text-xs tracking-[0.3em] uppercase text-[#A17E65]'>Ürünler</p>
            <h2 className='mt-3 font-serif text-4xl text-[#5C4638] lg:text-5xl'>En Sevilenler</h2>
          </div>
          <p className='max-w-xs text-sm text-[#8B6B57]'>Teninizle bütünleşen, doğal görünümlü formüller</p>
        </div>

        <div className='flex flex-wrap justify-center gap-2 mb-12'>
 
  {HOME_DATA?.CATEGORIES?.map((cat) => (
    <button
      key={cat}
      onClick={() => setActiveCategory(cat)}
      className={`px-4 py-2 rounded-full transition-all ${
        activeCategory === cat 
          ? "bg-[#5C4638] text-white" 
          : "bg-[#EDE0D1] text-[#5C4638] hover:bg-[#D9C5B0]"
      }`}
    >
      {cat}
    </button>
  ))}
</div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className='group text-left bg-white rounded-3xl overflow-hidden border border-[#EDE0D1] hover:border-[#C9A99A] transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl'>
              <div className='relative h-80 flex items-center justify-center overflow-hidden' style={{ background: `linear-gradient(145deg, ${HOME_DATA?.palette?.cream ?? '#F8F1E9'}, ${HOME_DATA?.palette?.warmBeige ?? '#EDE0D1'})` }}>
                {product.badge && <span className='absolute left-4 top-4 z-10 rounded-full bg-[#5C4638] px-3 py-1 text-[10px] tracking-widest uppercase text-[#F8F1E9]'>{product.badge}</span>}
                
                <ProductVisual shadeHex={product.shades[0].hex} volume={product.volume} />

                <div className={`absolute inset-0 bg-[#5C4638]/0 group-hover:bg-[#5C4638]/5 transition-all duration-500 flex items-end justify-center pb-6 ${hoveredProduct === product.id ? "opacity-100" : "opacity-0"}`}>
                  <span className='bg-[#5C4638] text-[#F8F1E9] px-6 py-2 rounded-full text-xs tracking-[2px]'>İNCELE</span>
                </div>
              </div>

              <div className='p-7 flex-1 flex flex-col'>
                <div className='flex items-baseline justify-between'>
                  <div>
                    <div className='text-[10px] tracking-[2.5px] text-[#A17E65]'>{product.category.toUpperCase()}</div>
                    <div className='font-serif text-[22px] tracking-[-0.3px] text-[#5C4638] mt-0.5 leading-none'>{product.name}</div>
                  </div>
                  <div className='font-mono text-sm text-[#A17E65] tabular-nums tracking-tighter'>₺{product.price}</div>
                </div>
                <p className='mt-auto pt-5 text-[13px] leading-snug tracking-tight text-[#8B6B57] pr-2'>{product.description}</p>
                <div className='flex gap-1.5 mt-6'>
                  {product.shades.slice(0, 4).map((shade, i) => (
                    <div key={i} className='w-5 h-5 rounded-full border border-white/70 shadow-sm' style={{ backgroundColor: shade.hex }} title={shade.name} />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}