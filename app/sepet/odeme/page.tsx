"use client";

import { CheckoutView } from "@raxonltd/raxon-core/view";
import { useCartPriceEnrichment } from "@/core/hook/use.cart.price.enrichment";

function OdemeCheckout() {
  useCartPriceEnrichment();

  return <CheckoutView webReturnUrl="/sepet/odeme" />;
}

export default function OdemePage() {
  return (
    <div className="checkout-page checkout-page--standalone">
      <div className="checkout-page__raxon">
        <OdemeCheckout />
      </div>
    </div>
  );
}
