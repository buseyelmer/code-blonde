'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Loader2, ArrowRight } from 'lucide-react';
import { useArticle, useProduct } from '@raxonltd/raxon-core/hook';
import type { Product as CustomProduct } from '@raxonltd/raxon-core/interface/product.interface';
import { Article, MediaRelated, Status } from '@raxonltd/raxon-core/interface/prisma.interface';
import first from 'lodash/first';
import ItemProduct from '@/core/theme/item/item.general.product';

function formatPublishedAt(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function estimateReadMinutes(content: string | null | undefined): number {
  if (!content) return 1;
  const text = content.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  const { data: article, isLoading, isError, error } = useArticle().detail(id);

  
  // İlişkili yazılar (API’den gelen liste; mevcut yazı hariç)
  const { data: articlesData, isLoading: articlesLoading } = useArticle().fetch({ amount: 12 });
  const relatedArticles = articlesData?.data ? (articlesData.data as Article[]).filter(a => String(a.id) !== String(id)).slice(0, 3) : [];

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

  let mobileCover = article?.mediaRelateds?.find((it: MediaRelated) => it.tag && it.tag.includes('mobile'))?.media;
  let webCover = article?.mediaRelateds?.find((it: MediaRelated) => it.tag && it.tag.includes('web'))?.media;
  let defaultCover = mobileCover ?? webCover ?? first(article?.mediaRelateds)?.media;
  const coverUrl = defaultCover ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${defaultCover.relativePath}` : 'https://placehold.co/1680x720/png';

  const readMins = article ? estimateReadMinutes(article.content ?? article.shortDescription ?? '') : 0;

  return (
    <div className="pb-20">
      {!id && <div className="mx-auto max-w-7xl px-4 py-16 text-center text-[12px] text-neutral-600">Geçersiz adres.</div>}

      {!!id && isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-neutral-500">
          <Loader2 className="animate-spin text-rose-900" size={32} />
          <span className="text-[12px] text-neutral-600">Yazı yükleniyor…</span>
        </div>
      )}

      {!!id && isError && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="rounded-2xl border border-red-100 bg-red-50/80 px-6 py-8 text-center text-[12px] text-red-800">
            Bu yazı yüklenemedi veya bulunamadı.
            {(error as Error)?.message && <span className="mt-2 block text-[12px] opacity-80">{(error as Error).message}</span>}
          </div>
        </div>
      )}



      {!!id && !isLoading && !isError && article && 'id' in article && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Ana içerik - Sol taraf */}
            <article className="lg:col-span-8">
              <header className="mb-8">
                <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-neutral-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="shrink-0" />
                    {formatPublishedAt(article.createdAt)}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} className="shrink-0" />
                    {readMins} dk okuma
                  </span>
                </div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">{article.title ?? 'Başlıksız'}</h1>
                {article.shortDescription && <p className="mt-4 text-sm leading-relaxed text-neutral-600">{article.shortDescription}</p>}
              </header>

              <div className="relative w-full aspect-[21/9] max-h-[420px] rounded-2xl overflow-hidden bg-neutral-100 ring-1 ring-black/5 mb-10">
                <Image
                  src={coverUrl}
                  alt={article.title ?? ''}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
              </div>

              {article.content && (
                <div
                  className="text-[17px] leading-relaxed text-neutral-800 [&_p]:mb-4 [&_ul]:my-4 [&_ol]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-neutral-900 [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-neutral-900 [&_h4]:mt-6 [&_h4]:font-semibold [&_h4]:tracking-tight [&_a]:text-rose-900 [&_a]:underline [&_img]:max-w-full [&_img]:rounded-xl [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-200 [&_blockquote]:pl-4 [&_blockquote]:italic"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              )}

              {!article.content && article.shortDescription && <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">{article.shortDescription}</p>}

              {!article.content && !article.shortDescription && <p className="text-[12px] text-neutral-500">Bu yazı için içerik henüz eklenmemiş.</p>}
            </article>

            {/* Sidebar - Sağ taraf */}
            <aside className="lg:col-span-4">
              <div className="mb-10 sticky top-24">
                <h3 className="mb-4 text-lg font-semibold tracking-tight text-neutral-900">İlişkili Yazılar</h3>
                {articlesLoading && <p className="text-[12px] text-neutral-500">Yazılar yükleniyor…</p>}
                {!articlesLoading && relatedArticles.length === 0 && <p className="text-[12px] text-neutral-500">Başka yazı bulunmuyor.</p>}
                {!articlesLoading && relatedArticles.length > 0 && (
                  <div className="flex flex-col gap-5">
                    {relatedArticles.map(post => {
                      const postCover = post.mediaRelateds?.[0]?.media?.relativePath ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.mediaRelateds[0].media.relativePath}` : 'https://placehold.co/160x160/png';
                      return (
                        <Link key={post.id} href={`/blog/${post.id}`} className="group flex gap-3 rounded-xl overflow-hidden hover:bg-neutral-50 transition-colors p-2 -m-2">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0 relative">
                            <Image
                              src={postCover}
                              alt={post.title ?? ''}
                              fill
                              sizes="80px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-rose-900">{post.title ?? 'Başlıksız'}</h4>
                            <p className="mt-1 text-[12px] text-neutral-500">{formatPublishedAt(post.createdAt)}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* İlginizi Çekebilecek Ürünler — useProduct().fetch */}
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">İlginizi Çekebilir</h2>
              <Link href="/urunler" className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.22em] text-neutral-600 transition hover:text-neutral-900">
                Tümünü Gör
                <ArrowRight size={14} />
              </Link>
            </div>
            {featuredProductsLoading && <p className="text-[12px] text-neutral-500">Ürünler yükleniyor…</p>}
            {!featuredProductsLoading && featuredProducts.length === 0 && <p className="text-[12px] text-neutral-500">Şu an önerilecek ürün bulunmuyor.</p>}
            {!featuredProductsLoading && featuredProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map(product => (
                  <ItemProduct key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Bunlar da İlginizi Çekebilir */}
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Bunlar da İlginizi Çekebilir</h2>
              <Link href="/urunler" className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.22em] text-neutral-600 transition hover:text-neutral-900">
                Tümünü Gör
                <ArrowRight size={14} />
              </Link>
            </div>
            {otherProductsLoading && <p className="text-[12px] text-neutral-500">Ürünler yükleniyor…</p>}
            {!otherProductsLoading && otherProducts.length === 0 && <p className="text-[12px] text-neutral-500">Şu an önerilecek ürün bulunmuyor.</p>}
            {!otherProductsLoading && otherProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {otherProducts.map(product => (
                  <ItemProduct key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
