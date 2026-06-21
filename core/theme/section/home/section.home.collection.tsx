"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRaxon } from "@raxonltd/raxon-core";
import { resolveHomeCollections } from "@/core/constant/collection.constant";

export default function SectionHomeCollection() {
  const { collection, category = [], flatCategory = [], isLoading } = useRaxon();
  const categories = flatCategory.length > 0 ? flatCategory : category;
  const collections = resolveHomeCollections(collection ?? [], categories);

  if (isLoading || collections.length === 0) {
    return null;
  }

  const sectionSubtitle =
    collections.length === 1
      ? "Cilt ve saç için özenle seçilmiş imza serimizle tanışın."
      : "Saç bakımından cilde, parfüme — günlük güzellik ritualiniz için üç imza seri.";

  return (
    <section id="koleksiyon" className="pt-14 pb-14 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:mb-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.3em] uppercase text-[#A17E65]">Koleksiyonlar</p>
            <h2 className="mt-4 font-serif text-4xl text-[#5C4638] sm:mt-3 lg:text-5xl">İmza Serilerimiz</h2>
            <p className="mt-5 max-w-lg text-[#8B6B57] sm:mt-4">{sectionSubtitle}</p>
          </div>
          <Link
            href="/koleksiyon"
            className="inline-flex shrink-0 items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B6B57] transition-all hover:gap-3 hover:text-[#5C4638]"
          >
            Tüm Koleksiyonlar
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {collections.map((col, idx) => (
            <Link
              key={col.id || idx}
              href={col.href}
              className="group relative overflow-hidden rounded-2xl"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={col.imageUrl}
                  alt={col.heading}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#5C4638]/75 via-[#5C4638]/20 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="text-[10px] tracking-[0.28em] uppercase text-white/70">{col.eyebrow}</p>
                <h3 className="mt-2 font-serif text-3xl text-white">{col.heading}</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/90 transition-all group-hover:gap-3">
                  {col.ctaLabel}
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
