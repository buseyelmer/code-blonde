'use client';

import Image from 'next/image';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Koleksiyon', href: '#koleksiyon' },
  { label: 'Ürünler', href: '#urunler' },
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
  },
  {
    id: 2,
    name: 'Silk Glow',
    tagline: 'Işıltılı ten',
    gradient: 'linear-gradient(145deg, #F5E6D8 0%, #D4A574 100%)',
  },
  {
    id: 3,
    name: 'Bare Essence',
    tagline: 'Doğal minimal',
    gradient: 'linear-gradient(145deg, #EDE0D4 0%, #B8956A 100%)',
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: 'Nude Velvet Lipstick',
    category: 'Ruj',
    price: '₺649',
    shade: 'Rose Sand',
    badge: 'Bestseller',
    gradient: 'linear-gradient(160deg, #D4A89A 0%, #8B5E52 100%)',
  },
  {
    id: 2,
    name: 'Silk Touch Foundation',
    category: 'Fondöten',
    price: '₺899',
    shade: 'Warm Beige',
    badge: null,
    gradient: 'linear-gradient(160deg, #E8CDB5 0%, #C4A484 100%)',
  },
  {
    id: 3,
    name: 'Bare Glow Highlighter',
    category: 'Aydınlatıcı',
    price: '₺549',
    shade: 'Champagne',
    badge: 'Yeni',
    gradient: 'linear-gradient(160deg, #F5E6C8 0%, #D4A574 100%)',
  },
  {
    id: 4,
    name: 'Soft Blush Palette',
    category: 'Allık',
    price: '₺749',
    shade: 'Nude Bloom',
    badge: null,
    gradient: 'linear-gradient(160deg, #E8B4A8 0%, #C4786A 100%)',
  },
  {
    id: 5,
    name: 'Lash Silk Mascara',
    category: 'Maskara',
    price: '₺499',
    shade: 'Soft Brown',
    badge: null,
    gradient: 'linear-gradient(160deg, #6B5344 0%, #3D2E24 100%)',
  },
  {
    id: 6,
    name: 'Nude Line Eyeliner',
    category: 'Eyeliner',
    price: '₺399',
    shade: 'Espresso',
    badge: 'Limited',
    gradient: 'linear-gradient(160deg, #4A3728 0%, #2C2520 100%)',
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Elif K.',
    text: 'Ten rengime mükemmel uyum sağlayan nude tonlar. Sonunda doğal görünen bir makyaj buldum.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Zeynep A.',
    text: 'Velvet Nude ruj serisi favorim. Hem kalıcı hem de dudakları kurutmuyor.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Selin M.',
    text: 'Zarif ambalaj, premium his. Code Blonde gerçekten fark yaratıyor.',
    rating: 5,
  },
];

