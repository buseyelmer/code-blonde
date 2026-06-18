"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useSandboxData } from "@/hooks/useHomeData";
import { toCategoryHref } from "@/lib/category-utils";
import { CloseIcon } from "./icons";
import { Logo } from "./Logo";

type HeaderMobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function HeaderMobileMenu({ open, onClose }: HeaderMobileMenuProps) {
  const { isAuthenticated, user, logout, isReady } = useAuth();
  const { data } = useSandboxData();
  const categories = data?.productCategories ?? [];

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/40"
        aria-label="Menüyü kapat"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-stone/60 px-4 py-3.5">
          <Logo variant="mobile" onNavigate={onClose} />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-charcoal transition-colors hover:bg-powder"
            aria-label="Menüyü kapat"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {isReady && isAuthenticated && user ? (
            <>
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-muted">
                Merhaba, {user.name}
              </p>
              <Link
                href="/account"
                onClick={onClose}
                className="rounded-xl px-3 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
              >
                Hesabım
              </Link>
              <Link
                href="/orders"
                onClick={onClose}
                className="rounded-xl px-3 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
              >
                Siparişlerim
              </Link>
              <Link
                href="/favorites"
                onClick={onClose}
                className="rounded-xl px-3 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
              >
                Favorilerim
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="mt-2 rounded-xl px-3 py-3 text-left text-sm font-medium text-charcoal transition-colors hover:bg-powder"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="rounded-xl px-3 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="btn-primary mt-2 text-center"
              >
                Kayıt Ol
              </Link>
            </>
          )}

          <div className="my-3 border-t border-stone/60" />

          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Kategoriler
          </p>
          <Link
            href="/products"
            onClick={onClose}
            className="rounded-xl px-3 py-3 text-sm font-semibold text-primary transition-colors hover:bg-powder"
          >
            Tüm Ürünler
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={toCategoryHref(category.id)}
              onClick={onClose}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
            >
              {category.name}
            </Link>
          ))}

          <div className="my-3 border-t border-stone/60" />

          <Link
            href="/cart"
            onClick={onClose}
            className="rounded-xl px-3 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
          >
            Sepetim
          </Link>
        </nav>
      </aside>
    </div>
  );
}
