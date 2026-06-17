import Link from "next/link";

type LogoProps = {
  className?: string;
  variant?: "full" | "compact";
  crossColor?: string;
};

export function Logo({
  className = "",
  variant = "full",
  crossColor = "var(--background, #faf8f5)",
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-start text-foreground ${className}`}
      aria-label="Code Blonde Ana Sayfa"
    >
      <div className="flex items-end gap-2.5">
        <svg
          viewBox="0 0 40 40"
          className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
          aria-hidden="true"
        >
          <path
            d="M6 0H19V19H0V6Q0 0 6 0Z"
            fill="currentColor"
          />
          <rect x="21" y="0" width="19" height="19" fill="currentColor" />
          <rect x="0" y="21" width="19" height="19" fill="currentColor" />
          <path
            d="M21 34Q21 40 27 40H40V21H21V34Z"
            fill="currentColor"
          />
          <rect x="19" y="0" width="2" height="40" fill={crossColor} />
          <rect x="0" y="19" width="40" height="2" fill={crossColor} />
        </svg>
        <span className="text-[1.65rem] font-light leading-none tracking-tight sm:text-[1.85rem]">
          CB
        </span>
      </div>
      {variant === "full" && (
        <span className="mt-1.5 text-[0.52rem] font-normal tracking-[0.38em] sm:text-[0.58rem]">
          CODE BLONDE
        </span>
      )}
    </Link>
  );
}
