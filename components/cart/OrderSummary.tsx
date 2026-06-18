"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { calculateOrderTotal } from "@/lib/checkout-utils";
import { formatPrice } from "@/lib/product-utils";

type OrderSummaryProps = {
  subtotal: number;
  showCheckoutButton?: boolean;
  checkoutLabel?: string;
  className?: string;
};

export function OrderSummary({
  subtotal,
  showCheckoutButton = true,
  checkoutLabel = "Ödemeye Geç",
  className = "",
}: OrderSummaryProps) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const discount = useMemo(() => {
    if (appliedCode === "CODEBLONDE") return Math.min(subtotal * 0.1, 150);
    return 0;
  }, [appliedCode, subtotal]);

  const totals = useMemo(
    () => calculateOrderTotal(subtotal, discount),
    [subtotal, discount],
  );

  const applyPromo = () => {
    const normalized = promoCode.trim().toUpperCase();

    if (normalized === "CODEBLONDE") {
      setAppliedCode(normalized);
      setPromoMessage("CODEBLONDE kodu uygulandı");
      return;
    }

    setAppliedCode(null);
    setPromoMessage("Geçersiz indirim kodu");
  };

  const handleCheckout = () => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.push("/giris?redirect=/checkout");
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
        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-700">
            <dt>İndirim</dt>
            <dd className="font-medium">-{formatPrice(discount)}</dd>
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
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
            placeholder="Kod girin"
            className="flex-1 rounded-xl border border-stone/80 bg-cream px-3 py-2 text-sm outline-none focus:border-brand-purple/40"
          />
          <button
            type="button"
            onClick={applyPromo}
            className="rounded-xl border border-charcoal px-4 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
          >
            Uygula
          </button>
        </div>
        {promoMessage && (
          <p
            className={`mt-2 text-xs ${
              appliedCode ? "text-emerald-700" : "text-red-600"
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
          className="mt-6 w-full rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-purple"
        >
          {checkoutLabel}
        </button>
      )}
    </aside>
  );
}
