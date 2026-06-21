"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { LoginType } from "@raxonltd/raxon-core/interface/prisma.interface";
import Link from "next/link";
import { User, ShoppingBag, Heart, MapPin, FileText, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@raxonltd/raxon-core/hook";
import { useRaxon } from "@raxonltd/raxon-core";
import { AccountSpinner } from "@/core/component/account/account.ui";

const menuItems = [
  { href: "/hesabim", label: "Hesabım", icon: User, exact: true },
  { href: "/hesabim/siparislerim", label: "Siparişlerim", icon: ShoppingBag, exact: false },
  { href: "/hesabim/favorilerim", label: "Favorilerim", icon: Heart, exact: false },
  { href: "/hesabim/adreslerim", label: "Adreslerim", icon: MapPin, exact: false },
  { href: "/hesabim/faturalarim", label: "Faturalarım", icon: FileText, exact: false },
] as const;

function isMenuActive(pathname: string, href: string, exact: boolean = false) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, profile } = useRaxon();
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || profile?.loginType === LoginType.GUEST)) {
      router.push("/guvenlik/giris-yap");
    }
  }, [isAuthenticated, isLoading, profile, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-[#F8F1E9]">
        <AccountSpinner />
      </div>
    );
  }

  if (!isAuthenticated || profile?.loginType === LoginType.GUEST) {
    return null;
  }

  const initials = `${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="bg-[#F8F1E9] pb-16 pt-4 sm:pt-6 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:gap-10 xl:gap-14">
          <aside className="mb-6 lg:mb-0 lg:w-72 lg:shrink-0 xl:w-80">
            <div className="overflow-hidden rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] shadow-[0_1px_3px_rgba(92,70,56,0.04)] lg:sticky lg:top-28">
              <div className="border-b border-[#D9C5B0]/40 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#5C4638] font-serif text-base text-[#F8F1E9] sm:h-14 sm:w-14 sm:text-lg">
                    {initials || "CB"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-serif text-base text-[#5C4638] sm:text-lg">
                      {profile?.firstName} {profile?.lastName}
                    </h2>
                    <p className="truncate text-sm text-[#8B6B57]">{profile?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="border-b border-[#D9C5B0]/30 p-2" aria-label="Hesap menüsü">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isMenuActive(pathname, item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`mb-0.5 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition sm:px-4 sm:py-3 ${
                        active
                          ? "bg-[#5C4638] text-[#F8F1E9]"
                          : "text-[#8B6B57] hover:bg-[#F8F1E9] hover:text-[#5C4638]"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <span className="min-w-0 flex-1 tracking-wide">{item.label}</span>
                      <ChevronRight
                        className={`hidden h-4 w-4 shrink-0 sm:block ${active ? "text-[#F8F1E9]/70" : "text-[#D9C5B0]"}`}
                        strokeWidth={1.5}
                      />
                    </Link>
                  );
                })}
              </nav>

              <div className="p-2">
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-sm text-[#A17E65] transition hover:bg-[#F8F1E9] hover:text-[#5C4638]"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.5} />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
