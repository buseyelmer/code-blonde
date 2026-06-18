import type { Product as ApiProduct } from "@/core/interface/product.interface";
import type { Category } from "@/core/interface/prisma.interface";
import type { Product, ProductCategoryId } from "@/lib/data";
import { getProductCategoryMeta } from "@/lib/api/group-products";
import { limitCategories, resolveCategoryImage, toCategoryHref } from "@/lib/category-utils";
import type { ProductCategoryOption } from "@/lib/api/group-products";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

function resolveDisplayPrice(product: ApiProduct): number {
  if (typeof product.salePrice === "number") return product.salePrice;
  if (typeof product.price === "number") return product.price;

  if (product.price && typeof product.price === "object") {
    const nested = product.price as {
      payPrice?: number;
      mainPrice?: number;
      discountPrice?: number;
    };
    return (
      nested.payPrice ??
      nested.discountPrice ??
      nested.mainPrice ??
      0
    );
  }

  return 0;
}

/** API'den gelen name/slug alanları bazen iç içe nesne olabiliyor */
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

function resolveProductCategory(product: ApiProduct): {
  category: string;
  categoryId: ProductCategoryId;
} {
  const meta = getProductCategoryMeta(product);

  return {
    category: meta.categoryName,
    categoryId: meta.categoryId as ProductCategoryId,
  };
}

function resolveProductImage(product: ApiProduct): string {
  if (product.image?.trim() && !product.image.endsWith(".svg")) {
    return product.image;
  }

  const imageCandidates = [
    ...(product.images ?? []),
    product.image,
  ].filter((entry): entry is string => typeof entry === "string" && !!entry.trim());

  for (const candidate of imageCandidates) {
    if (!candidate.endsWith(".svg")) return candidate;
  }

  const mediaPath =
    product.media && !Array.isArray(product.media)
      ? product.media.path
      : Array.isArray(product.media)
        ? product.media.find((entry) => entry.path)?.path
        : undefined;

  if (mediaPath?.trim()) {
    if (/^https?:\/\//i.test(mediaPath)) return mediaPath;

    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL?.replace(/\/$/, "");
    if (storageUrl) {
      const normalizedPath = mediaPath.startsWith("/")
        ? mediaPath
        : `/${mediaPath}`;
      return `${storageUrl}${normalizedPath}`;
    }
  }

  return PLACEHOLDER_IMAGE;
}

export function mapApiProductToCard(
  product: ApiProduct,
  index = 0,
): Product {
  const { category, categoryId } = resolveProductCategory(product);
  const price = resolveDisplayPrice(product);

  return {
    id: product.id ?? `api-product-${index}`,
    name: toDisplayString(product.name, "Ürün"),
    category,
    categoryId,
    price,
    originalPrice: product.originalPrice,
    image: resolveProductImage(product),
    description: toDisplayString(product.description),
    articleNumber:
      typeof product.articleNumber === "string" ? product.articleNumber : undefined,
    isExclusive: true,
    rating: product.rating ?? 4.5,
    reviewCount: product.reviewCount ?? 0,
  };
}

export function mapApiProductsToCards(products?: ApiProduct[]): Product[] {
  if (!products?.length) return [];
  return products.map(mapApiProductToCard);
}

export function mapApiCategoriesToNav(
  categories?: Category[],
  productCategories?: ProductCategoryOption[],
): NavCategoryItem[] | null {
  if (productCategories?.length) {
    return limitCategories(productCategories, 12).map((category) => ({
      id: category.id,
      label: category.name,
      subtitle: `${category.count} ürün`,
      image: resolveCategoryImage(category.name),
      href: toCategoryHref(category.id),
    }));
  }

  if (!categories?.length) return null;

  const flat = flattenCategories(categories);

  return limitCategories(
    flat.map((category, index) => ({
      id:
        toDisplayString(category.slug) ||
        toDisplayString(category.id) ||
        `category-${index}`,
      name:
        toDisplayString(category.name) ||
        toDisplayString((category as Record<string, unknown>).title) ||
        "Kategori",
      count: 0,
    })),
    12,
  ).map((category) => ({
    id: category.id,
    label: category.name,
    subtitle: "",
    image: resolveCategoryImage(category.name),
    href: toCategoryHref(category.id),
  }));
}

type NavCategoryItem = {
  id: string;
  label: string;
  subtitle: string;
  image: string;
  href: string;
};

function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [
    category,
    ...(category.children ? flattenCategories(category.children) : []),
  ]);
}
