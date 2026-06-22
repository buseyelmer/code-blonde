"use client";

import { useEffect, useRef, useState } from "react";
import { useRaxon } from "@raxonltd/raxon-core";
import { useCart } from "@raxonltd/raxon-core/hook";
import { ModalAuth, type ModalAuthRef } from "@raxonltd/raxon-core/dist/core/feature/auth/modal/modal.auth";

const labelClass = "checkout-field-label mb-2 block text-[13px] font-medium text-[#5C4638]";
const inputClass =
  "checkout-field box-border block w-full min-h-12 rounded-xl border border-[#D9C5B0]/75 bg-[#FDFAF6] px-4 py-3 text-sm leading-normal text-[#5C4638] placeholder:text-[#8B6B57]/55 transition-all focus:border-[#5C4638] focus:outline-none focus:ring-2 focus:ring-[#5C4638]/12";
const linkClass = "font-medium text-[#5C4638] underline-offset-2 hover:underline";

type CheckoutContactStepProps = {
  onContinue: (email: string) => void;
};

export default function CheckoutContactStep({ onContinue }: CheckoutContactStepProps) {
  const { cart, profile, isAuthenticated, isGuest } = useRaxon();
  const modalAuthRef = useRef<ModalAuthRef>(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedEmailRef = useRef("");
  const saveInFlightRef = useRef<Promise<boolean> | null>(null);
  const userEditedEmailRef = useRef(false);
  const updateBasketMutation = useCart().update();

  useEffect(() => {
    const fromCart = cart?.email?.trim() || "";
    const fromProfile = isAuthenticated && !isGuest ? profile?.email?.trim() || "" : "";
    const resolved = fromCart || fromProfile;

    if (fromCart) {
      lastSavedEmailRef.current = fromCart;
    }

    if (!resolved || userEditedEmailRef.current) return;
    setEmailInput(resolved);
  }, [cart?.email, profile?.email, isAuthenticated, isGuest]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const saveEmail = (email: string) => {
    if (saveInFlightRef.current) return saveInFlightRef.current;

    const promise = (async () => {
      const trimmed = email.trim();

      if (!trimmed) {
        setEmailError("E-posta adresi zorunludur.");
        return false;
      }

      if (!isValidEmail(trimmed)) {
        setEmailError("Geçerli bir e-posta adresi giriniz.");
        return false;
      }

      if (trimmed === lastSavedEmailRef.current) return true;

      if (!cart?.id) {
        setEmailError("Sepet bulunamadı. Lütfen sayfayı yenileyin.");
        return false;
      }

      setEmailError(null);
      setIsSaving(true);

      try {
        await updateBasketMutation.mutateAsync({ id: cart.id, email: trimmed });
        lastSavedEmailRef.current = trimmed;
        return true;
      } catch {
        setEmailError("E-posta kaydedilemedi. Lütfen tekrar deneyin.");
        return false;
      } finally {
        setIsSaving(false);
      }
    })();

    saveInFlightRef.current = promise;
    void promise.finally(() => {
      if (saveInFlightRef.current === promise) {
        saveInFlightRef.current = null;
      }
    });

    return promise;
  };

  const handleContinue = async () => {
    const ok = await saveEmail(emailInput);
    if (ok) onContinue(emailInput.trim());
  };

  return (
    <>
      <ModalAuth ref={modalAuthRef} />

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-[#5C4638] sm:text-xl">İletişim</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[#8B6B57]">
            Sipariş onayı ve kargo bilgileri bu adrese gönderilir.
          </p>
        </div>

        {!isGuest && isAuthenticated ? (
          <p className="text-sm text-[#8B6B57]">
            <button type="button" className={linkClass} onClick={() => modalAuthRef.current?.open("login")}>
              Hesabınızla giriş yaptınız
            </button>
          </p>
        ) : (
          <p className="text-sm text-[#8B6B57]">
            Hesabınız var mı?{" "}
            <button type="button" className={linkClass} onClick={() => modalAuthRef.current?.open("login")}>
              Giriş yap
            </button>{" "}
            veya{" "}
            <button type="button" className={linkClass} onClick={() => modalAuthRef.current?.open("register")}>
              kayıt ol
            </button>
          </p>
        )}

        <div>
          <label htmlFor="checkout-email" className={labelClass}>
            E-posta
          </label>
          <input
            id="checkout-email"
            type="email"
            autoComplete="email"
            placeholder="ornek@email.com"
            value={emailInput}
            onChange={(event) => {
              userEditedEmailRef.current = true;
              setEmailInput(event.target.value);
              if (emailError) setEmailError(null);
            }}
            onBlur={() => void saveEmail(emailInput)}
            className={inputClass}
            required
          />
          {isSaving ? <p className="mt-1.5 text-xs text-[#8B6B57]">Kaydediliyor…</p> : null}
          {emailError ? <p className="mt-1.5 text-sm text-red-600">{emailError}</p> : null}
        </div>

        <button
          type="button"
          disabled={!emailInput.trim() || isSaving}
          onClick={() => void handleContinue()}
          className="w-full rounded-xl bg-[#5C4638] px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] text-[#F8F1E9] shadow-sm transition hover:bg-[#3F2F25] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Devam et
        </button>
      </div>
    </>
  );
}
