export const FREE_SHIPPING_THRESHOLD = 500;
export const SHIPPING_FEE = 49.9;
export const VAT_RATE = 0.2;

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
}

export function calculateVat(subtotal: number): number {
  return subtotal * VAT_RATE;
}

export function calculateOrderTotal(subtotal: number, discount = 0): {
  subtotal: number;
  shipping: number;
  vat: number;
  discount: number;
  total: number;
} {
  const shipping = calculateShipping(subtotal);
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const vat = calculateVat(discountedSubtotal);
  const total = discountedSubtotal + shipping + vat;

  return {
    subtotal,
    shipping,
    vat,
    discount,
    total,
  };
}

export const BANK_ACCOUNTS = [
  {
    bankName: "Garanti BBVA",
    accountHolder: "Code Blonde Kozmetik A.Ş.",
    iban: "TR12 0006 2000 1234 0006 7890 12",
  },
  {
    bankName: "İş Bankası",
    accountHolder: "Code Blonde Kozmetik A.Ş.",
    iban: "TR45 0006 4000 0011 2233 4455 66",
  },
];
