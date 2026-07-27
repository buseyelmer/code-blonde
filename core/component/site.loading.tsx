import Image from "next/image";
import { SITE_LOGO, SITE_NAME } from "@/core/constant/site.constant";

type SiteLoadingProps = {
  className?: string;
  fullScreen?: boolean;
};

export default function SiteLoading({
  className = "",
  fullScreen = true,
}: SiteLoadingProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        fullScreen ? "min-h-screen" : "min-h-[50vh]"
      } ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`${SITE_NAME} yükleniyor`}
      style={{
        background:
          "radial-gradient(ellipse 70% 55% at 50% 42%, #F3E4D6 0%, #EDE0D1 38%, #F8F1E9 72%, #F5EBE1 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 animate-[site-loader-shimmer_4.5s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(232,196,176,0.45) 0%, transparent 42%), radial-gradient(circle at 72% 78%, rgba(201,169,154,0.28) 0%, transparent 40%)",
        }}
      />

      <div className="relative flex items-center justify-center">
        <div className="absolute h-44 w-44 animate-[site-loader-glow_2.4s_ease-in-out_infinite] rounded-full bg-[#E8C4B0]/35 blur-3xl sm:h-56 sm:w-56" />
        <div className="absolute h-36 w-36 animate-[site-loader-ring_2.8s_cubic-bezier(0.4,0,0.2,1)_infinite] rounded-full border border-[#C9A99A]/35 sm:h-44 sm:w-44" />
        <div className="absolute h-48 w-48 animate-[site-loader-ring_2.8s_cubic-bezier(0.4,0,0.2,1)_infinite_0.35s] rounded-full border border-[#D9C5B0]/20 sm:h-60 sm:w-60" />

        <div className="relative h-20 w-60 animate-[site-logo-breathe_2.4s_ease-in-out_infinite] sm:h-24 sm:w-72">
          <Image
            src={SITE_LOGO}
            alt={SITE_NAME}
            fill
            priority
            className="object-contain drop-shadow-[0_8px_28px_rgba(92,70,56,0.12)]"
          />
        </div>
      </div>
    </div>
  );
}
