"use client";

import Link from "next/link";
import { useRaxon } from "@raxonltd/raxon-core";
import { useMemo } from "react";
import SiteLogo from "@/core/component/site.logo";
import { SITE_FOOTER_TAGLINE, SITE_SLOGAN } from "@/core/constant/site.constant";
import { resolveFooterCategoryLinks } from "@/core/constant/footer.constant";

const linkClassName =
  "block text-sm leading-relaxed text-[#8B6B57] transition-colors hover:text-[#5C4638]";

function resolveSocialLinks(
  socialMediaLinks: unknown,
): { label: string; href: string }[] {
  if (!socialMediaLinks) return [];

  if (Array.isArray(socialMediaLinks)) {
    return socialMediaLinks
      .map((item) => {
        if (typeof item === "string") return { label: item, href: item };
        if (typeof item === "object" && item !== null) {
          const record = item as Record<string, unknown>;
          const href = String(record.url ?? record.link ?? record.href ?? "");
          const label = String(record.platform ?? record.name ?? record.label ?? href);
          if (!href) return null;
          return { label, href };
        }
        return null;
      })
      .filter((item): item is { label: string; href: string } => item !== null);
  }

  if (typeof socialMediaLinks === "object") {
    return Object.entries(socialMediaLinks as Record<string, string>)
      .filter(([, href]) => Boolean(href))
      .map(([platform, href]) => ({
        label: platform.charAt(0).toUpperCase() + platform.slice(1),
        href,
      }));
  }

  return [];
}

export default function Footer() {
  const { branch, category = [] } = useRaxon();

  const categoryLinks = useMemo(
    () => resolveFooterCategoryLinks(category ?? []),
    [category],
  );

  const socialLinks = useMemo(
    () => resolveSocialLinks(branch?.socialMediaLinks),
    [branch?.socialMediaLinks],
  );

  const tagline = branch?.description?.trim() || SITE_SLOGAN;

  return (
    <footer className="border-t border-[#D9C5B0]/40 bg-[#F5EDE4]/40 pt-16 pb-10 text-[#5C4638]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid gap-12 md:grid-cols-3 md:gap-10 lg:gap-16">
          <div>
            <Link href="/" className="mb-6 inline-block transition-opacity hover:opacity-80">
              <SiteLogo className="relative h-14 w-48 sm:h-16 sm:w-56 md:h-[4.5rem] md:w-64" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#8B6B57]">{tagline}</p>
            <p className="mt-5 text-[11px] tracking-[0.22em] text-[#A17E65]">{SITE_FOOTER_TAGLINE}</p>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-medium tracking-[0.28em] text-[#5C4638]">
              ÖNE ÇIKAN KATEGORİLER
            </h3>
            <nav className="space-y-3" aria-label="Öne çıkan kategoriler">
              {categoryLinks.map((link) => (
                <Link key={link.label} href={link.href} className={linkClassName}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-medium tracking-[0.28em] text-[#5C4638]">
              İLETİŞİM
            </h3>
            <div className="space-y-3 text-sm leading-relaxed text-[#8B6B57]">
              {branch?.email && (
                <a href={`mailto:${branch.email}`} className="block transition-colors hover:text-[#5C4638]">
                  {branch.email}
                </a>
              )}
              {branch?.phoneNumber && (
                <a
                  href={`tel:${branch.phoneNumber.replace(/\s/g, "")}`}
                  className="block transition-colors hover:text-[#5C4638]"
                >
                  {branch.phoneNumber}
                </a>
              )}
              {branch?.openAddress && (
                <p className="max-w-xs whitespace-pre-line text-[#8B6B57]/90">{branch.openAddress}</p>
              )}
              {socialLinks.length > 0 && (
                <div className="space-y-2 pt-1">
                  {socialLinks.map((social) => (
                    <a
                      key={`${social.label}-${social.href}`}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-colors hover:text-[#5C4638]"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              )}
              {!branch?.email && !branch?.phoneNumber && !branch?.openAddress && (
                <Link href="/iletisim" className="block transition-colors hover:text-[#5C4638]">
                  Bize ulaşın
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#D9C5B0]/40 pt-8 sm:flex-row sm:items-center">
          <p className="text-[11px] tracking-[0.18em] text-[#A17E65]">
            © 2026 Code Blonde — Tüm hakları saklıdır
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/sozlesmeler/gizlilik-sozlesmesi"
              className="text-[11px] tracking-[0.16em] text-[#A17E65] transition-colors hover:text-[#5C4638]"
            >
              Gizlilik
            </Link>
            <Link
              href="/sss"
              className="text-[11px] tracking-[0.16em] text-[#A17E65] transition-colors hover:text-[#5C4638]"
            >
              SSS
            </Link>
            <Link
              href="/iletisim"
              className="text-[11px] tracking-[0.16em] text-[#A17E65] transition-colors hover:text-[#5C4638]"
            >
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
