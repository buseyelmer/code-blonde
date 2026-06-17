"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { serviceBenefits } from "@/lib/data";
import {
  DiscountIcon,
  PaymentIcon,
  ReturnIcon,
  ShippingIcon,
} from "./icons";

const promoSlides = [
  {
    id: "promo-1",
    image: "/images/promo-lifestyle.svg",
    alt: "Code Blonde bakım ritüeli lifestyle görseli",
  },
  {
    id: "promo-2",
    image: "/images/promo-peeling.svg",
    alt: "Vücut peeling ürünleri lifestyle görseli",
  },
] as const;

const benefitIcons = {
  shipping: ShippingIcon,
  return: ReturnIcon,
  payment: PaymentIcon,
  discount: DiscountIcon,
} as const;

export function PromoSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="mt-4" aria-label="Marka tanıtımı">
      <div className="bg-powder/70">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-powder">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={promoSlides[activeSlide].id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={promoSlides[activeSlide].image}
                      alt={promoSlides[activeSlide].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((s) =>
                      s === 0 ? promoSlides.length - 1 : s - 1,
                    )
                  }
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-cream/90 p-2 text-charcoal shadow-sm backdrop-blur transition-colors hover:bg-white"
                  aria-label="Önceki görsel"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((s) => (s + 1) % promoSlides.length)
                  }
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-cream/90 p-2 text-charcoal shadow-sm backdrop-blur transition-colors hover:bg-white"
                  aria-label="Sonraki görsel"
                >
                  ›
                </button>

                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                  {promoSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === activeSlide
                          ? "w-6 bg-charcoal"
                          : "w-1.5 bg-cream/80"
                      }`}
                      aria-label={`Görsel ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center px-6 py-10 text-center sm:px-10 lg:px-14">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold text-charcoal sm:text-2xl lg:text-[1.65rem]">
                    Code Blonde ile Tanışın
                  </h2>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                    Doğanın saflığını modern formüllerle buluşturan minimalist
                    bakım ritüelleri. Cildinize iyi gelen, sade ve etkili
                    ürünlerle tanışın.
                  </p>
                  <Link
                    href="/hakkimizda"
                    className="mt-8 inline-flex items-center justify-center rounded-full border border-charcoal bg-cream px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:border-gold hover:bg-white"
                  >
                    Detaylı Bilgi
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-stone/50 bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {serviceBenefits.map((benefit, index) => {
            const Icon = benefitIcons[benefit.icon];
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone bg-powder/50 text-charcoal">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-charcoal">
                    {benefit.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted sm:text-sm">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
