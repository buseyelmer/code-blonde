import type { MetadataRoute } from "next";
import { fetchRaxonBootstrap } from "@raxonltd/raxon-core";
import { absoluteSiteUrl, getSiteUrl } from "@/core/constant/site.constant";
import { getAllBlogSlugs } from "@/core/constant/blog.constant";
import { flattenCategories, getCategorySlug } from "@/core/util/category";
import type { Category } from "@raxonltd/raxon-core/interface/prisma.interface";

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/urunler", changeFrequency: "daily", priority: 0.9 },
  { path: "/koleksiyon", changeFrequency: "weekly", priority: 0.8 },
  { path: "/hakkimizda", changeFrequency: "monthly", priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/iletisim", changeFrequency: "monthly", priority: 0.6 },
  { path: "/sss", changeFrequency: "monthly", priority: 0.5 },
  { path: "/sozlesmeler/mesafeli-satis", changeFrequency: "yearly", priority: 0.3 },
  { path: "/sozlesmeler/gizlilik-sozlesmesi", changeFrequency: "yearly", priority: 0.3 },
  { path: "/sozlesmeler/kullanim-sartlari", changeFrequency: "yearly", priority: 0.3 },
  { path: "/sozlesmeler/kargo-teslimat", changeFrequency: "yearly", priority: 0.3 },
  { path: "/sozlesmeler/iade-degisim", changeFrequency: "yearly", priority: 0.3 },
  { path: "/sozlesmeler/cerez-politikasi", changeFrequency: "yearly", priority: 0.3 },
];

type BootstrapProduct = {
  id: string;
  slug?: string | null;
  updatedAt?: string | null;
};

async function loadBootstrap() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (!apiUrl || !apiKey) return null;

  try {
    return await fetchRaxonBootstrap(apiUrl, apiKey, {
      next: { revalidate: 3600 },
    });
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const siteUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: absoluteSiteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }));

  for (const slug of getAllBlogSlugs()) {
    entries.push({
      url: absoluteSiteUrl(`/blog/${slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  const bootstrap = await loadBootstrap();
  const categories = flattenCategories((bootstrap?.category ?? []) as Category[]);
  for (const category of categories) {
    entries.push({
      url: absoluteSiteUrl(`/urunler/kategori/${getCategorySlug(category, categories)}`),
      lastModified: category.updatedAt ? new Date(category.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  const products = (bootstrap?.product ?? []) as BootstrapProduct[];
  for (const product of products) {
    if (!product.id) continue;
    const path =
      product.slug?.trim()
        ? `/${product.slug.trim()}-${product.id}`
        : `/urunler/${product.id}`;
    entries.push({
      url: `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
