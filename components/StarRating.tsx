type StarRatingProps = {
  rating: number;
  reviewCount: number;
  className?: string;
};

export function StarRating({ rating, reviewCount, className = "" }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex gap-0.5" aria-label={`${rating} üzerinden 5 puan`}>
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = rating >= index + 1;
          const partial = !filled && rating > index && rating < index + 1;
          return (
            <svg
              key={index}
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                filled || partial ? "text-gold" : "text-stone"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.35l-4.94 2.36.94-5.5-4-3.9 5.53-.8L10 1.5z" />
            </svg>
          );
        })}
      </div>
      <span className="text-[0.65rem] text-muted sm:text-xs">
        ({reviewCount})
      </span>
    </div>
  );
}
