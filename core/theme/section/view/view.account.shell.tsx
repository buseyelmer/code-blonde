"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

const NAV_ITEMS = [
  { href: "/account", label: "Hesabım" },
  { href: "/orders", label: "Siparişlerim" },
  { href: "/favorites", label: "Favorilerim" },
];

type ViewAccountShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function ViewAccountShell({ title, subtitle, children }: ViewAccountShellProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-stone/70 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-stone/60 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {initials || "CB"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold uppercase text-charcoal">
                {user?.name}
              </p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-charcoal text-cream"
                      : "text-charcoal hover:bg-powder"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="rounded-2xl border border-stone/70 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-stone/60 pb-5">
            <h1 className="text-2xl font-semibold text-charcoal">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-muted">{subtitle}</p>
            )}
          </div>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </div>
  );
}
