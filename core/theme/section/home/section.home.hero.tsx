"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRaxon } from "@raxonltd/raxon-core";
import type { Collection } from "@raxonltd/raxon-core/interface/prisma.interface";
import first from "lodash/first";
import { isBannerCollection } from "@/core/constant/collection.constant";

const AUTO_MS = 5500;
const MAX_SLIDES = 5;

function hasMediaTag(
  mediaRelated: { tag?: string | string[] | null } | null | undefined,
  value: string,
) {
  return Array.isArray(mediaRelated?.tag)
    ? mediaRelated.tag.includes(value)
    : typeof mediaRelated?.tag === "string" && mediaRelated.tag === value;
}

function getBannerImageUrl(collection: Collection): string | null {
  const webMedia = collection.mediaRelateds?.find((item) => hasMediaTag(item, "web"))?.media
    ?.relativePath;
  const mobileMedia = collection.mediaRelateds?.find((item) => hasMediaTag(item, "mobile"))?.media
    ?.relativePath;
  const relativePath =
    webMedia ?? mobileMedia ?? first(collection.mediaRelateds ?? [])?.media?.relativePath;
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL?.replace(/\/$/, "");

  if (!storageUrl || !relativePath) return null;
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  return `${storageUrl}/${relativePath}`;
}

type HeroSlide = {
  id: string;
  title: string;
  href: string;
  image: string;
};

function toSlide(collection: Collection): HeroSlide | null {
  const image = getBannerImageUrl(collection);
  if (!image) return null;
  return {
    id: collection.id,
    title: collection.title?.trim() || "Code Blonde",
    href: `/koleksiyon/${collection.id}`,
    image,
  };
}

function bannerSortValue(collection: Collection): number {
  if (typeof collection.sortIndex === "number") return collection.sortIndex;
  return Number.MAX_SAFE_INTEGER;
}

export default function SectionHomeHero() {
  const { banner = [], collection = [] } = useRaxon();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = useMemo<HeroSlide[]>(() => {
    const byId = new Map<string, Collection>();

    for (const item of [...banner, ...collection]) {
      if (!isBannerCollection(item)) continue;
      byId.set(item.id, item);
    }

    return Array.from(byId.values())
      .sort((a, b) => {
        const bySort = bannerSortValue(a) - bannerSortValue(b);
        if (bySort !== 0) return bySort;
        return String(a.createdAt ?? "").localeCompare(String(b.createdAt ?? ""));
      })
      .map(toSlide)
      .filter((item): item is HeroSlide => item !== null)
      .slice(0, MAX_SLIDES);
  }, [banner, collection]);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  const goTo = (next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  };

  return (
    <section
      className="relative h-[calc(100svh-8rem)] w-full overflow-hidden bg-[#E8C4B0] lg:h-[calc(100svh-9.25rem)]"
      aria-roledescription="carousel"
      aria-label="Ana sayfa vitrin"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Link href={slide.href} className="absolute inset-0 block" aria-label={slide.title}>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={i === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </Link>
          </div>
        ))}

        {slides.length > 1 ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-end px-5 pb-8 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
            <div className="pointer-events-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/30"
                aria-label="Önceki görsel"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center gap-2 px-1" role="tablist" aria-label="Vitrin slaytları">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Slayt ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === index ? "w-8 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/30"
                aria-label="Sonraki görsel"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
