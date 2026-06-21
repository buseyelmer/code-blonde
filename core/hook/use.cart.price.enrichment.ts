"use client";

import { useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRaxon } from "@raxonltd/raxon-core";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import type { BasketSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";
import { cartNeedsPriceEnrichment, enrichCartPricing } from "@/core/util/cart.pricing";
import { isLocalPromoId } from "@/core/util/cart.promo.local";

const CART_QUERY_KEY = ["organization", "cart"] as const;

export function useCartPriceEnrichment() {
  const queryClient = useQueryClient();
  const { cart, promoCode } = useRaxon();
  const lastPatchRef = useRef<string>("");

  const { data: productList } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    page: 1,
    amount: 200,
    enabled: (cart?.items?.length ?? 0) > 0,
  });

  const products = productList?.data;
  const needsEnrichment = useMemo(() => cartNeedsPriceEnrichment(cart), [cart]);
  const needsLocalPromo = Boolean(promoCode && isLocalPromoId(promoCode.id));

  useEffect(() => {
    if (!cart?.items?.length || !products?.length) return;
    if (!needsEnrichment && !needsLocalPromo) return;

    const signature = `${cart.id}:${cart.items.length}:${products.length}:${promoCode?.id ?? ""}`;
    if (lastPatchRef.current === signature) return;

    const enriched = enrichCartPricing(cart, products, promoCode);
    queryClient.setQueryData<BasketSummaryInterface>(CART_QUERY_KEY, enriched);
    lastPatchRef.current = signature;
  }, [cart, needsEnrichment, needsLocalPromo, products, promoCode, queryClient]);
}
