'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const palette = {
  cream: '#F8F1E9',
  warmBeige: '#EDE0D1',
  softTaupe: '#D9C5B0',
  dustyRose: '#C9A99A',
  goldenNude: '#B89A7E',
  deepSand: '#A17E65',
  rosewood: '#8B6B57',
  espresso: '#5C4638',
  dark: '#2C2520',
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

const NAV_LINKS = [
  { label: 'Koleksiyon', href: '#koleksiyon' },
  { label: 'Ürünler', href: '#urunler' },
  { label: 'Tonlar', href: '#tonlar' },
  { label: 'Hikayemiz', href: '#hikaye' },
  { label: 'İletişim', href: '#iletisim' },
];

const HERO_STATS = [
  { value: '48+', label: 'Nude Ton' },
  { value: '100%', label: 'Vegan Formül' },
  { value: '12K', label: 'Mutlu Müşteri' },
];

const COLLECTIONS = [
  {
    id: 1,
    name: 'Velvet Nude',
    tagline: 'Mat & zarif',
    gradient: 'linear-gradient(145deg, #E8D5C4 0%, #C4A484 100%)',
    description: 'İpek gibi pürüzsüz, mat bitişli nude koleksiyonu.',
  },
  {
    id: 2,
    name: 'Silk Glow',
    tagline: 'Işıltılı ten',
    gradient: 'linear-gradient(145deg, #F5E6D8 0%, #D4A574 100%)',
    description: 'Doğal ışıltı ve aydınlık görünüm için.',
  },
  {
    id: 3,
    name: 'Bare Essence',
    tagline: 'Doğal minimal',
    gradient: 'linear-gradient(145deg, #EDE0D4 0%, #B8956A 100%)',
    description: 'Müdahalesiz, saf doğallık.',
  },
];

const PRODUCTS: Product[] = [
  {
    id: 1, name: 'Velvet Nude', category: 'Ruj', price: 649, badge: 'Bestseller',
    description: 'İpek gibi mat bitişli, ultra pigmentli nude ruj.',
    details: '12 saat kalıcı, nemlendirici formül. Dudak çizgilerini doldurur, asla kurutmaz.',
    shades: [{ name: 'Poudre', hex: '#D9C5B0' }, { name: 'Sable', hex: '#B89A7E' }, { name: 'Rose Cendré', hex: '#C9A99A' }, { name: 'Café Crème', hex: '#A17E65' }],
    volume: '3.5g',
  },
  {
    id: 2, name: 'Crème de Teint', category: 'Fondöten', price: 899,
    description: 'İkinci cilt hissi bırakan, hafif ve doğal kapatıcılık.',
    details: 'Ciltle bütünleşen, ince bir film oluşturan krem fondöten. SPF 15 içerir.',
    shades: [{ name: 'Porcelaine', hex: '#F8F1E9' }, { name: 'Lait de Noix', hex: '#EDE0D1' }, { name: 'Beige Doré', hex: '#D9C5B0' }, { name: 'Sienne', hex: '#B89A7E' }],
    volume: '30ml',
  },
  {
    id: 3, name: 'Lueur Liquide', category: 'Highlighter', price: 549, badge: 'Yeni',
    description: 'Işıkla parlayan, ince partiküllü sıvı aydınlatıcı.',
    details: 'Yüzün en yüksek noktalarına uygulanır. Doğal ışıltı.',
    shades: [{ name: 'Champagne', hex: '#EDE0D1' }, { name: 'Or Rose', hex: '#D9C5B0' }, { name: 'Miel', hex: '#B89A7E' }],
    volume: '15ml',
  },
  {
    id: 4, name: 'Blush Sablé', category: 'Allık', price: 749,
    description: 'Işıltısız, doğal yanak rengi veren krem allık.',
    details: 'Cilde eriyen doku. Elmacık kemiklerinde yumuşak pembelik yaratır.',
    shades: [{ name: 'Pêche', hex: '#E8C9B8' }, { name: 'Rose Thé', hex: '#C9A99A' }, { name: 'Biscuit', hex: '#D9C5B0' }, { name: 'Terre', hex: '#A17E65' }],
    volume: '8g',
  },
  {
    id: 5, name: 'Ombre Crème', category: 'Göz Farı', price: 499,
    description: 'Tek vuruşta katmanlanabilen krem göz farı.',
    details: 'Parmakla veya fırçayla uygulanır. Mat ve hafif saten seçenekleri.',
    shades: [{ name: 'Nu', hex: '#D9C5B0' }, { name: 'Grège', hex: '#C9A99A' }, { name: 'Moka', hex: '#A17E65' }, { name: 'Noix', hex: '#8B6B57' }],
    volume: '4g',
  },
  {
    id: 6, name: 'Baume Lèvres', category: 'Bakım', price: 399, badge: 'Limited',
    description: 'Nude rujların altına veya tek başına kullanılabilen nem balsamı.',
    details: 'Shea yağı, argan ve vitamin E ile zenginleştirilmiş.',
    shades: [{ name: 'Transparent', hex: '#F8F1E9' }, { name: 'Rosé', hex: '#E8C9B8' }],
    volume: '12ml',
  },
];

