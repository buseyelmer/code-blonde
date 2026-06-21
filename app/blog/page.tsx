"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock, Loader2, ChevronRight } from "lucide-react";
import { useArticle } from "@raxonltd/raxon-core/hook";
import { Article } from "@raxonltd/raxon-core/interface/prisma.interface";
import BlogCover, { resolveArticleCoverUrl } from "@/core/component/blog.cover";

function formatPublishedAt(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function estimateReadMinutes(content: string | null | undefined): number {
  if (!content) return 1;
  const text = content.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogListPage() {
  const { data, isLoading, isError } = useArticle().fetch();

  return (
    <div className="min-h-screen bg-[#F8F1E9] text-[#5C4638] selection:bg-[#C9A99A] selection:text-[#F8F1E9]">
      <div className="border-b border-[#D9C5B0]/50 bg-[#EDE0D1]/60">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B6B57]">
            <Link href="/" className="transition-colors hover:text-[#5C4638]">
              Ana Sayfa
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            <span className="text-[#5C4638]">Blog</span>
          </nav>
          <p className="text-xs tracking-[0.3em] uppercase text-[#A17E65]">Rehber & İlham</p>
          <h1 className="mt-3 font-serif text-4xl text-[#5C4638] sm:text-5xl">Blog & Rehber</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#8B6B57] sm:text-base">
            Ton seçimi, ürün bakımı ve nude makyaj ipuçları — kısa yazılarla daha bilinçli alışveriş.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-[#8B6B57]">
            <Loader2 className="animate-spin text-[#A17E65]" size={32} />
            <span className="text-xs tracking-[0.15em] uppercase">Yazılar yükleniyor…</span>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-[#C9A99A]/40 bg-[#F5EDE4]/50 px-6 py-8 text-center text-sm text-[#5C4638]">
            Yazılar yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
          </div>
        )}

        {!isLoading && !isError && (!data?.data || data.data.length === 0) && (
          <div className="rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 px-6 py-16 text-center text-sm text-[#8B6B57]">
            Henüz yayınlanmış yazı bulunmuyor.
          </div>
        )}

        {!isLoading && !isError && data?.data && data.data.length > 0 && (
          <ul className="flex flex-col gap-10 lg:gap-14">
            {(data.data as Article[]).map((post) => {
              const href = `/blog/${post.slug}`;
              const cover = resolveArticleCoverUrl(post);
              const coverAlt = post.title ?? "Blog görseli";
              const mins = estimateReadMinutes(post.content ?? post.shortDescription ?? "");

              return (
                <li key={post.id}>
                  <article className="group grid items-start gap-6 md:grid-cols-12 md:gap-8">
                    <Link
                      href={href}
                      className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-[#EDE0D1] md:col-span-5 md:aspect-[4/3]"
                    >
                      <BlogCover
                        src={cover}
                        alt={coverAlt}
                        sizes="(max-width: 768px) 100vw, 40vw"
                        imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-col md:col-span-7">
                      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.12em] text-[#A17E65]">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={14} className="shrink-0" />
                          {formatPublishedAt(post.createdAt)}
                        </span>
                        <span className="text-[#D9C5B0]">•</span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={14} className="shrink-0" />
                          {mins} dk okuma
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl text-[#5C4638] transition-colors group-hover:text-[#A17E65] sm:text-3xl">
                        <Link href={href}>{post.title ?? "Başlıksız"}</Link>
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
      </div>
    </div>
  );
}
