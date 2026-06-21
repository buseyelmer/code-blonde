import type { BasketSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";
import {
  PromoCodePlatform,
  PromoCodeType,
  Status,
  type PromoCode,
} from "@raxonltd/raxon-core/interface/prisma.interface";
import type { QueryClient } from "@tanstack/react-query";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import { enrichCartPricing } from "@/core/util/cart.pricing";

export const LOCAL_PROMO_DISCOUNTS: Record<string, number> = {
  CODE: 20,
};

const CART_QUERY_KEY = ["organization", "cart"] as const;

export function getLocalPromoDiscount(code: string): number | null {
  const normalized = code.trim().toUpperCase();
  return LOCAL_PROMO_DISCOUNTS[normalized] ?? null;
}

export function isLocalPromoId(id?: string | null): boolean {
  return Boolean(id?.startsWith("local-"));
}

export function buildLocalPromoCode(code: string): PromoCode {
  const normalized = code.trim().toUpperCase();
  const discount = LOCAL_PROMO_DISCOUNTS[normalized] ?? 0;
  const now = new Date().toISOString();

  return {
    id: `local-${normalized}`,
    code: normalized,
    usageLimit: 0,
    basketLimit: 0,
    singleUse: false,
    platform: PromoCodePlatform.WEB,
    discount,
    type: PromoCodeType.AMOUNT,
    status: Status.PUBLISHED,
    startDate: null,
    isRandom: false,
    endDate: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    branchId: null,
    isPublic: true,
    triggerId: null,
    tags: [],
  };
}

export function applyLocalPromoToCart(
  queryClient: QueryClient,
  cart: BasketSummaryInterface,
  promoCode: PromoCode,
  products?: Product[],
) {
  const withPromo: BasketSummaryInterface = {
    ...cart,
    promoCode: {
      id: promoCode.id,
      code: promoCode.code,
      discount: promoCode.discount ?? 0,
      type: promoCode.type,
      status: promoCode.status,
    },
  };

  const enriched = enrichCartPricing(withPromo, products, promoCode);
  queryClient.setQueryData(CART_QUERY_KEY, enriched);
  return enriched;
}

export function clearLocalPromoFromCart(
  queryClient: QueryClient,
  cart: BasketSummaryInterface,
  products?: Product[],
) {
  const cleared: BasketSummaryInterface = {
    ...cart,
    promoCode: undefined,
  };
  const enriched = enrichCartPricing(cleared, products);
  queryClient.setQueryData(CART_QUERY_KEY, enriched);
  return enriched;
}
