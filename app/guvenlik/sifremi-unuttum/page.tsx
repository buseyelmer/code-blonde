'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft, KeyRound, Loader2 } from 'lucide-react';
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

type Step = 'email' | 'code' | 'password';

const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta alanı zorunludur')
    .email('Geçerli bir e-posta adresi giriniz'),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Şifre alanı zorunludur')
      .min(6, 'Şifre en az 6 karakter olmalıdır')
      .max(100, 'Şifre çok uzun'),
    confirmPassword: z.string().min(1, 'Şifre tekrarı zorunludur'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

function getErrorMessage(error: unknown, fallback: string) {
  const err = error as { response?: { data?: { info?: { title?: string; message?: string } } } };
  return err?.response?.data?.info?.title || err?.response?.data?.info?.message || fallback;
}

export default function SifremiUnuttumPage() {
  const router = useRouter();
  const { codeSend, verifyCode, resetPassword } = useAuth();
  const codeSendMutation = codeSend();
  const verifyCodeMutation = verifyCode();
  const resetPasswordMutation = resetPassword();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const isPending =
    codeSendMutation.isPending || verifyCodeMutation.isPending || resetPasswordMutation.isPending;

  const onSendCode = (data: EmailFormData) => {
    setFormError('');
    codeSendMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setEmail(data.email);
          setCode('');
          setFormError('');
          setStep('code');
          toast.success('Doğrulama kodu e-posta adresinize gönderildi', { id: 'auth-code' });
        },
        onError: (error: unknown) => {
          const message = getErrorMessage(error, 'Kod gönderilemedi');
          setFormError(message);
          toast.error(message);
        },
      },
    );
  };

  const onResendCode = () => {
    if (!email) return;
    setFormError('');
    codeSendMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setCode('');
          setFormError('');
          toast.success('Yeni doğrulama kodu gönderildi', { id: 'auth-code' });
        },
        onError: (error: unknown) => {
          const message = getErrorMessage(error, 'Kod yeniden gönderilemedi');
          setFormError(message);
          toast.error(message);
        },
      },
    );
  };

  const onVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (code.length < 4) {
      const message = 'Lütfen doğrulama kodunu girin';
      setFormError(message);
      toast.error(message);
      return;
    }

    verifyCodeMutation.mutate(
      { email, code },
      {
        onSuccess: () => {
          passwordForm.reset();
          setFormError('');
          setStep('password');
          toast.success('Kod doğrulandı');
        },
        onError: (error: unknown) => {
          const message = getErrorMessage(error, 'Doğrulama kodu geçersiz');
          setFormError(message);
          toast.error(message);
        },
      },
    );
  };

  const onResetPassword = (data: PasswordFormData) => {
    setFormError('');
    resetPasswordMutation.mutate(
      { email, code, password: data.password },
      {
        onSuccess: () => {
          toast.success('Şifreniz başarıyla güncellendi');
          router.push('/guvenlik/giris-yap');
        },
        onError: (error: unknown) => {
          const message = getErrorMessage(error, 'Şifre güncellenemedi');
          setFormError(message);
          toast.error(message);
        },
      },
    );
  };

  const stepMeta = {
    email: {
      title: 'Şifremi unuttum',
      subtitle: 'E-posta adresinize bir doğrulama kodu göndereceğiz.',
    },
    code: {
      title: 'Doğrulama kodu',
      subtitle: `${email} adresine gönderilen kodu girin.`,
    },
    password: {
      title: 'Yeni şifre',
      subtitle: 'Hesabınız için yeni bir şifre belirleyin.',
    },
  }[step];

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
              <span className="font-serif text-xl tracking-[4px] text-[#5C4638] font-light uppercase">
                code blonde
              </span>
            </div>
          </Link>
          <h1 className="font-serif text-4xl tracking-[-1px] text-[#5C4638]">{stepMeta.title}</h1>
          <p className="mt-3 text-[#8B6B57] font-light tracking-tight">{stepMeta.subtitle}</p>
        </div>

        <div className="rounded-3xl border border-[#D9C5B0]/50 bg-white/40 backdrop-blur-sm p-8 sm:p-10 shadow-sm">
          <div className="mb-8 flex items-center justify-center gap-2">
            {(['email', 'code', 'password'] as Step[]).map((s, index) => {
              const activeIndex = step === 'email' ? 0 : step === 'code' ? 1 : 2;
              const done = index < activeIndex;
              const active = index === activeIndex;
              return (
                <React.Fragment key={s}>
                  {index > 0 && (
                    <div
                      className={`h-px w-8 ${done || active ? 'bg-[#5C4638]' : 'bg-[#D9C5B0]'}`}
                    />
                  )}
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] tracking-wide ${
                      active || done
                        ? 'bg-[#5C4638] text-[#F8F1E9]'
                        : 'border border-[#D9C5B0] text-[#A17E65]'
                    }`}
                  >
                    {index + 1}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {formError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-500">
              {formError}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={emailForm.handleSubmit(onSendCode)} className="space-y-7">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2.5 block text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]"
                >
                  E-posta adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A17E65]" />
                  <input
                    id="email"
                    type="email"
                    {...emailForm.register('email')}
                    placeholder="ornek@email.com"
                    className={`${emailForm.formState.errors.email ? inputError : inputNormal} pl-11 pr-4 text-sm`}
                    autoComplete="email"
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="mt-2 text-xs text-red-400">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#5C4638] px-4 py-4 text-xs font-light uppercase tracking-[2.5px] text-[#F8F1E9] shadow-sm transition-all hover:bg-[#3F2F25] active:scale-[0.985] disabled:opacity-60"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Kod gönder</span>
                {!isPending && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                )}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={onVerifyCode} className="space-y-7">
              <div>
                <label
                  htmlFor="code"
                  className="mb-2.5 block text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]"
                >
                  Doğrulama kodu
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A17E65]" />
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className={`${inputNormal} pl-11 pr-4 text-center text-lg tracking-[0.35em]`}
                    autoComplete="one-time-code"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending || code.length < 4}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#5C4638] px-4 py-4 text-xs font-light uppercase tracking-[2.5px] text-[#F8F1E9] shadow-sm transition-all hover:bg-[#3F2F25] active:scale-[0.985] disabled:opacity-60"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Doğrula</span>
                {!isPending && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                )}
              </button>

              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={onResendCode}
                  disabled={isPending}
                  className="text-xs font-light text-[#8B6B57] tracking-tight transition-colors hover:text-[#5C4638] disabled:opacity-60"
                >
                  Kodu tekrar gönder
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormError('');
                    setStep('email');
                    setCode('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-light text-[#A17E65] tracking-tight transition-colors hover:text-[#5C4638]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  E-posta adresini değiştir
                </button>
              </div>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(onResetPassword)} className="space-y-7">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2.5 block text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]"
                >
                  Yeni şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A17E65]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...passwordForm.register('password')}
                    placeholder="••••••••"
                    className={`${passwordForm.formState.errors.password ? inputError : inputNormal} pl-11 pr-11 text-sm`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A17E65] transition-colors hover:text-[#5C4638]"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.password && (
                  <p className="mt-2 text-xs text-red-400">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2.5 block text-[10px] font-light uppercase tracking-[3px] text-[#A17E65]"
                >
                  Şifre tekrarı
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A17E65]" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...passwordForm.register('confirmPassword')}
                    placeholder="••••••••"
                    className={`${passwordForm.formState.errors.confirmPassword ? inputError : inputNormal} pl-11 pr-11 text-sm`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A17E65] transition-colors hover:text-[#5C4638]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-400">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#5C4638] px-4 py-4 text-xs font-light uppercase tracking-[2.5px] text-[#F8F1E9] shadow-sm transition-all hover:bg-[#3F2F25] active:scale-[0.985] disabled:opacity-60"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Şifreyi güncelle</span>
                {!isPending && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                )}
              </button>
            </form>
          )}

          <div className="border-t border-[#D9C5B0]/40 pt-8 mt-8 text-center">
            <p className="text-xs text-[#8B6B57] font-light tracking-tight">
              Şifrenizi hatırladınız mı?{' '}
              <Link
                href="/guvenlik/giris-yap"
                className="font-medium text-[#5C4638] transition-colors hover:text-[#A17E65]"
              >
                Giriş yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
