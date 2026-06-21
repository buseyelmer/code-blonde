"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRaxon } from "@raxonltd/raxon-core";
import { useCart, usePromoCode, useProduct } from "@raxonltd/raxon-core/hook";
import { Status, type PromoCode } from "@raxonltd/raxon-core/interface/prisma.interface";
import type { BasketSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";
import { Check, Loader2, Tag, X } from "lucide-react";
import toast from "react-hot-toast";
import { isResolvableCartId, unwrapApiEntity, unwrapBasketSummary } from "@/core/util/api.response";
import {
  applyLocalPromoToCart,
  buildLocalPromoCode,
  clearLocalPromoFromCart,
  getLocalPromoDiscount,
  isLocalPromoId,
} from "@/core/util/cart.promo.local";
import "@/core/util/util";

const CART_QUERY_KEY = ["organization", "cart"] as const;

const inputClass =
  "w-full rounded-xl border border-[#D9C5B0]/60 bg-[#F8F1E9] px-4 py-3 text-sm uppercase tracking-[0.12em] text-[#5C4638] placeholder:normal-case placeholder:tracking-normal placeholder:text-[#8B6B57]/50 transition-all focus:border-[#C9A99A] focus:outline-none focus:ring-1 focus:ring-[#C9A99A] disabled:opacity-60";

function getApiErrorMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { info?: { message?: string } } } })?.response?.data?.info
    ?.message;
  return message?.trim() || fallback;
}

type CartPromoCodeProps = {
  compact?: boolean;
};