const CATEGORIES = ['Tümü', 'Ruj', 'Fondöten', 'Allık', 'Göz Farı', 'Highlighter', 'Bakım'];

const NUDE_TONES = [
  { name: 'Poudre', hex: '#F8F1E9', tone: 'Açık' },
  { name: 'Lait', hex: '#EDE0D1', tone: 'Açık' },
  { name: 'Sable', hex: '#D9C5B0', tone: 'Açık-Orta' },
  { name: 'Pêche', hex: '#E8C9B8', tone: 'Açık-Orta' },
  { name: 'Rose Thé', hex: '#C9A99A', tone: 'Orta' },
  { name: 'Champagne', hex: '#EDE0D1', tone: 'Açık' },
  { name: 'Biscuit', hex: '#D9C5B0', tone: 'Açık-Orta' },
  { name: 'Grège', hex: '#C9A99A', tone: 'Orta' },
  { name: 'Café Crème', hex: '#B89A7E', tone: 'Orta' },
  { name: 'Miel', hex: '#A17E65', tone: 'Orta-Koyu' },
  { name: 'Terre', hex: '#8B6B57', tone: 'Orta-Koyu' },
  { name: 'Noix', hex: '#5C4638', tone: 'Koyu' },
  { name: 'Ivoire', hex: '#EDE0D1', tone: 'Açık' },
  { name: 'Beige Doré', hex: '#D9C5B0', tone: 'Açık-Orta' },
  { name: 'Ambre', hex: '#A17E65', tone: 'Orta-Koyu' },
  { name: 'Sienne', hex: '#B89A7E', tone: 'Orta' },
];

const PHILOSOPHY = [
  { title: 'Teni onurlandıran formüller', desc: 'Her ürün cildin doğal ritmini bozmadan, onunla birlikte çalışır.' },
  { title: 'Nude\'un 40\'dan fazla tonu', desc: 'Her ten rengine özel geliştirilmiş, asla gri veya turuncu düşmeyen nüanslar.' },
  { title: 'Minimal ama lüks ambalaj', desc: 'Tekrar doldurulabilir, zamansız tasarımlar. Güzellik rutininin bir objesi.' },
];

const INGREDIENTS = [
  { icon: '🌿', title: 'Doğal İçerik', desc: '%92 bitkisel kaynaklı formül' },
  { icon: '🐰', title: 'Cruelty Free', desc: 'Hayvan testi yapılmaz' },
  { icon: '♻️', title: 'Sürdürülebilir', desc: 'Geri dönüştürülebilir ambalaj' },
  { icon: '✨', title: 'Dermatolojik', desc: 'Hassas ciltler için test edildi' },
];

