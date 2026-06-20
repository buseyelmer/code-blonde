"use client";

import type { MouseEvent } from "react";
import { useCart } from "@/lib/context/CartContext";
import type { Product } from "@/lib/data";
import { MinusIcon, PlusIcon } from "@/theme/item/item.icons";

type ItemCartQuantitySelectorProps = {
  product: Product;
  variant?: "compact" | "detail";
  className?: string;
};

const addButtonClass =
  "border-2 border-primary bg-white text-primary transition-colors hover:bg-primary hover:text-white";
const activeControlClass =
  "border-2 border-primary bg-primary text-white";

export function ItemCartQuantitySelector({
  product,
  variant = "compact",
  className = "",
}: ItemCartQuantitySelectorProps) {
  const { addItem, incrementItem, decrementItem, getQuantity } = useCart();
  const quantity = getQuantity(product.id);

  const stopPropagation = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  if (variant === "detail") {
    if (quantity === 0) {
      return (
        <button
          type="button"
          onClick={() => addItem(product)}
          className={`btn-primary inline-flex items-center gap-2 px-8 py-3.5 ${className}`}
        >
          <PlusIcon className="h-4 w-4" />
          Sepete Ekle
        </button>
      );
    }

    return (
      <div
        className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${activeControlClass} ${className}`}
        onClick={stopPropagation}
      >
        <button
          type="button"
          onClick={() => decrementItem(product.id)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/15"
          aria-label="Adedi azalt"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="min-w-8 text-center text-lg font-semibold tabular-nums">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => incrementItem(product.id)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/15"
          aria-label="Adedi artır"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={(event) => {
          stopPropagation(event);
          addItem(product);
        }}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${addButtonClass} ${className}`}
        aria-label={`${product.name} sepete ekle`}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-lg p-1 ${activeControlClass} ${className}`}
      onClick={stopPropagation}
    >
      <button
        type="button"
        onClick={() => decrementItem(product.id)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/15"
        aria-label={`${product.name} adedini azalt`}
      >
        <MinusIcon className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => incrementItem(product.id)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/15"
        aria-label={`${product.name} adedini artır`}
      >
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
