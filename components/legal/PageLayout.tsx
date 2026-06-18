import type { ReactNode } from "react";

type PageLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-10 border-b border-stone/60 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Code Blonde
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-muted">
            {description}
          </p>
        )}
      </header>
      <div className="prose-legal space-y-6 text-sm leading-relaxed text-charcoal/90 sm:text-base">
        {children}
      </div>
    </div>
  );
}