const TESTIMONIALS = [
  { quote: 'Bu nude tonlar tenime sanki doğuştan aitmiş gibi duruyor. En doğal ve zarif makyajım.', name: 'Defne A.', role: 'İç Mimar', rating: 5 },
  { quote: 'Fondötenin dokusu inanılmaz. Cildim nefes alıyor, makyaj yapmadığım halde aydınlık görünüyorum.', name: 'Lara K.', role: 'Moda Editörü', rating: 5 },
  { quote: 'Velvet Nude ruj serisi favorim. Gün boyu tazeliğini koruyor, dudaklarım kurutmuyor.', name: 'Selin M.', role: 'Dermatolog', rating: 5 },
];

const TRUST_ITEMS = ['Cruelty Free', 'Vegan Formül', 'Parabensiz', 'Fransız Laboratuvar', 'Tekrar Doldurulabilir'];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5 text-[#C9A99A]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ProductVisual({ shadeHex, volume }: { shadeHex: string; volume: string }) {
  return (
    <div className="relative w-28 flex flex-col items-center">
      <div className="w-[52px] h-8 rounded-t-xl shadow-inner z-10" style={{ backgroundColor: shadeHex }} />
      <div
        className="w-[68px] h-40 rounded-2xl -mt-1 flex items-end justify-center pb-4 shadow-lg"
        style={{ backgroundColor: palette.cream, border: `1px solid ${palette.softTaupe}` }}
      >
        <div
          className="w-4 h-4 rounded-full ring-1 ring-offset-2 ring-offset-[#F8F1E9] ring-[#C9A99A]/60"
          style={{ backgroundColor: shadeHex }}
        />
      </div>
      <div className="absolute top-0 right-0 text-[9px] tracking-[3px] text-[#A17E65]/60 font-light translate-x-6 -translate-y-2">
        {volume}
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedShadeIndex, setSelectedShadeIndex] = useState(0);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedItems, setAddedItems] = useState<{ product: Product; shade: Shade }[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filteredProducts = activeCategory === 'Tümü'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

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
    <div className="min-h-screen bg-[#F8F1E9] text-[#5C4638] overflow-x-hidden selection:bg-[#C9A99A] selection:text-[#F8F1E9]">
      {/* Navigation */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-[#D9C5B0]/50 bg-[#F8F1E9]/95 shadow-sm backdrop-blur-md'
            : 'border-b border-transparent bg-[#F8F1E9]/70 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="relative h-8 w-28 lg:h-9 lg:w-32">
              <Image src="/code-blonde-logo.svg" alt="Code Blonde" fill className="object-contain object-left" priority />
            </div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs tracking-[0.2em] uppercase text-[#8B6B57] transition-colors hover:text-[#5C4638]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-[#8B6B57] transition-colors hover:text-[#5C4638]"
            >
              Sepet
              {cartCount > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#5C4638] text-[10px] text-[#F8F1E9]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsCartOpen(true)} className="relative text-xs tracking-widest uppercase">
              Sepet
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#5C4638] text-[9px] text-[#F8F1E9]">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
              <span className={`block h-px w-6 bg-[#5C4638] transition-transform ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`block h-px w-6 bg-[#5C4638] transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-6 bg-[#5C4638] transition-transform ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-[#D9C5B0]/40 bg-[#F8F1E9] px-6 py-6 lg:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block border-b border-[#D9C5B0]/30 py-4 text-sm tracking-[0.15em] uppercase"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative min-h-[100dvh] overflow-hidden pt-24 lg:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(#D9C5B0_0.6px,transparent_1px)] bg-[length:5px_5px] opacity-25" />
        <div className="absolute -right-32 top-20 h-[500px] w-[500px] rounded-full bg-[#D9C5B0]/25 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#C9A99A]/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 lg:min-h-[calc(100dvh-7rem)] lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-24">
          <div className="order-2 lg:order-1">
            <div className="mb-6 inline-block rounded-full border border-[#C9A99A]/60 px-5 py-1 text-[10px] tracking-[0.3em] uppercase">
              Yeni Sezon · 2026
            </div>
            <h1 className="font-serif text-5xl leading-[0.95] tracking-tight text-[#5C4638] lg:text-7xl">
              Tenin kendi
              <br />
              <span className="italic text-[#A17E65]">rengiyle</span>
              <br />
              tanış.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed font-light text-[#actions]">
            </p>