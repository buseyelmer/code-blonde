"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogCover from "@/core/component/blog.cover";
import { formatBlogDate, type BlogDisplayPost } from "@/core/util/blog";

function ArticleCard({ post, compact = false }: { post: BlogDisplayPost; compact?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-3 rounded-xl p-2 transition-colors hover:bg-[#EDE0D1]/50"
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-lg bg-[#EDE0D1] ${
          compact ? "h-20 w-20" : "h-24 w-24 sm:h-28 sm:w-28"
        }`}
      >
        <BlogCover
          src={post.coverUrl}
          alt={post.title}
          sizes={compact ? "80px" : "112px"}
          imageClassName="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h4
          className={`line-clamp-2 font-medium leading-snug text-[#5C4638] transition-colors group-hover:text-[#A17E65] ${
            compact ? "text-sm" : "text-base sm:text-lg"
          }`}
        >
          {post.title}
        </h4>
        <p className="mt-1 text-[11px] text-[#A17E65]">{formatBlogDate(post.createdAt)}</p>
        {!compact && post.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-[#8B6B57]">{post.shortDescription}</p>
        )}
      </div>
    </Link>
  );
}

export function BlogSidebarArticles({
  posts,
  isLoading,
}: {
  posts: BlogDisplayPost[];
  isLoading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 p-6">
      <p className="text-[10px] tracking-[0.32em] uppercase text-[#A17E65]">Keşfet</p>
      <h3 className="mt-1 font-serif text-xl text-[#5C4638]">Önerilen Yazılar</h3>
      <div className="mt-5">
        {isLoading && posts.length === 0 && (
          <p className="text-xs text-[#8B6B57]">Yazılar yükleniyor…</p>
        )}
        {!isLoading && posts.length === 0 && (
          <p className="text-xs text-[#8B6B57]">Başka yazı bulunmuyor.</p>
        )}
        {posts.length > 0 && (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BlogRecommendedArticles({
  posts,
  isLoading,
  title = "Önerilen Yazılar",
  eyebrow = "Blog & Rehber",
  excludeSlugs = [],
}: {
  posts: BlogDisplayPost[];
  isLoading?: boolean;
  title?: string;
  eyebrow?: string;
  excludeSlugs?: string[];
}) {
  const excluded = new Set(excludeSlugs);
  const list = posts.filter((post) => !excluded.has(post.slug)).slice(0, 3);

  if (!isLoading && list.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#D9C5B0]/50 pt-12">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.38em] uppercase text-[#A17E65]">{eyebrow}</p>
          <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#5C4638] sm:text-3xl">{title}</h2>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#5C4638] transition hover:text-[#A17E65]"
        >
          Tümünü Gör
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-[#EDE0D1]/80" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {list.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