export default function CartPromoCode({ compact = false }: CartPromoCodeProps) {
  const queryClient = useQueryClient();
  const { cart, promoCode, setPromoCode } = useRaxon();
  const cartApi = useCart();
  const { mutate: updateCart, isPending: isUpdatingCart } = cartApi.update();
  const { mutate: findPromoCode, isPending: isFindingPromoCode } = usePromoCode().findByCode();

  const { data: productList } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    page: 1,
    amount: 200,
    enabled: (cart?.items?.length ?? 0) > 0,
  });

  const [isOpen, setIsOpen] = useState(compact);
  const [promoInput, setPromoInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const appliedCode = cart?.promoCode?.code ?? promoCode?.code;
  const isApplied = Boolean(cart?.promoCode?.id ?? promoCode?.id);
  const isLoading = isFindingPromoCode || isUpdatingCart;

  useEffect(() => {
    if (cart?.promoCode?.id) {
      setPromoInput(cart.promoCode.code);
      setIsOpen(true);
    }
  }, [cart?.promoCode?.id, cart?.promoCode?.code]);

  const resolveCart = useCallback(async (): Promise<BasketSummaryInterface | null> => {
    if (isResolvableCartId(cart?.id)) {
      return cart;
    }

    await queryClient.refetchQueries({ queryKey: CART_QUERY_KEY });
    const freshCart = queryClient.getQueryData<BasketSummaryInterface>(CART_QUERY_KEY);
    if (isResolvableCartId(freshCart?.id)) {
      return freshCart ?? null;
    }

    return isResolvableCartId(cart?.id) ? cart : null;
  }, [cart, queryClient]);

  const applyLocalPromo = useCallback(
    async (code: string) => {
      const discount = getLocalPromoDiscount(code);
      if (discount == null) return false;

      const targetCart = await resolveCart();
      if (!targetCart) {
        setError("Sepet bilgisi bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.");
        return false;
      }

      const localPromo = buildLocalPromoCode(code);
      applyLocalPromoToCart(queryClient, targetCart, localPromo, productList?.data);
      setPromoCode(localPromo);
      setPromoInput(localPromo.code);
      setError(null);
      setIsOpen(true);
      toast.success("Promosyon kodu uygulandı");
      return true;
    },
    [productList?.data, queryClient, resolveCart, setPromoCode],
  );

  const applyPromoCode = useCallback(
    async (foundPromoCode: PromoCode) => {
      if (isLocalPromoId(foundPromoCode.id)) {
        await applyLocalPromo(foundPromoCode.code);
        return;
      }

      const targetCart = await resolveCart();
      if (!targetCart?.id || !isResolvableCartId(targetCart.id)) {
        setError("Sepet bilgisi bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.");
        return;
      }

      if (foundPromoCode.status === Status.ARCHIVED) {
        setError("Bu promosyon kodu artık geçerli değil.");
        return;
      }

      const currentBasketAmount = targetCart.info?.basePrice?.pay ?? targetCart.info?.basePrice?.total ?? 0;
      if (foundPromoCode.basketLimit > 0 && currentBasketAmount < foundPromoCode.basketLimit) {
        setError(`Bu kod için minimum sepet tutarı ${foundPromoCode.basketLimit.toTry()} olmalıdır.`);
        return;
      }

      updateCart(
        {
          id: targetCart.id,
          promoCodeId: foundPromoCode.id,
          campaignId: targetCart.campaign?.id ?? undefined,
        },
        {
          onSuccess: (response) => {
            const updatedCart = unwrapBasketSummary(response);
            if (updatedCart) {
              queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
            } else {
              void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
            }

            setPromoCode(foundPromoCode);
            setPromoInput(foundPromoCode.code);
            setError(null);
            setIsOpen(true);
            toast.success("Promosyon kodu uygulandı");
          },
          onError: async (updateError) => {
            const appliedLocally = await applyLocalPromo(foundPromoCode.code);
            if (!appliedLocally) {
              setError(getApiErrorMessage(updateError, "Promosyon kodu sepete eklenemedi."));
            }
          },
        },
      );
    },
    [applyLocalPromo, queryClient, resolveCart, setPromoCode, updateCart],
  );

  const handleApply = () => {
    const trimmed = promoInput.trim();
    if (!trimmed) {
      setError("Lütfen bir promosyon kodu girin.");
      return;
    }

    setError(null);
    findPromoCode(trimmed, {
      onSuccess: (rawPromoCode) => {
        const foundPromoCode = unwrapApiEntity<PromoCode>(rawPromoCode);
        if (!foundPromoCode?.id) {
          void applyLocalPromo(trimmed).then((applied) => {
            if (!applied) setError("Geçersiz promosyon kodu.");
          });
          return;
        }

        void applyPromoCode(foundPromoCode);
      },
      onError: () => {
        void applyLocalPromo(trimmed).then((applied) => {
          if (!applied) setError("Geçersiz promosyon kodu.");
        });
      },
    });
  };

  const handleClear = () => {
    const activeId = cart?.promoCode?.id ?? promoCode?.id;

    if (isLocalPromoId(activeId)) {
      if (!cart) return;
      clearLocalPromoFromCart(queryClient, cart, productList?.data);
      setPromoCode(null);
      setPromoInput("");
      setError(null);
      toast.success("Promosyon kodu kaldırıldı");
      return;
    }

    if (!isResolvableCartId(cart?.id)) return;

    updateCart(
      {
        id: cart!.id,
        promoCodeId: null,
        campaignId: cart?.campaign?.id ?? undefined,
      },
      {
        onSuccess: (response) => {
          const updatedCart = unwrapBasketSummary(response);
          if (updatedCart) {
            queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
          } else {
            void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
          }

          setPromoCode(null);
          setPromoInput("");
          setError(null);
          toast.success("Promosyon kodu kaldırıldı");
        },
        onError: (updateError) => {
          setError(getApiErrorMessage(updateError, "Promosyon kodu kaldırılamadı."));
        },
      },
    );
  };

  const wrapperClass = compact ? "pt-1" : "border-t border-[#D9C5B0]/30 pt-6";

  return (
    <div className={wrapperClass}>
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center gap-2 text-left text-[11px] font-medium tracking-[0.2em] uppercase text-[#A17E65] transition hover:text-[#5C4638]"
        >
          <Tag className="h-3.5 w-3.5" strokeWidth={1.5} />
          İndirim kodu ekle
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium tracking-[0.24em] uppercase text-[#A17E65]">
              Promosyon kodu
            </span>
            {!isApplied && !compact && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setError(null);
                }}
                className="text-[#8B6B57]/60 transition hover:text-[#5C4638]"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <input
                type="text"
                value={promoInput}
                onChange={(event) => {
                  setPromoInput(event.target.value.toUpperCase());
                  setError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleApply();
                  }
                }}
                placeholder="Örn. CODE"
                disabled={isApplied || isLoading}
                className={`${inputClass} ${isApplied ? "border-[#5C4638]/40 bg-[#EDE0D1]/30 pr-10" : ""} ${error ? "border-red-300/80" : ""}`}
              />
              {isApplied && (
                <Check
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C4638]"
                  strokeWidth={2}
                />
              )}
            </div>

            {isApplied ? (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="inline-flex h-[46px] shrink-0 items-center justify-center rounded-xl border border-[#D9C5B0] px-4 text-[#8B6B57] transition hover:border-[#A17E65] hover:text-[#5C4638] disabled:opacity-50 sm:w-12"
                title="Kodu kaldır"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                disabled={!promoInput.trim() || isLoading}
                className="inline-flex h-[46px] shrink-0 items-center justify-center rounded-full bg-[#5C4638] px-6 text-[10px] font-medium tracking-[0.2em] uppercase text-[#F8F1E9] transition hover:bg-[#3F2F25] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Uygula"}
              </button>
            )}
          </div>

          {error && <p className="text-xs text-red-600/90">{error}</p>}

          {isApplied && appliedCode ? (
            <p className="text-xs text-[#5C4638]">
              <span className="font-medium tracking-wider">{appliedCode}</span> kodu uygulandı.
            </p>
          ) : (
            <p className="text-[11px] leading-relaxed text-[#8B6B57]/80">
              <span className="font-medium tracking-wider text-[#A17E65]">CODE</span> kodu ile 20₺ indirim
              kazanın.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
