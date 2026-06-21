import type { Category, Collection, MediaRelated } from "@raxonltd/raxon-core/interface/prisma.interface";
import first from "lodash/first";
import { findCategoryByKeywords } from "@/core/constant/footer.constant";

export type FooterCollectionMatch = {
  label: string;
  keywords: string[];
};

export type HomeCollectionPresentation = {
  keywords: string[];
  categoryKeywords?: string[];
  search?: string;
  eyebrow: string;
  heading: string;
  tagline: string;
  ctaLabel: string;
};

export type CollectionCategoryRule = {
  collectionKeywords: string[];
  categoryKeywords: string[];
  search?: string;
};

export const COLLECTION_HOME_SHORT_HEADINGS: { keywords: string[]; heading: string; order: number }[] = [
  {
    keywords: ["saç bakım", "sac bakim", "saç onarım", "sac onarim", "hair"],
    heading: "Saç Bakım & Onarım",
    order: 0,
  },
  {
    keywords: ["cilt bakım", "cilt bakim", "skin care", "skincare"],
    heading: "Cilt Bakım",
    order: 1,
  },
  {
    keywords: ["parfüm", "parfum", "fragrance", "edp", "edt"],
    heading: "Parfüm",
    order: 2,
  },
];

export const COLLECTION_CATEGORY_RULES: CollectionCategoryRule[] = [
  {
    collectionKeywords: ["parfüm", "parfum", "fragrance", "edp", "edt", "eau"],
    categoryKeywords: ["parfüm", "parfum"],
  },
  {
    collectionKeywords: [
      "saç krem",
      "sac krem",
      "hair cream",
      "saç mask",
      "sac mask",
      "saç serum",
      "sac serum",
      "yoğun saç",
      "yogun sac",
      "saç bakım",
      "sac bakim",
      "saç onarım",
      "sac onarim",
    ],
    categoryKeywords: ["saç bakım", "sac bakim", "onarım", "onarim", "saç bakım & onarım"],
  },
  {
    collectionKeywords: ["saç şekillendirme", "sac sekillendirme", "şekillendirme", "sekillendirme", "wax stick"],
    categoryKeywords: ["saç şekillendirme", "sac sekillendirme", "şekillendirme", "sekillendirme"],
  },
  {
    collectionKeywords: ["peeling", "scrub", "çilek", "cilek", "vücut peeling", "vucut peeling"],
    categoryKeywords: ["vücut bakım", "vucut bakim", "cilt bakım", "cilt bakim"],
    search: "peeling",
  },
  {
    collectionKeywords: ["ağda", "agda", "wax", "kartuş", "kartus", "konserve"],
    categoryKeywords: ["ağda", "agda"],
  },
  {
    collectionKeywords: ["cilt", "yüz", "yuz", "skin care", "skincare"],
    categoryKeywords: ["cilt bakım", "cilt bakim"],
  },
  {
    collectionKeywords: ["vücut", "vucut", "body"],
    categoryKeywords: ["vücut bakım", "vucut bakim"],
  },
];
export const FOOTER_COLLECTION_MATCHES: FooterCollectionMatch[] = [
  { label: "Velvet Nude", keywords: ["velvet nude", "velvet"] },
  { label: "Silk Glow", keywords: ["silk glow", "silk"] },
  { label: "Bare Essence", keywords: ["bare essence", "bare"] },
  { label: "Limited Editions", keywords: ["limited edition", "limited editions", "limited"] },
];

