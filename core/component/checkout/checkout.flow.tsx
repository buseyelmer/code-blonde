"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useRaxon } from "@raxonltd/raxon-core";
import { LOGIN_SUCCESS_EVENT } from "@raxonltd/raxon-core/dist/core/feature/auth/hook/use.auth";
import { parseCheckoutPayRoute } from "@raxonltd/raxon-core/dist/core/feature/payment-method/payment.flow";
import { CheckoutViewContext } from "@raxonltd/raxon-core/dist/core/view/checkout/context";
import { CheckoutPayView } from "@raxonltd/raxon-core/dist/core/view/checkout/pay-view";
import { CheckoutResultView } from "@raxonltd/raxon-core/dist/core/view/checkout/result-view";
import { ViewStep2 } from "@raxonltd/raxon-core/dist/core/view/checkout/step-address";
import { ViewStepCheckout } from "@raxonltd/raxon-core/dist/core/view/checkout/step-payment";
import CheckoutContactStep from "@/core/component/checkout/checkout.contact.step";
import CheckoutStepper, { type CheckoutStep } from "@/core/component/checkout/checkout.stepper";
import { useCartPriceEnrichment } from "@/core/hook/use.cart.price.enrichment";

const WEB_RETURN_URL = "/sepet/odeme";

function CheckoutFlowFallback() {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#D9C5B0]/40 bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-[#A17E65]" aria-label="Yükleniyor" />
    </div>
  );
}

function CheckoutFlowInner() {
  useCartPriceEnrichment();

  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const { isPayRoute } = parseCheckoutPayRoute(searchParams);
  const isPaymentResult = statusParam === "success" || statusParam === "fail" || statusParam === "error";

  if (isPaymentResult) {
    return (
      <CheckoutViewContext.Provider value={{ webReturnUrl: WEB_RETURN_URL }}>
        <div className="checkout-form-card overflow-hidden rounded-2xl border border-[#D9C5B0]/40 bg-white shadow-sm">
          <CheckoutResultView />
        </div>
      </CheckoutViewContext.Provider>
    );
  }

  if (isPayRoute) {
    return (
      <CheckoutViewContext.Provider value={{ webReturnUrl: WEB_RETURN_URL }}>
        <div className="checkout-form-card overflow-hidden rounded-2xl border border-[#D9C5B0]/40 bg-white shadow-sm">
          <CheckoutPayView />
        </div>
      </CheckoutViewContext.Provider>
    );
  }

  return <CheckoutMainFlow />;
}

function CheckoutMainFlow() {
  const { cart } = useRaxon();
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("contact");
  const [confirmedContactEmail, setConfirmedContactEmail] = useState("");

  useEffect(() => {
    const fromCart = cart?.email?.trim() || "";
    if (fromCart) setConfirmedContactEmail(fromCart);
  }, [cart?.email]);

  useEffect(() => {
    const hasContactEmail = Boolean(cart?.email?.trim() || confirmedContactEmail);
    if (!hasContactEmail && checkoutStep !== "contact") {
      setCheckoutStep("contact");
    }
  }, [cart?.email, confirmedContactEmail, checkoutStep]);

  useEffect(() => {
    const handleLoginSuccess = () => window.location.reload();
    window.addEventListener(LOGIN_SUCCESS_EVENT, handleLoginSuccess);
    return () => window.removeEventListener(LOGIN_SUCCESS_EVENT, handleLoginSuccess);
  }, []);

  return (
    <CheckoutViewContext.Provider value={{ webReturnUrl: WEB_RETURN_URL }}>
      <div className="checkout-form-card overflow-hidden rounded-2xl border border-[#D9C5B0]/40 bg-white shadow-sm">
        <CheckoutStepper currentStep={checkoutStep} />

        <div className="checkout-step-content p-6 sm:p-8">
          {checkoutStep === "contact" && (
            <CheckoutContactStep
              onContinue={(email) => {
                setConfirmedContactEmail(email);
                setCheckoutStep("address");
              }}
            />
          )}

          {checkoutStep === "address" && (
            <ViewStep2
              onComplete={() => setCheckoutStep("checkout")}
              onBack={() => setCheckoutStep("contact")}
            />
          )}

          {checkoutStep === "checkout" && <ViewStepCheckout onBack={() => setCheckoutStep("address")} />}
        </div>

        <div className="border-t border-[#D9C5B0]/40 px-6 py-5 text-center sm:px-8">
          <p className="flex items-center justify-center gap-1.5 text-xs text-[#8B6B57]">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Güvenli ödeme · SSL ile şifrelenir
          </p>
        </div>
      </div>
    </CheckoutViewContext.Provider>
  );
}

export default function CheckoutFlow() {
  return (
    <Suspense fallback={<CheckoutFlowFallback />}>
      <CheckoutFlowInner />
    </Suspense>
  );
}
