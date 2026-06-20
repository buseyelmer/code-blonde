'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@raxonltd/raxon-core/hook';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const inputBase =
  'w-full rounded-2xl border bg-white/60 py-4 text-[#5C4638] placeholder-[#A17E65]/50 transition-all focus:outline-none focus:ring-1';
const inputNormal = `${inputBase} border-[#D9C5B0] focus:border-[#5C4638] focus:ring-[#5C4638]`;

export default function GirisYapPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login } = useAuth().loginEmail();
  const { mutate: loginGuest } = useAuth().loginGuest();
  const { mutate: loginSocial } = useAuth().loginSocial();
  const form = useForm();
  const router = useRouter();

 
  const handleLoginSocial = (provider: string) => {
    loginSocial({ platform: provider, returnUrl: '/hesabim' }, {
      onSuccess: (url) => {
        if (typeof window !== 'undefined') {
          window.location.href = url;
        }
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(data => {
      login(data, {
        onSuccess: () => {
          
          router.push('/hesabim');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.info?.title || 'Giriş başarısız');
        }
      });
    })();
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
          <h1 className="font-serif text-4xl tracking-[-1px] text-[#5C4638]">Tekrar hoş geldiniz</h1>
          <p className="mt-3 text-[#8B6B57] font-light tracking-tight">Zarafet dolu dünyamıza giriş yapın.</p>
        </div>

        <div className="rounded-3xl border border-[#D9C5B0]/50 bg-white/40 backdrop-blur-sm p-8 sm:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label htmlFor="email" className="mb-2.5 block text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]">
                E-posta adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A17E65]" />
                <input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="ornek@email.com"
                  className={`${inputNormal} pl-11 pr-4 text-sm`}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2.5 block text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A17E65]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('password')}
                  placeholder="••••••••"
                  className={`${inputNormal} pl-11 pr-11 text-sm`}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A17E65] transition-colors hover:text-[#5C4638]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  {...form.register('rememberMe')}
                  className="h-4 w-4 rounded border-[#D9C5B0] text-[#5C4638] focus:ring-[#5C4638] bg-transparent"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-[#8B6B57] font-light tracking-tight">
                  Beni hatırla
                </label>
              </div>
              <Link
                href="/guvenlik/sifremi-unuttum"
                className="text-xs font-light text-[#8B6B57] tracking-tight transition-colors hover:text-[#5C4638]"
              >
                Şifremi unuttum
              </Link>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#5C4638] px-4 py-4 text-xs font-light uppercase tracking-[2.5px] text-[#F8F1E9] shadow-sm transition-all hover:bg-[#3F2F25] active:scale-[0.985]"
            >
              <span>Giriş yap</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D9C5B0]/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#F8F1E9] px-4 text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]">
                  Veya
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleLoginSocial('google')}
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-[#D9C5B0] bg-white/50 py-3 px-4 transition-all hover:border-[#A17E65] hover:bg-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-xs font-light tracking-[1px] text-[#5C4638]">Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleLoginSocial('facebook')}
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-[#D9C5B0] bg-white/50 py-3 px-4 transition-all hover:border-[#A17E65] hover:bg-white"
              >
                <svg className="h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-xs font-light tracking-[1px] text-[#5C4638]">Facebook</span>
              </button>
            </div>


            <div className="border-t border-[#D9C5B0]/40 pt-8 text-center">
              <p className="text-xs text-[#8B6B57] font-light tracking-tight">
                Hesabınız yok mu?{' '}
                <Link href="/guvenlik/kayit-ol" className="font-medium text-[#5C4638] transition-colors hover:text-[#A17E65]">
                  Kayıt ol
                </Link>
              </p>
            </div>

            <p className="text-center text-[10px] leading-relaxed text-[#A17E65] font-light tracking-tight">
              Devam ederek{' '}
              <Link href="/sozlesmeler/kullanim-sartlari" className="underline underline-offset-4 hover:text-[#5C4638]">
                Kullanım Şartları
              </Link>{' '}
              ve{' '}
              <Link href="/sozlesmeler/gizlilik-sozlesmesi" className="underline underline-offset-4 hover:text-[#5C4638]">
                Gizlilik Politikası
              </Link>
              &apos;nı kabul etmiş olursunuz.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
