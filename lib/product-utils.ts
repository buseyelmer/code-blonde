export const PLACEHOLDER_IMAGE = "/placeholder.svg";

export function isPlaceholderImage(src: string): boolean {
  return src === PLACEHOLDER_IMAGE || /\/placeholder\.(svg|jpg)$/i.test(src);
}

export function formatPrice(amount: unknown): string {
  if (amount === undefined || amount === null) return "₺0,00";

  const value = Number(amount);
  if (Number.isNaN(value)) return "₺0,00";

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(value);
}

type MediaCarrier = {
  image?: string;
  media?: { path?: string } | null;
};

export function resolveProductImageUrl(product: MediaCarrier): string {
  if (product.image?.trim()) return product.image;

  const mediaPath = product.media?.path?.trim();
  if (mediaPath) {
    if (/^https?:\/\//i.test(mediaPath)) return mediaPath;

    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL?.replace(/\/$/, "");
    if (storageUrl) {
      const normalizedPath = mediaPath.startsWith("/")
        ? mediaPath
        : `/${mediaPath}`;
      return `${storageUrl}${normalizedPath}`;
    }

    return mediaPath;
  }

  return PLACEHOLDER_IMAGE;
}

export function getProductCategoryName(product: {
  category?: string;
  categoryId?: string;
}): string {
  return product.category?.trim() || "";
}
