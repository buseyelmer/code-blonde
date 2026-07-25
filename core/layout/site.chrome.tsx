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
    return children;
  }

  return (
    <>
      <SiteHeader />
      <SiteShell>{children}</SiteShell>
    </>
  );
}
