"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Loader2, ArrowRight, ChevronRight, User } from "lucide-react";
import { useArticle, useProduct } from "@raxonltd/raxon-core/hook";
import type { Product as CustomProduct } from "@raxonltd/raxon-core/interface/product.interface";
import { Article, Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import BlogCover from "@/core/component/blog.cover";
import BlogShareButtons from "@/core/component/blog.share.buttons";
import { BlogSidebarArticles, BlogRecommendedArticles } from "@/core/component/blog/blog.related.articles";
import {
  BlogSidebarProducts,
  BlogArticleRelatedProducts,
} from "@/core/component/blog/blog.related.products";
import { getBlogPostBySlug } from "@/core/constant/blog.constant";
import {
  articleToDisplay,
  blogPostToDisplay,
  estimateReadMinutes,
  formatBlogDate,
  getSiteUrl,
  isArticleCurrentlyVisible,
  mergeVisibleBlogPosts,
} from "@/core/util/blog";

export default function BlogDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const localPost = id ? getBlogPostBySlug(id) : undefined;
  const isLocal = Boolean(localPost);

  const { data: article, isLoading, isError, error } = useArticle().detail(id);
  const { data: articlesData, isLoading: articlesLoading } = useArticle().fetch({ amount: 100, published: true });

  const apiArticle = article && typeof article === "object" && "id" in article ? (article as Article) : null;

  const displayPost = useMemo(() => {
    if (localPost) return blogPostToDisplay(localPost);
    if (apiArticle) return articleToDisplay(apiArticle);
    return null;
  }, [localPost, apiArticle]);

  const linkedIds = displayPost?.productIds ?? [];

  const { data: relatedByProductsData, isLoading: relatedByProductsLoading } = useArticle().fetch({
    productIds: linkedIds,
    published: true,
    amount: 6,
    enabled: linkedIds.length > 0 && !isLocal,
  });

  const relatedPosts = useMemo(() => {
    const fromProducts = mergeVisibleBlogPosts(relatedByProductsData?.data as Article[] | undefined).filter(
      (post) => post.slug !== id,
    );
    if (fromProducts.length > 0) return fromProducts.slice(0, 3);

    return mergeVisibleBlogPosts(articlesData?.data as Article[] | undefined)
      .filter((post) => post.slug !== id)
      .slice(0, 3);
  }, [relatedByProductsData?.data, articlesData, id]);

  const { data: catalogData, isLoading: catalogLoading } = useProduct().fetch({
    amount: 48,
    page: 1,
    status: Status.PUBLISHED,
    enabled: linkedIds.length > 0,
  });

  const linkedProducts = useMemo((): CustomProduct[] => {
    if (apiArticle?.products?.length) {
      return apiArticle.products as unknown as CustomProduct[];
    }
    if (linkedIds.length === 0) return [];
    const idSet = new Set(linkedIds);
    return (catalogData?.data ?? []).filter((product) => idSet.has(product.id));
  }, [apiArticle, catalogData?.data, linkedIds]);

  const articleProductIds = useMemo(
    () => linkedProducts.map((product) => product.id),
    [linkedProducts],
  );

  const isInactive =
    !isLocal &&
    !!apiArticle &&
    !isArticleCurrentlyVisible(apiArticle.status, apiArticle.startDate, apiArticle.endDate);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${displayPost?.slug ?? id}`
      : `${getSiteUrl()}/blog/${displayPost?.slug ?? id}`;

  const readMins = displayPost
    ? estimateReadMinutes(displayPost.content ?? displayPost.shortDescription ?? "")
    : 0;

  const showLoading = !isLocal && !!id && isLoading;
  const notFound = !isLocal && !!id && !isLoading && (isError || !displayPost);
  const showInactive = !!id && !!displayPost && isInactive;
  const relatedArticlesLoading = articlesLoading || relatedByProductsLoading;
  const productsLoading = catalogLoading && linkedIds.length > 0 && !apiArticle?.products?.length;

  return (
    <div className="min-h-screen bg-[#F8F1E9] pb-20 text-[#5C4638] selection:bg-[#C9A99A] selection:text-[#F8F1E9]">
      {!id && (
        <div className="mx-auto max-w-7xl px-6 py-16 text-center text-sm text-[#8B6B57]">
          Geçersiz adres.
        </div>
      )}

      {showLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-[#8B6B57]">
          <Loader2 className="animate-spin text-[#A17E65]" size={32} />
          <span className="text-xs uppercase tracking-[0.15em]">Yazı yükleniyor…</span>
        </div>
      )}

      {notFound && (
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-2xl border border-[#C9A99A]/40 bg-[#F5EDE4]/50 px-6 py-8 text-center text-sm text-[#5C4638]">
            Bu yazı yüklenemedi veya bulunamadı.
            {(error as Error)?.message && (
              <span className="mt-2 block text-xs opacity-80">{(error as Error).message}</span>
            )}
            <Link
              href="/blog"
              className="mt-6 inline-flex text-[11px] uppercase tracking-[0.2em] text-[#A17E65] hover:text-[#5C4638]"
            >
              Bloga dön
            </Link>
          </div>
        </div>
      )}

      {showInactive && (
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-2xl border border-[#C9A99A]/40 bg-[#F5EDE4]/50 px-6 py-8 text-center text-sm text-[#5C4638]">
            Bu yazı şu an yayında değil veya yayın süresi dolmuş.
            <Link
              href="/blog"
              className="mt-6 inline-flex text-[11px] uppercase tracking-[0.2em] text-[#A17E65] hover:text-[#5C4638]"
            >
              Bloga dön
            </Link>
          </div>
        </div>
      )}

      {!!id && displayPost && !showInactive && (
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:py-14">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B6B57]">
            <Link href="/" className="transition-colors hover:text-[#5C4638]">
              Ana Sayfa
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <Link href="/blog" className="transition-colors hover:text-[#5C4638]">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1 text-[#5C4638]">{displayPost.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <article className="lg:col-span-8">
              <header className="mb-8">
                <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.12em] text-[#A17E65]">
                  <span className="inline-flex items-center gap-1.5">
                    <User size={14} className="shrink-0" />
                    {displayPost.authorName}
                  </span>
                  <span className="text-[#D9C5B0]">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="shrink-0" />
                    {formatBlogDate(displayPost.createdAt)}
                  </span>
                  <span className="text-[#D9C5B0]">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} className="shrink-0" />
                    {readMins} dk okuma
                  </span>
                </div>
                <h1 className="font-serif text-3xl leading-tight text-[#5C4638] sm:text-4xl lg:text-5xl">
                  {displayPost.title}
                </h1>
                {displayPost.shortDescription && (
                  <p className="mt-4 text-sm leading-relaxed text-[#8B6B57] sm:text-base">
                    {displayPost.shortDescription}
                  </p>
                )}
              </header>

              <div className="relative mb-10 aspect-[21/9] max-h-[420px] w-full overflow-hidden rounded-2xl bg-[#EDE0D1]">
                <BlogCover
                  src={displayPost.coverUrl}
                  alt={displayPost.title}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 800px"
                  priority
                />
              </div>

              {displayPost.content && (
                <div
                  className="text-[17px] leading-relaxed text-[#5C4638] [&_a]:text-[#A17E65] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#D9C5B0] [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-[#5C4638] [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-[#5C4638] [&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:font-semibold [&_img]:max-w-full [&_img]:rounded-xl [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
                  dangerouslySetInnerHTML={{ __html: displayPost.content }}
                />
              )}

              {!displayPost.content && displayPost.shortDescription && (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#8B6B57]">
                  {displayPost.shortDescription}
                </p>
              )}

              <div className="mt-10 border-t border-[#D9C5B0]/40 pt-6">
                <BlogShareButtons url={shareUrl} title={displayPost.title} />
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[#D9C5B0]/40 pt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#5C4638] transition hover:text-[#A17E65]"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" strokeWidth={1.5} />
                  Tüm yazılara dön
                </Link>
              </div>
            </article>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <BlogSidebarProducts products={linkedProducts} isLoading={productsLoading} />
                <BlogSidebarArticles posts={relatedPosts} isLoading={relatedArticlesLoading} />
              </div>
            </aside>
          </div>

          <BlogArticleRelatedProducts
            sourceProductIds={articleProductIds.length > 0 ? articleProductIds : linkedIds}
            excludeIds={articleProductIds.length > 0 ? articleProductIds : linkedIds}
            linkedProducts={linkedProducts}
            linkedLoading={productsLoading}
          />

          <BlogRecommendedArticles
            posts={mergeVisibleBlogPosts(articlesData?.data as Article[] | undefined)}
            isLoading={articlesLoading}
            excludeSlugs={[id]}
            title="Diğer Önerilen Yazılar"
          />
        </div>
      )}
    </div>
  );
}
