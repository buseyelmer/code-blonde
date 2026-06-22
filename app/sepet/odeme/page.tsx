"use client";

import Link from "next/link";
import CheckoutFlow from "@/core/component/checkout/checkout.flow";
import CheckoutOrderSummary from "@/core/component/checkout.order.summary";

export default function OdemePage() {
  return (
    <div className="checkout-page pb-8 sm:pb-10">
      <div className="checkout-page__top">
        <Link
          href="/sepet"
          className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5C4638] transition hover:text-[#3F2F25]"
        >
          Sepete dön
        </Link>
      </div>

      <div className="checkout-page__layout">
        <CheckoutFlow />
        <CheckoutOrderSummary className="checkout-page__summary" />
      </div>
    </div>
  );
}
