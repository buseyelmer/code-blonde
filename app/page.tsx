"use client";

import SectionHomeCollection from "@/core/theme/section/home/section.home.collection";
import SectionHomeHero from "@/core/theme/section/home/section.home.hero";
import { useRaxon } from "@raxonltd/raxon-core";
import Image from "next/image";
import { useEffect, useState } from "react";

const palette = {
  cream: "#F8F1E9",
  warmBeige: "#EDE0D1",
  softTaupe: "#D9C5B0",
  dustyRose: "#C9A99A",
  goldenNude: "#B89A7E",
  deepSand: "#A17E65",
  rosewood: "#8B6B57",
  espresso: "#5C4638",
  dark: "#2C2520",
};

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
  badge?: string;
}


const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Velvet Nude",
    category: "Ruj",
    price: 649,
    badge: "Bestseller",
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
    price: 899,
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
    name: "Lueur Liquide",
    category: "Highlighter",
    price: 549,
    badge: "Yeni",
    description: "Işıkla parlayan, ince partiküllü sıvı aydınlatıcı.",
    details: "Yüzün en yüksek noktalarına uygulanır. Doğal ışıltı.",
    shades: [
      { name: "Champagne", hex: "#EDE0D1" },
      { name: "Or Rose", hex: "#D9C5B0" },
      { name: "Miel", hex: "#B89A7E" },
    ],
    volume: "15ml",
  },
  {
    id: 4,
    name: "Blush Sablé",
    category: "Allık",
    price: 749,
    description: "Işıltısız, doğal yanak rengi veren krem allık.",
    details: "Cilde eriyen doku. Elmacık kemiklerinde yumuşak pembelik yaratır.",
    shades: [
      { name: "Pêche", hex: "#E8C9B8" },
      { name: "Rose Thé", hex: "#C9A99A" },
      { name: "Biscuit", hex: "#D9C5B0" },
      { name: "Terre", hex: "#A17E65" },
    ],
    volume: "8g",
  },
  {
    id: 5,
    name: "Ombre Crème",
    category: "Göz Farı",
    price: 499,
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
    price: 399,
    badge: "Limited",
    description: "Nude rujların altına veya tek başına kullanılabilen nem balsamı.",
    details: "Shea yağı, argan ve vitamin E ile zenginleştirilmiş.",
    shades: [
      { name: "Transparent", hex: "#F8F1E9" },
      { name: "Rosé", hex: "#E8C9B8" },
    ],
    volume: "12ml",
  },
];

const CATEGORIES = ["Tümü", "Ruj", "Fondöten", "Allık", "Göz Farı", "Highlighter", "Bakım"];

const NUDE_TONES = [
  { name: "Poudre", hex: "#F8F1E9", tone: "Açık" },
  { name: "Lait", hex: "#EDE0D1", tone: "Açık" },
  { name: "Sable", hex: "#D9C5B0", tone: "Açık-Orta" },
  { name: "Pêche", hex: "#E8C9B8", tone: "Açık-Orta" },
  { name: "Rose Thé", hex: "#C9A99A", tone: "Orta" },
  { name: "Champagne", hex: "#EDE0D1", tone: "Açık" },
  { name: "Biscuit", hex: "#D9C5B0", tone: "Açık-Orta" },
  { name: "Grège", hex: "#C9A99A", tone: "Orta" },
  { name: "Café Crème", hex: "#B89A7E", tone: "Orta" },
  { name: "Miel", hex: "#A17E65", tone: "Orta-Koyu" },
  { name: "Terre", hex: "#8B6B57", tone: "Orta-Koyu" },
  { name: "Noix", hex: "#5C4638", tone: "Koyu" },
  { name: "Ivoire", hex: "#EDE0D1", tone: "Açık" },
  { name: "Beige Doré", hex: "#D9C5B0", tone: "Açık-Orta" },
  { name: "Ambre", hex: "#A17E65", tone: "Orta-Koyu" },
  { name: "Sienne", hex: "#B89A7E", tone: "Orta" },
];

const PHILOSOPHY = [
  { title: "Teni onurlandıran formüller", desc: "Her ürün cildin doğal ritmini bozmadan, onunla birlikte çalışır." },
  { title: "Nude'un 40'dan fazla tonu", desc: "Her ten rengine özel geliştirilmiş, asla gri veya turuncu düşmeyen nüanslar." },
  { title: "Minimal ama lüks ambalaj", desc: "Tekrar doldurulabilir, zamansız tasarımlar. Güzellik rutininin bir objesi." },
];

