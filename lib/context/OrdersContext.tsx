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
import type { CartItem } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";

export type OrderRecord = {
  id: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "card" | "transfer";
  createdAt: string;
  status: "completed" | "pending";
};

type OrdersContextValue = {
  orders: OrderRecord[];
  addOrder: (
    order: Omit<OrderRecord, "id" | "createdAt" | "status">,
  ) => OrderRecord;
  getUserOrders: (email: string) => OrderRecord[];
  isReady: boolean;
};

const ORDERS_STORAGE_KEY = "code-blonde-orders";

const OrdersContext = createContext<OrdersContextValue | null>(null);

function readOrders(): OrderRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as OrderRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: OrderRecord[]) {
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setOrders(readOrders());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    writeOrders(orders);
  }, [orders, isReady]);

  const addOrder = useCallback(
    (order: Omit<OrderRecord, "id" | "createdAt" | "status">) => {
      const record: OrderRecord = {
        ...order,
        id: `ORD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: order.paymentMethod === "transfer" ? "pending" : "completed",
      };

      setOrders((current) => [record, ...current]);
      return record;
    },
    [],
  );

  const getUserOrders = useCallback(
    (email: string) =>
      orders.filter(
        (order) => order.userEmail.toLowerCase() === email.toLowerCase(),
      ),
    [orders],
  );

  const value = useMemo(
    () => ({
      orders,
      addOrder,
      getUserOrders,
      isReady,
    }),
    [orders, addOrder, getUserOrders, isReady],
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders yalnızca OrdersProvider içinde kullanılabilir.");
  }

  return context;
}

export function useUserOrders() {
  const { user } = useAuth();
  const { getUserOrders, isReady } = useOrders();

  return useMemo(
    () => ({
      orders: user ? getUserOrders(user.email) : [],
      isReady,
    }),
    [user, getUserOrders, isReady],
  );
}
