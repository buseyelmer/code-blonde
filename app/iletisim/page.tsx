'use client';

import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2, ChevronRight, Send } from 'lucide-react';
import { useFormSubmit } from '@raxonltd/raxon-core/hook';
import { useRaxon } from '@raxonltd/raxon-core';
import toast from 'react-hot-toast';
import { HOME_DATA } from '@/core/constant/home.constant';

const contactFormSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phoneNumber: z.string().optional(),
  subject: z.string().min(1, 'Lütfen bir konu seçiniz'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const labelClass = 'mb-2 block text-[11px] font-medium uppercase tracking-[0.22em] text-[#A17E65]';
const fieldOk =
  'box-border block w-full min-w-0 rounded-xl border border-[#D9C5B0]/60 bg-[#F8F1E9] px-4 py-3 text-sm leading-normal text-[#5C4638] placeholder:text-[#8B6B57]/50 transition-all focus:border-[#C9A99A] focus:outline-none focus:ring-1 focus:ring-[#C9A99A]';
const fieldErr =
  'box-border block w-full min-w-0 rounded-xl border border-red-400 bg-[#F8F1E9] px-4 py-3 text-sm leading-normal text-[#5C4638] focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400';
const selectField =
  'appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10 [background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%238B6B57%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")]';

interface WorkingHoursSchedule {
  active: boolean;
  startTime: string;
  endTime: string;
}

interface WorkingHoursData {
  [key: string]: WorkingHoursSchedule | undefined;
}

const INSTAGRAM_FALLBACK_URL = 'https://www.instagram.com/codeblonde';

function resolveInstagramLink(socialMediaLinks: unknown): { href: string; handle: string } {
  const links: { label: string; href: string }[] = [];

  if (Array.isArray(socialMediaLinks)) {
    for (const item of socialMediaLinks) {
      if (typeof item === 'string') links.push({ label: item, href: item });
      else if (typeof item === 'object' && item !== null) {
        const record = item as Record<string, unknown>;
        const href = String(record.url ?? record.link ?? record.href ?? '');
        const label = String(record.platform ?? record.name ?? record.label ?? href);
        if (href) links.push({ label, href });
      }
    }
  } else if (socialMediaLinks && typeof socialMediaLinks === 'object') {
    for (const [platform, href] of Object.entries(socialMediaLinks as Record<string, string>)) {
      if (href) links.push({ label: platform, href });
    }
  }

  const instagram = links.find(
    (link) =>
      link.label.toLowerCase().includes('instagram') || link.href.toLowerCase().includes('instagram.com'),
  );

  const href = instagram?.href ?? INSTAGRAM_FALLBACK_URL;
  const handleMatch = href.match(/instagram\.com\/([^/?#]+)/i);
  const handle = handleMatch?.[1] ? `@${handleMatch[1]}` : '@codeblonde';

  return { href, handle };
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { branch } = useRaxon();

  const contactMethods = useMemo(() => {
    const methods = [];
    if (branch?.email) {
      methods.push({
        id: 'email',
        icon: Mail,
        title: 'E-posta',
        value: branch.email,
        link: `mailto:${branch.email}`,
        description: '7/24 e-posta desteği',
      });
    }
    if (branch?.phoneNumber) {
      methods.push({
        id: 'phone',
        icon: Phone,
        title: 'Telefon',
        value: branch.phoneNumber,
        link: `tel:${branch.phoneNumber.replace(/\s/g, '')}`,
        description: 'Çalışma saatleri içinde',
      });
    }
    if (branch?.openAddress) {
      methods.push({
        id: 'address',
        icon: MapPin,
        title: 'Ofis',
        value: branch.openAddress,
        link: branch?.googleMapsLink || '#',
        description: 'Ziyaret edebilirsiniz',
      });
    }
    return methods;
  }, [branch]);

  const workingHoursList = useMemo(() => {
    const workingHours = branch?.branchMeetSetting?.workingHours as WorkingHoursData | undefined;
    if (!workingHours || typeof workingHours !== 'object') return [];

    const dayTranslations: Record<string, string> = {
      monday: 'Pazartesi',
      tuesday: 'Salı',
      wednesday: 'Çarşamba',
      thursday: 'Perşembe',
      friday: 'Cuma',
      saturday: 'Cumartesi',
      sunday: 'Pazar',
    };

    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return dayOrder
      .filter((day) => day in workingHours && workingHours[day]?.active)
      .map((day) => {
        const schedule = workingHours[day] as WorkingHoursSchedule;
        return {
          day: dayTranslations[day],
          hours: `${schedule.startTime} - ${schedule.endTime}`,
        };
      });
  }, [branch?.branchMeetSetting?.workingHours]);

  const instagram = useMemo(
    () => resolveInstagramLink(branch?.socialMediaLinks),
    [branch?.socialMediaLinks],
  );

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      subject: '',
      message: '',
    },
  });

  const { create } = useFormSubmit();
  const mutation = create();

  const onSubmit = async (data: ContactFormData) => {
    try {
      await mutation.mutateAsync({
        ...data,
        response: data,
        content: data,
      });
      toast.success('Mesajınız başarıyla gönderildi!');
      form.reset();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      toast.error('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F1E9] text-[#5C4638] selection:bg-[#C9A99A] selection:text-[#F8F1E9]">
      <div className="border-b border-[#D9C5B0]/50 bg-[#EDE0D1]/60 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-14 gap-y-2 px-8 text-[11px] font-light tracking-[2.5px] text-[#8B6B57]/80">
          {(HOME_DATA?.TRUST_ITEMS ?? []).map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>

      <div className="border-b border-[#D9C5B0]/50 bg-[#EDE0D1]/60">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B6B57]">
            <Link href="/" className="transition-colors hover:text-[#5C4638]">
              Ana Sayfa
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            <span className="text-[#5C4638]">İletişim</span>
          </nav>
          <p className="text-xs tracking-[0.3em] uppercase text-[#A17E65]">Code Blonde</p>
          <h1 className="mt-3 font-serif text-4xl text-[#5C4638] sm:text-5xl">
            Bize <span className="italic text-[#A17E65]">ulaşın</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#8B6B57] sm:text-base">
            Sorularınız, önerileriniz veya destek talepleriniz için formu doldurun veya doğrudan iletişim kanallarımızı
            kullanın.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12 xl:gap-14">
          <div className="rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 p-6 sm:p-8 lg:p-10">
            <p className="text-xs tracking-[0.3em] uppercase text-[#A17E65]">Mesaj gönderin</p>
            <h2 className="mt-2 font-serif text-2xl text-[#5C4638] sm:text-3xl">İletişim formu</h2>

            {submitted && (
              <div className="mt-6 flex items-start gap-4 rounded-xl border border-[#C9A99A]/50 bg-[#EDE0D1]/60 p-4">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#A17E65]" strokeWidth={1.5} />
                <div>
                  <h3 className="font-medium text-[#5C4638]">Mesajınız gönderildi</h3>
                  <p className="mt-1 text-sm text-[#8B6B57]">En kısa sürede size dönüş yapacağız.</p>
                </div>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor="firstName" className={labelClass}>
                    Ad *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...form.register('firstName')}
                    className={form.formState.errors.firstName ? fieldErr : fieldOk}
                    placeholder="Adınız"
                  />
                  {form.formState.errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="min-w-0">
                  <label htmlFor="lastName" className={labelClass}>
                    Soyad *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...form.register('lastName')}
                    className={form.formState.errors.lastName ? fieldErr : fieldOk}
                    placeholder="Soyadınız"
                  />
                  {form.formState.errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
                <div className="min-w-0 md:col-span-2">
                  <label htmlFor="email" className={labelClass}>
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...form.register('email')}
                    className={form.formState.errors.email ? fieldErr : fieldOk}
                    placeholder="ornek@email.com"
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="min-w-0">
                  <label htmlFor="phoneNumber" className={labelClass}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    {...form.register('phoneNumber')}
                    className={form.formState.errors.phoneNumber ? fieldErr : fieldOk}
                    placeholder="Telefon numaranız"
                  />
                  {form.formState.errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.phoneNumber.message}</p>
                  )}
                </div>
                <div className="min-w-0">
                  <label htmlFor="subject" className={labelClass}>
                    Konu *
                  </label>
                  <select
                    id="subject"
                    {...form.register('subject')}
                    className={`${form.formState.errors.subject ? fieldErr : fieldOk} ${selectField} cursor-pointer`}
                  >
                    <option value="">Konu seçin</option>
                    <option value="genel">Genel bilgi</option>
                    <option value="siparis">Sipariş</option>
                    <option value="iade">İade / değişim</option>
                    <option value="urun">Ürün bilgisi</option>
                    <option value="oneri">Öneri / şikayet</option>
                    <option value="diger">Diğer</option>
                  </select>
                  {form.formState.errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.subject.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Mesajınız *
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...form.register('message')}
                  className={`resize-none ${form.formState.errors.message ? fieldErr : fieldOk}`}
                  placeholder="Mesajınızı buraya yazın..."
                />
                {form.formState.errors.message && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending || form.formState.isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#5C4638] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#F8F1E9] transition-all hover:bg-[#4A382C] focus:outline-none focus:ring-2 focus:ring-[#C9A99A] focus:ring-offset-2 focus:ring-offset-[#F5EDE4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mutation.isPending || form.formState.isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F8F1E9] border-t-transparent" />
                    <span>Gönderiliyor…</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" strokeWidth={1.5} />
                    <span>Mesaj gönder</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-6">
              {contactMethods.length > 0 && (
                <div className="rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 p-6 sm:p-7">
                  <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#A17E65]">İletişim yöntemleri</p>
                  <div className="space-y-3">
                    {contactMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <a
                          key={method.id}
                          href={method.link}
                          className="group flex items-start gap-4 rounded-xl border border-[#D9C5B0]/40 bg-[#F8F1E9]/60 p-4 transition-colors hover:border-[#C9A99A]/60 hover:bg-[#EDE0D1]/50"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A99A]/50 text-[#A17E65] transition-colors group-hover:border-[#A17E65] group-hover:bg-[#EDE0D1]">
                            <Icon className="h-5 w-5" strokeWidth={1.5} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-[#5C4638]">{method.title}</h3>
                            <p className="mt-0.5 text-sm text-[#8B6B57]">{method.value}</p>
                            <p className="mt-1 text-xs text-[#A17E65]">{method.description}</p>
                          </div>
                          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#C9A99A] transition-all group-hover:translate-x-0.5 group-hover:text-[#A17E65]" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {workingHoursList.length > 0 && (
                <div className="rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 p-6 sm:p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A99A]/50 text-[#A17E65]">
                      <Clock className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <h3 className="font-medium text-[#5C4638]">Çalışma saatleri</h3>
                  </div>
                  <div className="space-y-2">
                    {workingHoursList.map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-[#8B6B57]">{schedule.day}</span>
                        <span className="font-medium tabular-nums text-[#5C4638]">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex aspect-[16/10] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#D9C5B0]/40 bg-gradient-to-br from-[#F5EDE4] via-[#EDE0D1] to-[#E8D5C4] p-6 text-center transition hover:border-[#C9A99A]/70 hover:shadow-[0_8px_24px_rgba(92,70,56,0.08)]"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A99A]/50 bg-[#F8F1E9]/90 text-[#5C4638] transition group-hover:scale-105 group-hover:border-[#A17E65] group-hover:bg-[#F8F1E9]">
                  <InstagramIcon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-xs tracking-[0.3em] uppercase text-[#A17E65]">Instagram</p>
                <p className="mt-2 font-serif text-lg text-[#5C4638]">Bizi takip edin</p>
                <p className="mt-1 text-sm text-[#8B6B57]">{instagram.handle}</p>
                <ArrowRight className="mt-3 h-4 w-4 text-[#C9A99A] transition group-hover:translate-x-0.5 group-hover:text-[#A17E65]" />
              </a>
            </div>
          </aside>
        </div>

        <div className="mt-16 rounded-2xl bg-[#5C4638] px-8 py-12 text-center text-[#F8F1E9] sm:px-12">
          <p className="text-sm text-[#E8D5C4]">Ürünlerimizi incelemek ister misiniz?</p>
          <Link
            href="/urunler"
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#F8F1E9] px-8 py-4 text-xs tracking-[0.2em] uppercase text-[#5C4638] transition-all hover:scale-[1.02]"
          >
            Ürünlere git
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
