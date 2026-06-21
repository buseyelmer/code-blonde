"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Loader2, ArrowRight, ChevronRight } from "lucide-react";
import { useArticle, useProduct } from "@raxonltd/raxon-core/hook";
import type { Product as CustomProduct } from "@raxonltd/raxon-core/interface/product.interface";
import { Article, Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import ItemListingProduct from "@/core/theme/item/item.listing.product";
import BlogCover, { resolveArticleCoverUrl } from "@/core/component/blog.cover";
import { BLOG_POSTS, getBlogPostBySlug, type BlogPost } from "@/core/constant/blog.constant";

type DisplayPost = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  content: string | null;
  createdAt: string;
  coverUrl: string | null;
};

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

function blogPostToDisplay(post: BlogPost): DisplayPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    createdAt: post.publishedAt,
    coverUrl: post.coverUrl,
  };
}

function articleToDisplay(post: Article): DisplayPost {
  return {
    id: post.id,
    slug: post.slug ?? post.id,
    title: post.title ?? "Başlıksız",
    shortDescription: post.shortDescription,
    content: post.content,
    createdAt: post.createdAt,
    coverUrl: resolveArticleCoverUrl(post),
  };
}

export default function BlogDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const localPost = id ? getBlogPostBySlug(id) : undefined;
  const isLocal = Boolean(localPost);

  const { data: article, isLoading, isError, error } = useArticle().detail(id);
  const { data: articlesData, isLoading: articlesLoading } = useArticle().fetch({ amount: 12 });

  const displayPost = useMemo<DisplayPost | null>(() => {
    if (localPost) return blogPostToDisplay(localPost);
    if (article && "id" in article) return articleToDisplay(article as Article);
    return null;
  }, [localPost, article]);

  const relatedPosts = useMemo(() => {
    const local = BLOG_POSTS.map(blogPostToDisplay);
    const api = (articlesData?.data as Article[] | undefined)?.map(articleToDisplay) ?? [];
    const localSlugs = new Set(local.map((p) => p.slug));
    const merged = [...local, ...api.filter((p) => !localSlugs.has(p.slug))];
    return merged.filter((p) => p.slug !== id).slice(0, 3);
  }, [articlesData, id]);

  const { data: featuredProductsData, isLoading: featuredProductsLoading } = useProduct().fetch({
    amount: 4,
    page: 1,
    status: Status.PUBLISHED,
  });

  const { data: otherProductsData, isLoading: otherProductsLoading } = useProduct().fetch({
    amount: 4,
    page: 2,
    status: Status.PUBLISHED,
  });

  const featuredProducts: CustomProduct[] = featuredProductsData?.data?.slice(0, 4) ?? [];
  const otherProducts: CustomProduct[] = otherProductsData?.data?.slice(0, 4) ?? [];

  const readMins = displayPost
    ? estimateReadMinutes(displayPost.content ?? displayPost.shortDescription ?? "")
    : 0;

  const showLoading = !isLocal && !!id && isLoading;
  const showError = !isLocal && !!id && isError && !displayPost;

  return (
    <div className="min-h-screen bg-[#F8F1E9] text-[#5C4638] selection:bg-[#C9A99A] selection:text-[#F8F1E9] pb-20">
      {!id && (
        <div className="mx-auto max-w-7xl px-6 py-16 text-center text-sm text-[#8B6B57]">Geçersiz adres.</div>
      )}

      {showLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-[#8B6B57]">
          <Loader2 className="animate-spin text-[#A17E65]" size={32} />
          <span className="text-xs tracking-[0.15em] uppercase">Yazı yükleniyor…</span>
        </div>
      )}

      {showError && (
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-2xl border border-[#C9A99A]/40 bg-[#F5EDE4]/50 px-6 py-8 text-center text-sm text-[#5C4638]">
            Bu yazı yüklenemedi veya bulunamadı.
            {(error as Error)?.message && (
              <span className="mt-2 block text-xs opacity-80">{(error as Error).message}</span>
            )}
          </div>
        </div>
      )}

      {!!id && displayPost && (
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
                    <Calendar size={14} className="shrink-0" />
                    {formatPublishedAt(displayPost.createdAt)}
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
            </article>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-[#D9C5B0]/40 bg-[#F5EDE4]/30 p-6">
                <h3 className="font-serif text-xl text-[#5C4638]">İlişkili Yazılar</h3>
                {articlesLoading && relatedPosts.length === 0 && (
                  <p className="mt-4 text-xs text-[#8B6B57]">Yazılar yükleniyor…</p>
                )}
                {relatedPosts.length === 0 && !articlesLoading && (
                  <p className="mt-4 text-xs text-[#8B6B57]">Başka yazı bulunmuyor.</p>
                )}
                {relatedPosts.length > 0 && (
                  <div className="mt-5 flex flex-col gap-4">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex gap-3 rounded-xl p-2 transition-colors hover:bg-[#EDE0D1]/50"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#EDE0D1]">
                          <BlogCover
                            src={post.coverUrl}
                            alt={post.title}
                            sizes="80px"
                            imageClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-2 text-sm font-medium leading-snug text-[#5C4638] transition-colors group-hover:text-[#A17E65]">
                            {post.title}
                          </h4>
                          <p className="mt-1 text-[11px] text-[#A17E65]">
                            {formatPublishedAt(post.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>

          <div className="mt-16 border-t border-[#D9C5B0]/50 pt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#5C4638]">İlginizi Çekebilir</h2>
              <Link
                href="/urunler"
                className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B6B57] transition hover:text-[#5C4638]"
              >
                Tümünü Gör
                <ArrowRight size={14} />
              </Link>
            </div>
            {featuredProductsLoading && <p className="text-xs text-[#8B6B57]">Ürünler yükleniyor…</p>}
            {!featuredProductsLoading && featuredProducts.length === 0 && (
              <p className="text-xs text-[#8B6B57]">Şu an önerilecek ürün bulunmuyor.</p>
            )}
            {!featuredProductsLoading && featuredProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {featuredProducts.map((product, index) => (
                  <ItemListingProduct key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-16 border-t border-[#D9C5B0]/50 pt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#5C4638]">Bunlar da İlginizi Çekebilir</h2>
              <Link
                href="/urunler"
                className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B6B57] transition hover:text-[#5C4638]"
              >
                Tümünü Gör
                <ArrowRight size={14} />
              </Link>
            </div>
            {otherProductsLoading && <p className="text-xs text-[#8B6B57]">Ürünler yükleniyor…</p>}
            {!otherProductsLoading && otherProducts.length === 0 && (
              <p className="text-xs text-[#8B6B57]">Şu an önerilecek ürün bulunmuyor.</p>
            )}
            {!otherProductsLoading && otherProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {otherProducts.map((product, index) => (
                  <ItemListingProduct key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
