'use client';

import Image from 'next/image';
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
  'w-full rounded-xl border border-[#D9C5B0]/60 bg-[#F8F1E9] px-4 py-3 text-[#5C4638] placeholder:text-[#8B6B57]/50 transition-all focus:border-[#C9A99A] focus:outline-none focus:ring-1 focus:ring-[#C9A99A]';
const fieldErr =
  'w-full rounded-xl border border-red-400 bg-[#F8F1E9] px-4 py-3 text-[#5C4638] focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400';

interface WorkingHoursSchedule {
  active: boolean;
  startTime: string;
  endTime: string;
}

interface WorkingHoursData {
  [key: string]: WorkingHoursSchedule | undefined;
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

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 p-6 sm:p-8">
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
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
                <div>
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
                <div className="md:col-span-2">
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
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
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
                <div>
                  <label htmlFor="subject" className={labelClass}>
                    Konu *
                  </label>
                  <select
                    id="subject"
                    {...form.register('subject')}
                    className={form.formState.errors.subject ? fieldErr : fieldOk}
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

          <div className="space-y-8">
            <div>
              <p className="mb-4 text-xs tracking-[0.3em] uppercase text-[#A17E65]">İletişim yöntemleri</p>
              <div className="space-y-3">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={method.id}
                      href={method.link}
                      className="group flex items-start gap-4 rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 p-5 transition-colors hover:border-[#C9A99A]/60 hover:bg-[#EDE0D1]/50"
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

            {workingHoursList.length > 0 && (
              <div className="rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 p-6">
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

            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#D9C5B0]/40 bg-[#EDE0D1]">
              <Image
                src="/store/2.png"
                alt="Ofis"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#5C4638]/40 to-transparent" />
            </div>
          </div>
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
