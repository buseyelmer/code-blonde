"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { AuthFormLayout } from "@/components/auth/AuthFormLayout";
import { useAuth } from "@/lib/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  if (isAuthenticated) {
    return (
      <div className="px-4 py-16 text-center text-sm text-muted">
        Yönlendiriliyorsunuz...
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = login(email, password);
    if (!result.ok) {
      setError(result.error ?? "Giriş başarısız.");
      return;
    }

    router.push(redirectTo);
  };

  return (
    <AuthFormLayout
      title="Giriş Yap"
      subtitle="Hesabınıza giriş yaparak alışverişe devam edin."
      footerText="Hesabınız yok mu?"
      footerHref="/register"
      footerLinkLabel="Kayıt Ol"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-muted">E-posta</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-purple/40"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Şifre</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-purple/40"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-purple"
        >
          Giriş Yap
        </button>
      </form>
    </AuthFormLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-16 text-center text-sm text-muted">
          Yükleniyor...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
