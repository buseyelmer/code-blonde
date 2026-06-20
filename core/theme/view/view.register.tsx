'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@raxonltd/raxon-core/hook';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Türk telefon numarası regex'i - 0 ile başlayan 11 haneli veya 5 ile başlayan 10 haneli
const turkishPhoneRegex = /^(\+90[5-9][0-9]{9}|0[5-9][0-9]{9}|[5-9][0-9]{8})$/;

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
  
  phone: z.string()
    .min(1, 'Telefon numarası zorunludur')
    .regex(turkishPhoneRegex, 'Geçerli bir Türk telefon numarası giriniz (örn: +905551234567)')
    .transform((val) => val.replace(/\s/g, '')), // Boşlukları temizle
  
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

interface ViewRegisterProps {
  onClose?: () => void;
  onSwitchToLogin?: () => void;
}

export default function ViewRegister({ onClose, onSwitchToLogin }: ViewRegisterProps) {
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
      phone: '',
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
      phone: data.phone,
      password: data.password,
      acceptMarketing: data.acceptMarketing || false
    }, {
      onSuccess: () => {
        
        onSwitchToLogin?.();
      },
      onError: (e: any) => {
        toast.error(e.response?.data?.info?.title || 'Kayıt başarısız');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              {...register('firstName')}
              placeholder="Adınız"
              className={`w-full pl-10 pr-4 py-3 text-sm border rounded-sm focus:outline-none transition-colors ${
                errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-black'
              }`}
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="relative">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              {...register('lastName')}
              placeholder="Soyadınız"
              className={`w-full pl-10 pr-4 py-3 text-sm border rounded-sm focus:outline-none transition-colors ${
                errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-black'
              }`}
            />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div className="relative">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            {...register('email')}
            placeholder="E-posta adresiniz"
            className={`w-full pl-10 pr-4 py-3 text-sm border rounded-sm focus:outline-none transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-200 focus:border-black'
            }`}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field */}
      <div className="relative">
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            {...register('phone')}
            placeholder="Telefon numaranız (örn: 05551234567)"
            className={`w-full pl-10 pr-4 py-3 text-sm border rounded-sm focus:outline-none transition-colors ${
              errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-black'
            }`}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="relative">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            {...register('password')}
            placeholder="Şifreniz (en az 6 karakter, büyük/küçük harf ve rakam)"
            className={`w-full pl-10 pr-12 py-3 text-sm border rounded-sm focus:outline-none transition-colors ${
              errors.password ? 'border-red-500' : 'border-gray-200 focus:border-black'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="relative">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register('confirmPassword')}
            placeholder="Şifrenizi tekrar giriniz"
            className={`w-full pl-10 pr-12 py-3 text-sm border rounded-sm focus:outline-none transition-colors ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-black'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms & Marketing Checkboxes */}
      <div className="space-y-3">
        <div className="flex items-start">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-0 focus:ring-offset-0 mt-0.5"
          />
          <label className="ml-2 text-sm text-gray-600 font-light">
            <button
              type="button"
              onClick={onClose}
              className="text-black hover:underline"
            >
              Kullanım Şartları
            </button>
            {' '}ve{' '}
            <button
              type="button"
              onClick={onClose}
              className="text-black hover:underline"
            >
              Gizlilik Politikası
            </button>
            'nı okudum ve kabul ediyorum. *
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-red-500 ml-6">{errors.acceptTerms.message}</p>
        )}

        <div className="flex items-start">
          <input
            type="checkbox"
            {...register('acceptMarketing')}
            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-0 focus:ring-offset-0 mt-0.5"
          />
          <label className="ml-2 text-sm text-gray-600 font-light">
            Kampanya ve promosyon bilgilerini e-posta ile almak istiyorum.
          </label>
        </div>
      </div>

      {/* Register Button */}
      <button
        type="submit"
        disabled={isSubmitting || registerMutation.isPending}
        className="w-full bg-black text-white py-3 rounded-sm hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-sm font-light uppercase tracking-wider">
          {isSubmitting || registerMutation.isPending ? 'Kayıt Oluşturuluyor...' : 'Kayıt Ol'}
        </span>
        {!isSubmitting && !registerMutation.isPending && (
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        )}
      </button>

      {/* Divider */}
      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-xs text-gray-500 uppercase tracking-wider">
          veya
        </span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* Social Register */}
      <div className="space-y-3 hidden">
        <button 
          type="button"
          className="w-full border border-gray-200 py-3 rounded-sm hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm font-light">Google ile kayıt ol</span>
        </button>
        
        <button 
          type="button"
          className="w-full border border-gray-200 py-3 rounded-sm hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="text-sm font-light">Facebook ile kayıt ol</span>
        </button>
      </div>
    </form>
  );
}