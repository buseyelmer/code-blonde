"use client";

import { useMemo } from "react";
import { useRaxon } from "@raxonltd/raxon-core";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import type { BasketItemSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";
import { buildProductMap } from "@/core/util/basket.enrichment";
import { enrichCartPricing, resolveItemLinePay } from "@/core/util/cart.pricing";

export function useCartPricing() {
  const { cart, promoCode } = useRaxon();

  const { data: productList } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    page: 1,
    amount: 200,
    enabled: (cart?.items?.length ?? 0) > 0,
  });

  const productMap = useMemo(() => buildProductMap(productList?.data), [productList?.data]);

  const pricing = useMemo(() => {
    if (!cart) {
      return {
        subtotal: 0,
        discount: 0,
        delivery: 0,
        total: 0,
        getItemLinePay: (_item: BasketItemSummaryInterface) => 0,
      };
    }

    const enriched = enrichCartPricing(cart, productList?.data, promoCode);

    return {
      subtotal: enriched.info?.basePrice?.pay ?? 0,
      discount: enriched.info?.discount?.pay ?? 0,
      delivery: enriched.info?.delivery?.pay ?? 0,
      total: enriched.info?.payPrice?.pay ?? 0,
      getItemLinePay: (item: BasketItemSummaryInterface) => resolveItemLinePay(item, productMap),
    };
  }, [cart, productList?.data, productMap, promoCode]);

  return pricing;
}