export const HOME_COLLECTION_PRESENTATIONS: HomeCollectionPresentation[] = [
  {
    keywords: ["velvet nude", "velvet"],
    eyebrow: "Dudak & Renk",
    heading: "Velvet Nude",
    tagline: "İpek mat bitişli, ten tonunuza uyum sağlayan imza nude ruj serisi.",
    ctaLabel: "Seriyi Keşfet",
  },
  {
    keywords: ["silk glow", "silk"],
    eyebrow: "Işıltı & Aydınlık",
    heading: "Silk Glow",
    tagline: "Sedefli parlaklık ve doğal ışıltı veren aydınlatıcı koleksiyon.",
    ctaLabel: "Işıltıyı Keşfet",
  },
  {
    keywords: ["bare essence", "bare"],
    eyebrow: "Doğal Güzellik",
    heading: "Bare Essence",
    tagline: "Az ürünle çok etki — cilt bakımı ve nude makyajın sade özü.",
    ctaLabel: "Ritüeli Keşfet",
  },
  {
    keywords: ["limited edition", "limited editions", "limited"],
    eyebrow: "Özel Üretim",
    heading: "Limited Editions",
    tagline: "Sınırlı sayıda üretilen, mevsimsel imza parçalar ve özel setler.",
    ctaLabel: "Özel Seriyi Gör",
  },
  {
    keywords: ["crème", "creme", "fondöten", "fondoten", "teint"],
    eyebrow: "Ten & Kapatıcılık",
    heading: "Crème de Teint",
    tagline: "İkinci cilt hissi bırakan, hafif ve doğal kapatıcılık sunan fondöten serisi.",
    ctaLabel: "Tonları İncele",
  },
  {
    keywords: ["blush", "allık", "allik", "sablé", "sable"],
    eyebrow: "Yanak & Renk",
    heading: "Blush Sablé",
    tagline: "Işıltısız, doğal yanak rengi veren krem allık koleksiyonu.",
    ctaLabel: "Allıkları Keşfet",
  },
];

export type ResolvedHomeCollection = {
  id: string;
  href: string;
  eyebrow: string;
  heading: string;
  tagline: string;
  ctaLabel: string;
  imageUrl: string;
  sortIndex: number;
  categoryId?: string;
  subCategoryId?: string;
  search?: string;
};

export type CollectionProductFilter = {
  categoryId?: string;
  subCategoryId?: string;
  search?: string;
};

function getCategoryName(category: Category): string {
  if (Array.isArray(category.name)) return category.name.getName();
  if (typeof category.name === "string") return category.name;
  return category.code ?? "";
}

function getCollectionSearchText(collection: Collection): string {
  return normalizeTitle(
    [collection.title, collection.shortDescription, collection.description, ...(collection.tags ?? [])]
      .filter(Boolean)
      .join(" "),
  );
}

function pickCategoryFromKeywords(
  categories: Category[],
  categoryKeywords: string[],
): Pick<CollectionProductFilter, "categoryId" | "subCategoryId"> {
  const subMatch = findCategoryByKeywords(
    categories.filter((category) => category.parentId),
    categoryKeywords,
  );
  if (subMatch) {
    return {
      categoryId: subMatch.parentId ?? subMatch.id,
      subCategoryId: subMatch.parentId ? subMatch.id : undefined,
    };
  }

  const topMatch = findCategoryByKeywords(
    categories.filter((category) => !category.parentId),
    categoryKeywords,
  );
  if (topMatch) {
    return { categoryId: topMatch.id };
  }

  return {};
}

export function resolveCollectionProductFilter(
  categories: Category[],
  collection: Collection | null | undefined,
): CollectionProductFilter {
  if (!collection || categories.length === 0) return {};

  const searchText = getCollectionSearchText(collection);

  for (const rule of COLLECTION_CATEGORY_RULES) {
    if (rule.collectionKeywords.some((keyword) => searchText.includes(normalizeTitle(keyword)))) {
      const picked = pickCategoryFromKeywords(categories, rule.categoryKeywords);
      if (picked.categoryId) {
        return { ...picked, search: rule.search };
      }
    }
  }

  const presentation = findPresentationForCollection(collection);
  if (presentation?.categoryKeywords?.length) {
    const picked = pickCategoryFromKeywords(categories, presentation.categoryKeywords);
    if (picked.categoryId) {
      return { ...picked, search: presentation.search };
    }
  }

  for (const category of categories) {
    const categoryName = normalizeTitle(getCategoryName(category));
    const title = normalizeTitle(collection.title ?? "");
    if (!categoryName || !title) continue;
    if (categoryName.includes(title) || title.includes(categoryName)) {
      if (category.parentId) {
        return { categoryId: category.parentId, subCategoryId: category.id };
      }
      return { categoryId: category.id };
    }
  }

  return {};
}
function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

