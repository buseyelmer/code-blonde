'use client';

import { Star } from 'lucide-react';
import { useRaxon } from '@raxonltd/raxon-core';

export function SectionHomeTestimonial() {
  const { review } = useRaxon()

  const testimonials = review || [];

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight mb-4">Müşteri Yorumları</h2>
          <p className="text-sm text-neutral-600">50.000+ mutlu müşterimizin deneyimleri</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-sm text-neutral-700 mb-6 leading-relaxed">&ldquo;{testimonial.comment}&rdquo;</p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-200 to-pink-300 rounded-full flex items-center justify-center">
                  <span className="text-rose-900 text-sm font-semibold">{testimonial.fullName?.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 tracking-tight">{testimonial.fullName}</h4>
                  <p className="text-[12px] text-neutral-500">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
