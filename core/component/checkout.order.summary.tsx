"use client";

import Image from "next/image";
import { useRaxon } from "@raxonltd/raxon-core";
import type { BasketItemSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";
import { ShoppingBag } from "lucide-react";
import CartPromoCode from "@/core/component/cart.promo.code";
import { useCartPricing } from "@/core/hook/use.cart.pricing";
import { formatBasketItemVariantLine, getBasketItemDisplayName } from "@/core/util/basket.item.display";
import { buildStorageImageUrl, getBasketItemImagePath } from "@/core/util/basket.enrichment";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import { useMemo } from "react";
import { buildProductMap } from "@/core/util/basket.enrichment";
import "@/core/util/util";

type CheckoutOrderSummaryProps = {
  className?: string;
};

export default function CheckoutOrderSummary({ className = "" }: CheckoutOrderSummaryProps) {
  const { cart } = useRaxon();
  const { subtotal, discount, delivery, total, getItemLinePay } = useCartPricing();

  const { data: productList } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    page: 1,
    amount: 200,
    enabled: (cart?.items?.length ?? 0) > 0,
  });

  const productMap = useMemo(() => buildProductMap(productList?.data), [productList?.data]);

  if (!cart?.items?.length) return null;

  const promoLabel = cart.promoCode?.code ? `Promosyon (${cart.promoCode.code})` : "İndirim";

  return (
    <aside className={`h-fit lg:sticky lg:top-28 ${className}`}>
      <div className="rounded-[2rem] border border-[#D9C5B0]/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A17E65]">Özet</span>
        <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#5C4638]">Sipariş özeti</h2>

        <div className="my-6 space-y-5">
          {cart.items.map((item: BasketItemSummaryInterface) => {
            const product = productMap.get(item.productId);
            const linePay = getItemLinePay(item);
            const listGross = (item.lineTotal ?? 0) + (item.lineTax ?? 0);
            const showListStrike = linePay > 0 && listGross - linePay > 0.01;
            const variantLine = formatBasketItemVariantLine(item);
            const productName = getBasketItemDisplayName(item);
            const imageUrl = buildStorageImageUrl(getBasketItemImagePath(item, product));

            return (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#EDE0D1] bg-[#F8F1E9]">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={productName}
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-[#D9C5B0]" strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#5C4638] text-[11px] font-medium text-[#F8F1E9]">
                    {item.quantity}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[#5C4638]">{productName}</h3>
                  {variantLine ? (
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-[#A17E65]">{variantLine}</p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {showListStrike ? (
                      <span className="text-xs text-[#A17E65]/60 line-through tabular-nums">{listGross.toTry()}</span>
                    ) : null}
                    <span className="text-sm font-mono font-semibold tabular-nums text-[#5C4638]">
                      {linePay > 0 ? linePay.toTry() : "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 border-t border-[#D9C5B0]/40 pt-5">
          <div className="flex justify-between text-sm">
            <span className="text-[#8B6B57]">Ara toplam</span>
            <span className="font-mono tabular-nums text-[#5C4638]">{subtotal > 0 ? subtotal.toTry() : "0,00 ₺"}</span>
          </div>

          {cart.info?.tax && cart.info.tax.length > 0 ? (
            <div className="flex justify-between text-sm">
              <span className="text-[#8B6B57]">KDV</span>
              <span className="font-mono tabular-nums text-[#5C4638]">
                {cart.info.tax.reduce((acc, curr) => acc + curr.tax, 0).toTry()}
              </span>
            </div>
          ) : null}

          {delivery > 0 ? (
            <div className="flex justify-between text-sm">
              <span className="text-[#8B6B57]">Kargo</span>
              <span className="font-mono tabular-nums text-[#5C4638]">{delivery.toTry()}</span>
            </div>
          ) : null}

          {discount > 0 ? (
            <div className="flex justify-between text-sm">
              <span className="text-[#A17E65]">{promoLabel}</span>
              <span className="font-mono tabular-nums text-[#A17E65]">-{discount.toTry()}</span>
            </div>
          ) : null}

          <CartPromoCode compact />

          <div className="flex items-center justify-between border-t border-[#D9C5B0]/40 pt-5">
            <span className="text-sm uppercase tracking-[0.2em] text-[#5C4638]">Toplam</span>
            <span className="font-serif text-2xl tabular-nums text-[#5C4638]">{total > 0 ? total.toTry() : "0,00 ₺"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
