import { Dictionary, WeightType } from "@raxonltd/raxon-core/interface/prisma.interface";


String.prototype.toTry = function () {
  return Number(this).toTry();
};
String.prototype.storageUrl = function () {
  return `${process.env.NEXT_PUBLIC_STORAGE_URL}/${this}`;
};
String.prototype.letterInitial = function () {
  return this.substring(0, 2).toUpperCase();
};

String.prototype.weightTypeToText = function (): string {
  if (this == WeightType.GR) return "gr";
  if (this == WeightType.ML) return "ml";
  if (this == WeightType.PIECE) return "adet";
  return "---";
};

Number.prototype.toTry = function () {
  return this.toLocaleString('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

Date.prototype.ddMMyyyy = function () {
  return this.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
String.prototype.ddMMyyyy = function () {
  return new Date(this.toString()).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};


Array.prototype.getName = function (this: Array<Dictionary>): string {

  var selectedLanguage = 'TR';

  if (this.length > 0) {
    var findGerman = this.find(item => item.language === 'DE');
    var findTurkish = this.find(item => item.language === 'TR');
    var findEnglish = this.find(item => item.language === 'EN');

    var findSelectedLanguage = this.find(item => item.language.toLowerCase() === selectedLanguage.toLowerCase());

    if (findSelectedLanguage) {
      return findSelectedLanguage.value ?? findSelectedLanguage.name;
    }
    
    if (findGerman) {
      return findGerman.value ?? findGerman.name;
    }
    if (findTurkish) {
      return findTurkish.value ?? findTurkish.name;
    }
    if (findEnglish) {
      return findEnglish.value ?? findEnglish.name;
    }
    return this[0].value ?? this[0].value;
  }
  return '----';
}

Array.prototype.getSlug = function (this: Array<Dictionary>): string {

  var selectedLanguage = 'TR';


  if (this.length > 0) {
    var findGerman = this.find(item => item.language === 'DE');
    var findTurkish = this.find(item => item.language === 'TR');
    var findEnglish = this.find(item => item.language === 'EN');

    var dt = {
      "de": findGerman,
      "tr": findTurkish,
      "en": findEnglish
    }


    var find = dt[selectedLanguage as keyof typeof dt];

    if (find) {
      return find.slug ?? find.value;
    }

    if (findGerman) {
      return findGerman.slug ?? findGerman.value;
    }
    if (findTurkish) {
      return findTurkish.slug ?? findTurkish.value;
    }
    if (findEnglish) {
      return findEnglish.slug ?? findEnglish.value;
    }
    return this[0].slug ?? this[0].value;
  }
  return '----';
}

// Global Event Emitter sistemi
class GlobalEventEmitter {
  private events: { [key: string]: Function[] } = {};

  // Event dinleyici ekle
  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // Event dinleyici kaldır
  off(event: string, callback: Function) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  // Event tetikle
  emit(event: string, data?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }

  // Tüm dinleyicileri temizle
  clear(event?: string) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

// Global emitter instance
export const globalEmitter = new GlobalEventEmitter();

// Event türleri
export const GLOBAL_EVENTS = {
  SHOW_LOGIN_MODAL: 'show_login_modal',
  HIDE_LOGIN_MODAL: 'hide_login_modal',
  UNAUTHORIZED_ERROR: 'unauthorized_error',
  TOKEN_EXPIRED: 'token_expired',
} as const;


export const cn = (...inputs: any[]) => {
  return inputs.filter(Boolean).join(" ");
};
