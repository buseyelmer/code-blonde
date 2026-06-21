"use client";

import { useRaxon } from "@raxonltd/raxon-core";
import type { Category } from "@raxonltd/raxon-core/interface/prisma.interface";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Heart, LogIn, Search, ShoppingBag, User, UserPlus } from "lucide-react";
import { Suspense, useEffect, useMemo, useState, type FormEvent } from "react";
import SiteLogo from "@/core/component/site.logo";
import { findCategoryByKeywords } from "@/core/constant/footer.constant";

const STATIC_LINKS = [
  { label: "Koleksiyon", href: "/koleksiyon" },
  { label: "Ürünler", href: "/urunler" },
  { label: "Hikayemiz", href: "/hakkimizda" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
] as const;

const EXTRA_NAV_CATEGORY_KEYWORDS = ["makyaj", "makeup", "kozmetik", "güneş koruma", "gunes koruma"];

function getCategoryName(category: Category) {
  if (Array.isArray(category.name)) return category.name.getName();
  if (typeof category.name === "string") return category.name;
  return category.code ?? "Kategori";
}

function isLinkActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function IconAction({
  label,
  onClick,
  href,
  badge,
  children,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  badge?: number;
  children: React.ReactNode;
}) {
  const className =
    "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#5C4638] transition-colors hover:bg-[#EDE0D1]/80 hover:text-[#3F2F25]";

  const content = (
    <>
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5C4638] px-1 text-[10px] font-medium text-[#F8F1E9]">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} aria-label={label}>
      {content}
    </button>
  );
}

function HeaderSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/urunler?search=${encodeURIComponent(trimmed)}`);
      return;
    }
    router.push("/urunler");
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <Search
        className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#A17E65]"
        strokeWidth={1.5}
        aria-hidden
      />
      <input
        id="header-product-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Ürün veya kategori ara..."
        className="h-11 w-full rounded-full border border-[#D9C5B0]/70 bg-[#FDFAF6]/50 pl-12 pr-5 font-serif text-sm tracking-wide text-[#5C4638] placeholder:text-[#B89B88]/90 transition-colors focus:border-[#A17E65]/55 focus:bg-[#FDFAF6] focus:outline-none"
        aria-label="Ürün ara"
      />
    </form>
  );
}

function NavLink({
  href,
  label,
  active,
  compact,
}: {
  href: string;
  label: string;
  active?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-center transition-colors ${
        compact
          ? "text-[10px] tracking-[0.14em] xl:text-[11px] xl:tracking-[0.16em]"
          : "text-[11px] tracking-[0.16em]"
      } uppercase ${
        active ? "text-[#5C4638]" : "text-[#8B6B57] hover:text-[#5C4638]"
      }`}
    >
      {label}
    </Link>
  );
}

function DesktopCategoryNav({
  pathname,
  mainNavCategories,
  extraNavCategory,
}: {
  pathname: string;
  mainNavCategories: Category[];
  extraNavCategory: Category | null;
}) {
  const searchParams = useSearchParams();
  const activeCategoryId = searchParams.get("categoryId");

  return (
    <nav className="hidden border-t border-[#D9C5B0]/35 pb-3.5 pt-3 lg:block" aria-label="Kategoriler">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4 xl:gap-x-5">
        {STATIC_LINKS.slice(0, 2).map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={isLinkActive(pathname, link.href)}
            compact
          />
        ))}

        {(mainNavCategories.length > 0 || extraNavCategory) && (
          <span className="hidden h-3 w-px shrink-0 bg-[#D9C5B0] sm:block" aria-hidden />
        )}

        {mainNavCategories.map((cat) => {
          const href = `/urunler?categoryId=${cat.id}`;
          const active = pathname === "/urunler" && activeCategoryId === cat.id;
          return (
            <NavLink key={cat.id} href={href} label={getCategoryName(cat)} active={active} compact />
          );
        })}

        {extraNavCategory && (
          <NavLink
            href={`/urunler?categoryId=${extraNavCategory.id}`}
            label={getCategoryName(extraNavCategory)}
            active={pathname === "/urunler" && activeCategoryId === extraNavCategory.id}
            compact
          />
        )}

        <span className="hidden h-3 w-px shrink-0 bg-[#D9C5B0] sm:block" aria-hidden />

        {STATIC_LINKS.slice(2).map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={isLinkActive(pathname, link.href)}
            compact
          />
        ))}
      </div>
    </nav>
  );
}

