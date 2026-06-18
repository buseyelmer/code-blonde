"use client";

import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { CartIcon } from "./icons";

export function HeaderCartLink() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/sepet"
      className="relative rounded-full p-2.5 text-charcoal transition-colors hover:bg-stone/30"
      aria-label={`Sepet${totalItems > 0 ? `, ${totalItems} ürün` : ""}`}
    >
      <CartIcon />
      {totalItems > 0 && (
        <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-purple px-1 text-[0.65rem] font-semibold text-white">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
