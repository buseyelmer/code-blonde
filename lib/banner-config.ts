import type { ProductCategoryOption } from "@/lib/api/group-products";
import { normalizeSearchText, toCategoryHref } from "@/lib/category-utils";

export type BannerSlot = {
  id: string;
  keywords: string[];
  label: string;
  titleFallback: string;
  layout: "small" | "large";
};

export const BANNER_SLOTS: BannerSlot[] = [
  {
    id: "peeling",
    keywords: ["peel", "peeling"],
    label: "ÖZEL SERİ",
    titleFallback: "Peeling Koleksiyonu",
    layout: "small",
  },
  {
    id: "shampoo",
    keywords: ["sampuan", "şampuan", "shampoo"],
    label: "ŞAMPUAN",
    titleFallback: "Saç Bakım Koleksiyonu",
    layout: "small",
  },
  {
    id: "hair-cream",
    keywords: ["krem", "sac krem", "saç krem", "hair cream"],
    label: "KOLEKSİYON",
    titleFallback: "Code Blonde'un Özel Serileri",
    layout: "large",
  },
];

export type ResolvedBanner = {
  id: string;
  href: string;
  label: string;
  title: string;
  layout: "small" | "large";
  categoryName?: string;
};

export function findCategoryByKeywords(
  categories: ProductCategoryOption[] | undefined,
  keywords: string[],
): ProductCategoryOption | undefined {
  const normalizedKeywords = keywords.map((keyword) =>
    normalizeSearchText(keyword),
  );

  return (categories ?? []).find((category) => {
    const name = normalizeSearchText(category.name);
    const id = normalizeSearchText(category.id);

    return normalizedKeywords.some(
      (keyword) => name.includes(keyword) || id.includes(keyword),
    );
  });
}

export function resolveBannerGrid(
  categories?: ProductCategoryOption[],
): ResolvedBanner[] {
  return BANNER_SLOTS.map((slot) => {
    const match = findCategoryByKeywords(categories, slot.keywords);

    return {
      id: slot.id,
      href: match ? toCategoryHref(match.id) : "/products",
      label: slot.label,
      title: match?.name ?? slot.titleFallback,
      layout: slot.layout,
      categoryName: match?.name,
    };
  });
}
