export const DEFAULT_PRODUCT_SHIPPING_INFO = {
  deliveryTime: "1-3 iş günü içinde kargoya verilir",
  freeShippingThreshold: 500,
  returnPolicy:
    "Kozmetik ürünleri hijyen nedeniyle açıldıktan sonra iade edilemez. Ambalajı açılmamış ürünlerde 14 gün içinde iade hakkınız vardır.",
} as const;

export type ProductShippingInfo = {
  deliveryTime: string;
  freeShippingThreshold: number;
  returnPolicy: string;
};
