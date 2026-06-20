"use client";

import { ItemProductDetailGallery } from "@/theme/item/item.product.detail.gallery";

type GalleryImage = {
  id: string | number;
  src: string;
  alt: string;
};

type SectionProductDetailGalleryProps = {
  images: GalleryImage[];
  productId: string;
  isFavorite?: boolean;
};

export function SectionProductDetailGallery({
  images,
}: SectionProductDetailGalleryProps) {
  return (
    <ItemProductDetailGallery
      src={images[0]?.src}
      alt={images[0]?.alt || "Ürün görseli"}
    />
  );
}
