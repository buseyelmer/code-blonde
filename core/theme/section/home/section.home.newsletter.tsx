'use client';

import { useState } from 'react';
import { useNewsletter } from '@raxonltd/raxon-core/hook';
import { CheckCircle2, Heart, Loader2, Mail } from 'lucide-react';
import { useRaxon } from '@raxonltd/raxon-core';

export function SectionHomeNewsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { subscribe: subscribeMutation } = useNewsletter();
  const { profile, isAuthenticated, isGuest } = useRaxon();

  const [newsletterSuccess, setNewsletterSuccess] = useState(false);


  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) return;
    subscribeMutation.mutate(
      {
        email: trimmed,
        ...(profile?.id ? { userId: profile.id } : {}),
      },
      {
        onSuccess: () => {
          setEmail('');
          setNewsletterSuccess(true);
          window.setTimeout(() => setNewsletterSuccess(false), 5000);
        },
      }
    );
  };
  return (
    <>
      {/* Newsletter */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={28} className="text-rose-900" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight mb-4">Bulut Ailesine Katılın</h2>
          <p className="text-sm text-neutral-600 mb-8">Yeni koleksiyonlardan ilk siz haberdar olun, özel indirimlerden ve üyelere özel avantajlardan yararlanın.</p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={subscribeMutation.isPending}
              className="flex-1 px-6 py-4 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={subscribeMutation.isPending || !email.trim()}
              className="bg-rose-900 text-white px-8 py-3.5 rounded-lg text-xs font-semibold uppercase tracking-[0.15em] hover:bg-rose-800 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {subscribeMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin shrink-0" />
                  Gönderiliyor...
                </>
              ) : (
                'Abone Ol'
              )}
            </button>
          </form>

          {newsletterSuccess && <p className="text-[12px] text-emerald-700 mt-4">Kaydınız alındı. Teşekkürler!</p>}
          {subscribeMutation.isError && <p className="text-[12px] text-red-600 mt-4">Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>}

          <p className="text-[12px] text-neutral-500 mt-4">Abone olarak gizlilik politikasını kabul etmiş olursunuz. İstediğiniz zaman abonelikten çıkabilirsiniz.</p>
        </div>
      </section>
    </>
  );
}
