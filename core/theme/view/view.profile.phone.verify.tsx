"use client";
import { useEffect, useState } from "react";
import { Phone, Shield, Check, AlertCircle, Clock, ArrowRight, CheckCircle, X } from "lucide-react";
import { useProfile } from "@raxonltd/raxon-core/hook";
import { Input } from "rizzui/input";
import { useForm } from "react-hook-form";
import { Button } from "rizzui/button";
import { User } from "@raxonltd/raxon-core/interface/prisma.interface";
import { useTranslation } from "react-i18next";
import "@/theme/locale/i18n";
import { useRaxon } from "@raxonltd/raxon-core";

export default function ViewProfilePhoneNumberVerification() {
  const { t } = useTranslation();
  const { isAuthenticated } = useRaxon();
  const { data: profile } = useProfile().fetch({isEnabled: true});
  const { mutate: verifyPhoneNumber } = useProfile().verifyPhoneNumber();

  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [state, setState] = useState<"input" | "verify" | "verified">("input");
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isVerified = profile?.phoneNumberVerification?.isVerified;

  // Hata mesajını temizle
  const clearError = () => setError(null);

  // Telefon numarası değiştirme işlemi başlatıldığında
  const handleStartPhoneChange = () => {
    setIsChangingPhone(true);
    setState("input");
    setPhoneNumber(null);
    clearError();
  };

  // Telefon numarası değiştirme işlemi iptal edildiğinde
  const handleCancelPhoneChange = () => {
    setIsChangingPhone(false);
    setState("input");
    setPhoneNumber(null);
    clearError();
  };

  if (isVerified && !isChangingPhone) {
    return <ViewProfilePhoneNumberVerified profile={profile!} onStartChange={handleStartPhoneChange} />;
  }

  return (
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      {/* Minimal Header */}
      <div className='px-3 py-2 border-b border-gray-100 bg-gray-50'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 bg-amber-50 rounded-full flex items-center justify-center'>
              <Shield className='w-3 h-3 text-amber-600' />
            </div>
            <div>
              <h3 className='text-sm font-bold text-gray-900'>{isChangingPhone ? t('phoneVerification.changePhone') : t('phoneVerification.title')}</h3>
            </div>
          </div>

          {isChangingPhone && (
            <Button variant='outline' onClick={handleCancelPhoneChange} className='text-gray-600 border-gray-300 hover:bg-gray-50 text-xs px-2 py-1' size='sm'>
              {t('phoneVerification.cancel')}
            </Button>
          )}
        </div>
      </div>

      {/* Kompakt Progress */}
      <div className='px-3 py-1 bg-gray-50 border-b border-gray-100'>
        <div className='flex items-center justify-center gap-1'>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
            state === "input" ? "bg-amber-500 text-white" : "bg-green-500 text-white"
          }`}>
            {state === "input" ? "1" : <Check className='w-2 h-2' />}
          </div>
          <div className='w-6 h-px bg-gray-300'></div>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
            state === "verify" ? "bg-amber-500 text-white" : state === "verified" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
          }`}>
            {state === "verify" ? "2" : state === "verified" ? <Check className='w-2 h-2' /> : "2"}
          </div>
          <div className='w-6 h-px bg-gray-300'></div>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
            state === "verified" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
          }`}>
            {state === "verified" ? <Check className='w-2 h-2' /> : "3"}
          </div>
        </div>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className='mx-3 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='w-3 h-3 text-red-600 flex-shrink-0' />
              <p className='text-xs text-red-700'>{error}</p>
            </div>
            <button onClick={clearError} className='text-red-400 hover:text-red-600 flex-shrink-0'>
              <X className='w-3 h-3' />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className='p-3'>
        {state === "input" && (
          <ViewProfilePhoneNumberInput
            profile={profile!}
            isLoading={isLoading}
            onVerify={(phoneNumber) => {
              setIsLoading(true);
              clearError();
              verifyPhoneNumber(
                { phoneNumber },
                {
                  onSuccess: () => {
                    setState("verify");
                    setPhoneNumber(phoneNumber);
                    setIsLoading(false);
                  },
                  onError: (error: any) => {
                    const errorMessage = error?.response?.data?.info?.message || 
                                       error?.response?.data?.message || 
                                       "Kod gönderilemedi. Lütfen tekrar deneyin.";
                    setError(errorMessage);
                    setIsLoading(false);
                  },
                }
              );
            }}
          />
        )}

        {state === "verify" && (
          <ViewProfilePhoneNumberCodeVerify
            profile={profile!}
            phoneNumber={phoneNumber!}
            isLoading={isLoading}
            onVerify={(code) => {
              setIsLoading(true);
              clearError();
              verifyPhoneNumber(
                { phoneNumber: phoneNumber!, code },
                {
                  onSuccess: () => {
                    setState("verified");
                    setIsLoading(false);
                    if (isChangingPhone) {
                      setTimeout(() => {
                        setIsChangingPhone(false);
                      }, 2000);
                    }
                  },
                  onError: (error: any) => {
                    const errorMessage = error?.response?.data?.info?.message || 
                                       error?.response?.data?.message || 
                                       "Geçersiz kod. Lütfen tekrar deneyin.";
                    setError(errorMessage);
                    setIsLoading(false);
                  },
                }
              );
            }}
            onResend={() => {
              setIsLoading(true);
              clearError();
              verifyPhoneNumber(
                { phoneNumber: phoneNumber! },
                {
                  onSuccess: () => {
                    setIsLoading(false);
                  },
                  onError: (error: any) => {
                    const errorMessage = error?.response?.data?.info?.message || 
                                       error?.response?.data?.message || 
                                       "Kod gönderilemedi. Lütfen tekrar deneyin.";
                    setError(errorMessage);
                    setIsLoading(false);
                  },
                }
              );
            }}
          />
        )}

        {state === "verified" && (
          <ViewProfilePhoneNumberSuccess 
            phoneNumber={phoneNumber!}
            isChangingPhone={isChangingPhone}
          />
        )}
      </div>
    </div>
  );
}

function ViewProfilePhoneNumberInput({ profile, isLoading, onVerify }: { profile: User; isLoading: boolean; onVerify: (phoneNumber: string) => void }) {
  const { t } = useTranslation();
  const form = useForm();

  useEffect(() => {
    if (profile?.phoneNumber) {
      form.setValue("phoneNumber", profile.phoneNumberVerification?.data);
    }
  }, [profile, form]);

  return (
    <div className='flex items-center gap-3'>
      {/* İkon */}
      <div className='w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0'>
        <Phone className='w-4 h-4 text-amber-600' />
      </div>

      {/* Form */}
      <div className='flex-1 space-y-2'>
        <div>
          <label className='block text-xs font-medium text-gray-700 mb-1'>{t('phoneVerification.phoneNumber')}</label>
          <div className='flex gap-2'>
            <Input 
              {...form.register("phoneNumber", { required: true })} 
              placeholder='+90 5xx xxx xx xx' 
              className='flex-1' 
              size='sm'
            />
            <Button
              onClick={() => {
                const phoneNumber = form.getValues("phoneNumber");
                if (phoneNumber) {
                  onVerify(phoneNumber);
                }
              }}
              disabled={isLoading}
              isLoading={isLoading}
              className='bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-3'
              size='sm'>
              {isLoading ? t('phoneVerification.sending') : t('phoneVerification.sendCode')}
            </Button>
          </div>
        </div>
        <p className='text-xs text-gray-500'>{t('phoneVerification.smsNote')}</p>
      </div>
    </div>
  );
}

function ViewProfilePhoneNumberCodeVerify({ 
  profile, 
  phoneNumber, 
  isLoading, 
  onVerify, 
  onResend 
}: { 
  profile: User; 
  phoneNumber: string; 
  isLoading: boolean; 
  onVerify: (code: string) => void;
  onResend: () => void;
}) {
  const { t } = useTranslation();
  const form = useForm();
  const [countdown, setCountdown] = useState(60);
  const [isResendLoading, setIsResendLoading] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    setIsResendLoading(true);
    onResend();
    setCountdown(60);
    setTimeout(() => setIsResendLoading(false), 1000);
  };

  return (
    <div className='flex items-center gap-3'>
      {/* İkon */}
      <div className='w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0'>
        <Shield className='w-4 h-4 text-green-600' />
      </div>

      {/* Form */}
      <div className='flex-1 space-y-2'>
        <div>
          <label className='block text-xs font-medium text-gray-700 mb-1'>
            {t('phoneVerification.codeNote', { phoneNumber })}
          </label>
          <div className='flex gap-2'>
            <Input 
              {...form.register("code", { required: true })} 
              placeholder='000000' 
              className='flex-1 text-center tracking-widest' 
              maxLength={6}
              size='sm'
            />
            <Button
              onClick={() => {
                const code = form.getValues("code");
                if (code) {
                  onVerify(code);
                }
              }}
              disabled={isLoading}
              isLoading={isLoading}
              className='bg-green-500 hover:bg-green-600 text-white rounded-lg px-3'
              size='sm'>
              {isLoading ? t('phoneVerification.verifying') : t('phoneVerification.verify')}
            </Button>
          </div>
        </div>
        
        <div className='flex items-center justify-between'>
          <p className='text-xs text-gray-500'>{t('phoneVerification.enterCode')}</p>
          {countdown > 0 ? (
            <p className='text-xs text-gray-500 flex items-center gap-1'>
              <Clock className='w-3 h-3' />
              {countdown}s
            </p>
          ) : (
            <Button 
              variant='outline' 
              size='sm'
              disabled={isResendLoading}
              isLoading={isResendLoading}
              className='text-amber-600 border-amber-200 hover:bg-amber-50 text-xs px-2 py-1' 
              onClick={handleResend}>
              {t('phoneVerification.resend')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ViewProfilePhoneNumberSuccess({ phoneNumber, isChangingPhone }: { phoneNumber: string; isChangingPhone: boolean }) {
  const { t } = useTranslation();
  
  return (
    <div className='flex items-center gap-3'>
      {/* İkon */}
      <div className='w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0'>
        <CheckCircle className='w-4 h-4 text-green-600' />
      </div>
      
      {/* İçerik */}
      <div className='flex-1'>
        <h4 className='text-sm font-bold text-gray-900'>
          {isChangingPhone ? t('phoneVerification.changed') : t('phoneVerification.success')}
        </h4>
        <p className='text-xs text-gray-600'>
          {t('phoneVerification.successDesc', { phoneNumber })}
        </p>
        <div className='mt-2 inline-flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-2 py-1'>
          <CheckCircle className='w-3 h-3 text-green-600' />
          <span className='text-xs font-medium text-green-700'>{t('phoneVerification.accountSecure')}</span>
        </div>
      </div>
    </div>
  );
}

function ViewProfilePhoneNumberVerified({ profile, onStartChange }: { profile: User; onStartChange: () => void }) {
  const { t } = useTranslation();
  
  return (
    <div className='bg-white rounded-xl border border-green-200 shadow-sm p-3'>
      <div className='flex items-center gap-3'>
        <div className='w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0'>
          <CheckCircle className='w-4 h-4 text-green-600' />
        </div>
        
        <div className='flex-1'>
          <h4 className='text-sm font-bold text-gray-900'>{t('phoneVerification.verified')}</h4>
          <div className='flex items-center gap-2 mt-1'>
            <Phone className='w-3 h-3 text-gray-500' />
            <span className='text-xs font-medium text-gray-700'>{profile?.phoneNumber}</span>
            <div className='bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium'>{t('phoneVerification.verified')}</div>
          </div>
        </div>

        <Button 
          variant='outline' 
          onClick={onStartChange} 
          className='text-amber-600 border-amber-200 hover:bg-amber-50 text-xs px-2 py-1'
          size='sm'>
          {t('phoneVerification.change')}
        </Button>
      </div>
    </div>
  );
}

