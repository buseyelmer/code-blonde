'use client';

import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

const benefits = [
  { icon: Truck, title: 'Ücretsiz Kargo', desc: '300₺ üzeri siparişlerde' },
  { icon: RefreshCw, title: 'Kolay İade', desc: '14 gün içinde ücretsiz' },
  { icon: Shield, title: 'Güvenli Ödeme', desc: '256-bit SSL şifreleme' },
  { icon: Headphones, title: '7/24 Destek', desc: 'Uzman müşteri hizmetleri' },
];

export function SectionHomeBenefit() {
  return (
    <section className="bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <benefit.icon size={20} className="text-rose-900" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 tracking-tight lg:text-[15px]">{benefit.title}</p>
                <p className="text-[12px] lg:text-[13px] text-neutral-500">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