const INGREDIENTS = [
  { icon: "🌿", title: "Doğal İçerik", desc: "%92 bitkisel kaynaklı formül" },
  { icon: "🐰", title: "Cruelty Free", desc: "Hayvan testi yapılmaz" },
  { icon: "♻️", title: "Sürdürülebilir", desc: "Geri dönüştürülebilir ambalaj" },
  { icon: "✨", title: "Dermatolojik", desc: "Hassas ciltler için test edildi" },
];

const TESTIMONIALS = [
  { quote: "Bu nude tonlar tenime sanki doğuştan aitmiş gibi duruyor. En doğal ve zarif makyajım.", name: "Defne A.", role: "İç Mimar", rating: 5 },
  { quote: "Fondötenin dokusu inanılmaz. Cildim nefes alıyor, makyaj yapmadığım halde aydınlık görünüyorum.", name: "Lara K.", role: "Moda Editörü", rating: 5 },
  { quote: "Velvet Nude ruj serisi favorim. Gün boyu tazeliğini koruyor, dudaklarım kurutmuyor.", name: "Selin M.", role: "Dermatolog", rating: 5 },
];

const TRUST_ITEMS = ["Cruelty Free", "Vegan Formül", "Parabensiz", "Fransız Laboratuvar", "Tekrar Doldurulabilir"];

function StarRating({ count }: { count: number }) {
  return (
    <div className='flex gap-0.5'>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className='h-3.5 w-3.5 text-[#C9A99A]' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ))}
    </div>
  );
}

