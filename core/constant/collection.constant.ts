import type { Collection } from "@raxonltd/raxon-core/interface/prisma.interface";

export type FooterCollectionMatch = {
  label: string;
  keywords: string[];
};

export const FOOTER_COLLECTION_MATCHES: FooterCollectionMatch[] = [
  { label: "Velvet Nude", keywords: ["velvet nude", "velvet"] },
  { label: "Silk Glow", keywords: ["silk glow", "silk"] },
  { label: "Bare Essence", keywords: ["bare essence", "bare"] },
  { label: "Limited Editions", keywords: ["limited edition", "limited editions", "limited"] },
];

function normalizeTitle(value: string): string {
  return value.toLowerCase().trim();
}

export function findCollectionByKeywords(
  collections: Collection[],
  keywords: string[],
): Collection | undefined {
  const normalizedKeywords = keywords.map(normalizeTitle);

  return collections.find((collection) => {
    const title = normalizeTitle(collection.title ?? "");
    return normalizedKeywords.some((keyword) => title.includes(keyword));
  });
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
