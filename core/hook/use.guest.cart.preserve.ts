"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { nexineAxios, useRaxon } from "@raxonltd/raxon-core";
import { LOGIN_SUCCESS_EVENT } from "@raxonltd/raxon-core/hook";
import {
  clearGuestCartRestorePending,
  clearGuestCartSnapshot,
  isGuestCartRestorePending,
  loadGuestCartSnapshot,
  markGuestCartRestorePending,
  saveGuestCartSnapshot,
} from "@/core/util/guest.cart.preserve";

const CART_QUERY_KEY = ["organization", "cart"] as const;

/**
 * Keeps the guest basket across login/register by snapshotting items
 * and re-inserting them into the authenticated basket after auth.
 * Restores silently (no per-item or summary toasts).
 */
export function useGuestCartPreserve() {
  const queryClient = useQueryClient();
  const { cart, isAuthenticated, isGuest } = useRaxon();
  const restoringRef = useRef(false);

  // Continuously snapshot while browsing as guest.
  useEffect(() => {
    const isGuestSession = isGuest || !isAuthenticated;
    if (!isGuestSession) return;
    if (!cart?.items?.length) return;
    saveGuestCartSnapshot(cart.items);
  }, [cart?.items, isAuthenticated, isGuest]);

  // Right before token swap / reload, freeze the latest guest cart.
  useEffect(() => {
    const onLoginSuccess = () => {
      if (cart?.items?.length) {
        saveGuestCartSnapshot(cart.items);
      } else {
        const existing = loadGuestCartSnapshot();
        if (existing.length === 0) return;
      }
      markGuestCartRestorePending();
    };

    window.addEventListener(LOGIN_SUCCESS_EVENT, onLoginSuccess, true);
    return () => window.removeEventListener(LOGIN_SUCCESS_EVENT, onLoginSuccess, true);
  }, [cart?.items]);

  // After auth (and checkout reload), merge guest lines into the account cart.
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isGuestCartRestorePending()) return;
    if (restoringRef.current) return;

    const snapshot = loadGuestCartSnapshot();
    if (snapshot.length === 0) {
      clearGuestCartRestorePending();
      return;
    }

    restoringRef.current = true;
    clearGuestCartRestorePending();

    void (async () => {
      try {
        for (const item of snapshot) {
          await nexineAxios.post(
            "/customer/basket/me/item",
            {
              productId: item.productId,
              variantId: item.variantId,
              productUnitId: item.variantId ? undefined : item.productUnitId,
              quantity: item.quantity,
              type: "increment",
              deposit: "disable",
            },
            { headers: { "x-raxon-silent": "1" } },
          );
        }

        clearGuestCartSnapshot();
        await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      } catch {
        markGuestCartRestorePending();
      } finally {
        restoringRef.current = false;
      }
    })();
  }, [isAuthenticated, queryClient]);
}
