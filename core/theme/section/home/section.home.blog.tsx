'use client';

import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { useArticle } from '@raxonltd/raxon-core/hook';
import first from 'lodash/first';
import { useRaxon } from '@raxonltd/raxon-core';

export function SectionHomeBlog() {
  const { article } = useRaxon()

  const posts = article?.slice(0, 3) || [];

  if (posts.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight mb-4">Blog & Rehber</h2>
            <p className="text-sm text-neutral-600">Uzman tavsiyeleri ve bakım ipuçları</p>
          </div>
          <Link href="/blog" className="text-[12px] font-semibold uppercase tracking-[0.22em] text-neutral-600 transition hover:text-neutral-900 flex items-center gap-2 hover:gap-3">
            Tüm Yazılar
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(post => {
            let image = first(post.mediaRelateds)?.media?.relativePath;
            let fullPath = image ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${image}` : 'https://placehold.co/800x500';
            const raw = post.content ?? post.shortDescription ?? '';
            const words = raw
              .replace(/<[^>]+>/g, ' ')
              .trim()
              .split(/\s+/)
              .filter(Boolean).length;
            const readMins = Math.max(1, Math.ceil(words / 200));
            const dateLabel = post.createdAt ? new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
            return (
              <Link key={post.id} href={`/blog/${post.id}`} className="group block">
                <article>
                  <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-4">
                    <img src={fullPath} alt={post.title ?? ''} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 pointer-events-none">
                        <Play size={20} className="text-rose-900 ml-1" />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[12px] text-neutral-500 mb-3">
                    <span>{dateLabel}</span>
                    <span>•</span>
                    <span>{readMins} dk okuma</span>
                  </div>

                  <h3 className="text-lg font-semibold text-neutral-900 tracking-tight group-hover:text-rose-900 transition-colors mb-2">{post.title}</h3>

                  <p className="text-sm text-neutral-600 line-clamp-2">{post.shortDescription}</p>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
