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

const contactFormSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phoneNumber: z.string().optional(),
  subject: z.string().min(1, 'Lütfen bir konu seçiniz'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const labelClass = 'mb-2 block text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500';
const fieldOk = 'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all focus:border-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-900';
const fieldErr = 'w-full rounded-lg border border-red-500 bg-white px-4 py-3 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500';

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
      .filter(day => day in workingHours && workingHours[day]?.active)
      .map(day => {
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
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          <Link href="/" className="transition-colors hover:text-rose-900">
            Ana Sayfa
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-gray-900">İletişim</span>
        </nav>

        <div className="mb-10 lg:mb-12">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Bize ulaşın</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
            Sorularınız, önerileriniz veya destek talepleriniz için formu doldurun veya doğrudan iletişim kanallarımızı kullanın.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500">Mesaj gönderin</p>
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">İletişim formu</h2>

            {submitted && (
              <div className="mb-6 flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-rose-900" strokeWidth={1.5} />
                <div>
                  <h3 className="font-semibold text-gray-900">Mesajınız gönderildi</h3>
                  <p className="mt-1 text-sm text-gray-600">En kısa sürede size dönüş yapacağız.</p>
                </div>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-900 px-8 py-4 text-sm font-medium uppercase tracking-wide text-white shadow-md transition hover:bg-rose-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mutation.isPending || form.formState.isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Gönderiliyor…</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" strokeWidth={1.5} />
                    <span>Mesaj gönder</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-10">
            <div>
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500">İletişim yöntemleri</p>
              <div className="space-y-3">
                {contactMethods.map(method => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={method.id}
                      href={method.link}
                      className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-rose-900/40 hover:bg-rose-50/30"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors group-hover:border-rose-900 group-hover:text-rose-900">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900">{method.title}</h3>
                        <p className="mt-0.5 text-sm text-gray-700">{method.value}</p>
                        <p className="mt-1 text-xs text-gray-500">{method.description}</p>
                      </div>
                      <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-rose-900" />
                    </a>
                  );
                })}
              </div>
            </div>

            {workingHoursList.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600">
                    <Clock className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-semibold text-gray-900">Çalışma saatleri</h3>
                </div>
                <div className="space-y-2">
                  {workingHoursList.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{schedule.day}</span>
                      <span className="font-medium tabular-nums text-gray-900">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
              <Image
                src="/store/2.png"
                alt="Ofis"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-gray-200 pt-12 text-center sm:mt-20 sm:pt-16">
          <p className="mb-6 text-base text-gray-600">Ürünlerimizi incelemek ister misiniz?</p>
          <Link
            href="/urunler"
            className="group inline-flex items-center gap-2 rounded-lg bg-rose-900 px-8 py-4 text-sm font-medium uppercase tracking-wide text-white shadow-md transition hover:bg-rose-800 hover:shadow-lg"
          >
            Ürünlere git
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
