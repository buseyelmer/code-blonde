"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { useAuth } from "@/lib/context/AuthContext";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isReady, isAuthenticated, router]);

  if (!isReady || !isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-muted">
        Yükleniyor...
      </div>
    );
  }

  const membershipDate = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AccountShell
      title="Hesabım / Bilgilerim"
      subtitle="Profil bilgilerinizi buradan görüntüleyebilirsiniz."
    >
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-powder/40 px-4 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Ad Soyad
          </dt>
          <dd className="mt-1 text-sm font-semibold text-charcoal">{user.name}</dd>
        </div>
        <div className="rounded-xl bg-powder/40 px-4 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            E-posta
          </dt>
          <dd className="mt-1 text-sm font-semibold text-charcoal">{user.email}</dd>
        </div>
        <div className="rounded-xl bg-powder/40 px-4 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Üyelik Tarihi
          </dt>
          <dd className="mt-1 text-sm font-semibold text-charcoal">
            {membershipDate}
          </dd>
        </div>
        <div className="rounded-xl bg-powder/40 px-4 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Hesap Durumu
          </dt>
          <dd className="mt-1 text-sm font-semibold text-emerald-700">Aktif</dd>
        </div>
      </dl>
    </AccountShell>
  );
}
