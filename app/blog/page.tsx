'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock, Loader2 } from 'lucide-react';
import { useArticle } from '@raxonltd/raxon-core/hook';
import { Article, MediaRelated } from '@raxonltd/raxon-core/interface/prisma.interface';
import first from 'lodash/first';

const PLACEHOLDER_BLOG_CARD_MOBILE = 'https://placehold.co/1200x750/png';

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

export default function BlogListPage() {
  const { data, isLoading, isError } = useArticle().fetch();

  return (
    <div className="pb-20">
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">Blog & Rehber</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">Ürün bakımı, seçim rehberi ve güncel notlar — kısa yazılarla daha bilinçli alışveriş.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-neutral-500">
            <Loader2 className="animate-spin text-rose-900" size={32} />
            <span className="text-[12px] text-neutral-600">Yazılar yükleniyor…</span>
          </div>
        )}

        {isError && <div className="rounded-2xl border border-red-100 bg-red-50/80 px-6 py-8 text-center text-[12px] text-red-800">Yazılar yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</div>}

        {!isLoading && !isError && (!data?.data || data.data.length === 0) && <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center text-sm text-neutral-600">Henüz yayınlanmış yazı bulunmuyor.</div>}

        {!isLoading && !isError && data?.data && data.data.length > 0 && (
          <ul className="flex flex-col gap-10 lg:gap-12">
            {(data.data as Article[]).map(post => {
              const href = `/blog/${post.slug}`;
              let mobileCover = post.mediaRelateds?.find((it: MediaRelated) => it.tag && it.tag.includes('mobile'))?.media?.relativePath;
              let webCover = post.mediaRelateds?.find((it: MediaRelated) => it.tag && it.tag.includes('web'))?.media?.relativePath;
              let defaultCover = mobileCover ?? webCover ?? first(post.mediaRelateds)?.media?.relativePath;
              const cover = defaultCover ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${defaultCover}` : null;
              const coverAlt = post.title ?? 'Blog görseli';
              const mins = estimateReadMinutes(post.content ?? post.shortDescription ?? '');
              return (
                <li key={post.id}>
                  <article className="group grid gap-6 md:grid-cols-12 md:gap-8 items-start">
                    <Link href={href} className="md:col-span-5 block overflow-hidden rounded-2xl bg-neutral-100 aspect-[16/10] md:aspect-[4/3] relative ring-1 ring-black/5">
                      <Image
                        src={cover ?? PLACEHOLDER_BLOG_CARD_MOBILE}
                        alt={coverAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </Link>
                    <div className="md:col-span-7 flex flex-col min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-neutral-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={14} className="shrink-0" />
                          {formatPublishedAt(post.createdAt)}
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={14} className="shrink-0" />
                          {mins} dk okuma
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-rose-900 sm:text-2xl">
                        <Link href={href}>{post.title ?? 'Başlıksız'}</Link>
                      </h2>
                      {post.shortDescription && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">{post.shortDescription}</p>}
                      <Link href={href} className="mt-5 inline-flex w-fit items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-neutral-600 transition-all hover:gap-3 hover:text-neutral-900">
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
