export const PROMO_CODE = "CODE";
export const PROMO_DISCOUNT_AMOUNT = 20;

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

export function getPromoDiscount(code: string | null | undefined): number {
  if (!code) return 0;
  return normalizePromoCode(code) === PROMO_CODE ? PROMO_DISCOUNT_AMOUNT : 0;
}

export function validatePromoCode(code: string): {
  ok: boolean;
  message: string;
  normalizedCode: string | null;
} {
  const normalized = normalizePromoCode(code);

  if (!normalized) {
    return { ok: false, message: "Lütfen bir indirim kodu girin.", normalizedCode: null };
  }

  if (normalized === PROMO_CODE) {
    return {
      ok: true,
      message: "CODE kodu uygulandı",
      normalizedCode: PROMO_CODE,
    };
  }

  return { ok: false, message: "Geçersiz indirim kodu", normalizedCode: null };
}
