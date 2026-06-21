"use client";

import { CheckoutView } from "@raxonltd/raxon-core/view";
import CheckoutOrderSummary from "@/core/component/checkout.order.summary";
import { useCartPriceEnrichment } from "@/core/hook/use.cart.price.enrichment";

function CheckoutShell() {
  useCartPriceEnrichment();

  return (
    <>
      <div className="checkout-page__main">
        <CheckoutView webReturnUrl="/sepet/odeme" />
      </div>
      <CheckoutOrderSummary className="checkout-page__summary" />
    </>
  );
}

export default function OdemePage() {
  return (
    <div className="checkout-page pb-8 sm:pb-10">
      <div className="checkout-page__layout">
        <CheckoutShell />
      </div>
    </div>
  );
}
