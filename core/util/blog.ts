import type { Article } from "@raxonltd/raxon-core/interface/prisma.interface";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import { resolveArticleCoverUrl } from "@/core/component/blog.cover";
import { BLOG_POSTS, type BlogPost } from "@/core/constant/blog.constant";

export const BLOG_PAGE_SIZE = 6;
export const DEFAULT_BLOG_AUTHOR = "Code Blonde";

export type BlogDisplayPost = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  content: string | null;
  createdAt: string;
  coverUrl: string | null;
  authorName: string;
  status: Status | "LOCAL";
  startDate: string | null;
  endDate: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string[];
  productIds: string[];
};

export function formatBlogDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export function estimateReadMinutes(content: string | null | undefined): number {
  if (!content) return 1;
  const text = content.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function resolveAuthorName(article: Article | null | undefined): string {
  const user = article?.author;
  if (!user) return DEFAULT_BLOG_AUTHOR;
  const first = (user as { firstName?: string | null }).firstName?.trim() ?? "";
  const last = (user as { lastName?: string | null }).lastName?.trim() ?? "";
  const full = `${first} ${last}`.trim();
  if (full) return full;
  const email = (user as { email?: string | null }).email?.trim();
  return email || DEFAULT_BLOG_AUTHOR;
}

export function isArticleCurrentlyVisible(
  status: Status | "LOCAL" | string | null | undefined,
  startDate?: string | null,
  endDate?: string | null,
  now = new Date(),
): boolean {
  if (status === "LOCAL") return true;

  const activeStatuses = new Set<string>([Status.PUBLISHED, Status.ACTIVE]);
  if (!status || !activeStatuses.has(status)) return false;

  if (startDate) {
    const start = new Date(startDate);
    if (!Number.isNaN(start.getTime()) && start.getTime() > now.getTime()) return false;
  }

  if (endDate) {
    const end = new Date(endDate);
    if (!Number.isNaN(end.getTime()) && end.getTime() < now.getTime()) return false;
  }

  return true;
}

export function blogPostToDisplay(post: BlogPost): BlogDisplayPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    createdAt: post.publishedAt,
    coverUrl: post.coverUrl,
    authorName: post.authorName ?? DEFAULT_BLOG_AUTHOR,
    status: "LOCAL",
    startDate: null,
    endDate: null,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    metaKeywords: post.metaKeywords,
    productIds: post.productIds ?? [],
  };
}

export function articleToDisplay(post: Article): BlogDisplayPost {
  return {
    id: post.id,
    slug: post.slug ?? post.id,
    title: post.title ?? "Başlıksız",
    shortDescription: post.shortDescription,
    content: post.content,
    createdAt: post.createdAt,
    coverUrl: resolveArticleCoverUrl(post),
    authorName: resolveAuthorName(post),
    status: post.status,
    startDate: post.startDate,
    endDate: post.endDate,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    metaKeywords: post.metaKeywords,
    productIds: post.products?.map((p) => p.id).filter(Boolean) ?? [],
  };
}

export function mergeVisibleBlogPosts(apiArticles: Article[] | undefined | null): BlogDisplayPost[] {
  const localPosts = BLOG_POSTS.map(blogPostToDisplay).filter((p) =>
    isArticleCurrentlyVisible(p.status, p.startDate, p.endDate),
  );

  const apiPosts = (apiArticles ?? [])
    .map(articleToDisplay)
    .filter((p) => isArticleCurrentlyVisible(p.status, p.startDate, p.endDate));

  const localSlugs = new Set(localPosts.map((p) => p.slug));
  const merged = [...localPosts, ...apiPosts.filter((p) => !localSlugs.has(p.slug))];

  return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function paginatePosts<T>(items: T[], page: number, pageSize = BLOG_PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    page: safePage,
    totalPages,
    total,
    items: items.slice(start, start + pageSize),
  };
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://codeblonde.com";
}
