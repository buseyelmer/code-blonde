"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { useOrders } from "@/lib/context/OrdersContext";
import { BANK_ACCOUNTS, calculateOrderTotal } from "@/lib/checkout-utils";
import { formatPrice } from "@/lib/product-utils";
import { OrderSummary } from "@/components/cart/OrderSummary";

type CheckoutStep = 1 | 2;

type DeliveryFormState = {
  addressTitle: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  address: string;
  postalCode: string;
  invoiceType: "individual" | "corporate";
  identityNumber: string;
};

type PaymentMethod = "card" | "transfer";

const INITIAL_DELIVERY: DeliveryFormState = {
  addressTitle: "",
  fullName: "",
  phone: "",
  country: "Türkiye",
  city: "",
  district: "",
  address: "",
  postalCode: "",
  invoiceType: "individual",
  identityNumber: "",
};

export function CheckoutFlow() {
  const router = useRouter();
  const { isAuthenticated, isReady, user } = useAuth();
  const { items, totalPrice, promoDiscount, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [step, setStep] = useState<CheckoutStep>(1);
  const [delivery, setDelivery] = useState<DeliveryFormState>({
    ...INITIAL_DELIVERY,
    fullName: user?.name ?? "",
  });
  const [addressSaved, setAddressSaved] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const totals = useMemo(
    () => calculateOrderTotal(totalPrice, promoDiscount),
    [totalPrice, promoDiscount],
  );

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [isReady, isAuthenticated, router]);

  if (!isReady) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="h-64 animate-pulse rounded-3xl bg-powder/60" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-muted">
        Yönlendiriliyorsunuz...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-charcoal">Sepetiniz boş</h1>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream"
        >
          Alışverişe Dön
        </Link>
      </div>
    );
  }

  const updateDelivery = (field: keyof DeliveryFormState, value: string) => {
    setDelivery((current) => ({ ...current, [field]: value }));
    setAddressSaved(false);
  };

  const saveAddress = () => {
    if (
      !delivery.fullName.trim() ||
      !delivery.phone.trim() ||
      !delivery.city.trim() ||
      !delivery.district.trim() ||
      !delivery.address.trim()
    ) {
      return;
    }

    setAddressSaved(true);
    setStep(2);
  };

  const canCompletePayment =
    addressSaved &&
    acceptedTerms &&
    (paymentMethod === "transfer" ||
      (cardNumber.trim() && cardName.trim() && cardExpiry.trim() && cardCvc.trim()));

  const completePayment = () => {
    if (!canCompletePayment || !user) return;

    addOrder({
      userEmail: user.email,
      userName: user.name,
      items: [...items],
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
      paymentMethod,
    });

    clearCart();
    router.push("/checkout/thank-you");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/cart"
        className="text-sm font-medium text-muted transition-colors hover:text-charcoal"
      >
        ← Sepetim
      </Link>

      <div className="mt-4 flex flex-wrap gap-3">
        {[1, 2].map((stepNumber) => {
          const isActive = step === stepNumber;
          const isDone = step > stepNumber;
          return (
            <button
              key={stepNumber}
              type="button"
              onClick={() => stepNumber === 1 && setStep(1)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-charcoal text-cream"
                  : isDone
                    ? "bg-brand-brown-light text-brand-brown"
                    : "bg-white text-muted ring-1 ring-stone"
              }`}
            >
              {stepNumber}. {stepNumber === 1 ? "Teslimat Bilgileri" : "Ödeme Yöntemi"}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {step === 1 && (
            <section className="rounded-2xl border border-stone/70 bg-white p-6">
              <h1 className="text-xl font-semibold text-charcoal">Teslimat Adresi</h1>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-sm text-muted">Adres Başlığı</span>
                  <input
                    value={delivery.addressTitle}
                    onChange={(e) => updateDelivery("addressTitle", e.target.value)}
                    placeholder="Ev, İş vb."
                    className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-brown/40"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm text-muted">Ad Soyad</span>
                  <input
                    value={delivery.fullName}
                    onChange={(e) => updateDelivery("fullName", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-brown/40"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted">Telefon No</span>
                  <input
                    value={delivery.phone}
                    onChange={(e) => updateDelivery("phone", e.target.value)}
                    placeholder="5XX XXX XX XX"
                    className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-brown/40"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted">Ülke</span>
                  <input
                    value={delivery.country}
                    onChange={(e) => updateDelivery("country", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-brown/40"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted">İl</span>
                  <input
                    value={delivery.city}
                    onChange={(e) => updateDelivery("city", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-brown/40"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted">İlçe</span>
                  <input
                    value={delivery.district}
                    onChange={(e) => updateDelivery("district", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-brown/40"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm text-muted">Adres</span>
                  <textarea
                    value={delivery.address}
                    onChange={(e) => updateDelivery("address", e.target.value)}
                    placeholder="Mahalle, sokak, bina no..."
                    rows={3}
                    className="mt-2 w-full resize-y rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-brown/40"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted">Posta Kodu</span>
                  <input
                    value={delivery.postalCode}
                    onChange={(e) => updateDelivery("postalCode", e.target.value)}
                    placeholder="34000"
                    className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-brown/40"
                  />
                </label>
                <fieldset className="sm:col-span-2">
                  <legend className="text-sm text-muted">Fatura Tipi</legend>
                  <div className="mt-2 flex gap-4">
                    {[
                      { id: "individual", label: "Bireysel" },
                      { id: "corporate", label: "Kurumsal" },
                    ].map((option) => (
                      <label key={option.id} className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="invoiceType"
                          checked={delivery.invoiceType === option.id}
                          onChange={() =>
                            updateDelivery(
                              "invoiceType",
                              option.id as DeliveryFormState["invoiceType"],
                            )
                          }
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="block sm:col-span-2">
                  <span className="text-sm text-muted">TC Kimlik No</span>
                  <input
                    value={delivery.identityNumber}
                    onChange={(e) => updateDelivery("identityNumber", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-brown/40"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={saveAddress}
                className="mt-6 w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
              >
                Kaydet ve Devam Et
              </button>
            </section>
          )}

          {step === 2 && (
            <>
              <section className="rounded-2xl border border-stone/70 bg-white p-6">
                <h2 className="text-xl font-semibold text-charcoal">Ödeme Yöntemleri</h2>

                {!addressSaved ? (
                  <p className="mt-4 text-sm text-muted">
                    Teslimat adresi alanlarını doldurduktan sonra ödeme yöntemlerini seçebilirsiniz.
                  </p>
                ) : (
                  <div className="mt-6 space-y-4">
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone/70 p-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="mt-1"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-charcoal">
                          Kredi Kartı
                        </span>
                        <span className="mt-1 block text-xs text-muted">
                          iyzico / iPay güvenli ödeme altyapısı
                        </span>
                      </span>
                    </label>

                    {paymentMethod === "card" && (
                      <div className="grid gap-4 rounded-xl bg-powder/30 p-4 sm:grid-cols-2">
                        <label className="block sm:col-span-2">
                          <span className="text-xs text-muted">Kart Üzerindeki İsim</span>
                          <input
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-stone/80 bg-white px-4 py-2.5 text-sm outline-none"
                          />
                        </label>
                        <label className="block sm:col-span-2">
                          <span className="text-xs text-muted">Kart Numarası</span>
                          <input
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="0000 0000 0000 0000"
                            className="mt-2 w-full rounded-xl border border-stone/80 bg-white px-4 py-2.5 text-sm outline-none"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs text-muted">Son Kullanma</span>
                          <input
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="AA/YY"
                            className="mt-2 w-full rounded-xl border border-stone/80 bg-white px-4 py-2.5 text-sm outline-none"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs text-muted">CVC</span>
                          <input
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="000"
                            className="mt-2 w-full rounded-xl border border-stone/80 bg-white px-4 py-2.5 text-sm outline-none"
                          />
                        </label>
                      </div>
                    )}

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone/70 p-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "transfer"}
                        onChange={() => setPaymentMethod("transfer")}
                        className="mt-1"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-charcoal">
                          Havale / EFT
                        </span>
                        <span className="mt-1 block text-xs text-muted">
                          Banka hesabına transfer ile ödeme
                        </span>
                      </span>
                    </label>

                    {paymentMethod === "transfer" && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                        <p className="font-semibold">Banka Hesap Bilgileri</p>
                        <ul className="mt-3 space-y-3">
                          {BANK_ACCOUNTS.map((account) => (
                            <li key={account.iban}>
                              <p className="font-medium">{account.bankName}</p>
                              <p>{account.accountHolder}</p>
                              <p className="font-mono text-xs">{account.iban}</p>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-xs">
                          Açıklama kısmına sipariş numaranızı yazmayı unutmayın.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>

              <label className="flex items-start gap-3 rounded-2xl border border-stone/70 bg-white p-4 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1"
                />
                Ön Bilgilendirme Formu&apos;nu ve Mesafeli Satış Sözleşmesi&apos;ni okudum, onaylıyorum.
              </label>

              <button
                type="button"
                disabled={!canCompletePayment}
                onClick={completePayment}
                className="w-full rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-brown disabled:cursor-not-allowed disabled:bg-stone disabled:text-muted"
              >
                Ödemeyi Tamamla
              </button>
            </>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-stone/70 bg-white p-4">
            <h2 className="text-sm font-semibold text-charcoal">
              Sepetim ({items.length})
            </h2>
            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="line-clamp-2 text-charcoal">{item.name}</span>
                  <span className="shrink-0 font-semibold text-emerald-700">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <OrderSummary
            subtotal={totalPrice}
            showCheckoutButton={false}
          />

          <div className="rounded-2xl border border-stone/70 bg-white p-4 text-sm text-muted">
            Tahmini teslimat tutarı:{" "}
            <span className="font-semibold text-charcoal">
              {formatPrice(totals.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
