import type { Product as ApiProduct } from "@/core/interface/product.interface";
import type { Category } from "@/core/interface/prisma.interface";
import type { Product, ProductCategoryId, ShopCategory } from "@/lib/data";
import { shopCategories } from "@/lib/data";

const CATEGORY_IMAGES: Record<string, string> = {
  "sac-bakim": "/images/categories/sac-bakim.svg",
  "sac-sekillendirme": "/images/categories/sac-sekillendirme.svg",
  epilasyon: "/images/categories/epilasyon.svg",
  "vucut-peeling": "/images/categories/vucut-peeling.svg",
  parfumeri: "/images/categories/parfumeri.svg",
  "manikur-pedikur": "/images/categories/manikur-pedikur.svg",
};

const PLACEHOLDER_IMAGE = "/placeholder.jpg";

function resolveDisplayPrice(product: ApiProduct): number {
  if (typeof product.salePrice === "number") return product.salePrice;
  if (typeof product.price === "number") return product.price;
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

function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i");
}

const CATEGORY_RULES: {
  id: ProductCategoryId;
  label: string;
  keywords: string[];
}[] = [
  {
    id: "sac-bakim",
    label: "Saç Bakım",
    keywords: ["sac bakim", "sac mask", "sac serum", "sampuan", "sac yag"],
  },
  {
    id: "sac-sekillendirme",
    label: "Saç Şekillendirme",
    keywords: ["sekillendir", "sac kopugu", "jole", "termal"],
  },
  {
    id: "epilasyon",
    label: "Epilasyon",
    keywords: ["epilasyon", "agda", "band", "kartus", "wax"],
  },
  {
    id: "vucut-peeling",
    label: "Vücut Peeling",
    keywords: ["peeling", "peel", "vucut peeling"],
  },
  {
    id: "parfumeri",
    label: "Parfümeri",
    keywords: ["parfum", "edp", "kolonya", "vucut sprey"],
  },
  {
    id: "manikur-pedikur",
    label: "Manikür & Pedikür",
    keywords: ["manikur", "pedikur", "oje", "tirnak", "el-ayak", "el ayak"],
  },
];

function resolveProductCategory(product: ApiProduct): {
  category: string;
  categoryId: ProductCategoryId;
} {
  const apiCategoryName = product.categories?.[0]?.name ?? "";
  const productName = toDisplayString(product.name);
  const searchText = normalizeSearchText(`${apiCategoryName} ${productName}`);

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => searchText.includes(keyword))) {
      return { category: rule.label, categoryId: rule.id };
    }
  }

  const shopMatch = shopCategories.find((shopCategory) => {
    const label = normalizeSearchText(shopCategory.label);
    const apiName = normalizeSearchText(apiCategoryName);
    return apiName.includes(label) || label.includes(apiName);
  });

  if (shopMatch) {
    return { category: shopMatch.label, categoryId: shopMatch.id };
  }

  return {
    category: apiCategoryName || "Ürün",
    categoryId: "vucut-peeling",
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
): ShopCategory[] | null {
  if (!categories?.length) return null;

  const flat = flattenCategories(categories);

  return flat.slice(0, 6).map((category, index) => {
    const slug =
      toDisplayString(category.slug) ||
      toDisplayString(category.id) ||
      `category-${index}`;
    const label =
      toDisplayString(category.name) ||
      toDisplayString((category as Record<string, unknown>).title) ||
      "Kategori";

    return {
      id: slugToCategoryId(slug),
      label,
      subtitle: "",
      image: CATEGORY_IMAGES[slug] ?? CATEGORY_IMAGES["vucut-peeling"],
      href: `/kategori/${slug}`,
    };
  });
}

function slugToCategoryId(slug?: string): ProductCategoryId {
  const normalized = slug?.toLowerCase() ?? "";
  const match = shopCategories.find(
    (c) => c.id === normalized || c.label.toLowerCase() === normalized,
  );
  return match?.id ?? "vucut-peeling";
}

function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [
    category,
    ...(category.children ? flattenCategories(category.children) : []),
  ]);
}
