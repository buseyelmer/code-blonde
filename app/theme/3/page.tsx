'use client';

import React, { useState } from 'react';

interface Shade {
  name: string;
  hex: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  details: string;
  shades: Shade[];
  volume: string;
}

const brandName = "code blonde";

const nudePalette = {
  cream: '#F8F1E9',
  warmBeige: '#EDE0D1',
  softTaupe: '#D9C5B0',
  dustyRose: '#C9A99A',
  goldenNude: '#B89A7E',
  deepSand: '#A17E65',
  rosewood: '#8B6B57',
  espresso: '#5C4638',
};

const products: Product[] = [
  {
    id: 1,
    name: "Velvet Nude",
    category: "Ruj",
    price: 285,
    description: "İpek gibi mat bitişli, ultra pigmentli nude ruj.",
    details: "12 saat kalıcı, nemlendirici formül. Dudak çizgilerini doldurur, asla kurutmaz.",
    shades: [
      { name: "Poudre", hex: "#D9C5B0" },
      { name: "Sable", hex: "#B89A7E" },
      { name: "Rose Cendré", hex: "#C9A99A" },
      { name: "Café Crème", hex: "#A17E65" },
    ],
    volume: "3.5g",
  },
  {
    id: 2,
    name: "Crème de Teint",
    category: "Fondöten",
    price: 420,
    description: "İkinci cilt hissi bırakan, hafif ve doğal kapatıcılık.",
    details: "Ciltle bütünleşen, ince bir film oluşturan krem fondöten. SPF 15 içerir.",
    shades: [
      { name: "Porcelaine", hex: "#F8F1E9" },
      { name: "Lait de Noix", hex: "#EDE0D1" },
      { name: "Beige Doré", hex: "#D9C5B0" },
      { name: "Sienne", hex: "#B89A7E" },
    ],
    volume: "30ml",
  },
  {
    id: 3,
    name: "Blush Sablé",
    category: "Allık",
    price: 245,
    description: "Işıltısız, doğal yanak rengi veren krem allık.",
    details: "Cilde eriyen doku. Elmacık kemiklerinde yumuşak, sağlıklı bir pembelik yaratır.",
    shades: [
      { name: "Pêche", hex: "#E8C9B8" },
      { name: "Rose Thé", hex: "#C9A99A" },
      { name: "Biscuit", hex: "#D9C5B0" },
      { name: "Terre", hex: "#A17E65" },
    ],
    volume: "8g",
  },
  {
    id: 4,
    name: "Lueur Liquide",
    category: "Highlighter",
    price: 265,
    description: "Işıkla parlayan, ince partiküllü sıvı aydınlatıcı.",
    details: "Yüzün en yüksek noktalarına, klavikula ve omuzlara uygulanır. Doğal ışıltı.",
    shades: [
      { name: "Champagne", hex: "#EDE0D1" },
      { name: "Or Rose", hex: "#D9C5B0" },
      { name: "Miel", hex: "#B89A7E" },
    ],
    volume: "15ml",
  },
  {
    id: 5,
    name: "Ombre Crème",
    category: "Göz Farı",
    price: 195,
    description: "Tek vuruşta katmanlanabilen krem göz farı.",
    details: "Parmakla veya fırçayla uygulanır. Mat ve hafif saten seçenekleri.",
    shades: [
      { name: "Nu", hex: "#D9C5B0" },
      { name: "Grège", hex: "#C9A99A" },
      { name: "Moka", hex: "#A17E65" },
      { name: "Noix", hex: "#8B6B57" },
    ],
    volume: "4g",
  },
  {
    id: 6,
    name: "Baume Lèvres",
    category: "Bakım",
    price: 165,
    description: "Nude rujların altına veya tek başına kullanılabilen nem balsamı.",
    details: "Shea yağı, argan ve vitamin E ile zenginleştirilmiş. Dudakları yumuşatır.",
    shades: [
      { name: "Transparent", hex: "#F8F1E9" },
      { name: "Rosé", hex: "#E8C9B8" },
    ],
    volume: "12ml",
  },
  {
    id: 7,
    name: "Sérum Teint",
    category: "Fondöten",
    price: 465,
    description: "Cilt bakımından ödün vermeden renk veren serum fondöten.",
    details: "Niasinamid, hyaluronik asit ve antioksidanlar içerir. Hafif-orta kapatıcılık.",
    shades: [
      { name: "Ivoire", hex: "#EDE0D1" },
      { name: "Beige Clair", hex: "#D9C5B0" },
      { name: "Doré", hex: "#B89A7E" },
      { name: "Ambre", hex: "#A17E65" },
    ],
    volume: "30ml",
  },
  {
    id: 8,
    name: "Poudre Libre",
    category: "Allık",
    price: 310,
    description: "Ultra ince öğütülmüş, transparan bitişli allık pudrası.",
    details: "Ciltteki gözenekleri kapatmadan renk verir. Fırçayla sürülür, katmanlanır.",
    shades: [
      { name: "Sable Rosé", hex: "#C9A99A" },
      { name: "Cannelle", hex: "#B89A7E" },
      { name: "Brique", hex: "#A17E65" },
    ],
    volume: "12g",
  },
];

