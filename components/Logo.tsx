import Link from "next/link";

const LOGO_SRC = "/images/code-blonde-logo.svg";

type LogoVariant = "header" | "footer" | "mobile";

type LogoProps = {
  className?: string;
  variant?: LogoVariant;
  onNavigate?: () => void;
};

/** Header, footer ve mobil menüde aynı logo ölçüsü */
const LOGO_SIZE = "h-14 w-auto sm:h-16";

const variantHeights: Record<LogoVariant, string> = {
  header: LOGO_SIZE,
  mobile: LOGO_SIZE,
  footer: LOGO_SIZE,
};

export function Logo({
  className = "",
  variant = "footer",
  onNavigate,
}: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={`inline-flex shrink-0 items-center ${className}`}
      aria-label="Code Blonde Ana Sayfa"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        alt="Code Blonde"
        width={367}
        height={269}
        decoding="async"
        className={`block max-w-none object-contain ${variantHeights[variant]}`}
      />
    </Link>
  );
}
