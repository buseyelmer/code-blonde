import Link from "next/link";
import type { ReactNode } from "react";

type ViewAuthFormLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerHref: string;
  footerLinkLabel: string;
};

export function ViewAuthFormLayout({
  title,
  subtitle,
  children,
  footerText,
  footerHref,
  footerLinkLabel,
}: ViewAuthFormLayoutProps) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-charcoal">{title}</h1>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>

      <div className="mt-8 rounded-2xl border border-stone/70 bg-white p-6 shadow-sm">
        {children}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        {footerText}{" "}
        <Link
          href={footerHref}
          className="font-medium text-charcoal underline-offset-4 hover:underline"
        >
          {footerLinkLabel}
        </Link>
      </p>

      <Link
        href="/"
        className="mt-4 inline-block text-sm text-muted transition-colors hover:text-charcoal"
      >
        ← Ana sayfaya dön
      </Link>
    </div>
  );
}