const INGREDIENTS = [
  { icon: '🌿', title: 'Doğal İçerik', desc: '%92 bitkisel kaynaklı formül' },
  { icon: '🐰', title: 'Cruelty Free', desc: 'Hayvan testi yapılmaz' },
  { icon: '♻️', title: 'Sürdürülebilir', desc: 'Geri dönüştürülebilir ambalaj' },
  { icon: '✨', title: 'Dermatolojik', desc: 'Hassas ciltler için test edildi' },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5 text-[#C4A484]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#2C2520] selection:bg-[#E8D5C4] selection:text-[#2C2520]">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E8D5C4]/40 bg-[#FAF7F4]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#" className="relative block h-8 w-28 lg:h-10 lg:w-36">
            <Image
              src="/code-blonde-logo.svg"
              alt="Code Blonde"
              fill
              className="object-contain object-left"
              priority
            />
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm tracking-[0.15em] uppercase text-[#6B5B4F] transition-colors hover:text-[#2C2520]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-6 md:flex">
            <button className="text-sm tracking-widest uppercase text-[#6B5B4F] transition-colors hover:text-[#2C2520]">
              Ara
            </button>
            <button className="rounded-full border border-[#2C2520] px-6 py-2.5 text-xs tracking-[0.2em] uppercase transition-all hover:bg-[#2C2520] hover:text-[#FAF7F4]">
              Sepet (0)
            </button>
          </div>

          <button
            className="flex flex-col gap-1.5 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            <span className={`block h-px w-6 bg-[#2C2520] transition-transform ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-px w-6 bg-[#2C2520] transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-6 bg-[#2C2520] transition-transform ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-[#E8D5C4]/40 bg-[#FAF7F4] px-6 py-6 md:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block border-b border-[#E8D5C4]/30 py-4 text-sm tracking-[0.15em] uppercase"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 lg:pt-36">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#E8D5C4]/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#D4A574]/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-32">
          <div className="order-2 lg:order-1">
            <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#C4A484]">
              Yeni Sezon · 2026
            </p>
            <h1 className="font-serif text-5xl leading-[1.1] tracking-tight text-[#2C2520] lg:text-7xl">
              Doğal
              <br />
              <span className="italic text-[#9B8B7E]">Güzelliğin</span>
              <br />
              Kodu
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#6B5B4F] lg:text-lg">
              Teninizin doğal tonlarına saygı duyan, nude paletle tasarlanmış
              premium kozmetik koleksiyonu. Zarif, minimal, zamansız.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#koleksiyon"
                className="inline-flex items-center gap-3 rounded-full bg-[#2C2520] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#FAF7F4] transition-transform hover:scale-[1.02]"
              >
                Koleksiyonu Keşfet
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#hikaye"
                className="inline-flex items-center rounded-full border border-[#C4A484] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#6B5B4F] transition-colors hover:border-[#2C2520] hover:text-[#2C2520]"
              >
                Hikayemiz
              </a>
            </div>

            <div className="mt-14 flex gap-10 border-t border-[#E8D5C4]/50 pt-10">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-3xl text-[#2C2520]">{stat.value}</p>
                  <p className="mt-1 text-xs tracking-widest uppercase text-[#9B8B7E]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[4/5] max-w-md lg:max-w-none">
              <div className="absolute inset-4 rounded-[2rem] bg-[#E8D5C4]/40" />
              <div
                className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-[#E8D5C4]/60"
                style={{ background: 'linear-gradient(165deg, #F5EDE4 0%, #E8D5C4 40%, #C4A484 100%)' }}
              >
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-white/60 blur-2xl" />
                  <div className="absolute bottom-1/3 right-1/4 h-40 w-40 rounded-full bg-[#D4A574]/40 blur-3xl" />
                </div>
                <div className="relative z-10 text-center">
                  <p className="text-xs tracking-[0.4em] uppercase text-[#6B5B4F]/80">Signature</p>
                  <p className="mt-2 font-serif text-4xl italic text-[#2C2520] lg:text-5xl">Nude</p>
                  <p className="mt-1 text-xs tracking-[0.3em] uppercase text-[#9B8B7E]">Collection</p>
                </div>
                <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white/50 shadow-sm"
                      style={{
                        background: [
                          '#E8CDB5',
                          '#D4A89A',
                          '#C4A484',
                          '#B8956A',
                          '#9B8B7E',
                        ][i],
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="koleksiyon" className="bg-[#F5EDE4]/50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C4A484]">Koleksiyonlar</p>
            <h2 className="mt-3 font-serif text-4xl text-[#2C2520] lg:text-5xl">Nude Serileri</h2>
            <p className="mx-auto mt-4 max-w-lg text-[#6B5B4F]">
              Her ten tonuna özel tasarlanmış üç imza koleksiyon
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {COLLECTIONS.map((col, idx) => (
              <a
                key={col.id}
                href="#urunler"
                className="group relative overflow-hidden rounded-2xl"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className="aspect-[3/4] transition-transform duration-700 group-hover:scale-105"
                  style={{ background: col.gradient }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2520]/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <p className="text-xs tracking-[0.25em] uppercase text-white/70">{col.tagline}</p>
                  <h3 className="mt-2 font-serif text-3xl text-white">{col.name}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                    İncele
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="urunler" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#C4A484]">Ürünler</p>
              <h2 className="mt-3 font-serif text-4xl text-[#2C2520] lg:text-5xl">En Sevilenler</h2>
            </div>
            <p className="max-w-xs text-sm text-[#6B5B4F]">
              Teninizle bütünleşen, doğal görünümlü formüller
            </p>
          </div>

          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <article
                key={product.id}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-[#F5EDE4]">
                  {product.badge && (
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-[#2C2520] px-3 py-1 text-[10px] tracking-widest uppercase text-[#FAF7F4]">
                      {product.badge}
                    </span>
                  )}
                  <div
                    className="aspect-square transition-transform duration-500 group-hover:scale-105"
                    style={{ background: product.gradient }}
                  />
                  <div
                    className={`absolute inset-x-0 bottom-0 flex items-center justify-center bg-[#2C2520]/90 py-4 transition-all duration-300 ${
                      hoveredProduct === product.id ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                    }`}
                  >
                    <button className="text-xs tracking-[0.2em] uppercase text-[#FAF7F4]">
                      Sepete Ekle
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="text-xs tracking-widest uppercase text-[#9B8B7E]">{product.category}</p>
                  <h3 className="mt-1 font-serif text-xl text-[#2C2520]">{product.name}</h3>
                  <p className="mt-1 text-sm text-[#C4A484]">{product.shade}</p>
                  <p className="mt-2 text-sm font-medium text-[#2C2520]">{product.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section id="hikaye" className="relative overflow-hidden bg-[#2C2520] py-20 text-[#FAF7F4] lg:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#C4A484] to-transparent" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#C4A484]">Hikayemiz</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight lg:text-5xl">
              Güzellik,
              <br />
              <span className="italic text-[#E8D5C4]">doğallıktan</span> gelir
            </h2>
            <p className="mt-6 leading-relaxed text-[#E8D5C4]/80">
              Code Blonde, her kadının kendine özgü güzelliğini öne çıkarmak için
              doğdu. Nude tonlarımız, farklı ten renklerine uyum sağlayacak şekilde
              özenle formüle edildi — abartısız, zarif ve zamansız.
            </p>
            <p className="mt-4 leading-relaxed text-[#E8D5C4]/60">
              Paris&apos;ten ilham alan minimal estetiğimiz, sürdürülebilir üretim
              anlayışımızla birleşiyor. Çünkü gerçek güzellik, kendin olmaktan geçer.
            </p>
            <button className="mt-10 rounded-full border border-[#C4A484] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#E8D5C4] transition-colors hover:bg-[#C4A484] hover:text-[#2C2520]">
              Daha Fazla Oku
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {INGREDIENTS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#C4A484]/20 bg-[#FAF7F4]/5 p-6 backdrop-blur-sm transition-colors hover:border-[#C4A484]/40"
              >
                <span className="text-2xl">{item.icon}</span>
                <h3 className="mt-4 text-sm tracking-wide text-[#FAF7F4]">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#E8D5C4]/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C4A484]">Yorumlar</p>
            <h2 className="mt-3 font-serif text-4xl text-[#2C2520] lg:text-5xl">Müşterilerimiz Ne Diyor</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote
                key={t.id}
                className="rounded-2xl border border-[#E8D5C4]/50 bg-white/50 p-8 backdrop-blur-sm"
              >
                <StarRating count={t.rating} />
                <p className="mt-5 text-sm leading-relaxed text-[#6B5B4F]">&ldquo;{t.text}&rdquo;</p>
                <footer className="mt-6 text-xs tracking-widest uppercase text-[#9B8B7E]">
                  — {t.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="iletisim" className="border-t border-[#E8D5C4]/40 py-20 lg:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
          <p className="text-xs tracking-[0.3em] uppercase text-[#C4A484]">Bülten</p>
          <h2 className="mt-3 font-serif text-3xl text-[#2C2520] lg:text-4xl">
            Nude dünyasına katılın
          </h2>
          <p className="mt-4 text-sm text-[#6B5B4F]">
            Yeni ürünler, özel indirimler ve güzellik ipuçları için abone olun.
          </p>
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 rounded-full border border-[#E8D5C4] bg-transparent px-6 py-4 text-sm text-[#2C2520] placeholder:text-[#9B8B7E] focus:border-[#C4A484] focus:outline-none sm:rounded-r-none"
            />
            <button
              type="submit"
              className="rounded-full bg-[#2C2520] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#FAF7F4] transition-colors hover:bg-[#4A3728] sm:rounded-l-none"
            >
              Abone Ol
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8D5C4]/40 bg-[#F5EDE4]/30 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative h-10 w-36">
                <Image
                  src="/code-blonde-logo.svg"
                  alt="Code Blonde"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#6B5B4F]">
                Doğal güzelliğin kodu. Nude tonlarda premium kozmetik deneyimi.
              </p>
            </div>

            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-[#2C2520]">Keşfet</h4>
              <ul className="mt-4 space-y-3">
                {['Koleksiyonlar', 'Yeni Gelenler', 'Bestseller', 'Hediye Setleri'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#6B5B4F] transition-colors hover:text-[#2C2520]">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-[#2C2520]">Destek</h4>
              <ul className="mt-4 space-y-3">
                {['İletişim', 'SSS', 'Kargo & İade', 'Gizlilik'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#6B5B4F] transition-colors hover:text-[#2C2520]">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E8D5C4]/40 pt-8 sm:flex-row">
            <p className="text-xs text-[#9B8B7E]">© 2026 Code Blonde. Tüm hakları saklıdır.</p>
            <div className="flex gap-6">
              {['Instagram', 'Pinterest', 'TikTok'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs tracking-widest uppercase text-[#9B8B7E] transition-colors hover:text-[#2C2520]"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
