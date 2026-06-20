import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translationManager } from "./i18n.dynamic";

// Boş çevirilerle başlat (sadece yapılandırma)
i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {}
            },
            tr: {
                translation: {}
            },
            de: {
                translation: {}
            },
        },
        lng: "tr",
        fallbackLng: "tr",
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false // SSR uyumluluğu için
        }
    });

// Client-side'da dinamik çevirileri yükle
export const initializeDynamicTranslations = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    
    try {
        // localStorage'dan dil tercihini al
        const savedLanguage = localStorage.getItem('language') || 'tr';
        
        // Dinamik çevirileri yükle
        const translations = await translationManager.loadTranslations();
        
        if (!translations?.data) {
            // Çeviri yüklenemezse false dön
            console.error('Çeviriler yüklenemedi');
            return false;
        }

        // Her dil için çevirileri güncelle
        Object.keys(translations.data).forEach((lng) => {
            i18n.addResourceBundle(lng, 'translation', translations.data[lng as keyof typeof translations.data], true, true);
        });
        
        // Kayıtlı dili uygula
        await i18n.changeLanguage(savedLanguage);
        
        return true;
    } catch (error) {
        console.error('Dinamik çeviri yükleme hatası:', error);
        return false;
    }
};

// Çevirilerin yüklenip yüklenmediğini kontrol et
export const isTranslationsLoaded = (): boolean => {
    return translationManager.isTranslationsLoaded();
};

// Çevirileri manuel olarak güncelleme fonksiyonu
export const updateTranslations = async () => {
    try {
        const translations = await translationManager.forceUpdate();
        
        if (translations?.data) {
            Object.keys(translations.data).forEach((lng) => {
                i18n.addResourceBundle(lng, 'translation', translations.data[lng as keyof typeof translations.data], true, true);
            });
        }
        
        return true;
    } catch (error) {
        console.error('Çeviri güncelleme hatası:', error);
        return false;
    }
};

export default i18n;