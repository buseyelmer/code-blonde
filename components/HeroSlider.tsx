"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { heroSlides } from "@/lib/data";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

const AUTOPLAY_MS = 6000;

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = heroSlides.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const timer = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [goNext]);

  const slide = heroSlides[activeIndex];

  return (
    <section
      className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      aria-label="Öne çıkan kampanyalar"
      aria-roledescription="carousel"
    >
      <div className="overflow-hidden rounded-3xl bg-powder">
        <div className="relative grid min-h-[420px] md:min-h-[460px] lg:grid-cols-2 lg:min-h-[500px]">
          <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 text-center md:px-10 lg:px-14">
            <p className="text-sm font-medium tracking-wide text-gold">
              {slide.label}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {slide.title}
            </h1>
            <p className="mt-2 text-lg font-light text-charcoal/70">
              {slide.subtitle}
            </p>
            <p className="mt-4 max-w-sm text-base text-muted">
              {slide.description}
            </p>
            <Link
              href="/peelingler"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-charcoal bg-cream px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:border-gold hover:bg-white"
            >
              {slide.cta}
            </Link>

            <div className="mt-10 flex items-center gap-4 self-center lg:absolute lg:bottom-8 lg:left-14 lg:mt-0">
              <span className="min-w-[2.5rem] text-sm tabular-nums text-muted">
                {activeIndex + 1}/{total}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stone bg-cream/80 text-charcoal transition-colors hover:bg-white"
                  aria-label="Önceki slayt"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stone bg-cream/80 text-charcoal transition-colors hover:bg-white"
                  aria-label="Sonraki slayt"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="relative flex items-end justify-center px-4 pb-4 pt-2 sm:px-8 sm:pb-8 lg:items-center lg:justify-end lg:p-8">
            <div className="relative aspect-square w-full max-w-[340px] overflow-hidden rounded-sm border-2 border-gold-light shadow-sm sm:max-w-[380px] lg:max-w-[420px]">
              {heroSlides.map((item, index) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                  aria-hidden={index !== activeIndex}
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 1024px) 90vw, 420px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2 lg:justify-start lg:pl-2">
        {heroSlides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex
                ? "w-8 bg-charcoal"
                : "w-1.5 bg-stone hover:bg-muted"
            }`}
            aria-label={`Slayt ${index + 1}`}
            aria-current={index === activeIndex}
          />
        ))}
      </div>
    </section>
  );
}
