"use client";

import Link from "next/link";
import { useRaxon } from "@raxonltd/raxon-core";
import { useMemo } from "react";
import { resolveFooterCollectionLinks } from "@/core/constant/collection.constant";

const STATIC_FOOTER_SECTIONS = [
  {
    title: "KEŞFET",
    links: [
      { label: "Ton Rehberi", href: "/#tonlar" },
      { label: "İçindekiler", href: "/urunler" },
      { label: "Sürdürülebilirlik", href: "/hakkimizda" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "DESTEK",
    links: [
      { label: "İletişim", href: "/iletisim" },
      { label: "SSS", href: "/sss" },
      { label: "Kargo & İade", href: "/sozlesmeler/iade-degisim" },
      { label: "Gizlilik", href: "/sozlesmeler/gizlilik-sozlesmesi" },
    ],
  },
] as const;

const linkClassName = "block hover:text-[#5C4638] transition-colors";

export default function Footer() {
  const { collection } = useRaxon();

  const collectionLinks = useMemo(
    () => resolveFooterCollectionLinks(collection ?? []),
    [collection],
  );

  const footerSections = useMemo(
    () => [{ title: "KOLEKSİYONLAR", links: collectionLinks }, ...STATIC_FOOTER_SECTIONS],
    [collectionLinks],
  );

  return (
    <footer className="border-t border-[#D9C5B0]/40 bg-[#F5EDE4]/30 pt-16 pb-12 text-xs tracking-widest text-[#8B6B57]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="font-serif text-[#5C4638] text-base tracking-normal mb-4 block hover:opacity-80 transition-opacity"
            >
              code blonde
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#8B6B57]">
              Doğal güzelliğin kodu. Nude tonlarda premium kozmetik deneyimi.
            </p>
            <div className="mt-4 text-[10px]">Paris • İstanbul • New York</div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="space-y-[5px]">
              <div className="font-medium text-[#5C4638] mb-2">{section.title}</div>
              {section.links.map((link) => (
                <Link key={link.label} href={link.href} className={linkClassName}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#D9C5B0]/40 pt-8 sm:flex-row">
          <p className="text-[10px] text-[#A17E65] tracking-[2px]">© 2026 Code Blonde. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            {["Instagram", "Pinterest", "TikTok"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[10px] tracking-[2px] text-[#A17E65] transition-colors hover:text-[#5C4638]"
              >
                {social.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
