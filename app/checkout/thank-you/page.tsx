"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-brown-light">
        <CheckCircle2 className="h-10 w-10 text-brand-brown" aria-hidden />
      </div>

      <h1 className="mt-8 text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
        Siparişiniz Başarıyla Oluşturuldu
      </h1>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        Ödemeniz alındı ve siparişiniz hazırlanmaya başlandı. Sipariş detayları
        e-posta adresinize gönderilecektir.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-brown"
        >
          Alışverişe Devam Et
        </Link>
        <Link
          href="/products"
          className="rounded-full border border-charcoal px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-powder"
        >
          Ürünleri Keşfet
        </Link>
      </div>
    </div>
  );
}
