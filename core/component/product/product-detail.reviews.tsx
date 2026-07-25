"use client";

import { Star } from "lucide-react";

type ReviewItem = {
  id: string;
  fullName?: string | null;
  position?: string | null;
  rating?: number | null;
  comment?: string | null;
};

export function ProductDetailReviews({
  reviews,
  isLoading,
  totalCount,
}: {
  reviews: ReviewItem[];
  isLoading?: boolean;
  totalCount?: number;
}) {
  if (!isLoading && reviews.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#D9C5B0]/50 pt-12">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.38em] uppercase text-[#A17E65]">Değerlendirmeler</p>
        <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#5C4638] sm:text-3xl">
          Müşteri Yorumları
          {totalCount ? (
            <span className="ml-2 font-mono text-base text-[#8B6B57]">({totalCount})</span>
          ) : null}
        </h2>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-sm border border-[#D9C5B0]/40 bg-[#FDFAF6] p-6"
            >
              <div className="mb-4 h-4 w-32 rounded bg-[#EDE0D1]/80" />
              <div className="mb-3 h-3 w-full rounded bg-[#F0E8DE]/80" />
              <div className="h-3 w-4/5 rounded bg-[#F0E8DE]/60" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-sm border border-[#D9C5B0]/40 bg-[#FDFAF6] p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5C4638] font-serif text-sm text-[#F8F1E9]">
                  {(review.fullName ?? "M").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#5C4638]">
                    {review.fullName ?? "Müşteri"}
                  </p>
                  {review.position && (
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#8B6B57]">
                      {review.position}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-3.5 w-3.5 ${
                      index < (review.rating ?? 0)
                        ? "fill-[#A17E65] text-[#A17E65]"
                        : "text-[#D9C5B0]"
                    }`}
                    strokeWidth={0}
                  />
                ))}
              </div>
              {review.comment && (
                <p className="text-sm leading-relaxed text-[#8B6B57]">&ldquo;{review.comment}&rdquo;</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
