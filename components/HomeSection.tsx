import type { ReactNode } from "react";

export const HOME_CONTAINER_CLASS =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export const HOME_SECTION_SPACING_CLASS = "my-10 md:my-16";

type HomeSectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Tam genişlik arka plan (kategori şeridi vb.) */
  bleed?: boolean;
  bleedClassName?: string;
};

export function HomeSection({
  children,
  className = "",
  containerClassName = "",
  bleed = false,
  bleedClassName = "",
}: HomeSectionProps) {
  const spacing = HOME_SECTION_SPACING_CLASS;

  if (bleed) {
    return (
      <section className={`${spacing} w-full max-w-full ${bleedClassName} ${className}`}>
        <div className={`${HOME_CONTAINER_CLASS} ${containerClassName}`}>
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className={`${spacing} w-full max-w-full ${className}`}>
      <div className={`${HOME_CONTAINER_CLASS} ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
