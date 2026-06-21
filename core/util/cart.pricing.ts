import type { BasketItemSummaryInterface, BasketSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import {
  buildProductMap,
  getBasketItemLinePay,
} from "@/core/util/basket.enrichment";
import { getLocalPromoDiscount, isLocalPromoId } from "@/core/util/cart.promo.local";
import type { PromoCode } from "@raxonltd/raxon-core/interface/prisma.interface";

export function resolveItemLinePay(
  item: BasketItemSummaryInterface,
  productMap: Map<string, Product>,
): number {
  return getBasketItemLinePay(item, productMap.get(item.productId)) ?? item.linePay ?? 0;
}

export function resolvePromoDiscountPay(
  cart: BasketSummaryInterface,
  promoCode?: PromoCode | null,
): number {
  const apiDiscount = cart.info?.discount?.pay ?? 0;
  if (apiDiscount > 0) return apiDiscount;

  const code = cart.promoCode?.code ?? promoCode?.code;
  const promoId = cart.promoCode?.id ?? promoCode?.id;
  if (code && isLocalPromoId(promoId)) {
    return getLocalPromoDiscount(code) ?? 0;
  }

  return 0;
}

export function enrichCartPricing(
  cart: BasketSummaryInterface,
  products: Product[] | undefined,
  promoCode?: PromoCode | null,
): BasketSummaryInterface {
  const productMap = buildProductMap(products);
  const items = (cart.items ?? []).map((item) => {
    const linePay = resolveItemLinePay(item, productMap);
    if (linePay <= 0 || linePay === item.linePay) return item;
    return { ...item, linePay };
  });

  const computedSubtotal = items.reduce((sum, item) => sum + resolveItemLinePay(item, productMap), 0);
  const apiSubtotal = cart.info?.basePrice?.pay ?? cart.info?.basePrice?.total ?? 0;
  const subtotal = apiSubtotal > 0 ? apiSubtotal : computedSubtotal;

  const discountPay = resolvePromoDiscountPay(cart, promoCode);
  const deliveryPay = cart.info?.delivery?.pay ?? 0;
  const apiTotal = cart.info?.payPrice?.pay ?? 0;
  const computedTotal = Math.max(0, subtotal - discountPay + deliveryPay);
  const total =
    discountPay > 0 && (apiTotal <= 0 || apiTotal >= subtotal - 0.01)
      ? computedTotal
      : apiTotal > 0
        ? apiTotal
        : computedTotal;

  const activePromo = cart.promoCode ?? (promoCode && isLocalPromoId(promoCode.id) ? {
    id: promoCode.id,
    code: promoCode.code,
    discount: discountPay,
    type: promoCode.type,
    status: promoCode.status,
  } : undefined);

  return {
    ...cart,
    promoCode: activePromo ?? cart.promoCode,
    items,
    info: {
      ...cart.info,
      count: cart.info?.count ?? { VKE: 0, Basis: 0, Gesamt: 0, Artikel: items.length },
      basePrice: {
        total: subtotal,
        tax: cart.info?.basePrice?.tax ?? 0,
        pay: subtotal,
      },
      discount: {
        ...cart.info?.discount,
        total: discountPay,
        tax: cart.info?.discount?.tax ?? 0,
        pay: discountPay,
      },
      delivery: {
        ...cart.info?.delivery,
        remainingAmount: cart.info?.delivery?.remainingAmount ?? 0,
        total: deliveryPay,
        tax: cart.info?.delivery?.tax ?? 0,
        pay: deliveryPay,
      },
      payPrice: {
        total,
        tax: cart.info?.payPrice?.tax ?? 0,
        pay: total,
      },
    },
  };
}

export function cartNeedsPriceEnrichment(cart: BasketSummaryInterface | null | undefined): boolean {
  if (!cart?.items?.length) return false;

  const zeroLineItems = cart.items.some((item) => !item.linePay || item.linePay <= 0);
  const zeroTotals = (cart.info?.basePrice?.pay ?? cart.info?.basePrice?.total ?? 0) <= 0;
  return zeroLineItems || zeroTotals;
}
