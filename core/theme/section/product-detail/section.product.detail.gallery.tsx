"use client";

import type { Product } from "@/lib/data";
import type { ProductShippingInfo } from "@/lib/product-shipping";
import { ProductDetailGallery } from "@/components/product/ProductDetailGallery";
import { ProductDetailInfo } from "@/components/product/ProductDetailInfo";

type GalleryImage = {
  id: string | number;
  src: string;
  alt: string;
};

type SectionProductGalleryProps = {
  images: GalleryImage[];
  productId: string;
  isFavorite?: boolean;
};

export default function SectionProductGallery({
  images,
}: SectionProductGalleryProps) {
  return (
    <ProductDetailGallery
      src={images[0]?.src}
      alt={images[0]?.alt || "Ürün görseli"}
    />
  );
}
