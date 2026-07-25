"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Calendar, Clock, Loader2, ChevronRight, User } from "lucide-react";
import { useArticle } from "@raxonltd/raxon-core/hook";
import type { Article } from "@raxonltd/raxon-core/interface/prisma.interface";
import BlogCover from "@/core/component/blog.cover";
import {
  BLOG_PAGE_SIZE,
  estimateReadMinutes,
  formatBlogDate,
  mergeVisibleBlogPosts,
  paginatePosts,
} from "@/core/util/blog";
import { BlogRecommendedArticles } from "@/core/component/blog/blog.related.articles";
import { BlogListRecommendedProducts } from "@/core/component/blog/blog.related.products";

function BlogListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page") || "1");
  const requestedPage = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;

  const { data, isLoading, isError } = useArticle().fetch({ amount: 100 });

  const posts = useMemo(
    () => mergeVisibleBlogPosts(data?.data as Article[] | undefined),
    [data],
  );

  const { page, totalPages, total, items } = useMemo(
    () => paginatePosts(posts, requestedPage, BLOG_PAGE_SIZE),
    [posts, requestedPage],
  );

  useEffect(() => {
    if (requestedPage !== page) {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) params.delete("page");
      else params.set("page", String(page));
      const qs = params.toString();
      router.replace(qs ? `/blog?${qs}` : "/blog");
    }
  }, [page, requestedPage, router, searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));
    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : "/blog");
  };

  return (
    <div className="min-h-screen bg-[#F8F1E9] text-[#5C4638] selection:bg-[#C9A99A] selection:text-[#F8F1E9]">
      <div className="border-b border-[#D9C5B0]/50 bg-[#EDE0D1]/60">
        <div className="mx-auto max-w-5xl px-6 py-6 lg:px-8 lg:py-8">
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B6B57]">
            <Link href="/" className="transition-colors hover:text-[#5C4638]">
              Ana Sayfa
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            <span className="text-[#5C4638]">Blog</span>
          </nav>
          <h1 className="font-serif text-4xl text-[#5C4638] sm:text-5xl">Blog & Rehber</h1>
          {total > 0 && (
            <p className="mt-3 text-sm text-[#8B6B57]">
              {total.toLocaleString("tr-TR")} yazı · Sayfa {page} / {totalPages}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        {isLoading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-[#8B6B57]">
            <Loader2 className="animate-spin text-[#A17E65]" size={32} />
            <span className="text-xs uppercase tracking-[0.15em]">Yazılar yükleniyor…</span>
          </div>
        )}

        {isError && posts.length === 0 && (
          <div className="rounded-2xl border border-[#C9A99A]/40 bg-[#F5EDE4]/50 px-6 py-8 text-center text-sm text-[#5C4638]">
            Yazılar yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
          </div>
        )}

        {!isLoading && posts.length === 0 && !isError && (
          <div className="rounded-2xl border border-[#C9A99A]/40 bg-[#F5EDE4]/50 px-6 py-8 text-center text-sm text-[#5C4638]">
            Şu an yayınlanan blog yazısı bulunmuyor.
          </div>
        )}

        {items.length > 0 && (
          <ul className="flex flex-col gap-10 lg:gap-14">
            {items.map((post) => {
              const href = `/blog/${post.slug}`;
              const mins = estimateReadMinutes(post.content ?? post.shortDescription ?? "");

              return (
                <li key={post.id}>
                  <article className="group grid items-start gap-6 md:grid-cols-12 md:gap-8">
                    <Link
                      href={href}
                      className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-[#EDE0D1] md:col-span-5 md:aspect-[4/3]"
                    >
                      <BlogCover
                        src={post.coverUrl}
                        alt={post.title}
                        sizes="(max-width: 768px) 100vw, 40vw"
                        imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-col md:col-span-7">
                      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.12em] text-[#A17E65]">
                        <span className="inline-flex items-center gap-1.5">
                          <User size={14} className="shrink-0" />
                          {post.authorName}
                        </span>
                        <span className="text-[#D9C5B0]">•</span>
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={14} className="shrink-0" />
                          {formatBlogDate(post.createdAt)}
                        </span>
                        <span className="text-[#D9C5B0]">•</span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={14} className="shrink-0" />
                          {mins} dk okuma
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl text-[#5C4638] transition-colors group-hover:text-[#A17E65] sm:text-3xl">
                        <Link href={href}>{post.title}</Link>
                      </h2>
                      {post.shortDescription && (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#8B6B57]">
                          {post.shortDescription}
                        </p>
                      )}
                      <Link
                        href={href}
                        className="mt-5 inline-flex w-fit items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B6B57] transition-all hover:gap-3 hover:text-[#5C4638]"
                      >
                        Devamını oku
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Blog sayfalama"
            className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-[#D9C5B0]/40 pt-8"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              className="rounded-full border border-[#D9C5B0] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#5C4638] transition hover:border-[#5C4638] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Önceki
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => goToPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={`min-w-10 rounded-full px-3 py-2 text-xs tabular-nums transition ${
                  n === page
                    ? "bg-[#5C4638] text-[#F8F1E9]"
                    : "border border-[#D9C5B0] text-[#5C4638] hover:border-[#5C4638]"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
              className="rounded-full border border-[#D9C5B0] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#5C4638] transition hover:border-[#5C4638] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sonraki
            </button>
          </nav>
        )}

        <BlogRecommendedArticles
          posts={posts}
          isLoading={isLoading}
          excludeSlugs={items.map((post) => post.slug)}
          title="Önerilen Yazılar"
        />

        <BlogListRecommendedProducts />
      </div>
    </div>
  );
}

export default function BlogListPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-[#F8F1E9] text-[#8B6B57]">
          <Loader2 className="animate-spin text-[#A17E65]" size={32} />
        </div>
      }
    >
      <BlogListContent />
    </Suspense>
  );
}
