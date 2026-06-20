"use client";

import { ItemProductDetailInfo } from "@/theme/item/item.product.detail.info";
import type { Product, ProductCategoryId } from "@/lib/data";
import type { ProductShippingInfo } from "@/lib/product-shipping";
import { PLACEHOLDER_IMAGE } from "@/lib/product-utils";

type SectionProductDetailInfoProps = {
  productId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  description: string;
  ingredients?: string[];
  usage?: string[];
  shippingInfo: ProductShippingInfo;
  variants?: unknown[];
  image?: string;
  isFavorite?: boolean;
};

export function SectionProductDetailInfo({
  productId,
  name,
  category,
  price,
  originalPrice,
  description,
  shippingInfo,
  image,
}: SectionProductDetailInfoProps) {
  const product: Product = {
    id: productId,
    name,
    category,
    categoryId: "sac-bakim" as ProductCategoryId,
    price,
    originalPrice,
    image: image || PLACEHOLDER_IMAGE,
    description,
    isExclusive: true,
    rating: 4.5,
    reviewCount: 0,
  };

  return <ItemProductDetailInfo product={product} shippingInfo={shippingInfo} />;
}
