"use client";

import Link from "next/link";
import { useRaxon } from "@raxonltd/raxon-core";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import SiteLogo from "@/core/component/site.logo";
import {
  SITE_CONTACT,
  SITE_FOOTER_TAGLINE,
  SITE_NAME,
  SITE_SLOGAN,
} from "@/core/constant/site.constant";
import {
  FOOTER_HELP_LINKS,
  FOOTER_LEGAL_LINKS,
  resolveFooterCategoryLinks,
} from "@/core/constant/footer.constant";

const linkClassName =
  "group relative inline-flex text-sm text-[#C9B5A4] transition-colors duration-300 hover:text-[#F8F1E9]";

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

function normalizeExternalHref(href: string): string {
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  if (href.startsWith("//")) return `https:${href}`;
  if (href.startsWith("/")) return href;
  return `https://${href}`;
}

export default function Footer() {
  const { branch, category = [] } = useRaxon();

  const categoryLinks = useMemo(
    () => resolveFooterCategoryLinks(category ?? []),
    [category],
  );

  const socialLinks = useMemo(() => {
    const fromBranch = resolveSocialLinks(branch?.socialMediaLinks);
    if (fromBranch.length > 0) return fromBranch;
    return [{ label: "Instagram", href: SITE_CONTACT.instagram }];
  }, [branch?.socialMediaLinks]);

  const tagline = branch?.description?.trim() || SITE_SLOGAN;
  const email = branch?.email || SITE_CONTACT.email;
  const phone = branch?.phoneNumber || SITE_CONTACT.phoneDisplay;
  const phoneHref = (branch?.phoneNumber || SITE_CONTACT.phone).replace(/\s/g, "");

  return (
    <footer className="relative overflow-hidden bg-[#3F2F25] text-[#F8F1E9]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 10% 0%, #A17E65 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 100%, #8B6B57 0%, transparent 50%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#D9C5B0 0.7px, transparent 0.7px)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-10 sm:px-8 sm:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="mb-6 inline-block transition-opacity hover:opacity-90"
            >
              <SiteLogo
                variant="onDark"
                className="relative h-16 w-56 sm:h-20 sm:w-72"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#C9B5A4]">{tagline}</p>
            <p className="mt-6 text-[11px] tracking-[0.28em] text-[#A17E65] uppercase">
              {SITE_FOOTER_TAGLINE}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8 lg:gap-8">
            <div>
              <h3 className="mb-5 text-[11px] font-medium tracking-[0.28em] text-[#A17E65]">
                KATEGORİLER
              </h3>
              <nav className="flex flex-col gap-3" aria-label="Öne çıkan kategoriler">
                {categoryLinks.map((link) => (
                  <Link key={link.label} href={link.href} className={linkClassName}>
                    <span className="border-b border-transparent transition-[border-color] duration-300 group-hover:border-[#A17E65]/60">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="mb-5 text-[11px] font-medium tracking-[0.28em] text-[#A17E65]">
                YARDIM
              </h3>
              <nav className="flex flex-col gap-3" aria-label="Yardım">
                {FOOTER_HELP_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className={linkClassName}>
                    <span className="border-b border-transparent transition-[border-color] duration-300 group-hover:border-[#A17E65]/60">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="mb-5 text-[11px] font-medium tracking-[0.28em] text-[#A17E65]">
                SÖZLEŞMELER
              </h3>
              <nav className="flex flex-col gap-3" aria-label="Sözleşmeler">
                {FOOTER_LEGAL_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className={linkClassName}>
                    <span className="border-b border-transparent transition-[border-color] duration-300 group-hover:border-[#A17E65]/60">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="grid gap-10 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-4 text-[11px] font-medium tracking-[0.28em] text-[#A17E65]">
              İLETİŞİM
            </h3>
            <div className="space-y-3 text-sm text-[#C9B5A4]">
              <a href={`mailto:${email}`} className="block transition-colors hover:text-[#F8F1E9]">
                {email}
              </a>
              <a href={`tel:${phoneHref}`} className="block transition-colors hover:text-[#F8F1E9]">
                {phone}
              </a>
              {branch?.openAddress ? (
                <p className="max-w-xs whitespace-pre-line text-[#C9B5A4]/85">{branch.openAddress}</p>
              ) : (
                <p className="text-[#C9B5A4]/85">{SITE_CONTACT.locality}, {SITE_CONTACT.countryName}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-medium tracking-[0.28em] text-[#A17E65]">
              SOSYAL
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={`${social.label}-${social.href}`}
                  href={normalizeExternalHref(social.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-[11px] tracking-[0.18em] text-[#C9B5A4] uppercase transition-all duration-300 hover:border-[#A17E65]/50 hover:bg-white/5 hover:text-[#F8F1E9]"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-4 text-[11px] font-medium tracking-[0.28em] text-[#A17E65]">
              HIZLI ERİŞİM
            </h3>
            <Link
              href="/sss"
              className="group inline-flex items-center gap-2 rounded-full bg-[#F8F1E9] px-5 py-2.5 text-[11px] tracking-[0.18em] text-[#3F2F25] uppercase transition-transform duration-300 hover:-translate-y-0.5"
            >
              Sıkça Sorulan Sorular
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={1.5}
                aria-hidden
              />
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-8 sm:flex-row sm:items-center">
          <p className="text-[11px] tracking-[0.16em] text-[#A17E65]/90">
            © {new Date().getFullYear()} {SITE_NAME} — Tüm hakları saklıdır
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/sss"
              className="text-[11px] tracking-[0.16em] text-[#C9B5A4] transition-colors hover:text-[#F8F1E9]"
            >
              SSS
            </Link>
            <Link
              href="/sozlesmeler/gizlilik-sozlesmesi"
              className="text-[11px] tracking-[0.16em] text-[#C9B5A4] transition-colors hover:text-[#F8F1E9]"
            >
              Gizlilik
            </Link>
            <Link
              href="/sozlesmeler/kullanim-sartlari"
              className="text-[11px] tracking-[0.16em] text-[#C9B5A4] transition-colors hover:text-[#F8F1E9]"
            >
              Kullanım Şartları
            </Link>
            <Link
              href="/iletisim"
              className="text-[11px] tracking-[0.16em] text-[#C9B5A4] transition-colors hover:text-[#F8F1E9]"
            >
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