function ProductVisual({ shadeHex, volume }: { shadeHex: string; volume: string }) {
  return (
    <div className='relative w-28 flex flex-col items-center'>
      <div className='w-[52px] h-8 rounded-t-xl shadow-inner z-10' style={{ backgroundColor: shadeHex }} />
      <div className='w-[68px] h-40 rounded-2xl -mt-1 flex items-end justify-center pb-4 shadow-lg' style={{ backgroundColor: palette.cream, border: `1px solid ${palette.softTaupe}` }}>
        <div className='w-4 h-4 rounded-full ring-1 ring-offset-2 ring-offset-[#F8F1E9] ring-[#C9A99A]/60' style={{ backgroundColor: shadeHex }} />
      </div>
      <div className='absolute top-0 right-0 text-[9px] tracking-[3px] text-[#A17E65]/60 font-light translate-x-6 -translate-y-2'>{volume}</div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedShadeIndex, setSelectedShadeIndex] = useState(0);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedItems, setAddedItems] = useState<{ product: Product; shade: Shade }[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const { branch } = useRaxon();

  branch?.socialMediaLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredProducts = activeCategory === "Tümü" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  const currentShade = selectedProduct ? selectedProduct.shades[selectedShadeIndex] : null;

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedShadeIndex(0);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    setSelectedShadeIndex(0);
  };

  const addToCart = () => {
    if (!selectedProduct || !currentShade) return;
    setAddedItems((prev) => [...prev, { product: selectedProduct, shade: currentShade }]);
    setCartCount((prev) => prev + 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const removeFromCart = (index: number) => {
    setAddedItems((prev) => prev.filter((_, i) => i !== index));
    setCartCount((prev) => Math.max(0, prev - 1));
  };

  const totalPrice = addedItems.reduce((sum, item) => sum + item.product.price, 0);

  return (
    <div className='min-h-screen bg-[#F8F1E9] text-[#5C4638] overflow-x-hidden selection:bg-[#C9A99A] selection:text-[#F8F1E9]'>
  

      {/* Trust Bar - From Theme/3 */}
      <div className='border-y border-[#D9C5B0]/50 bg-[#EDE0D1]/60 py-4'>
        <div className='max-w-6xl mx-auto px-8 flex flex-wrap justify-center items-center gap-x-14 gap-y-2 text-[11px] tracking-[2.5px] text-[#8B6B57]/80 font-light'>
          {TRUST_ITEMS.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>

      <SectionHomeHero/>
<SectionHomeCollection/>

      {/* Products Section - Enhanced from Theme/3 with filters */}
      <section id='urunler' className='py-20 lg:py-28 bg-[#F5EDE4]/30'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end'>
            <div>
              <p className='text-xs tracking-[0.3em] uppercase text-[#A17E65]'>Ürünler</p>
              <h2 className='mt-3 font-serif text-4xl text-[#5C4638] lg:text-5xl'>En Sevilenler</h2>
            </div>
            <p className='max-w-xs text-sm text-[#8B6B57]'>Teninizle bütünleşen, doğal görünümlü formüller</p>
          </div>

          {/* Category filters - From Theme/3 */}
          <div className='flex flex-wrap justify-center gap-2 mb-12'>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-2.5 text-xs tracking-[2px] rounded-full transition-all duration-200 border ${
                  activeCategory === cat ? "bg-[#5C4638] text-[#F8F1E9] border-[#5C4638]" : "border-[#D9C5B0] hover:border-[#A17E65] hover:text-[#5C4638] bg-white/60"
                }`}>
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Product Grid - From Theme/3 with enhancements */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredProducts.map((product, index) => {
              const mainShade = product.shades[0];
              return (
                <button
                  key={product.id}
                  onClick={() => openProduct(product)}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className='group text-left bg-white rounded-3xl overflow-hidden border border-[#EDE0D1] hover:border-[#C9A99A] transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl'>
                  <div className='relative h-80 flex items-center justify-center overflow-hidden' style={{ background: `linear-gradient(145deg, ${palette.cream}, ${palette.warmBeige})` }}>
                    {product.badge && <span className='absolute left-4 top-4 z-10 rounded-full bg-[#5C4638] px-3 py-1 text-[10px] tracking-widest uppercase text-[#F8F1E9]'>{product.badge}</span>}
                    {/* Elegant product mock visual */}
                    <div className='relative w-28 flex flex-col items-center'>
                      <div className='w-[52px] h-8 rounded-t-xl shadow-inner z-10' style={{ backgroundColor: mainShade.hex }} />
                      <div
                        className='w-[68px] h-40 rounded-2xl -mt-1 flex items-end justify-center pb-4 shadow-lg'
                        style={{ backgroundColor: palette.cream, border: `1px solid ${palette.softTaupe}` }}>
                        <div className='w-4 h-4 rounded-full ring-1 ring-offset-2 ring-offset-[#F8F1E9] ring-[#C9A99A]/60' style={{ backgroundColor: mainShade.hex }} />
                      </div>
                    </div>

                    <div className='absolute top-6 right-6 text-[9px] tracking-[3px] text-[#A17E65]/60 font-light'>{product.volume}</div>

                    {/* Hover overlay with quick add */}
                    <div
                      className={`absolute inset-0 bg-[#5C4638]/0 group-hover:bg-[#5C4638]/5 transition-all duration-500 flex items-end justify-center pb-6 ${
                        hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                      }`}>
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

                    {/* Mini swatches */}
                    <div className='flex gap-1.5 mt-6'>
                      {product.shades.slice(0, 4).map((shade, i) => (
                        <div key={i} className='w-5 h-5 rounded-full border border-white/70 shadow-sm' style={{ backgroundColor: shade.hex }} title={shade.name} />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nude Tones Explorer - From Theme/3 */}
      <section id='tonlar' className='max-w-6xl mx-auto px-8 py-24'>
        <div className='text-center mb-14'>
          <p className='text-[10px] tracking-[4px] text-[#A17E65]'>THE PALETTE</p>
          <h3 className='font-serif text-5xl tracking-[-1.5px] mt-2 text-[#5C4638]'>Nude&apos;un 40 Tonu</h3>
          <p className='mt-3 text-[#8B6B57]'>Her tenin kendine ait bir nüansı vardır. Aşağıda en ikonik olanları keşfedin.</p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3'>
          {NUDE_TONES.map((tone, i) => (
            <button
              key={i}
              onClick={() => setSelectedTone(selectedTone === i ? null : i)}
              className={`group aspect-[1.65] rounded-2xl flex flex-col justify-end p-5 border transition-all text-left ${
                selectedTone === i ? "border-[#5C4638] ring-2 ring-[#5C4638]/20" : "border-[#D9C5B0] hover:border-[#A17E65]"
              }`}
              style={{ backgroundColor: tone.hex }}>
              <div className={`text-[13px] font-light tracking-wide group-hover:tracking-widest transition-all ${tone.tone === "Açık" ? "text-[#5C4638]" : "text-white"}`}>{tone.name}</div>
              <div className={`font-mono text-[10px] mt-px tracking-[1px] ${tone.tone === "Açık" ? "text-[#5C4638]/50" : "text-white/60"}`}>{tone.hex}</div>
            </button>
          ))}
        </div>

        <div className='text-center mt-9 text-xs text-[#A17E65] tracking-[3px]'>HER TON, GERÇEK CİLTTE TEST EDİLDİ</div>
      </section>

      {/* Brand Story - Enhanced from Theme/1 */}
      <section id='hikaye' className='relative overflow-hidden bg-[#5C4638] py-20 text-[#F8F1E9] lg:py-28'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#C9A99A] to-transparent' />
        </div>
        <div className='relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8'>
          <div>
            <p className='text-xs tracking-[0.3em] uppercase text-[#C9A99A]'>Hikayemiz</p>
            <h2 className='mt-3 font-serif text-4xl leading-tight lg:text-5xl'>
              Güzellik,
              <br />
              <span className='italic text-[#E8D5C4]'>doğallıktan</span> gelir
            </h2>
            <p className='mt-6 leading-relaxed text-[#E8D5C4]/80'>
              Code Blonde, her kadının kendine özgü güzelliğini öne çıkarmak için doğdu. Nude tonlarımız, farklı ten renklerine uyum sağlayacak şekilde özenle formüle edildi — abartısız, zarif ve
              zamansız.
            </p>
            <p className='mt-4 leading-relaxed text-[#E8D5C4]/60'>
              Paris&apos;ten ilham alan minimal estetiğimiz, sürdürülebilir üretim anlayışımızla birleşiyor. Çünkü gerçek güzellik, kendin olmaktan geçer.
            </p>
            <button className='mt-10 rounded-full border border-[#C9A99A] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#E8D5C4] transition-colors hover:bg-[#C9A99A] hover:text-[#5C4638]'>
              Daha Fazla Oku
            </button>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {INGREDIENTS.map((item) => (
              <div key={item.title} className='rounded-2xl border border-[#C9A99A]/20 bg-[#F8F1E9]/5 p-6 backdrop-blur-sm transition-colors hover:border-[#C9A99A]/40'>
                <span className='text-2xl'>{item.icon}</span>
                <h3 className='mt-4 text-sm tracking-wide text-[#F8F1E9]'>{item.title}</h3>
                <p className='mt-2 text-xs leading-relaxed text-[#E8D5C4]/60'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy - From Theme/3 */}
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
              {PHILOSOPHY.map((point, idx) => (
                <div key={idx} className='pl-8 border-l border-[#C9A99A]/60'>
                  <div className='font-medium text-lg tracking-[-0.1px] mb-1.5'>{point.title}</div>
                  <div className='text-[#8B6B57] leading-relaxed'>{point.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Combined styles */}
      <section id='yorumlar' className='py-20 lg:py-28'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mb-14 text-center'>
            <p className='text-xs tracking-[0.3em] uppercase text-[#A17E65]'>Yorumlar</p>
            <h2 className='mt-3 font-serif text-4xl text-[#5C4638] lg:text-5xl'>Müşterilerimiz Ne Diyor</h2>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            {TESTIMONIALS.map((t, index) => (
              <div key={index} className='rounded-2xl border border-[#D9C5B0]/50 bg-white/50 p-8 backdrop-blur-sm'>
                <StarRating count={t.rating} />
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

      {/* Newsletter - Enhanced */}
      <section id='iletisim' className='border-t border-[#D9C5B0]/40 py-20 lg:py-24 bg-[#F5EDE4]/30'>
        <div className='mx-auto max-w-2xl px-6 text-center lg:px-8'>
          <p className='text-xs tracking-[0.3em] uppercase text-[#A17E65]'>Bülten</p>
          <h2 className='mt-3 font-serif text-3xl text-[#5C4638] lg:text-4xl'>Nude dünyasına katılın</h2>
          <p className='mt-4 text-sm text-[#8B6B57]'>Yeni ürünler, özel indirimler ve güzellik ipuçları için abone olun.</p>
          <form className='mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0' onSubmit={(e) => e.preventDefault()}>
            <input
              type='email'
              placeholder='E-posta adresiniz'
              className='flex-1 rounded-full border border-[#D9C5B0] bg-white/50 px-6 py-4 text-sm text-[#5C4638] placeholder:text-[#A17E65] focus:border-[#C9A99A] focus:outline-none sm:rounded-r-none'
            />
            <button type='submit' className='rounded-full bg-[#5C4638] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#F8F1E9] transition-colors hover:bg-[#3F2F25] sm:rounded-l-none'>
              Abone Ol
            </button>
          </form>
        </div>
      </section>

      {/* Footer - Enhanced from both themes */}
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

      {/* Product Detail Modal - From Theme/3 */}
      {selectedProduct && currentShade && (
        <div className='fixed inset-0 z-[70] flex items-center justify-center bg-[#5C4638]/70 p-4' onClick={closeProduct}>
          <div className='bg-[#F8F1E9] rounded-3xl max-w-[980px] w-full overflow-hidden shadow-2xl' onClick={(e) => e.stopPropagation()}>
            <div className='grid md:grid-cols-5'>
              {/* Left: Large product visual */}
              <div className='md:col-span-3 relative min-h-[420px] flex items-center justify-center p-12' style={{ background: `linear-gradient(160deg, #F8F1E9, ${palette.warmBeige})` }}>
                <div className='relative flex flex-col items-center'>
                  <div className='relative'>
                    <div className='w-16 h-9 rounded-t-2xl shadow-inner z-10 relative' style={{ backgroundColor: currentShade.hex }} />
                    <div
                      className='w-24 h-[210px] rounded-[22px] -mt-1 shadow-xl flex items-end justify-center pb-8'
                      style={{ backgroundColor: "#FBF6F0", boxShadow: "0 25px 50px -12px rgb(92 70 56 / 0.25)" }}>
                      <div className='text-center'>
                        <div className='mx-auto mb-3 w-9 h-9 rounded-full ring-[6px] ring-offset-4 ring-offset-[#FBF6F0] ring-[#D9C5B0]/40' style={{ backgroundColor: currentShade.hex }} />
                        <div className='text-[10px] tracking-[3px] text-[#A17E65]'>{selectedProduct.volume}</div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-7 text-center'>
                    <div className='font-mono text-xs tracking-[4px] text-[#A17E65]'>{currentShade.name.toUpperCase()}</div>
                    <div className='font-serif text-4xl tracking-[-1px] mt-px text-[#5C4638]'>{selectedProduct.name}</div>
                  </div>
                </div>

                <button onClick={closeProduct} className='absolute top-8 right-8 text-xs tracking-[2px] hover:text-[#A17E65] transition'>
                  KAPAT
                </button>
              </div>

              {/* Right: Details */}
              <div className='md:col-span-2 p-10 md:pr-12 flex flex-col'>
                <div>
                  <div className='uppercase text-[#A17E65] tracking-[3px] text-xs mb-1'>{selectedProduct.category}</div>
                  <div className='font-serif text-[38px] tracking-[-1.2px] leading-none mb-1'>{selectedProduct.name}</div>
                  <div className='font-mono text-lg tabular-nums text-[#A17E65]'>₺{selectedProduct.price}</div>
                </div>

                <p className='mt-6 text-[15px] leading-snug tracking-tight text-[#5C4638]'>{selectedProduct.description}</p>
                <p className='mt-4 text-sm leading-relaxed text-[#8B6B57] tracking-tight'>{selectedProduct.details}</p>

                {/* Shade picker */}
                <div className='mt-auto pt-9'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='text-xs tracking-[2.5px] text-[#A17E65]'>TON SEÇ</div>
                    <div className='font-mono text-xs tracking-widest'>{currentShade.name}</div>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {selectedProduct.shades.map((shade, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedShadeIndex(idx)}
                        className={`w-9 h-9 rounded-xl transition-all border-2 ${selectedShadeIndex === idx ? "border-[#5C4638] scale-110 shadow" : "border-[#EDE0D1] hover:border-[#C9A99A]"}`}
                        style={{ backgroundColor: shade.hex }}
                        aria-label={shade.name}
                      />
                    ))}
                  </div>

                  <div className='mt-8 flex gap-3'>
                    <button
                      onClick={addToCart}
                      className={`flex-1 py-[17px] rounded-2xl text-sm tracking-[2.5px] transition-all active:scale-[0.985] ${isAdded ? "bg-[#A17E65] text-white" : "bg-[#5C4638] text-[#F8F1E9] hover:bg-black"}`}>
                      {isAdded ? "SEPETE EKLENDİ" : "SEPETE EKLE"}
                    </button>

                    <button
                      onClick={() => {
                        addToCart();
                        setTimeout(() => {
                          closeProduct();
                          setIsCartOpen(true);
                        }, 650);
                      }}
                      className='px-8 border border-[#C9A99A] text-[#5C4638] rounded-2xl text-xs tracking-[2px] hover:bg-white transition'>
                      HEMEN AL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer - From Theme/3 */}
      {isCartOpen && (
        <div className='fixed inset-0 z-[80] flex justify-end' onClick={() => setIsCartOpen(false)}>
          <div className='absolute inset-0 bg-black/40' />

          <div className='relative bg-[#F8F1E9] w-full max-w-md h-full shadow-2xl flex flex-col' onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between px-8 pt-9 pb-6 border-b border-[#D9C5B0]'>
              <div>
                <div className='font-serif text-3xl tracking-tight text-[#5C4638]'>Sepetiniz</div>
                <div className='text-xs text-[#A17E65] tracking-widest mt-px'>{cartCount} ÜRÜN</div>
              </div>
              <button onClick={() => setIsCartOpen(false)} className='text-xs tracking-[2px] text-[#A17E65]'>
                KAPAT
              </button>
            </div>

            {addedItems.length === 0 ? (
              <div className='flex-1 flex items-center justify-center text-center px-8'>
                <div>
                  <div className='text-[#C9A99A] text-sm tracking-[3px]'>SEPETİNİZ BOŞ</div>
                  <p className='text-sm mt-2 text-[#8B6B57]'>Zarif bir nude seçmek için koleksiyona göz atın.</p>
                  <button onClick={() => setIsCartOpen(false)} className='mt-6 px-8 py-3 border border-[#C9A99A] rounded-full text-xs tracking-[2px] text-[#5C4638] hover:bg-[#C9A99A]/20'>
                    KEŞFE BAŞLA
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className='flex-1 overflow-auto px-8 pt-6 space-y-7 text-sm'>
                  {addedItems.map((item, index) => (
                    <div key={index} className='flex gap-5 border-b border-[#D9C5B0]/60 pb-7 last:border-0 last:pb-0'>
                      <div className='w-16 h-16 flex-shrink-0 rounded-2xl mt-0.5' style={{ backgroundColor: item.shade.hex, border: "1px solid #EDE0D1" }} />
                      <div className='flex-1 min-w-0'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <div className='font-medium tracking-tight leading-none text-[#5C4638]'>{item.product.name}</div>
                            <div className='text-[11px] text-[#A17E65] mt-1 tracking-widest'>{item.shade.name}</div>
                          </div>
                          <div className='font-mono tabular-nums text-right text-[#5C4638]'>₺{item.product.price}</div>
                        </div>
                        <button onClick={() => removeFromCart(index)} className='text-[10px] text-[#A17E65] mt-4 tracking-[1.5px] hover:text-[#5C4638]'>
                          KALDIR
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='p-8 border-t border-[#D9C5B0] bg-white/70'>
                  <div className='flex justify-between font-mono text-sm tracking-widest mb-5 text-[#5C4638]'>
                    <div>TOPLAM</div>
                    <div>₺{totalPrice}</div>
                  </div>
                  <button
                    onClick={() => {
                      alert("Teşekkürler! Siparişiniz alındı.");
                      setAddedItems([]);
                      setCartCount(0);
                      setIsCartOpen(false);
                    }}
                    className='w-full py-4 bg-[#5C4638] text-[#F8F1E9] rounded-2xl text-sm tracking-[3px] hover:bg-black active:bg-[#3F2F25] transition'>
                    ÖDEMEYE GEÇ
                  </button>
                  <div className='text-center text-[10px] text-[#A17E65] tracking-[1px] mt-4'>GÜVENLİ ÖDEME • 30 GÜN İADE</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
