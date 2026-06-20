import { PLACEHOLDER_IMAGE } from "@/lib/product-utils";

export function getSafeImageUrl(
  relativePath?: string | null,
  _type?: string,
): string {
  if (!relativePath?.trim()) return PLACEHOLDER_IMAGE;

  if (/^https?:\/\//i.test(relativePath)) {
    return relativePath;
  }

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL?.replace(/\/$/, "");
  const normalizedPath = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;

  return storageUrl ? `${storageUrl}${normalizedPath}` : relativePath;
}
