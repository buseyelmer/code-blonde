"use client";

import Image from "next/image";
import { useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/product-utils";

type ProductImageZoomProps = {
  src: string;
  alt: string;
};

export function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
  const [imageUrl, setImageUrl] = useState(src || PLACEHOLDER_IMAGE);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsZoomed((current) => !current)}
      className="relative block aspect-square w-full overflow-hidden rounded-3xl bg-powder/40"
      aria-label={isZoomed ? "Görseli küçült" : "Görseli büyüt"}
    >
      <Image
        src={imageUrl || PLACEHOLDER_IMAGE}
        alt={alt}
        fill
        className={`object-contain p-6 transition-transform duration-300 ${
          isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
        }`}
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
        onError={() => setImageUrl(PLACEHOLDER_IMAGE)}
      />
      <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-charcoal shadow-sm">
        {isZoomed ? "Küçült" : "Yakınlaştır"}
      </span>
    </button>
  );
}
