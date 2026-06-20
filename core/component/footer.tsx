"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRaxon } from "@raxonltd/raxon-core";
import type { Article, Collection, Faq } from "@raxonltd/raxon-core/interface/prisma.interface";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const linkClassName =
  "block transition-colors hover:text-[#5C4638]";

function getCategoryName(category: { name?: unknown; title?: string | null }): string {
  if (category.title) return category.title;
  if (Array.isArray(category.name) && category.name.length > 0) {
    const names = category.name as Array<{ value?: string; name?: string }> & { getName?: () => string };
    return names.getName?.() ?? names[0]?.value ?? names[0]?.name ?? "Kategori";
  }
  if (typeof category.name === "string") return category.name;
  return "Kategori";
}

function parseSocialLinks(links: unknown): FooterLink[] {
  if (!links) return [];

  if (Array.isArray(links)) {
    return links
      .map((item): FooterLink | null => {
        if (!item || typeof item !== "object") return null;
        const entry = item as Record<string, unknown>;
        const href =
          typeof entry.url === "string"
            ? entry.url
            : typeof entry.link === "string"
              ? entry.link
              : null;
        if (!href) return null;

        const platform =
          typeof entry.platform === "string"
            ? entry.platform
            : typeof entry.type === "string"
              ? entry.type
              : "Sosyal Medya";

        return {
          label: platform.replace(/_/g, " "),
          href,
          external: true,
        };
      })
      .filter((item): item is FooterLink => item !== null);
  }

  if (typeof links === "object") {
    return Object.entries(links as Record<string, unknown>)
      .map(([key, value]): FooterLink | null => {
        if (typeof value !== "string" || !value) return null;
        return {
          label: key.charAt(0).toUpperCase() + key.slice(1),
          href: value,
          external: true,
        };
      })
      .filter((item): item is FooterLink => item !== null);
  }

  return [];
}

function FooterLinkItem({ label, href, external }: FooterLink) {
  if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClassName}>
      {label}
    </Link>
  );
}

export default function Footer() {
  const { branch, collection, flatCategory, article, faq } = useRaxon();

  const brandName = branch?.tradingName ?? "code blonde";
  const brandDescription =
    branch?.description ?? "Doğal güzelliğin kodu. Nude tonlarda premium kozmetik deneyimi.";
  const locations = [branch?.city, branch?.province, branch?.country].filter(Boolean).join(" • ");

  const collectionLinks = useMemo(
    () =>
      (collection ?? []).slice(0, 6).map((col: Collection) => ({
        label: col.title || "Koleksiyon",
        href: `/koleksiyon/${col.id}`,
      })),
    [collection],
  );

  const exploreLinks = useMemo(() => {
    const links: FooterLink[] = [];

    (flatCategory ?? [])
      .filter((cat) => cat.id)
      .slice(0, 4)
      .forEach((cat) => {
        links.push({
          label: getCategoryName(cat),
          href: `/urunler?category=${cat.id}`,
        });
      });

    (article ?? []).slice(0, 2).forEach((post: Article) => {
      if (!post.title) return;
      links.push({
        label: post.title,
        href: post.slug ? `/blog/${post.slug}` : `/blog/${post.id}`,
      });
    });

    links.push(
      { label: "Ton Rehberi", href: "/#tonlar" },
      { label: "Hikayemiz", href: "/#hikaye" },
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Blog", href: "/blog" },
      { label: "Koleksiyonlar", href: "/koleksiyon" },
    );

    const seen = new Set<string>();
    return links.filter((link) => {
      const key = `${link.label}-${link.href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [flatCategory, article]);

  const supportLinks = useMemo(() => {
    const links: FooterLink[] = [
      { label: "İletişim", href: "/iletisim" },
      { label: "SSS", href: "/sss" },
      { label: "Kargo & İade", href: "/sozlesmeler/kargo-teslimat" },
      { label: "Gizlilik", href: "/sozlesmeler/gizlilik-sozlesmesi" },
    ];

    (faq ?? []).slice(0, 2).forEach((item: Faq) => {
      if (!item.question) return;
      links.push({
        label: item.question,
        href: "/sss",
      });
    });

    return links;
  }, [faq]);

  const socialLinks = useMemo(
    () => parseSocialLinks(branch?.socialMediaLinks),
    [branch?.socialMediaLinks],
  );

  return (
    <footer className="border-t border-[#D9C5B0]/40 bg-[#F5EDE4]/30 pt-16 pb-12 text-xs tracking-widest text-[#8B6B57]">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-base tracking-normal text-[#5C4638] mb-4 block hover:opacity-80">
              {brandName}
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#8B6B57]">{brandDescription}</p>
            {locations && <div className="mt-4 text-[10px]">{locations}</div>}
          </div>

          <div className="space-y-[5px]">
            <div className="mb-2 font-medium text-[#5C4638]">KOLEKSİYONLAR</div>
            {collectionLinks.length > 0 ? (
              collectionLinks.map((link) => <FooterLinkItem key={link.href} {...link} />)
            ) : (
              <FooterLinkItem label="Koleksiyonlar" href="/koleksiyon" />
            )}
          </div>

          <div className="space-y-[5px]">
            <div className="mb-2 font-medium text-[#5C4638]">KEŞFET</div>
            {exploreLinks.map((link) => (
              <FooterLinkItem key={`${link.label}-${link.href}`} {...link} />
            ))}
          </div>

          <div className="space-y-[5px]">
            <div className="mb-2 font-medium text-[#5C4638]">DESTEK</div>
            {supportLinks.map((link) => (
              <FooterLinkItem key={`${link.label}-${link.href}`} {...link} />
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#D9C5B0]/40 pt-8 sm:flex-row">
          <p className="text-[10px] tracking-[2px] text-[#A17E65]">
            © {new Date().getFullYear()} {brandName}. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.length > 0 ? (
              socialLinks.map((link) => <FooterLinkItem key={`${link.label}-${link.href}`} {...link} />)
            ) : (
              branch?.webSite && (
                <FooterLinkItem label="Web Sitesi" href={branch.webSite} external />
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
