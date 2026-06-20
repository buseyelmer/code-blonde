"use client";

import { Clock, Store, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/theme/locale/i18n";

export function ViewStoreOffline() {
  const { t } = useTranslation();

  return (
    <div className=' flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md w-full text-center'>
        {/* İkon */}
        <div className='w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6'>
          <Store className='w-8 h-8 text-amber-600' />
        </div>

        {/* Başlık */}
        <h1 className='text-2xl font-bold text-slate-900 mb-3'>{t('storeOffline.title')}</h1>

        {/* Açıklama */}
        <p className='text-slate-600 mb-6 leading-relaxed'>{t('storeOffline.description')}</p>

        {/* Bilgilendirme */}
        <div className='bg-amber-50 rounded-xl p-4 mb-6'>
          <div className='flex items-center justify-center space-x-2 mb-2'>
            <Bell className='w-4 h-4 text-amber-600' />
            <span className='text-sm font-semibold text-amber-800'>{t('storeOffline.notification')}</span>
          </div>
          <p className='text-sm text-amber-700'>{t('storeOffline.autoOpen')}</p>
        </div>

        {/* Geri Dönüş Butonu */}
        <button
          onClick={() => (window.location.href = "/")}
          className='w-full py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 transform hover:-translate-y-0.5'>
          {t('storeOffline.goHome')}
        </button>
      </div>
    </div>
  );
}
