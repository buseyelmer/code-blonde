"use client";

import { ProductDetailInfo } from "@/components/product/ProductDetailInfo";
import type { Product, ProductCategoryId } from "@/lib/data";
import type { ProductShippingInfo } from "@/lib/product-shipping";
import { PLACEHOLDER_IMAGE } from "@/lib/product-utils";

type SectionProductInfoProps = {
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

export default function SectionProductInfo({
  productId,
  name,
  category,
  price,
  originalPrice,
  description,
  shippingInfo,
  image,
}: SectionProductInfoProps) {
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

  return <ProductDetailInfo product={product} shippingInfo={shippingInfo} />;
}
