"use client";

import { CheckoutView } from "@raxonltd/raxon-core/view";
import { useCartPriceEnrichment } from "@/core/hook/use.cart.price.enrichment";

export default function OdemePage() {
  useCartPriceEnrichment();

  return <CheckoutView webReturnUrl="/sepet/odeme" />;
}
