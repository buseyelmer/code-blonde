"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { calculateOrderTotal } from "@/lib/checkout-utils";
import { formatPrice } from "@/lib/product-utils";

type OrderSummaryProps = {
  subtotal?: number;
  showCheckoutButton?: boolean;
  checkoutLabel?: string;
  className?: string;
};

export function OrderSummary({
  subtotal: subtotalProp,
  showCheckoutButton = true,
  checkoutLabel = "Ödemeye Geç",
  className = "",
}: OrderSummaryProps) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();
  const {
    totalPrice,
    promoCode,
    promoDiscount,
    applyPromoCode,
    clearPromoCode,
  } = useCart();
  const [promoInput, setPromoInput] = useState(promoCode ?? "");
  const [promoMessage, setPromoMessage] = useState<string | null>(
    promoCode ? "CODE kodu uygulandı" : null,
  );

  const subtotal = subtotalProp ?? totalPrice;

  useEffect(() => {
    setPromoInput(promoCode ?? "");
    if (promoCode) {
      setPromoMessage("CODE kodu uygulandı");
    }
  }, [promoCode]);

  const totals = useMemo(
    () => calculateOrderTotal(subtotal, promoDiscount),
    [subtotal, promoDiscount],
  );

  const handleApplyPromo = () => {
    const result = applyPromoCode(promoInput);
    setPromoMessage(result.message);

    if (!result.ok) {
      clearPromoCode();
    }
  };

  const handleCheckout = () => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  return (
    <aside
      className={`rounded-2xl border border-stone/70 bg-white p-6 shadow-sm ${className}`}
    >
      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-charcoal">
        Sipariş Özeti
      </h2>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between text-muted">
          <dt>Ara Toplam</dt>
          <dd className="font-medium text-charcoal">
            {formatPrice(totals.subtotal)}
          </dd>
        </div>
        <div className="flex items-center justify-between text-muted">
          <dt>Kargo</dt>
          <dd className="font-medium text-charcoal">
            {totals.shipping === 0 ? (
              <span className="text-emerald-700">Ücretsiz</span>
            ) : (
              formatPrice(totals.shipping)
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between text-muted">
          <dt>KDV Dahil</dt>
          <dd className="font-medium text-charcoal">
            {formatPrice(totals.vat)}
          </dd>
        </div>
        {promoDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-700">
            <dt>İndirim (CODE)</dt>
            <dd className="font-medium">-{formatPrice(promoDiscount)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-6">
        <label htmlFor="promo-code" className="text-xs font-medium text-muted">
          İndirim kodu
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="promo-code"
            value={promoInput}
            onChange={(event) => setPromoInput(event.target.value)}
            placeholder="CODE"
            className="flex-1 rounded-xl border border-stone/80 bg-cream px-3 py-2 text-sm uppercase outline-none focus:border-brand-brown/40"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="rounded-xl border border-charcoal px-4 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
          >
            Uygula
          </button>
        </div>
        {promoMessage && (
          <p
            className={`mt-2 text-xs ${
              promoCode ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {promoMessage}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-stone/60 pt-4">
        <span className="text-base font-semibold text-charcoal">Toplam</span>
        <span className="text-2xl font-bold text-charcoal">
          {formatPrice(totals.total)}
        </span>
      </div>

      {showCheckoutButton && (
        <button
          type="button"
          onClick={handleCheckout}
          className="btn-primary-solid mt-6 w-full py-3.5"
        >
          {checkoutLabel}
        </button>
      )}
    </aside>
  );
}