const categories = ["Tümü", "Ruj", "Fondöten", "Allık", "Göz Farı", "Highlighter", "Bakım"];

const testimonials = [
  {
    quote: "Bu nude tonlar tenime sanki doğuştan aitmiş gibi duruyor. En doğal ve zarif makyajım.",
    name: "Defne A.",
    role: "İç Mimar",
  },
  {
    quote: "Fondötenin dokusu inanılmaz. Cildim nefes alıyor, makyaj yapmadığım halde aydınlık görünüyorum.",
    name: "Lara K.",
    role: "Moda Editörü",
  },
  {
    quote: "Rujların kalıcılığı ve rengi tartışmasız. Gün boyu tazeliğini koruyor, dudaklarım kurutmuyor.",
    name: "Selin M.",
    role: "Dermatolog",
  },
];

const philosophyPoints = [
  {
    title: "Teni onurlandıran formüller",
    desc: "Her ürün cildin doğal ritmini bozmadan, onunla birlikte çalışır.",
  },
  {
    title: "Nude’un 40’dan fazla tonu",
    desc: "Her ten rengine özel geliştirilmiş, asla gri veya turuncu düşmeyen nüanslar.",
  },
  {
    title: "Minimal ama lüks ambalaj",
    desc: "Tekrar doldurulabilir, zamansız tasarımlar. Güzellik rutininin bir parçası değil, bir objesi.",
  },
];

