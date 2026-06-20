"use client";

import Image from "next/image";
import { useState } from "react";

type ProductDetailGalleryProps = {
  src?: string;
  alt: string;
};

export function ProductDetailGallery({ src, alt }: ProductDetailGalleryProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = src?.trim();
  const showPlaceholder = !imageSrc || imageError;

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-stone/70 bg-powder/30">
      {showPlaceholder ? (
        <div className="flex h-full w-full items-center justify-center bg-stone/40">
          <p className="text-sm font-medium text-muted">Görsel yok</p>
        </div>
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          priority
          className="object-contain p-6"
          sizes="(max-width: 1024px) 100vw, 50vw"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}
