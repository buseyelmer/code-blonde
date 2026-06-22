"use client";

import { useCallback } from "react";
import { useRaxon } from "@raxonltd/raxon-core";
import { useCart } from "@raxonltd/raxon-core/hook";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import type { BasketItemSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";
import { resolveCartInsertIdsSync } from "@/core/util/cart.insert";

type CartLineIds = {
  variantId: string | null;
  productUnitId: string | null;
  productOnly?: boolean;
};

function resolveLineIds(
  product: Product,
  variantId?: string | null,
  productUnitId?: string | null,
): CartLineIds {
  if (variantId) {
    return { variantId, productUnitId: null };
  }
  if (productUnitId) {
    return { variantId: null, productUnitId };
  }
  return resolveCartInsertIdsSync(product, { allowProductOnly: true });
}

export function useProductCart() {
  const {
    cart,
    addToCart,
    removeItem,
    updateQuantity,
    isAddingToCart,
    isUpdatingCart,
  } = useRaxon();
  const insertMutation = useCart().insert();

  const addProduct = useCallback(
    (
      product: Product,
      quantity = 1,
      options?: { variantId?: string | null; productUnitId?: string | null; linePay?: number },
    ) => {
      try {
        const ids = resolveLineIds(product, options?.variantId, options?.productUnitId);
        const linePay = options?.linePay;

        if (ids.variantId || ids.productOnly) {
          addToCart(product.id, quantity, ids.variantId ?? undefined, { linePay });
          return true;
        }

        if (ids.productUnitId) {
          insertMutation.mutate({
            productId: product.id,
            productUnitId: ids.productUnitId,
            quantity,
            type: quantity > 1 ? "set" : "increment",
            deposit: "disable",
          });
          return true;
        }

        addToCart(product.id, quantity, undefined, { linePay });
        return true;
      } catch {
        return false;
      }
    },
    [addToCart, insertMutation],
  );

  const setProductQuantity = useCallback(
    (
      product: Product,
      item: BasketItemSummaryInterface,
      quantity: number,
      ids: CartLineIds,
    ) => {
      if (quantity < 1) {
        if (item.id) removeItem(item.id);
        return;
      }

      updateQuantity(String(item.id), quantity, String(product.id));
    },
    [removeItem, updateQuantity],
  );

  return {
    cart,
    addProduct,
    setProductQuantity,
    removeItem,
    isCartBusy: isAddingToCart || isUpdatingCart,
  };
}
