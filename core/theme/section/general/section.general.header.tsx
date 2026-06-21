"use client";

import { useRaxon } from "@raxonltd/raxon-core";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Koleksiyon", href: "/koleksiyon" },
  { label: "Ürünler", href: "/urunler" },
  { label: "Tonlar", href: "/#tonlar" },
  { label: "Hikayemiz", href: "/hakkimizda" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];

export default function SectionGeneralHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const { branch } = useRaxon();

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL?.replace(/\/$/, "");
  const logoPath = branch?.logoMedia?.relativePath;
  const logoUrl = storageUrl && logoPath ? `${storageUrl}/${logoPath}` : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[#D9C5B0]/50 bg-[#F8F1E9]/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-[#F8F1E9]/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-8 w-28 lg:h-9 lg:w-32">
            {logoUrl ? (
              <Image src={logoUrl} alt="Code Blonde" fill className="object-contain object-left" priority />
            ) : (
              <span className="font-serif text-lg text-[#5C4638]">code blonde</span>
            )}
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-xs tracking-[0.2em] uppercase transition-colors ${
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-[#5C4638]"
                  : "text-[#8B6B57] hover:text-[#5C4638]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <button
            onClick={() => {
              router.push("/sepet");
            }}
            className="flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-[#8B6B57] transition-colors hover:text-[#5C4638]"
          >
            Sepet
            {cartCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#5C4638] text-[10px] text-[#F8F1E9]">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={() => {
              router.push("/sepet");
            }}
            className="relative text-xs tracking-widest uppercase text-[#8B6B57]"
          >
            Sepet
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#5C4638] text-[9px] text-[#F8F1E9]">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="flex flex-col gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            <span
              className={`block h-px w-6 bg-[#5C4638] transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span className={`block h-px w-6 bg-[#5C4638] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`block h-px w-6 bg-[#5C4638] transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#D9C5B0]/40 bg-[#F8F1E9] px-6 py-6 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block border-b border-[#D9C5B0]/30 py-4 text-sm tracking-[0.15em] uppercase text-[#5C4638]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
