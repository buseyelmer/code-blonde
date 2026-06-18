import type { Product } from "@/core/interface/product.interface";

const DEFAULT_IMAGE = "/images/product-gum.svg";

type MediaLike = {
  path?: string;
  relativePath?: string;
};

type ImageLike = {
  path?: string;
  relativePath?: string;
};

type PriceLike = {
  mainPrice?: number;
  discountPrice?: number;
  payPrice?: number;
  depositAmount?: number;
  taxAmount?: number;
};

type ReviewLike = {
  count?: number;
  rating?: number;
};

function getStorageBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_STORAGE_URL ?? "").replace(/\/$/, "");
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return undefined;
}

function toDisplayString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.name === "string") return record.name;
    if (typeof record.value === "string") return record.value;
    if (typeof record.slug === "string") return record.slug;
    if (typeof record.label === "string") return record.label;
  }
  return fallback;
}

export function buildImageUrl(
  mediaPath: string,
  storageUrl = getStorageBaseUrl(),
): string {
  if (!mediaPath.trim()) return "";

  if (/^https?:\/\//i.test(mediaPath)) {
    return mediaPath;
  }

  if (!storageUrl) return mediaPath;

  const normalizedPath = mediaPath.replace(/^\/+/, "");
  const baseLast = storageUrl.split("/").pop();
  const pathFirst = normalizedPath.split("/")[0];

  if (baseLast && pathFirst && baseLast === pathFirst) {
    return `${storageUrl}/${normalizedPath.slice(pathFirst.length + 1)}`;
  }

  return `${storageUrl}/${normalizedPath}`;
}

function extractPathFromMedia(media: unknown): string | undefined {
  if (!media) return undefined;

  if (Array.isArray(media)) {
    for (const entry of media) {
      const path = extractPathFromMedia(entry);
      if (path) return path;
    }
    return undefined;
  }

  if (typeof media !== "object") return undefined;

  const record = media as MediaLike;
  if (typeof record.path === "string" && record.path.trim()) {
    return record.path.trim();
  }
  if (typeof record.relativePath === "string" && record.relativePath.trim()) {
    return record.relativePath.trim();
  }

  return undefined;
}

function extractImagePaths(raw: Record<string, unknown>): string[] {
  const paths: string[] = [];

  const mediaPath = extractPathFromMedia(raw.media);
  if (mediaPath) paths.push(mediaPath);

  if (typeof raw.image === "string" && raw.image.trim()) {
    paths.push(raw.image.trim());
  }

  if (typeof raw.icon === "string" && raw.icon.trim()) {
    paths.push(raw.icon.trim());
  }

  const images = raw.images;
  if (Array.isArray(images)) {
    for (const entry of images) {
      if (typeof entry === "string" && entry.trim()) {
        paths.push(entry.trim());
        continue;
      }

      if (entry && typeof entry === "object") {
        const image = entry as ImageLike;
        if (typeof image.path === "string" && image.path.trim()) {
          paths.push(image.path.trim());
        } else if (
          typeof image.relativePath === "string" &&
          image.relativePath.trim()
        ) {
          paths.push(image.relativePath.trim());
        }
      }
    }
  }

  return [...new Set(paths)];
}

