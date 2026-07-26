import type { Category } from "@raxonltd/raxon-core/interface/prisma.interface";
import { getCategoryHref } from "@/core/util/category";

export type FooterCategoryMatch = {
  label: string;
  keywords: string[];
};

export type FooterNavLink = {
  label: string;
  href: string;
};

export const FOOTER_FEATURED_CATEGORIES: FooterCategoryMatch[] = [
  { label: "Saç Bakım & Onarım", keywords: ["saç bakım", "sac bakim", "onarım", "onarim", "saç bakım & onarım"] },
  { label: "Saç Şekillendirme", keywords: ["saç şekillendirme", "sac sekillendirme", "şekillendirme", "sekillendirme"] },
  { label: "Cilt Bakım", keywords: ["cilt bakım", "cilt bakim", "cilt"] },
  { label: "Vücut Bakım", keywords: ["vücut bakım", "vucut bakim", "vücut", "vucut"] },
];

export const FOOTER_HELP_LINKS: FooterNavLink[] = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Sıkça Sorulan Sorular", href: "/sss" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Kargo & Teslimat", href: "/sozlesmeler/kargo-teslimat" },
  { label: "İade & Değişim", href: "/sozlesmeler/iade-degisim" },
];

export const FOOTER_LEGAL_LINKS: FooterNavLink[] = [
  { label: "Mesafeli Satış Sözleşmesi", href: "/sozlesmeler/mesafeli-satis" },
  { label: "Gizlilik Politikası", href: "/sozlesmeler/gizlilik-sozlesmesi" },
  { label: "Kullanım Şartları", href: "/sozlesmeler/kullanim-sartlari" },
  { label: "Çerez Politikası", href: "/sozlesmeler/cerez-politikasi" },
];

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

function getCategoryName(category: Category): string {
  if (Array.isArray(category.name)) return category.name.getName();
  if (typeof category.name === "string") return category.name;
  return category.code ?? "";
}

export function findCategoryByKeywords(
  categories: Category[],
  keywords: string[],
): Category | undefined {
  const normalizedKeywords = keywords.map(normalizeTitle);

  return categories.find((category) => {
    const name = normalizeTitle(getCategoryName(category));
    const code = normalizeTitle(category.code ?? "");
    return normalizedKeywords.some((keyword) => name.includes(keyword) || code.includes(keyword));
  });
}

export function resolveFooterCategoryLinks(categories: Category[]) {
  const topLevel = categories.filter((category) => !category.parentId);

  return FOOTER_FEATURED_CATEGORIES.map(({ label, keywords }) => {
    const match = findCategoryByKeywords(topLevel, keywords);

    return {
      label,
      href: match ? getCategoryHref(match, topLevel) : "/urunler",
    };
  });
}
