"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRaxon } from "@raxonltd/raxon-core";
import { useCart } from "@raxonltd/raxon-core/hook";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import type { BasketItemSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";
import { resolveCartInsertIds } from "@/core/util/cart.insert";

const CART_QUERY_KEY = ["organization", "cart"];

type CartLineIds = {
  variantId: string | null;
  productUnitId: string | null;
};

async function resolveLineIds(
  product: Product,
  variantId?: string | null,
  productUnitId?: string | null,
): Promise<CartLineIds> {
  if (variantId || productUnitId) {
    return { variantId: variantId ?? null, productUnitId: variantId ? null : (productUnitId ?? null) };
  }
  return resolveCartInsertIds(product);
}

export function useProductCart() {
  const {
    cart,
    addToCart,
    removeItem,
    changeQuantity,
    isAddingToCart,
    isUpdatingCart,
  } = useRaxon();
  const insertMutation = useCart().insert();
  const queryClient = useQueryClient();

  const refreshCart = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    await queryClient.refetchQueries({ queryKey: CART_QUERY_KEY });
  }, [queryClient]);

  const insertLine = useCallback(
    async (
      productId: string,
      quantity: number,
      type: "increment" | "set",
      ids: CartLineIds,
    ) => {
      await insertMutation.mutateAsync({
        productId,
        variantId: ids.variantId ?? undefined,
        productUnitId: !ids.variantId ? (ids.productUnitId ?? undefined) : undefined,
        quantity,
        type,
        deposit: "disable",
      });
      await refreshCart();
    },
    [insertMutation, refreshCart],
  );

  const addProduct = useCallback(
    async (
      product: Product,
      quantity = 1,
      options?: { variantId?: string | null; productUnitId?: string | null; linePay?: number },
    ) => {
      const ids = await resolveLineIds(product, options?.variantId, options?.productUnitId);
      if (!ids.variantId && !ids.productUnitId) return false;

      if (ids.variantId) {
        addToCart(product.id, quantity, ids.variantId, { linePay: options?.linePay });
        return true;
      }

      await insertLine(product.id, quantity, "increment", ids);
      return true;
    },
    [addToCart, insertLine],
  );

  const setProductQuantity = useCallback(
    async (
      product: Product,
      item: BasketItemSummaryInterface,
      quantity: number,
      ids: CartLineIds,
    ) => {
      if (quantity < 1) {
        if (item.id) removeItem(item.id);
        return;
      }

      if (ids.variantId && item.id && !String(item.id).startsWith("optimistic-")) {
        changeQuantity(item.id, quantity - (item.quantity ?? 0), product.id, ids.variantId);
        return;
      }

      await insertLine(product.id, quantity, "set", ids);
    },
    [changeQuantity, insertLine, removeItem],
  );

  return {
    cart,
    addProduct,
    setProductQuantity,
    removeItem,
    isCartBusy: isAddingToCart || isUpdatingCart || insertMutation.isPending,
  };
}
