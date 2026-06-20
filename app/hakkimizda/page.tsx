'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ArrowRight, ArrowUpRight, Heart, Shield, Sparkles, Target, CheckCircle, Truck, ShieldCheck, RefreshCw, Clock, ChevronRight } from 'lucide-react';

const VALUES = [
  { id: 1, icon: Heart, title: 'Müşteri odaklılık', description: 'Her kararımızda müşterilerimizin ihtiyaçlarını ön planda tutuyoruz.' },
  { id: 2, icon: Shield, title: 'Kalite güvencesi', description: 'Tüm ürünlerimiz en yüksek kalite standartlarına uygun olarak seçilir.' },
  { id: 3, icon: Sparkles, title: 'Yenilikçilik', description: 'Moda dünyasının en son trendlerini takip ederek koleksiyonlarımızı sürekli güncelliyoruz.' },
  { id: 4, icon: Target, title: 'Sürdürülebilirlik', description: 'Çevreye duyarlı üretim ve tüketim prensiplerini benimsiyoruz.' },
];

const STATS = [
  { value: '50K+', label: 'Mutlu müşteri' },
  { value: '15+', label: 'Yıllık deneyim' },
  { value: '500+', label: 'Ürün çeşidi' },
  { value: '98%', label: 'Memnuniyet oranı' },
];

const COMMITMENTS = [
  '100% güvenli ödeme sistemi',
  'Ücretsiz kargo ve hızlı teslimat',
  '30 gün içinde kolay iade',
  '7/24 müşteri desteği',
  'Özenli paketleme ve hediye seçenekleri',
];

const FEATURES = [
  { icon: Truck, title: 'Ücretsiz kargo', desc: 'Tüm siparişlerinizde ücretsiz ve hızlı teslimat.' },
  { icon: ShieldCheck, title: 'Güvenli ödeme', desc: '256-bit SSL ile güvenli alışveriş deneyimi.' },
  { icon: RefreshCw, title: 'Kolay iade', desc: '30 gün içinde koşulsuz iade ve değişim.' },
  { icon: Clock, title: '7/24 destek', desc: 'Uzman ekibimizle her an yanınızdayız.' },
] as const;

export default function Hakkimizda() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          <Link href="/" className="transition-colors hover:text-rose-900">
            Ana Sayfa
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          <span className="text-gray-900">Hakkımızda</span>
        </nav>

        <header className="mb-12 lg:mb-16">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Hakkımızda</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Moda dünyasında zamansız zarafeti ve modern tasarımı buluşturan bir marka olarak, her sezon sizlere en kaliteli ürünleri sunmaya devam ediyoruz.
          </p>
        </header>

        {/* Hikayemiz */}
        <section className="mb-16 grid grid-cols-1 items-center gap-10 lg:mb-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500">Hikayemiz</p>
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">Moda dünyasında iz bırakan bir yolculuk</h2>
            <div className="space-y-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              <p>
                2010 yılında kurulan markamız, moda ve kalite tutkusuyla başlayan bir hayalin ürünü. İstanbul merkezli olarak faaliyet gösteren şirketimiz, zaman içinde genişleyen koleksiyonları ve müşteri odaklı yaklaşımıyla sektörde öncü konuma geldi.
              </p>
              <p>
                Her sezon, dünya moda trendlerini yakından takip ederek koleksiyonlarımızı güncelliyoruz. Minimalist tasarımdan cesur seçimlere kadar geniş bir yelpazede ürünler sunarak, her zevke hitap etmeyi hedefliyoruz.
              </p>
              <p>Kalite, konfor ve stil bir arada olsun istiyoruz. Bu yüzden her ürünümüzü titizlikle seçiyor, müşterilerimizin memnuniyetini ön planda tutuyoruz.</p>
            </div>
          </div>
          <div className="relative aspect-[5/3] overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
            <Image
              src="/store/2.png"
              alt="Hikayemiz"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
          </div>
        </section>

        {/* Değerlerimiz */}
        <section className="mb-16 border-t border-gray-200 pt-16 lg:mb-20 lg:pt-20">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500">Değerlerimiz</p>
          <h2 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">Bizi yönlendiren prensipler</h2>
          <p className="mb-10 max-w-2xl text-sm text-gray-600 sm:text-base">
            Her adımımızda bu değerlerle ilerliyor, müşterilerimize en iyi deneyimi sunmak için çalışıyoruz.
          </p>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {VALUES.map(value => {
              const Icon = value.icon;
              return (
                <div key={value.id} className="group">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors duration-200 group-hover:border-rose-900 group-hover:text-rose-900">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <h3 className="font-semibold text-gray-900">{value.title}</h3>
                  </div>
                  <p className="pl-14 text-sm leading-relaxed text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Neden biz */}
        <section className="mb-16 lg:mb-20">
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8 lg:p-10">
            <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500">Neden biz</p>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {FEATURES.map((feature, idx) => (
                <div key={idx} className="group/feat">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors duration-200 group-hover/feat:border-rose-900 group-hover/feat:text-rose-900">
                      <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  </div>
                  <p className="pl-14 text-sm leading-relaxed text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* İstatistikler */}
        <section className="mb-16 lg:mb-20">
          <div className="grid grid-cols-2 gap-6 rounded-xl border border-gray-100 bg-white px-6 py-10 md:grid-cols-4 md:gap-8 md:px-10">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <span className="block text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">{stat.value}</span>
                <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Misyon */}
        <section className="mb-16 grid grid-cols-1 items-center gap-10 lg:mb-20 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 aspect-[5/4] overflow-hidden rounded-xl border border-gray-100 bg-gray-100 lg:order-1">
            <Image
              src="/store/1.png"
              alt="Misyonumuz"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500">Misyonumuz</p>
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">Üst kalitedeki ürünleri tüm herkese ulaştırmak</h2>
            <p className="mb-8 text-sm leading-relaxed text-gray-600 sm:text-base">
              Kaliteli iç giyimi herkesin erişebileceği bir deneyim haline getirmek. Müşterilerimizin günlük yaşamlarında kendilerini rahat, özgüvenli ve özel hissetmelerini sağlamak.
            </p>
            <ul className="space-y-3">
              {COMMITMENTS.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-900" strokeWidth={1.5} />
                  <span className="text-sm leading-relaxed text-gray-600 sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Vizyon */}
        <section className="mb-16 rounded-xl border border-gray-100 bg-gray-50/50 px-6 py-12 text-center sm:px-10 sm:py-14 lg:mb-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600">
              <Target className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500">Vizyonumuz</p>
            <p className="text-lg font-semibold leading-relaxed text-gray-900 sm:text-xl">
              Premium değil, kaliteli bir marka olmak. İnsanların tenlerine değen özel iç giyim ürünlerinin en iyilerini onlara sunmak istiyoruz.
            </p>
            <Link
              href="/urunler"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gray-900 transition-colors hover:text-rose-900"
            >
              Koleksiyonları keşfet
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-gray-200 pt-12 text-center sm:pt-16">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">Koleksiyonlarımızı keşfedin</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-600 sm:text-base">Özenle seçilmiş ürünlerimizle gardırobunuzu tamamlayın.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/urunler"
              className="group inline-flex items-center gap-2 rounded-lg bg-rose-900 px-8 py-4 text-sm font-medium uppercase tracking-wide text-white shadow-md transition hover:bg-rose-800 hover:shadow-lg"
            >
              Ürünleri incele
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/iletisim"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gray-600 transition-colors hover:text-rose-900"
            >
              İletişime geçin
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
