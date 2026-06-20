'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@raxonltd/raxon-core/hook';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ViewLoginProps {
  onClose?: () => void;
  returnUrl?: string;
}

export default function ViewLogin({ onClose, returnUrl }: ViewLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login } = useAuth().loginEmail();
  const { mutate: loginGuest } = useAuth().loginGuest();
  const { mutate: loginSocial } = useAuth().loginSocial();
  const form = useForm();
  

  const handleSubmitGuest = (e: React.FormEvent) => {
    e.preventDefault();
    loginGuest({} as any, {
      onSuccess: () => {
        onClose?.();
      },
    });
  };

  const handleLoginSocial = (provider: string) => {
    loginSocial({ platform: provider, returnUrl: returnUrl }, {
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
          
          onClose?.();
          
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.info?.title || 'Giriş başarısız');
        }
      });
    })();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <input 
          type="email" 
          {...form.register('email')} 
          placeholder="E-posta adresinizi girin *"
          className="w-full px-0 py-5 text-lg font-medium border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-black transition-colors placeholder-gray-500" 
          required 
        />
      </div>

      {/* Password Field */}
      <div className="relative">
        <input 
          type={showPassword ? 'text' : 'password'} 
          {...form.register('password')} 
          placeholder="Şifre *"
          className="w-full px-0 py-5 pr-10 text-lg font-medium border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-black transition-colors placeholder-gray-500" 
          required 
        />
        <button
          type="button"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center">
          <input 
            id="remember" 
            type="checkbox" 
            {...form.register('rememberMe')} 
            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-0" 
          />
          <label htmlFor="remember" className="ml-2 text-base font-medium text-gray-700">Beni hatırla</label>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-base font-medium text-gray-600 hover:text-black transition-colors"
        >
          Şifrenizi mi unuttunuz?
        </button>
      </div>



      {/* Social Login */}
      <div className="py-6">
        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-base font-medium text-gray-500">Veya sosyal hesapla devam edin</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>
        
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => handleLoginSocial('google')} 
            className="py-4 text-base font-medium border border-gray-200 hover:border-black transition-colors flex items-center justify-center space-x-2"
          >
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_278_6045)">
                <path d="M21.6696 9.08832L12.696 9.08789C12.2997 9.08789 11.9785 9.40904 11.9785 9.8053V12.672C11.9785 13.0681 12.2997 13.3894 12.6959 13.3894H17.7493C17.196 14.8254 16.1632 16.0281 14.8455 16.7922L17.0002 20.5223C20.4567 18.5233 22.5002 15.0158 22.5002 11.0894C22.5002 10.5303 22.459 10.1307 22.3766 9.68064C22.314 9.33874 22.0171 9.08832 21.6696 9.08832Z" fill="#167EE6"/>
                <path d="M11.4999 17.6964C9.02689 17.6964 6.86797 16.3452 5.70846 14.3457L1.97852 16.4956C3.87666 19.7854 7.4325 22.0007 11.4999 22.0007C13.4953 22.0007 15.378 21.4635 16.9999 20.5272V20.5221L14.8452 16.792C13.8595 17.3637 12.719 17.6964 11.4999 17.6964Z" fill="#12B347"/>
                <path d="M17 20.5262V20.5211L14.8452 16.791C13.8596 17.3626 12.7192 17.6954 11.5 17.6954V21.9997C13.4953 21.9997 15.3782 21.4625 17 20.5262Z" fill="#0F993E"/>
                <path d="M4.80435 11.0007C4.80435 9.78177 5.13702 8.64133 5.70854 7.65576L1.9786 5.50586C1.0372 7.12264 0.5 9.00029 0.5 11.0007C0.5 13.0012 1.0372 14.8788 1.9786 16.4956L5.70854 14.3457C5.13702 13.3602 4.80435 12.2197 4.80435 11.0007Z" fill="#FFD500"/>
                <path d="M11.4999 4.30435C13.1126 4.30435 14.5939 4.87738 15.7509 5.83056C16.0363 6.06568 16.4512 6.04871 16.7127 5.78725L18.7438 3.75611C19.0405 3.45946 19.0193 2.97387 18.7024 2.69895C16.7639 1.0172 14.2416 0 11.4999 0C7.4325 0 3.87666 2.21534 1.97852 5.50511L5.70846 7.65501C6.86797 5.65555 9.02689 4.30435 11.4999 4.30435Z" fill="#FF4B26"/>
                <path d="M15.751 5.83056C16.0364 6.06568 16.4513 6.04871 16.7128 5.78725L18.7439 3.75611C19.0405 3.45946 19.0194 2.97387 18.7025 2.69895C16.764 1.01716 14.2417 0 11.5 0V4.30435C13.1126 4.30435 14.594 4.87738 15.751 5.83056Z" fill="#D93F21"/>
              </g>
            </svg>
            <span className="text-sm sm:text-base">Google ile giriş yap</span>
          </button>
          
          <button 
            type="button"
            onClick={() => handleLoginSocial('facebook')} 
            className="py-4 text-base font-medium border border-gray-200 hover:border-black transition-colors flex items-center justify-center space-x-2"
          >
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_278_6055)">
                <path d="M22.5 11C22.5 16.4905 18.4773 21.0414 13.2188 21.8664V14.1797H15.7818L16.2695 11H13.2188V8.93664C13.2188 8.06652 13.645 7.21875 15.0114 7.21875H16.3984V4.51172C16.3984 4.51172 15.1395 4.29688 13.9359 4.29688C11.4235 4.29688 9.78125 5.81969 9.78125 8.57656V11H6.98828V14.1797H9.78125V21.8664C4.52273 21.0414 0.5 16.4905 0.5 11C0.5 4.92508 5.42508 0 11.5 0C17.5749 0 22.5 4.92508 22.5 11Z" fill="#1877F2"/>
                <path d="M15.7818 14.1797L16.2695 11H13.2188V8.9366C13.2188 8.0667 13.6449 7.21875 15.0114 7.21875H16.3984V4.51172C16.3984 4.51172 15.1396 4.29688 13.9361 4.29688C11.4235 4.29688 9.78125 5.81969 9.78125 8.57656V11H6.98828V14.1797H9.78125V21.8663C10.3413 21.9542 10.9153 22 11.5 22C12.0847 22 12.6587 21.9542 13.2188 21.8663V14.1797H15.7818Z" fill="white"/>
              </g>
            </svg>
            <span className="text-sm sm:text-base">Facebook ile giriş yap</span>
          </button>
        </div>
      </div>

      {/* Misafir Login */}
      <button 
        onClick={handleSubmitGuest}
        type="button"
        className="w-full py-4 text-base font-medium hover:text-black transition-colors"
      >
        Misafir Olarak Devam Et
      </button>

      {/* Login Button */}
      <button 
        id="btnLogin"
        type="submit" 
        className="w-full py-5 text-lg font-bold bg-black text-white hover:bg-gray-800 transition-colors"
      >
        Giriş Yap
      </button>

      {/* Terms */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500 leading-relaxed">
          Devam ederek{' '}
          <button
            type="button"
            onClick={onClose}
            className="hover:underline"
          >
            Kullanım Şartları
          </button>{' '}
          ve{' '}
          <button
            type="button"
            onClick={onClose}
            className="hover:underline"
          >
            Gizlilik Politikası
          </button>
          'nı kabul etmiş olursunuz.
        </p>
      </div>
    </form>
  );
}