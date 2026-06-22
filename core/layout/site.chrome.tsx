"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/core/layout/site.header";
import SiteShell from "@/core/layout/site.shell";

export function isMinimalChromeRoute(pathname: string | null): boolean {
  return Boolean(pathname?.startsWith("/sepet/odeme"));
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isMinimalChromeRoute(pathname)) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F8F1E9] text-[#5C4638]">
        <main className="flex flex-1 items-center justify-center px-4 py-6">{children}</main>
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <SiteShell>{children}</SiteShell>
    </>
  );
}
