"use client";

import { useState } from "react";
import type { Product, Shade } from "@/core/constant/home.constant";

export function useCart() {
  const [addedItems, setAddedItems] = useState<{ product: Product; shade: Shade }[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const addToCart = (product: Product, shade: Shade, quantity = 1) => {
    const entries = Array.from({ length: quantity }, () => ({ product, shade }));
    setAddedItems((prev) => [...prev, ...entries]);
    setCartCount((prev) => prev + quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const removeFromCart = (index: number) => {
    setAddedItems((prev) => prev.filter((_, i) => i !== index));
    setCartCount((prev) => Math.max(0, prev - 1));
  };

  const totalPrice = addedItems.reduce((sum, item) => sum + item.product.price, 0);

  return {
    addedItems,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    isAdded,
    addToCart,
    removeFromCart,
    totalPrice,
  };
}