export function findCollectionByKeywords(
  collections: Collection[],
  keywords: string[],
): Collection | undefined {
  const normalizedKeywords = keywords.map(normalizeTitle);

  return collections.find((collection) => {
    const title = normalizeTitle(collection.title ?? "");
    const description = normalizeTitle(collection.shortDescription ?? collection.description ?? "");
    return normalizedKeywords.some(
      (keyword) => title.includes(keyword) || description.includes(keyword),
    );
  });
}

export function findPresentationForCollection(collection: Collection): HomeCollectionPresentation | undefined {
  const title = normalizeTitle(collection.title ?? "");
  const description = normalizeTitle(collection.shortDescription ?? collection.description ?? "");

  return HOME_COLLECTION_PRESENTATIONS.find((presentation) =>
    presentation.keywords.some(
      (keyword) => title.includes(normalizeTitle(keyword)) || description.includes(normalizeTitle(keyword)),
    ),
  );
}

export function findShortHeadingForCollection(collection: Collection): string | undefined {
  const searchText = getCollectionSearchText(collection);

  return COLLECTION_HOME_SHORT_HEADINGS.find((entry) =>
    entry.keywords.some((keyword) => searchText.includes(normalizeTitle(keyword))),
  )?.heading;
}

function getHomeCollectionDisplayOrder(collection: Collection): number {
  const searchText = getCollectionSearchText(collection);
  const match = COLLECTION_HOME_SHORT_HEADINGS.find((entry) =>
    entry.keywords.some((keyword) => searchText.includes(normalizeTitle(keyword))),
  );
  return match?.order ?? collection.sortIndex ?? Number.MAX_SAFE_INTEGER;
}

export function resolveHomeCollection(
  collection: Collection,
  categories: Category[] = [],
): ResolvedHomeCollection {
  const presentation = findPresentationForCollection(collection);
  const shortHeading = findShortHeadingForCollection(collection);
  const productFilter = resolveCollectionProductFilter(categories, collection);
  const title = collection.title?.trim() || "Koleksiyon";

  const href = collection.id ? `/koleksiyon/${collection.id}` : "/koleksiyon";

  return {
    id: collection.id,
    href,
    eyebrow: presentation?.eyebrow ?? "İmza Seri",
    heading: presentation?.heading ?? shortHeading ?? title,
    tagline: "",
    ctaLabel: presentation?.ctaLabel ?? "Koleksiyonu Keşfet",
    imageUrl: getCollectionImageUrl(collection),
    sortIndex: collection.sortIndex ?? Number.MAX_SAFE_INTEGER,
    categoryId: productFilter.categoryId,
    subCategoryId: productFilter.subCategoryId,
    search: productFilter.search,
  };
}

export function resolveHomeCollections(
  collections: Collection[],
  categories: Category[] = [],
): ResolvedHomeCollection[] {
  return [...collections]
    .sort((a, b) => getHomeCollectionDisplayOrder(a) - getHomeCollectionDisplayOrder(b))
    .map((collection) => resolveHomeCollection(collection, categories));
}
export function resolveFooterCollectionLinks(collections: Collection[]) {
  return FOOTER_COLLECTION_MATCHES.map(({ label, keywords }) => {
    const match = findCollectionByKeywords(collections, keywords);

    return {
      label,
      href: match?.id ? `/koleksiyon/${match.id}` : "/koleksiyon",
    };
  });
}

function hasMediaTag(mediaRelated: MediaRelated, value: string) {
  return Array.isArray(mediaRelated?.tag)
    ? mediaRelated.tag.includes(value)
    : typeof mediaRelated?.tag === "string" && mediaRelated.tag === value;
}

export function getCollectionImageUrl(collection: Collection): string {
  const mobileMedia = collection.mediaRelateds?.find((item) => hasMediaTag(item, "mobile"))?.media
    ?.relativePath;
  const webMedia = collection.mediaRelateds?.find((item) => hasMediaTag(item, "web"))?.media
    ?.relativePath;
  const defaultMedia =
    mobileMedia ?? webMedia ?? first(collection.mediaRelateds ?? [])?.media?.relativePath;
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL?.replace(/\/$/, "");

  if (storageUrl && defaultMedia) {
    return `${storageUrl}/${defaultMedia}`;
  }

  return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop";
}
