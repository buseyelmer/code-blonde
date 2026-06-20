'use client';

import { useProfile } from '@raxonltd/raxon-core/hook';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { User as UserIcon, Mail, Phone, Calendar, Edit2, Check, X, Loader2, Heart, MapPin, ShoppingBag, Shield, ShieldCheck, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRaxon } from '@raxonltd/raxon-core';

interface ExtendedProfile {
  phoneNumberVerified?: boolean;
  emailVerified?: boolean;
  [key: string]: any;
}

export default function ProfilPage() {
  const { profile } = useRaxon();
  const { update, verifyPhoneNumber, verifyEmail } = useProfile();
  const updateMutation = update();
  const verifyPhoneMutation = verifyPhoneNumber();
  const verifyEmailMutation = verifyEmail();

  const [isEditing, setIsEditing] = useState(false);
  const [phoneVerification, setPhoneVerification] = useState({
    isOpen: false,
    code: '',
    step: 'send' as 'send' | 'verify'
  });
  const [emailVerification, setEmailVerification] = useState({
    isOpen: false,
    code: '',
    step: 'send' as 'send' | 'verify'
  });

  const form = useForm({
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phoneNumber: profile?.phoneNumber || '',
    }
  });

  const handleSubmit = (data: any) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Profil bilgileriniz güncellendi');
        setIsEditing(false);
      },
      onError: () => {
        toast.error('Güncelleme başarısız');
      }
    });
  };

  // Telefon doğrulama
  const handleSendPhoneCode = () => {
    if (!profile?.phoneNumber) {
      toast.error('Önce telefon numarası ekleyin');
      return;
    }
    verifyPhoneMutation.mutate(
      { phoneNumber: profile.phoneNumber },
      {
        onSuccess: () => {
          toast.success('Doğrulama kodu gönderildi');
          setPhoneVerification(prev => ({ ...prev, step: 'verify' }));
        },
        onError: () => {
          toast.error('Kod gönderilemedi');
        }
      }
    );
  };

  const handleVerifyPhone = () => {
    if (!profile?.phoneNumber || !phoneVerification.code) return;
    verifyPhoneMutation.mutate(
      { phoneNumber: profile.phoneNumber, code: phoneVerification.code },
      {
        onSuccess: () => {
          toast.success('Telefon numarası doğrulandı');
          setPhoneVerification({ isOpen: false, code: '', step: 'send' });
        },
        onError: () => {
          toast.error('Doğrulama başarısız');
        }
      }
    );
  };

  // Email doğrulama
  const handleSendEmailCode = () => {
    if (!profile?.email) {
      toast.error('Email adresi bulunamadı');
      return;
    }
    verifyEmailMutation.mutate(
      { email: profile.email },
      {
        onSuccess: () => {
          toast.success('Doğrulama kodu gönderildi');
          setEmailVerification(prev => ({ ...prev, step: 'verify' }));
        },
        onError: () => {
          toast.error('Kod gönderilemedi');
        }
      }
    );
  };

  const handleVerifyEmail = () => {
    if (!profile?.email || !emailVerification.code) return;
    verifyEmailMutation.mutate(
      { email: profile.email, code: emailVerification.code },
      {
        onSuccess: () => {
          toast.success('Email adresi doğrulandı');
          setEmailVerification({ isOpen: false, code: '', step: 'send' });
        },
        onError: () => {
          toast.error('Doğrulama başarısız');
        }
      }
    );
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const extendedProfile = profile as ExtendedProfile | null;
  const isPhoneVerified = extendedProfile?.phoneNumberVerified;
  const isEmailVerified = extendedProfile?.emailVerified;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 font-serif font-bold">
            Hesabım
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Profil bilgilerinizi görüntüleyin ve düzenleyin
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-900 text-white rounded-lg hover:bg-rose-800 transition-colors text-sm"
          >
            <Edit2 className="w-4 h-4" />
            Düzenle
          </button>
        )}
      </div>

      {/* Profile Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Kişisel Bilgiler</h2>
        </div>

        {isEditing ? (
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                  Ad
                </label>
                <input
                  {...form.register('firstName')}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-rose-900 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                  Soyad
                </label>
                <input
                  {...form.register('lastName')}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-rose-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                Telefon
              </label>
              <input
                {...form.register('phoneNumber')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-rose-900 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-900 text-white rounded-lg hover:bg-rose-800 transition-colors text-sm disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                İptal
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500">Ad Soyad</p>
                  <p className="text-gray-900 font-medium">{profile?.firstName} {profile?.lastName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500">E-posta</p>
                  <p className="text-gray-900 font-medium">{profile?.email}</p>
                </div>
                {isEmailVerified ? (
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <button
                    onClick={() => setEmailVerification(prev => ({ ...prev, isOpen: true }))}
                    className="text-xs text-amber-600 hover:text-amber-700 underline"
                  >
                    Doğrula
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500">Telefon</p>
                  <p className="text-gray-900 font-medium">{profile?.phoneNumber || '-'}</p>
                </div>
                {profile?.phoneNumber && (
                  isPhoneVerified ? (
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <button
                      onClick={() => setPhoneVerification(prev => ({ ...prev, isOpen: true }))}
                      className="text-xs text-amber-600 hover:text-amber-700 underline"
                    >
                      Doğrula
                    </button>
                  )
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500">Üyelik Tarihi</p>
                  <p className="text-gray-900 font-medium">{formatDate(profile?.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verification Status Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Hesap Güvenliği</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isEmailVerified ? 'bg-green-100' : 'bg-amber-100'}`}>
                {isEmailVerified ? <ShieldCheck className="w-5 h-5 text-green-600" /> : <Shield className="w-5 h-5 text-amber-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">E-posta Doğrulama</p>
                <p className="text-xs text-gray-500">
                  {isEmailVerified ? 'Doğrulandı' : 'Doğrulanmamış'}
                </p>
              </div>
              {!isEmailVerified && (
                <button
                  onClick={() => setEmailVerification(prev => ({ ...prev, isOpen: true }))}
                  className="text-xs px-3 py-1.5 bg-rose-900 text-white rounded-lg hover:bg-rose-800"
                >
                  Doğrula
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPhoneVerified ? 'bg-green-100' : 'bg-amber-100'}`}>
                {isPhoneVerified ? <ShieldCheck className="w-5 h-5 text-green-600" /> : <Shield className="w-5 h-5 text-amber-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Telefon Doğrulama</p>
                <p className="text-xs text-gray-500">
                  {isPhoneVerified ? 'Doğrulandı' : profile?.phoneNumber ? 'Doğrulanmamış' : 'Telefon eklenmemiş'}
                </p>
              </div>
              {profile?.phoneNumber && !isPhoneVerified && (
                <button
                  onClick={() => setPhoneVerification(prev => ({ ...prev, isOpen: true }))}
                  className="text-xs px-3 py-1.5 bg-rose-900 text-white rounded-lg hover:bg-rose-800"
                >
                  Doğrula
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLinkCard
          title="Siparişlerim"
          description="Siparişlerinizi takip edin"
          href="/hesabim/siparislerim"
          icon={ShoppingBag}
        />
        <QuickLinkCard
          title="Favorilerim"
          description="Favori ürünlerinizi görün"
          href="/hesabim/favorilerim"
          icon={Heart}
        />
        <QuickLinkCard
          title="Adreslerim"
          description="Teslimat adreslerinizi yönetin"
          href="/hesabim/adreslerim"
          icon={MapPin}
        />
      </div>

      {/* Phone Verification Modal */}
      {phoneVerification.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Telefon Doğrulama</h3>
                <p className="text-sm text-gray-500">{profile?.phoneNumber}</p>
              </div>
            </div>

            {phoneVerification.step === 'send' ? (
              <>
                <p className="text-sm text-gray-600 mb-6">
                  Telefon numaranıza doğrulama kodu göndereceğiz.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setPhoneVerification({ isOpen: false, code: '', step: 'send' })}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSendPhoneCode}
                    disabled={verifyPhoneMutation.isPending}
                    className="px-4 py-2 bg-rose-900 text-white rounded-lg text-sm hover:bg-rose-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    {verifyPhoneMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Kod Gönder
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Telefonunuza gönderilen 6 haneli kodu girin.
                </p>
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                    Doğrulama Kodu
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={phoneVerification.code}
                    onChange={(e) => setPhoneVerification(prev => ({ ...prev, code: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-rose-900 transition-colors text-center text-lg tracking-widest"
                    placeholder="000000"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setPhoneVerification(prev => ({ ...prev, step: 'send' }))}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Geri
                  </button>
                  <button
                    onClick={handleVerifyPhone}
                    disabled={verifyPhoneMutation.isPending || phoneVerification.code.length < 4}
                    className="px-4 py-2 bg-rose-900 text-white rounded-lg text-sm hover:bg-rose-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    {verifyPhoneMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Doğrula
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Email Verification Modal */}
      {emailVerification.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">E-posta Doğrulama</h3>
                <p className="text-sm text-gray-500">{profile?.email}</p>
              </div>
            </div>

            {emailVerification.step === 'send' ? (
              <>
                <p className="text-sm text-gray-600 mb-6">
                  E-posta adresinize doğrulama kodu göndereceğiz.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEmailVerification({ isOpen: false, code: '', step: 'send' })}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSendEmailCode}
                    disabled={verifyEmailMutation.isPending}
                    className="px-4 py-2 bg-rose-900 text-white rounded-lg text-sm hover:bg-rose-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    {verifyEmailMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Kod Gönder
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  E-postanıza gönderilen 6 haneli kodu girin.
                </p>
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                    Doğrulama Kodu
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={emailVerification.code}
                    onChange={(e) => setEmailVerification(prev => ({ ...prev, code: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-rose-900 transition-colors text-center text-lg tracking-widest"
                    placeholder="000000"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEmailVerification(prev => ({ ...prev, step: 'send' }))}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Geri
                  </button>
                  <button
                    onClick={handleVerifyEmail}
                    disabled={verifyEmailMutation.isPending || emailVerification.code.length < 4}
                    className="px-4 py-2 bg-rose-900 text-white rounded-lg text-sm hover:bg-rose-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    {verifyEmailMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Doğrula
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickLinkCard({ title, description, href, icon: Icon }: {
  title: string;
  description: string;
  href: string;
  icon: any;
}) {
  return (
    <a
      href={href}
      className="group block bg-white rounded-xl border border-gray-200 p-6 hover:border-rose-900 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-rose-900 transition-colors">
          <Icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
        </div>
        <span className="text-gray-400 group-hover:text-rose-900 transition-colors">→</span>
      </div>
      <h3 className="mt-4 font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </a>
  );
}
