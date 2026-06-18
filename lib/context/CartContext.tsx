"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/data";
import {
  getPromoDiscount,
  PROMO_CODE,
  validatePromoCode,
} from "@/lib/promo-utils";

export type CartItem = Product & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  getQuantity: (productId: string) => number;
  totalItems: number;
  totalPrice: number;
  promoCode: string | null;
  promoDiscount: number;
  applyPromoCode: (code: string) => { ok: boolean; message: string };
  clearPromoCode: () => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "code-blonde-cart";
const PROMO_STORAGE_KEY = "code-blonde-promo";

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

function readStoredPromo(): string | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(PROMO_STORAGE_KEY);
  if (!stored) return null;

  return getPromoDiscount(stored) > 0 ? PROMO_CODE : null;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setPromoCode(readStoredPromo());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isReady]);

  useEffect(() => {
    if (!isReady) return;

    if (promoCode) {
      window.localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
      return;
    }

    window.localStorage.removeItem(PROMO_STORAGE_KEY);
  }, [promoCode, isReady]);

  const addItem = useCallback((product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }, []);

  const incrementItem = useCallback((productId: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }, []);

  const decrementItem = useCallback((productId: string) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  }, []);

  const getQuantity = useCallback(
    (productId: string) =>
      items.find((item) => item.id === productId)?.quantity ?? 0,
    [items],
  );

  const applyPromoCode = useCallback((code: string) => {
    const result = validatePromoCode(code);

    if (result.ok && result.normalizedCode) {
      setPromoCode(result.normalizedCode);
    } else {
      setPromoCode(null);
    }

    return { ok: result.ok, message: result.message };
  }, []);

  const clearPromoCode = useCallback(() => {
    setPromoCode(null);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode(null);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [items],
  );

  const promoDiscount = useMemo(
    () => getPromoDiscount(promoCode),
    [promoCode],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      getQuantity,
      totalItems,
      totalPrice,
      promoCode,
      promoDiscount,
      applyPromoCode,
      clearPromoCode,
      clearCart,
    }),
    [
      items,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      getQuantity,
      totalItems,
      totalPrice,
      promoCode,
      promoDiscount,
      applyPromoCode,
      clearPromoCode,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart yalnızca CartProvider içinde kullanılabilir.");
  }

  return context;
}
