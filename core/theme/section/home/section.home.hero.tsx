'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRaxon } from '@raxonltd/raxon-core';
import first from 'lodash/first';
import { Collection } from '@raxonltd/raxon-core/interface/prisma.interface';

function getCollectionCoverPath(c: Collection): string | undefined {
  const path = first(c.mediaRelateds)?.media?.relativePath;
  return path != null ? path : undefined;
}

export function SectionHomeHero() {
  const { banner } = useRaxon();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const heroSlides = banner.slice(0, 5).map((b) => {
    const coverPath = getCollectionCoverPath(b);
    const coverUrl = coverPath
      ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${coverPath}`
      : 'https://placehold.co/1920x800';

    return {
      id: b.id,
      title: b.title || 'Yeni Koleksiyon',
      subtitle: b.shortDescription || 'Zarafet ve konforun buluşması',
      cta: 'Koleksiyonu Keşfet',
      image: coverUrl,
    };
  });

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning, currentSlide]
  );

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % heroSlides.length;
    goToSlide(next);
  }, [currentSlide, heroSlides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    goToSlide(prev);
  }, [currentSlide, heroSlides.length, goToSlide]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, heroSlides.length]);

  if (heroSlides.length === 0) return null;

  return (
    <section className="relative h-[85vh] min-h-[500px] max-h-[900px] overflow-hidden bg-white">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className={`object-cover object-[75%_center] sm:object-[70%_center] transition-transform duration-[8000ms] ease-out ${
              index === currentSlide ? 'scale-[1.03]' : 'scale-100'
            }`}
            priority={index === 0}
            fetchPriority={index === 0 ? 'high' : 'low'}
            loading={index === 0 ? 'eager' : 'lazy'}
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1920px"
            quality={85}
          />

          {/* Sol tam beyaz → sağa doğru beyaz opacity düşer, görsel ortaya çıkar */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_18%,rgba(255,255,255,0.97)_28%,rgba(255,255,255,0.75)_42%,rgba(255,255,255,0.28)_58%,rgba(255,255,255,0)_72%)] sm:bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_22%,rgba(255,255,255,0.96)_34%,rgba(255,255,255,0.65)_48%,rgba(255,255,255,0.2)_62%,rgba(255,255,255,0)_76%)]"
            aria-hidden
          />

          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-md lg:max-w-lg pr-4">
                <p
                  className={`text-[12px] font-semibold uppercase tracking-[0.22em] text-neutral-600 mb-4 transition-all duration-700 delay-100 ${
                    index === currentSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3'
                  }`}
                >
                  {slide.subtitle}
                </p>

                <h1
                  className={`text-4xl sm:text-5xl lg:text-6xl font-semibold text-neutral-900 tracking-tight leading-[1.1] mb-6 transition-all duration-700 delay-200 ${
                    index === currentSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  {slide.title}
                </h1>

                <div
                  className={`transition-all duration-700 delay-300 ${
                    index === currentSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <Link
                    href={`/koleksiyon/${slide.id}`}
                    className="group inline-flex items-center gap-2 bg-neutral-900 text-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 hover:bg-neutral-800"
                  >
                    {slide.cta}
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {heroSlides.length > 1 && (
        <>
          <div className="absolute bottom-10 left-6 z-20 flex items-center gap-2 sm:left-8 lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group relative h-[3px] overflow-hidden rounded-full transition-all duration-400"
                aria-label={`Slide ${index + 1}`}
              >
                <span
                  className={`block rounded-full transition-all duration-400 ${
                    index === currentSlide
                      ? 'w-10 bg-neutral-900/25'
                      : 'w-5 bg-neutral-900/15 group-hover:bg-neutral-900/25'
                  }`}
                  style={{ height: '3px' }}
                />
                {index === currentSlide && (
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-neutral-900"
                    style={{
                      height: '3px',
                      animation: 'hero-progress 6s linear forwards',
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-5 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-900 shadow-sm transition-all duration-300 hover:bg-white disabled:opacity-40"
            aria-label="Önceki"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-md text-neutral-900 transition-all duration-300 hover:bg-white/35 disabled:opacity-40"
            aria-label="Sonraki"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <style jsx global>{`
        @keyframes hero-progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