export default function NudeElegance() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedShadeIndex, setSelectedShadeIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedItems, setAddedItems] = useState<{ product: Product; shade: Shade }[]>([]);
  const [isAdded, setIsAdded] = useState(false);

  const filteredProducts = activeCategory === "Tümü"
    ? products
    : products.filter(p => p.category === activeCategory);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedShadeIndex(0);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    setSelectedShadeIndex(0);
  };

  const currentShade = selectedProduct ? selectedProduct.shades[selectedShadeIndex] : null;

  const addToCart = () => {
    if (!selectedProduct || !currentShade) return;

    const newItem = { product: selectedProduct, shade: currentShade };
    setAddedItems(prev => [...prev, newItem]);
    setCartCount(prev => prev + 1);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const removeFromCart = (index: number) => {
    setAddedItems(prev => prev.filter((_, i) => i !== index));
    setCartCount(prev => Math.max(0, prev - 1));
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalPrice = addedItems.reduce((sum, item) => sum + item.product.price, 0);

  return (
    <div className="min-h-screen bg-[#F8F1E9] text-[#5C4638] overflow-x-hidden selection:bg-[#C9A99A] selection:text-[#F8F1E9]">
      {/* Elegant Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F1E9]/95 backdrop-blur-md border-b border-[#D9C5B0]/40">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <img 
                src="/code-blonde-logo.svg" 
                alt="code blonde" 
                className="h-7 w-auto opacity-90" 
              />
              <div className="font-serif text-[17px] tracking-[4px] text-[#5C4638] font-light">
                {brandName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-10 text-sm tracking-[1.5px] font-light">
            <a href="#koleksiyon" className="hover:text-[#A17E65] transition-colors duration-300">KOLEKSİYON</a>
            <a href="#felsefe" className="hover:text-[#A17E65] transition-colors duration-300">FELSEFE</a>
            <a href="#tonlar" className="hover:text-[#A17E65] transition-colors duration-300">NUDE TONLARI</a>
            <a href="#yorumlar" className="hover:text-[#A17E65] transition-colors duration-300">YORUMLAR</a>
          </div>

          <button 
            onClick={openCart}
            className="flex items-center gap-2.5 text-sm tracking-[1.5px] font-light hover:text-[#A17E65] transition-colors duration-300 relative"
          >
            SEPET
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] bg-[#5C4638] text-[#F8F1E9] rounded-full font-mono tracking-normal">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero — Extremely elegant */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 bg-[#F8F1E9]">
        <div className="absolute inset-0 bg-[radial-gradient(#D9C5B0_0.6px,transparent_1px)] bg-[length:5px_5px] opacity-30" />
        
        <div className="relative max-w-5xl mx-auto px-8 text-center pt-12">
          <div className="inline-block mb-6 px-6 py-1 border border-[#C9A99A]/60 rounded-full text-[10px] tracking-[3px] font-light">
            2026 NU ANATOMİSİ
          </div>

          <h1 className="font-serif text-[92px] leading-[0.86] tracking-[-2.2px] mb-6 text-[#5C4638]">
            Tenin kendi<br />rengiyle tanış.
          </h1>
          
          <p className="max-w-md mx-auto text-xl text-[#8B6B57] font-light tracking-[-0.2px] mb-14">
            Her ton, her ten için tasarlanmış.<br />Zarif, kalıcı ve son derece doğal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#koleksiyon" 
              className="group inline-flex items-center justify-center gap-3 bg-[#5C4638] text-[#F8F1E9] px-12 py-4 text-sm tracking-[2.5px] rounded-full hover:bg-[#3F2F25] active:scale-[0.985] transition-all duration-200"
            >
              KOLEKSİYONU KEŞFET
              <span className="group-hover:translate-x-0.5 transition">→</span>
            </a>
            <a 
              href="#tonlar" 
              className="inline-flex items-center justify-center gap-3 border border-[#C9A99A] text-[#5C4638] px-10 py-4 text-sm tracking-[2.5px] rounded-full hover:bg-[#EDE0D1] active:bg-[#D9C5B0] transition-all duration-200"
            >
              TONLARI İNCELE
            </a>
          </div>

          <div className="mt-20 flex justify-center">
            <div className="flex items-center gap-2 text-[10px] tracking-[4px] text-[#A17E65]">
              SCROLL <div className="w-px h-3 bg-[#C9A99A]" />  TO BEGIN
            </div>
          </div>
        </div>

        {/* Subtle floating product hint */}
        <div className="absolute bottom-12 right-8 hidden lg:block">
          <div className="flex flex-col items-end text-right text-xs tracking-widest text-[#A17E65]/70">
            <div>8 ESSENTIALS</div>
            <div>40+ NUANCES</div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-[#D9C5B0]/50 bg-[#EDE0D1]/60 py-3.5">
        <div className="max-w-6xl mx-auto px-8 flex flex-wrap justify-center items-center gap-x-14 gap-y-2 text-[11px] tracking-[2.5px] text-[#8B6B57]/80 font-light">
          <div>CRUELTY FREE</div>
          <div>VEGAN FORMÜL</div>
          <div>PARABENSİZ</div>
          <div>FRANSIZ LABORATUVAR</div>
          <div>TEKRAR DOLDURULABİLİR</div>
        </div>
      </div>

      {/* Collection Section */}
      <section id="koleksiyon" className="max-w-7xl mx-auto px-8 pt-20 pb-24">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="text-[10px] tracking-[4px] text-[#A17E65] mb-3">SIGNATURE COLLECTION</div>
          <h2 className="font-serif text-6xl tracking-[-1.4px] text-[#5C4638]">Nude Koleksiyonu</h2>
          <p className="mt-4 max-w-md text-[#8B6B57] tracking-tight text-[15px]">
            Her biri teninize âşık olacak şekilde formüle edildi. 
            En az müdahale, en çok zarafet.
          </p>
        </div>

        {/* Category filters — very elegant */}
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-2.5 text-xs tracking-[2px] rounded-full transition-all duration-200 border ${
                activeCategory === cat 
                  ? 'bg-[#5C4638] text-[#F8F1E9] border-[#5C4638]' 
                  : 'border-[#D9C5B0] hover:border-[#A17E65] hover:text-[#5C4638] bg-white/60'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Product Grid — luxurious cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            const mainShade = product.shades[0];
            return (
              <button
                key={product.id}
                onClick={() => openProduct(product)}
                className="group text-left bg-white rounded-3xl overflow-hidden border border-[#EDE0D1] hover:border-[#C9A99A] transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl"
              >
                {/* Visual product representation */}
                <div 
                  className="relative h-80 flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(145deg, ${nudePalette.cream}, ${nudePalette.warmBeige})` }}
                >
                  {/* Elegant product mock visual */}
                  <div className="relative w-28 flex flex-col items-center">
                    {/* Cap / tube */}
                    <div 
                      className="w-[52px] h-8 rounded-t-xl shadow-inner z-10"
                      style={{ backgroundColor: mainShade.hex }}
                    />
                    {/* Body */}
                    <div 
                      className="w-[68px] h-40 rounded-2xl -mt-1 flex items-end justify-center pb-4 shadow-lg"
                      style={{ backgroundColor: '#F8F1E9', border: `1px solid ${nudePalette.softTaupe}` }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full ring-1 ring-offset-2 ring-offset-[#F8F1E9] ring-[#C9A99A]/60"
                        style={{ backgroundColor: mainShade.hex }}
                      />
                    </div>
                  </div>

                  {/* Subtle top label */}
                  <div className="absolute top-6 right-6 text-[9px] tracking-[3px] text-[#A17E65]/60 font-light">
                    {product.volume}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#5C4638]/0 group-hover:bg-[#5C4638]/5 transition-colors duration-500" />
                </div>

                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] tracking-[2.5px] text-[#A17E65]">{product.category.toUpperCase()}</div>
                      <div className="font-serif text-[22px] tracking-[-0.3px] text-[#5C4638] mt-0.5 leading-none">{product.name}</div>
                    </div>
                    <div className="font-mono text-sm text-[#A17E65] tabular-nums tracking-tighter">
                      ₺{product.price}
                    </div>
                  </div>

                  <p className="mt-auto pt-5 text-[13px] leading-snug tracking-tight text-[#8B6B57] pr-2">
                    {product.description}
                  </p>

                  {/* Mini swatches */}
                  <div className="flex gap-1.5 mt-6">
                    {product.shades.slice(0, 4).map((shade, i) => (
                      <div 
                        key={i} 
                        className="w-5 h-5 rounded-full border border-white/70 shadow-sm" 
                        style={{ backgroundColor: shade.hex }}
                        title={shade.name}
                      />
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Philosophy */}
      <section id="felsefe" className="bg-[#EDE0D1] py-20 border-y border-[#D9C5B0]/70">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid md:grid-cols-5 gap-x-16 gap-y-16 items-center">
            <div className="md:col-span-2">
              <div className="uppercase tracking-[4px] text-xs text-[#A17E65] mb-3">OUR APPROACH</div>
              <h3 className="font-serif text-[54px] leading-none tracking-[-1.6px] text-[#5C4638]">
                Güzellik,<br />sessizce konuşur.
              </h3>
            </div>
            <div className="md:col-span-3 space-y-8 text-[15px] text-[#5C4638] tracking-tight">
              {philosophyPoints.map((point, idx) => (
                <div key={idx} className="pl-8 border-l border-[#C9A99A]/60">
                  <div className="font-medium text-lg tracking-[-0.1px] mb-1.5">{point.title}</div>
                  <div className="text-[#8B6B57] leading-relaxed">{point.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Nude Tones Explorer */}
      <section id="tonlar" className="max-w-6xl mx-auto px-8 py-24">
        <div className="text-center mb-14">
          <div className="text-[10px] tracking-[4px] text-[#A17E65]">THE PALETTE</div>
          <h3 className="font-serif text-6xl tracking-[-1.5px] mt-2">Nude’un 40 Tonu</h3>
          <p className="mt-3 text-[#8B6B57]">Her tenin kendine ait bir nüansı vardır. Aşağıda en ikonik olanları keşfedin.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {[
            { name: "Poudre", hex: "#F8F1E9" },
            { name: "Lait", hex: "#EDE0D1" },
            { name: "Sable", hex: "#D9C5B0" },
            { name: "Pêche", hex: "#E8C9B8" },
            { name: "Rose Thé", hex: "#C9A99A" },
            { name: "Champagne", hex: "#EDE0D1" },
            { name: "Biscuit", hex: "#D9C5B0" },
            { name: "Grège", hex: "#C9A99A" },
            { name: "Café Crème", hex: "#B89A7E" },
            { name: "Miel", hex: "#A17E65" },
            { name: "Terre", hex: "#8B6B57" },
            { name: "Noix", hex: "#5C4638" },
            { name: "Ivoire", hex: "#EDE0D1" },
            { name: "Beige Doré", hex: "#D9C5B0" },
            { name: "Ambre", hex: "#A17E65" },
            { name: "Sienne", hex: "#B89A7E" },
          ].map((tone, i) => (
            <div 
              key={i} 
              className="group aspect-[1.65] rounded-2xl flex flex-col justify-end p-5 border border-[#D9C5B0] hover:border-[#A17E65] transition-all"
              style={{ backgroundColor: tone.hex }}
            >
              <div className="text-[13px] text-[#5C4638] font-light tracking-wide group-hover:tracking-widest transition-all">{tone.name}</div>
              <div className="font-mono text-[10px] text-[#5C4638]/50 mt-px tracking-[1px]">{tone.hex}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-9 text-xs text-[#A17E65] tracking-[3px]">
          HER TON, GERÇEK CİLTTE TEST EDİLDİ
        </div>
      </section>

      {/* Testimonials — refined */}
      <section id="yorumlar" className="bg-[#5C4638] text-[#F8F1E9] py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <div className="text-[#C9A99A] text-xs tracking-[4px]">GÜZELLİK UZMANLARINDAN</div>
            <h4 className="font-serif text-5xl tracking-[-1px] mt-2 text-white">Gerçek tenler, gerçek sözler.</h4>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <div key={index} className="bg-[#3F2F25] p-9 rounded-3xl flex flex-col">
                <div className="text-[13px] leading-relaxed tracking-tight flex-1">“{t.quote}”</div>
                <div className="mt-8 pt-6 border-t border-[#C9A99A]/30">
                  <div className="font-medium tracking-tight">{t.name}</div>
                  <div className="text-[#C9A99A] text-xs tracking-widest mt-px">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-b border-[#D9C5B0]">
        <div className="max-w-xl mx-auto text-center px-8">
          <div className="font-serif text-[46px] tracking-[-1.2px] leading-none mb-5">Teninize en yakın tonu bulun.</div>
          <p className="text-[#8B6B57] mb-8">Mağazalarımızda ücretsiz ten analizi yaptırabilir ya da online olarak ton önerisi alabilirsiniz.</p>
          <button 
            onClick={() => document.getElementById('koleksiyon')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-14 py-4 rounded-full text-sm tracking-[2.5px] border border-[#5C4638] hover:bg-[#5C4638] hover:text-[#F8F1E9] transition-all"
          >
            KOLEKSİYONA DÖN
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F8F1E9] pt-16 pb-12 text-xs tracking-widest text-[#8B6B57]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-y-10 text-[10px]">
          <div>
            <div className="font-serif text-[#5C4638] text-base tracking-normal mb-4">code blonde</div>
            <div>Paris • İstanbul • New York</div>
          </div>
          <div className="space-y-[5px]">
            <div>KOLEKSİYONLAR</div>
            <div>Nude Serisi</div>
            <div>Signature 2026</div>
            <div>Limited Editions</div>
          </div>
          <div className="space-y-[5px]">
            <div>KEŞFET</div>
            <div>Ton Rehberi</div>
            <div>İçindekiler</div>
            <div>Sürdürülebilirlik</div>
          </div>
          <div className="space-y-[5px]">
            <div>İLETİŞİM</div>
            <div>studio@codeblonde.com</div>
            <div>+90 212 000 00 00</div>
          </div>
        </div>
        <div className="text-center mt-20 text-[9px] tracking-[2px] text-[#C9A99A]">© CODE BLONDE — ZARAFETİN EN SESSİZ HALİ</div>
      </footer>

      {/* Product Detail Modal — very refined and calm */}
      {selectedProduct && currentShade && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#5C4638]/70 p-4" onClick={closeProduct}>
          <div 
            className="bg-[#F8F1E9] rounded-3xl max-w-[980px] w-full overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-5">
              {/* Left: Large product visual */}
              <div className="md:col-span-3 relative min-h-[420px] flex items-center justify-center p-12" 
                   style={{ background: `linear-gradient(160deg, #F8F1E9, ${nudePalette.warmBeige})` }}>
                <div className="relative flex flex-col items-center">
                  {/* Stylized luxury packaging */}
                  <div className="relative">
                    <div 
                      className="w-16 h-9 rounded-t-2xl shadow-inner z-10 relative"
                      style={{ backgroundColor: currentShade.hex }}
                    />
                    <div 
                      className="w-24 h-[210px] rounded-[22px] -mt-1 shadow-xl flex items-end justify-center pb-8"
                      style={{ backgroundColor: '#FBF6F0', boxShadow: '0 25px 50px -12px rgb(92 70 56 / 0.25)' }}
                    >
                      <div className="text-center">
                        <div 
                          className="mx-auto mb-3 w-9 h-9 rounded-full ring-[6px] ring-offset-4 ring-offset-[#FBF6F0] ring-[#D9C5B0]/40"
                          style={{ backgroundColor: currentShade.hex }}
                        />
                        <div className="text-[10px] tracking-[3px] text-[#A17E65]">{selectedProduct.volume}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 text-center">
                    <div className="font-mono text-xs tracking-[4px] text-[#A17E65]">{currentShade.name.toUpperCase()}</div>
                    <div className="font-serif text-4xl tracking-[-1px] mt-px text-[#5C4638]">{selectedProduct.name}</div>
                  </div>
                </div>

                <button 
                  onClick={closeProduct}
                  className="absolute top-8 right-8 text-xs tracking-[2px] hover:text-[#A17E65] transition"
                >
                  KAPAT
                </button>
              </div>

              {/* Right: Details */}
              <div className="md:col-span-2 p-10 md:pr-12 flex flex-col">
                <div>
                  <div className="uppercase text-[#A17E65] tracking-[3px] text-xs mb-1">{selectedProduct.category}</div>
                  <div className="font-serif text-[38px] tracking-[-1.2px] leading-none mb-1">{selectedProduct.name}</div>
                  <div className="font-mono text-lg tabular-nums text-[#A17E65]">₺{selectedProduct.price}</div>
                </div>

                <p className="mt-6 text-[15px] leading-snug tracking-tight text-[#5C4638]">
                  {selectedProduct.description}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#8B6B57] tracking-tight">
                  {selectedProduct.details}
                </p>

                {/* Shade picker — gorgeous */}
                <div className="mt-auto pt-9">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs tracking-[2.5px] text-[#A17E65]">TON SEÇ</div>
                    <div className="font-mono text-xs tracking-widest">{currentShade.name}</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.shades.map((shade, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedShadeIndex(idx)}
                        className={`w-9 h-9 rounded-xl transition-all border-2 ${selectedShadeIndex === idx ? 'border-[#5C4638] scale-110 shadow' : 'border-[#EDE0D1] hover:border-[#C9A99A]'}`}
                        style={{ backgroundColor: shade.hex }}
                        aria-label={shade.name}
                      />
                    ))}
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button 
                      onClick={addToCart}
                      className={`flex-1 py-[17px] rounded-2xl text-sm tracking-[2.5px] transition-all active:scale-[0.985] ${isAdded ? 'bg-[#A17E65] text-white' : 'bg-[#5C4638] text-[#F8F1E9] hover:bg-black'}`}
                    >
                      {isAdded ? "SEPETE EKLENDİ" : "SEPETE EKLE"}
                    </button>
                    
                    <button 
                      onClick={() => {
                        addToCart();
                        setTimeout(() => {
                          closeProduct();
                          openCart();
                        }, 650);
                      }}
                      className="px-8 border border-[#C9A99A] text-[#5C4638] rounded-2xl text-xs tracking-[2px] hover:bg-white transition"
                    >
                      HEMEN AL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer — clean and luxurious */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[80] flex justify-end" onClick={closeCart}>
          <div className="absolute inset-0 bg-black/40" />
          
          <div 
            className="relative bg-[#F8F1E9] w-full max-w-md h-full shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-8 pt-9 pb-6 border-b border-[#D9C5B0]">
              <div>
                <div className="font-serif text-3xl tracking-tight">Sepetiniz</div>
                <div className="text-xs text-[#A17E65] tracking-widest mt-px">{cartCount} ÜRÜN</div>
              </div>
              <button onClick={closeCart} className="text-xs tracking-[2px] text-[#A17E65]">KAPAT</button>
            </div>

            {addedItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center px-8">
                <div>
                  <div className="text-[#C9A99A] text-sm tracking-[3px]">SEPETİNİZ BOŞ</div>
                  <p className="text-sm mt-2 text-[#8B6B57]">Zarif bir nude seçmek için koleksiyona göz atın.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto px-8 pt-6 space-y-7 text-sm">
                  {addedItems.map((item, index) => (
                    <div key={index} className="flex gap-5 border-b border-[#D9C5B0]/60 pb-7 last:border-0 last:pb-0">
                      <div 
                        className="w-16 h-16 flex-shrink-0 rounded-2xl mt-0.5" 
                        style={{ backgroundColor: item.shade.hex, border: '1px solid #EDE0D1' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium tracking-tight leading-none">{item.product.name}</div>
                            <div className="text-[11px] text-[#A17E65] mt-1 tracking-widest">{item.shade.name}</div>
                          </div>
                          <div className="font-mono tabular-nums text-right">₺{item.product.price}</div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(index)} 
                          className="text-[10px] text-[#A17E65] mt-4 tracking-[1.5px] hover:text-[#5C4638]"
                        >
                          KALDIR
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 border-t border-[#D9C5B0] bg-white/70">
                  <div className="flex justify-between font-mono text-sm tracking-widest mb-5">
                    <div>TOPLAM</div>
                    <div>₺{totalPrice}</div>
                  </div>
                  <button 
                    onClick={() => {
                      alert('Teşekkürler! Siparişiniz mock olarak alındı. (Gerçek ödeme entegrasyonu yok)');
                      setAddedItems([]);
                      setCartCount(0);
                      closeCart();
                    }}
                    className="w-full py-4 bg-[#5C4638] text-[#F8F1E9] rounded-2xl text-sm tracking-[3px] hover:bg-black active:bg-[#3F2F25] transition"
                  >
                    ÖDEMEYE GEÇ
                  </button>
                  <div className="text-center text-[10px] text-[#A17E65] tracking-[1px] mt-4">GÜVENLİ ÖDEME • 30 GÜN İADE</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
