"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";

type ViewHeaderAuthLinksProps = {
  className?: string;
};

export function ViewHeaderAuthLinks({
  className = "hidden md:flex",
}: ViewHeaderAuthLinksProps) {
  const { isAuthenticated, user, logout, isReady } = useAuth();

  if (!isReady) {
    return <div className={`h-9 w-28 ${className}`} aria-hidden />;
  }

  if (isAuthenticated && user) {
    return (
      <div className={`items-center gap-2 ${className}`}>
        <Link
          href="/account"
          className="max-w-[140px] truncate text-xs font-medium text-charcoal transition-colors hover:text-primary lg:max-w-[180px] lg:text-sm"
        >
          Hesabım
        </Link>
        <span className="hidden text-xs text-muted lg:inline">{user.name}</span>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-stone px-3 py-1.5 text-xs font-medium text-charcoal transition-colors hover:bg-powder"
        >
          Çıkış
        </button>
      </div>
    );
  }

  return (
    <div className={`items-center gap-2 ${className}`}>
      <Link
        href="/login"
        className="rounded-full px-3 py-1.5 text-xs font-medium text-charcoal transition-colors hover:bg-stone/30 lg:text-sm"
      >
        Giriş Yap
      </Link>
      <Link href="/register" className="btn-primary px-3 py-1.5 text-xs lg:text-sm">
        Kayıt Ol
      </Link>
    </div>
  );
}
