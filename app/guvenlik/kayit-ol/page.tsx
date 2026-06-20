'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@raxonltd/raxon-core/hook';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const inputBase =
  'w-full rounded-2xl border bg-white/60 py-4 text-[#5C4638] placeholder-[#A17E65]/50 transition-all focus:outline-none focus:ring-1';
const inputNormal = `${inputBase} border-[#D9C5B0] focus:border-[#5C4638] focus:ring-[#5C4638]`;
const inputError = `${inputBase} border-red-300 focus:border-red-400 focus:ring-red-400`;

// Zod validation şeması
const registerSchema = z.object({
  firstName: z.string()
    .min(1, 'Ad alanı zorunludur')
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(50, 'Ad en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/, 'Ad sadece harf içerebilir'),
  
  lastName: z.string()
    .min(1, 'Soyad alanı zorunludur')
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .max(50, 'Soyad en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/, 'Soyad sadece harf içerebilir'),
  
  email: z.string()
    .min(1, 'E-posta alanı zorunludur')
    .email('Geçerli bir e-posta adresi giriniz')
    .max(100, 'E-posta adresi çok uzun'),
  
  password: z.string()
    .min(1, 'Şifre alanı zorunludur')
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(100, 'Şifre çok uzun'),
  
  confirmPassword: z.string()
    .min(1, 'Şifre tekrarı zorunludur'),
  
  acceptTerms: z.boolean()
    .refine((val) => val === true, 'Kullanım şartlarını kabul etmelisiniz'),
  
  acceptMarketing: z.boolean().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function KayitOlPage() {
  const router = useRouter();
  const { register: authRegister } = useAuth();
  const registerMutation = authRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      acceptMarketing: false
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    registerMutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      acceptMarketing: data.acceptMarketing || false
    }, {
      onSuccess: () => {
        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
        router.push('/guvenlik/giris-yap');
      },
      onError: (e: any) => {
        toast.error(e.response?.data?.info?.title || 'Kayıt başarısız');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-md space-y-12">
        <div className="text-center">
          <Link href="/" className="inline-block mb-8">
            <div className="flex flex-col items-center gap-2">
              <img 
                src="/code-blonde-logo.svg" 
                alt="code blonde" 
                className="h-8 w-auto opacity-90" 
              />
              <span className="font-serif text-xl tracking-[4px] text-[#5C4638] font-light uppercase">code blonde</span>
            </div>
          </Link>
          <h1 className="font-serif text-4xl tracking-[-1px] text-[#5C4638]">Hesap oluştur</h1>
          <p className="mt-3 text-[#8B6B57] font-light tracking-tight">Kişiselleştirilmiş güzellik deneyimine başlayın.</p>
        </div>

        <div className="rounded-3xl border border-[#D9C5B0]/50 bg-white/40 backdrop-blur-sm p-8 sm:p-10 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2.5 block text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]">Ad</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A17E65]" />
                  <input
                    type="text"
                    {...register('firstName')}
                    placeholder="Adınız"
                    className={`pl-11 pr-4 text-sm ${errors.firstName ? inputError : inputNormal}`}
                  />
                </div>
                {errors.firstName && <p className="mt-1.5 text-[10px] text-red-400 font-light tracking-tight">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="mb-2.5 block text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]">Soyad</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A17E65]" />
                  <input
                    type="text"
                    {...register('lastName')}
                    placeholder="Soyadınız"
                    className={`pl-11 pr-4 text-sm ${errors.lastName ? inputError : inputNormal}`}
                  />
                </div>
                {errors.lastName && <p className="mt-1.5 text-[10px] text-red-400 font-light tracking-tight">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]">E-posta adresi</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A17E65]" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="ornek@email.com"
                  className={`pl-11 pr-4 text-sm ${errors.email ? inputError : inputNormal}`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-[10px] text-red-400 font-light tracking-tight">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2.5 block text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A17E65]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="En az 6 karakter"
                  className={`pl-11 pr-11 text-sm ${errors.password ? inputError : inputNormal}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A17E65] transition-colors hover:text-[#5C4638]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-[10px] text-red-400 font-light tracking-tight">{errors.password.message}</p>}
            </div>

            <div>
              <label className="mb-2.5 block text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]">Şifre tekrar</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A17E65]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Şifrenizi tekrar girin"
                  className={`pl-11 pr-11 text-sm ${errors.confirmPassword ? inputError : inputNormal}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A17E65] transition-colors hover:text-[#5C4638]"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-[10px] text-red-400 font-light tracking-tight">{errors.confirmPassword.message}</p>}
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register('acceptTerms')}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-[#D9C5B0] text-[#5C4638] focus:ring-[#5C4638] bg-transparent"
                />
                <label className="text-xs leading-relaxed text-[#8B6B57] font-light tracking-tight">
                  <Link href="/sozlesmeler/kullanim-sartlari" className="font-medium text-[#5C4638] hover:text-[#A17E65]">
                    Kullanım Şartları
                  </Link>{' '}
                  ve{' '}
                  <Link href="/sozlesmeler/gizlilik-sozlesmesi" className="font-medium text-[#5C4638] hover:text-[#A17E65]">
                    Gizlilik Politikası
                  </Link>
                  &apos;nı okudum ve kabul ediyorum.
                </label>
              </div>
              {errors.acceptTerms && <p className="text-[10px] text-red-400 pl-7 font-light tracking-tight">{errors.acceptTerms.message}</p>}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register('acceptMarketing')}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-[#D9C5B0] text-[#5C4638] focus:ring-[#5C4638] bg-transparent"
                />
                <label className="text-xs text-[#8B6B57] font-light tracking-tight">Kampanya ve promosyon bilgilerini e-posta ile almak istiyorum.</label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || registerMutation.isPending}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#5C4638] px-4 py-4 text-xs font-light uppercase tracking-[2.5px] text-[#F8F1E9] shadow-sm transition-all hover:bg-[#3F2F25] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{isSubmitting || registerMutation.isPending ? 'Kayıt oluşturuluyor...' : 'Kayıt ol'}</span>
              {!isSubmitting && !registerMutation.isPending && (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>

            <div className="border-t border-[#D9C5B0]/40 pt-8 text-center">
              <p className="text-xs text-[#8B6B57] font-light tracking-tight">
                Zaten hesabınız var mı?{' '}
                <Link href="/guvenlik/giris-yap" className="font-medium text-[#5C4638] transition-colors hover:text-[#A17E65]">
                  Giriş yap
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
