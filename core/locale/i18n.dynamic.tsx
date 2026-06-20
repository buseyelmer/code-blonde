interface TranslationCache {
  version: string;
  timestamp: number;
  data: {
    en: any;
    tr: any;
    de: any;
  };
}

export class TranslationManager {
  private static instance: TranslationManager;
  private isLoading = false;
  private loadPromise: Promise<TranslationCache | null> | null = null;
  private cache: TranslationCache | null = null;

  static getInstance(): TranslationManager {
    if (!TranslationManager.instance) {
      TranslationManager.instance = new TranslationManager();
    }
    return TranslationManager.instance;
  }

  // Çeviri yükleme durumunu kontrol et
  isTranslationsLoaded(): boolean {
    return !!this.cache;
  }

  // Local API'den çevirileri çek
  private async fetchTranslations(): Promise<TranslationCache | null> {
    try {
      const response = await fetch('/api/translations');
      const result = await response.json();
      
      if (!result.success || !result.data) {
        console.error('Çeviri verisi alınamadı');
        return null;
      }

      this.cache = result.data;
      return result.data;
    } catch (error) {
      console.error('Çeviri yükleme hatası:', error);
      return null;
    }
  }

  // Ana yükleme fonksiyonu
  async loadTranslations(): Promise<TranslationCache | null> {
    // SSR kontrolü
    if (typeof window === 'undefined') {
      return null;
    }

    // Eğer cache varsa döndür
    if (this.cache) {
      return this.cache;
    }

    // Eğer zaten yükleme yapılıyorsa, mevcut promise'i döndür
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    
    this.loadPromise = (async () => {
      try {
        // API'den çek
        return await this.fetchTranslations();
      } finally {
        this.isLoading = false;
      }
    })();

    return this.loadPromise;
  }

  // Manuel güncelleme fonksiyonu (cache'i siler)
  async forceUpdate(): Promise<TranslationCache | null> {
    try {
      // Cache'i temizle
      await fetch('/api/translations', { method: 'DELETE' });
      this.cache = null;
      
      // Yeni veriyi çek
      return this.fetchTranslations();
    } catch (error) {
      console.error('Cache temizleme hatası:', error);
      return this.fetchTranslations();
    }
  }
}

export const translationManager = TranslationManager.getInstance();
