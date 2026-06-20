"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "@/theme/item/item.icons";
import { ItemProductDetailAccordion } from "@/theme/item/item.product.detail.accordion";
import { useCart } from "@/lib/context/CartContext";
import type { Product } from "@/lib/data";
import {
  DEFAULT_PRODUCT_SHIPPING_INFO,
  type ProductShippingInfo,
} from "@/lib/product-shipping";
import { formatPrice, PLACEHOLDER_IMAGE } from "@/lib/product-utils";

type ItemProductDetailInfoProps = {
  product: Product;
  shippingInfo?: ProductShippingInfo;
};

export function ItemProductDetailInfo({
  product,
  shippingInfo = DEFAULT_PRODUCT_SHIPPING_INFO,
}: ItemProductDetailInfoProps) {
  const { addItem, incrementItem, decrementItem, getQuantity } = useCart();
  const cartQuantity = getQuantity(product.id);
  const [pendingQuantity, setPendingQuantity] = useState(1);

  const displayQuantity = cartQuantity > 0 ? cartQuantity : pendingQuantity;

  const handleDecrease = () => {
    if (cartQuantity > 0) {
      decrementItem(product.id);
      return;
    }

    setPendingQuantity((current) => Math.max(1, current - 1));
  };

  const handleIncrease = () => {
    if (cartQuantity > 0) {
      incrementItem(product.id);
      return;
    }

    setPendingQuantity((current) => current + 1);
  };

  const handleAddToCart = () => {
    if (cartQuantity > 0) return;

    for (let index = 0; index < pendingQuantity; index += 1) {
      addItem({
        ...product,
        image: product.image || PLACEHOLDER_IMAGE,
      });
    }
  };

  return (
    <div className="flex min-w-0 flex-col">
      {product.category ? (
        <p className="text-sm font-bold uppercase tracking-tight text-charcoal">
          {product.category}
        </p>
      ) : null}

      <h1 className="mt-2 text-3xl font-light uppercase tracking-[0.08em] text-charcoal md:text-4xl">
        {product.name}
      </h1>

      <p className="mt-3 text-xs font-medium text-muted">
        KDV dahil · Ücretsiz kargo
      </p>

      <div className="mt-6 flex items-end gap-3">
        {product.originalPrice && product.originalPrice > product.price ? (
          <p className="text-lg text-muted line-through">
            {formatPrice(product.originalPrice)}
          </p>
        ) : null}
        <p className="text-3xl font-bold text-primary md:text-4xl">
          {formatPrice(Number(product.price))}
        </p>
      </div>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted">
          Adet
        </p>
        <div className="mt-3 inline-flex items-center overflow-hidden rounded-xl border border-stone/80 bg-white">
          <button
            type="button"
            onClick={handleDecrease}
            className="inline-flex h-11 w-11 items-center justify-center text-charcoal transition-colors hover:bg-powder"
            aria-label="Adedi azalt"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="min-w-10 px-2 text-center text-base font-semibold tabular-nums text-charcoal">
            {displayQuantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            className="inline-flex h-11 w-11 items-center justify-center text-charcoal transition-colors hover:bg-powder"
            aria-label="Adedi artır"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={cartQuantity > 0}
        className="mt-6 w-full rounded-xl border border-charcoal bg-white px-6 py-4 text-sm font-semibold text-charcoal transition-colors hover:border-primary-accent hover:bg-primary-accent hover:text-white disabled:cursor-default disabled:border-stone disabled:bg-stone/20 disabled:text-muted"
      >
        {cartQuantity > 0 ? "Sepette" : "Sepete Ekle"}
      </button>

      <div className="mt-8">
        <ItemProductDetailAccordion title="Ürün Açıklaması">
          <p className="text-sm leading-7 text-muted">
            {product.description?.trim() ||
              `${product.name} — Code Blonde bakım koleksiyonunun özenle formüle edilmiş bir parçasıdır.`}
          </p>
        </ItemProductDetailAccordion>

        <ItemProductDetailAccordion title="Kargo & İade" defaultOpen={false}>
          <dl className="space-y-4 text-sm text-muted">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal">
                Teslimat
              </dt>
              <dd className="mt-1">{shippingInfo.deliveryTime}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal">
                Ücretsiz Kargo
              </dt>
              <dd className="mt-1">
                {shippingInfo.freeShippingThreshold} TL üzeri siparişlerde
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal">
                İade
              </dt>
              <dd className="mt-1">{shippingInfo.returnPolicy}</dd>
            </div>
          </dl>
        </ItemProductDetailAccordion>
      </div>
    </div>
  );
}