export default function SectionGeneralHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { cart, category = [], modalAuthRef, isAuthenticated } = useRaxon();

  const cartCount = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0,
    [cart?.items],
  );

  const topCategories = useMemo(() => category.filter((c) => !c.parentId), [category]);

  const extraNavCategory = useMemo(() => {
    const topLevelMatch = findCategoryByKeywords(topCategories, EXTRA_NAV_CATEGORY_KEYWORDS);
    if (topLevelMatch) return topLevelMatch;

    const subMatch = findCategoryByKeywords(
      category.filter((c) => c.parentId),
      EXTRA_NAV_CATEGORY_KEYWORDS,
    );
    if (subMatch) return subMatch;

    if (topCategories.length > 6) return topCategories[6];
    return null;
  }, [category, topCategories]);

  const mainNavCategories = useMemo(() => {
    if (!extraNavCategory) return topCategories;
    if (!extraNavCategory.parentId && topCategories.some((cat) => cat.id === extraNavCategory.id)) {
      return topCategories.filter((cat) => cat.id !== extraNavCategory.id);
    }
    return topCategories;
  }, [topCategories, extraNavCategory]);

  const profileHref = "/hesabim";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const openAuth = () => modalAuthRef.current?.open();

  const handleFavorites = () => {
    if (isAuthenticated) {
      router.push("/hesabim/favorilerim");
      return;
    }
    openAuth();
  };

  const staticLinkActive = (href: string) => isLinkActive(pathname, href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[#D9C5B0]/50 bg-[#F8F1E9]/95 shadow-sm backdrop-blur-md"
          : "border-b border-[#D9C5B0]/30 bg-[#F8F1E9]/85 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Üst satır: logo · arama · ikonlar */}
        <div className="relative flex items-center gap-3 py-3 lg:gap-6 lg:py-4">
          <Link href="/" className="relative z-10 flex shrink-0 items-center">
            <SiteLogo className="relative h-14 w-40 sm:h-16 sm:w-48 md:h-[4.5rem] md:w-60" priority />
          </Link>

          <div className="pointer-events-none absolute inset-x-4 top-1/2 hidden -translate-y-1/2 justify-center sm:inset-x-6 lg:flex lg:inset-x-8">
            <div className="pointer-events-auto w-full max-w-2xl xl:max-w-3xl">
              <Suspense
                fallback={
                  <div className="h-11 w-full rounded-full border border-[#D9C5B0]/60 bg-white/50" aria-hidden />
                }
              >
                <HeaderSearch />
              </Suspense>
            </div>
          </div>

          <div className="relative z-10 ml-auto flex items-center gap-1 sm:gap-1.5">
            <div className="hidden items-center gap-1 sm:flex sm:gap-1.5">
              <IconAction label="Favorilerim" onClick={handleFavorites}>
                <Heart className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </IconAction>
              <IconAction label="Sepetim" href="/sepet" badge={cartCount}>
                <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </IconAction>
              {isAuthenticated ? (
                <IconAction label="Hesabım" href={profileHref}>
                  <User className="h-[22px] w-[22px]" strokeWidth={1.5} />
                </IconAction>
              ) : (
                <div className="ml-1 hidden items-center gap-2 sm:flex">
                  <Link
                    href="/guvenlik/giris-yap"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-[#D9C5B0]/80 px-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[#5C4638] transition-colors hover:border-[#A17E65] hover:bg-[#EDE0D1]/50"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/guvenlik/kayit-ol"
                    className="inline-flex h-10 items-center justify-center rounded-full bg-[#5C4638] px-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[#F8F1E9] transition-colors hover:bg-[#4A3728]"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-0.5 sm:hidden">
              <IconAction label="Favorilerim" onClick={handleFavorites}>
                <Heart className="h-5 w-5" strokeWidth={1.5} />
              </IconAction>
              <IconAction label="Sepetim" href="/sepet" badge={cartCount}>
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              </IconAction>
              <button
                type="button"
                className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menü"
                aria-expanded={menuOpen}
              >
                <span
                  className={`block h-px w-5 bg-[#5C4638] transition-transform ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`}
                />
                <span className={`block h-px w-5 bg-[#5C4638] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
                <span
                  className={`block h-px w-5 bg-[#5C4638] transition-transform ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobil arama */}
        <div className="pb-3 lg:hidden">
          <Suspense
            fallback={
              <div className="h-11 w-full rounded-full border border-[#D9C5B0]/60 bg-white/50" aria-hidden />
            }
          >
            <HeaderSearch />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <DesktopCategoryNav
            pathname={pathname}
            mainNavCategories={mainNavCategories}
            extraNavCategory={extraNavCategory}
          />
        </Suspense>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#D9C5B0]/40 bg-[#F8F1E9] px-4 py-5 sm:px-6 lg:hidden">
          <p className="mb-3 text-[10px] tracking-[0.28em] uppercase text-[#A17E65]">Menü</p>
          {STATIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block border-b border-[#D9C5B0]/30 py-3.5 font-serif text-sm tracking-[0.08em] uppercase text-[#5C4638]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {topCategories.length > 0 && (
            <>
              <p className="mb-3 mt-6 text-[10px] tracking-[0.28em] uppercase text-[#A17E65]">Kategoriler</p>
              <div className="flex flex-wrap gap-2">
                {mainNavCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/urunler?categoryId=${cat.id}`}
                    className="rounded-full border border-[#D9C5B0]/70 px-3.5 py-2 font-serif text-xs text-[#5C4638] transition-colors hover:bg-[#EDE0D1]/60"
                    onClick={() => setMenuOpen(false)}
                  >
                    {getCategoryName(cat)}
                  </Link>
                ))}
                {extraNavCategory && (
                  <Link
                    href={`/urunler?categoryId=${extraNavCategory.id}`}
                    className="rounded-full border border-[#D9C5B0]/70 px-3.5 py-2 font-serif text-xs text-[#5C4638] transition-colors hover:bg-[#EDE0D1]/60"
                    onClick={() => setMenuOpen(false)}
                  >
                    {getCategoryName(extraNavCategory)}
                  </Link>
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex items-center gap-3 border-t border-[#D9C5B0]/40 pt-5">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleFavorites();
              }}
              className="flex flex-1 items-center justify-center gap-2 border border-[#D9C5B0] py-3 text-[10px] tracking-[0.2em] uppercase text-[#5C4638]"
            >
              <Heart className="h-4 w-4" strokeWidth={1.5} />
              Favoriler
            </button>
            {isAuthenticated ? (
              <Link
                href="/hesabim"
                className="flex flex-1 items-center justify-center gap-2 border border-[#D9C5B0] py-3 text-[10px] tracking-[0.2em] uppercase text-[#5C4638]"
                onClick={() => setMenuOpen(false)}
              >
                <User className="h-4 w-4" strokeWidth={1.5} />
                Hesabım
              </Link>
            ) : (
              <>
                <Link
                  href="/guvenlik/giris-yap"
                  className="flex flex-1 items-center justify-center gap-2 border border-[#D9C5B0] py-3 text-[10px] tracking-[0.2em] uppercase text-[#5C4638]"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" strokeWidth={1.5} />
                  Giriş
                </Link>
                <Link
                  href="/guvenlik/kayit-ol"
                  className="flex flex-1 items-center justify-center gap-2 bg-[#5C4638] py-3 text-[10px] tracking-[0.2em] uppercase text-[#F8F1E9]"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4" strokeWidth={1.5} />
                  Kayıt
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