function resolvePriceFields(raw: Record<string, unknown>): {
  price: number;
  salePrice?: number;
  originalPrice?: number;
} {
  const topLevelSale = toNumber(raw.salePrice);
  const topLevelPrice = toNumber(raw.price);
  const topLevelOriginal = toNumber(raw.originalPrice);

  const priceObject =
    raw.price && typeof raw.price === "object" && !Array.isArray(raw.price)
      ? (raw.price as PriceLike)
      : undefined;

  const unitPriceObject = Array.isArray(raw.productUnit)
    ? raw.productUnit.find(
        (unit) =>
          unit &&
          typeof unit === "object" &&
          "price" in unit &&
          unit.price &&
          typeof unit.price === "object",
      )
    : undefined;

  const nestedUnitPrice =
    unitPriceObject &&
    typeof unitPriceObject === "object" &&
    "price" in unitPriceObject
      ? (unitPriceObject.price as PriceLike)
      : undefined;

  const mainPrice =
    toNumber(priceObject?.mainPrice) ??
    toNumber(nestedUnitPrice?.mainPrice) ??
    topLevelPrice;

  const discountPrice =
    toNumber(priceObject?.discountPrice) ??
    toNumber(nestedUnitPrice?.discountPrice);

  const payPrice =
    toNumber(priceObject?.payPrice) ??
    toNumber(nestedUnitPrice?.payPrice);

  const salePrice =
    topLevelSale ??
    (discountPrice && discountPrice > 0 ? discountPrice : undefined) ??
    payPrice ??
    mainPrice ??
    0;

  const originalPrice =
    topLevelOriginal ??
    (discountPrice && discountPrice > 0 ? mainPrice : undefined);

  return {
    price: salePrice,
    salePrice,
    originalPrice,
  };
}

function resolveReviewFields(raw: Record<string, unknown>): {
  rating?: number;
  reviewCount?: number;
} {
  const review =
    raw.review && typeof raw.review === "object"
      ? (raw.review as ReviewLike)
      : undefined;

  return {
    rating: toNumber(raw.rating) ?? toNumber(review?.rating),
    reviewCount: toNumber(raw.reviewCount) ?? toNumber(review?.count),
  };
}

export function normalizeApiProduct(raw: Record<string, unknown>): Product {
  const storageUrl = getStorageBaseUrl();
  const imagePaths = extractImagePaths(raw);
  const imageUrls = imagePaths
    .map((path) => buildImageUrl(path, storageUrl))
    .filter(Boolean);

  const { price, salePrice, originalPrice } = resolvePriceFields(raw);
  const { rating, reviewCount } = resolveReviewFields(raw);

  const brandName =
    typeof raw.brand === "string"
      ? raw.brand
      : raw.brand && typeof raw.brand === "object"
        ? toDisplayString((raw.brand as Record<string, unknown>).name)
        : undefined;

  const brandId =
    typeof raw.brandId === "string"
      ? raw.brandId
      : raw.brand && typeof raw.brand === "object" && "id" in raw.brand
        ? String((raw.brand as { id?: string }).id ?? "")
        : undefined;

  return {
    id: typeof raw.id === "string" ? raw.id : undefined,
    name: toDisplayString(raw.name, "Ürün"),
    slug: toDisplayString(raw.slug),
    description: toDisplayString(raw.description),
    articleNumber:
      typeof raw.articleNumber === "string" ? raw.articleNumber : undefined,
    price,
    salePrice,
    originalPrice,
    status: typeof raw.status === "string" ? raw.status : undefined,
    tag: Array.isArray(raw.tag)
      ? raw.tag.filter((item): item is string => typeof item === "string")
      : undefined,
    tags: Array.isArray(raw.tags)
      ? raw.tags.filter((item): item is string => typeof item === "string")
      : undefined,
    image: imageUrls[0] ?? DEFAULT_IMAGE,
    images: imageUrls.length > 0 ? imageUrls : [DEFAULT_IMAGE],
    media: raw.media as Product["media"],
    brandId,
    rating,
    reviewCount,
    categories: Array.isArray(raw.categories)
      ? raw.categories
          .filter(
            (item): item is Record<string, unknown> =>
              !!item && typeof item === "object",
          )
          .map((category) => ({
            id: typeof category.id === "string" ? category.id : undefined,
            name: toDisplayString(category.name),
            slug: toDisplayString(category.slug),
            parentId:
              typeof category.parentId === "string"
                ? category.parentId
                : undefined,
          }))
      : undefined,
    ...(brandName ? { brand: brandName } : {}),
  } as Product;
}

export function normalizeApiProducts(items: unknown): Product[] {
  if (!Array.isArray(items)) return [];

  return items
    .filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === "object",
    )
    .map(normalizeApiProduct);
}
