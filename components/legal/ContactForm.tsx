"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.currentTarget;
    form.reset();

    alert("Mesajınız iletildi");
    setIsSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-stone/70 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-charcoal"
        >
          Ad Soyad
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-brand-purple/40 focus:ring-2 focus:ring-brand-purple/10"
          placeholder="Adınız ve soyadınız"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-charcoal"
        >
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-brand-purple/40 focus:ring-2 focus:ring-brand-purple/10"
          placeholder="ornek@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-charcoal"
        >
          Konu
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-brand-purple/40 focus:ring-2 focus:ring-brand-purple/10"
        >
          <option value="">Konu seçin</option>
          <option value="siparis">Sipariş Takibi</option>
          <option value="iade">İade & Değişim</option>
          <option value="urun">Ürün Bilgisi</option>
          <option value="diger">Diğer</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-charcoal"
        >
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 w-full resize-y rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-brand-purple/40 focus:ring-2 focus:ring-brand-purple/10"
          placeholder="Mesajınızı buraya yazın..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full border border-charcoal bg-charcoal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-brand-purple disabled:opacity-60 sm:w-auto"
      >
        Gönder
      </button>
    </form>
  );
}
