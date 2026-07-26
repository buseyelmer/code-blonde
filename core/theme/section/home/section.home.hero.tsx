"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/hero-1.jpg",
    alt: "Güzelliğin kodunu keşfet — laboratuvar estetiğinde Code Blonde bakım dünyası",
    title: "Güzelliğin kodunu keşfet.",
    subtitle: "İhtiyacın olan bakım, doğru içeriklerle bir araya geliyor.",
  },
  {
    src: "/hero-2.jpg",
    alt: "Güzellik senin doğanda var — DNA formunda saç ve bakım ürünleri",
    title: "Güzellik senin doğanda var.",
    subtitle: "Kendine özel bakım formülü.",
  },
  {
    src: "/hero-3.jpg",
    alt: "Yeni bir sen buradan başlıyor — Code Blonde bakım dünyasına açılan kapı",
    title: "Yeni bir sen buradan başlıyor.",
    subtitle: "Bakım dünyasına açılan ilk adımı at.",
  },
] as const;

const AUTO_MS = 5500;

export default function SectionHomeHero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const goTo = (next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  };

  const active = SLIDES[index];

  return (
    <section
      className="relative h-[calc(100svh-8rem)] w-full overflow-hidden bg-[#E8C4B0] lg:h-[calc(100svh-9.25rem)]"
      aria-roledescription="carousel"
      aria-label="Ana sayfa vitrin"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              className="object-cover object-[center_40%] sm:object-center"
              sizes="100vw"
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#5C4638]/25 via-transparent to-transparent sm:from-[#5C4638]/15" />

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-6 px-5 pb-8 pt-16 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="font-serif text-[11px] tracking-[0.35em] uppercase text-white/90 drop-shadow-sm">
                code blonde
              </p>
              <h1 className="sr-only">{active.title}</h1>
              <p className="sr-only">{active.subtitle}</p>
              <Link
                href="/koleksiyon"
                className="pointer-events-auto mt-4 inline-flex items-center gap-3 rounded-full bg-[#5C4638]/90 px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase text-[#F8F1E9] backdrop-blur-sm transition-all hover:bg-[#3F2F25] hover:scale-[1.02]"
              >
                Koleksiyonu Keşfet
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>

            <div className="pointer-events-auto flex items-center gap-3 self-start sm:self-end">
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
                {SLIDES.map((slide, i) => (
                  <button
                    key={slide.src}
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
        </div>
      </div>
    </section>
  );
}
