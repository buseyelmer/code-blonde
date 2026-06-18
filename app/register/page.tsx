"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthFormLayout } from "@/components/auth/AuthFormLayout";
import { useAuth } from "@/lib/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="px-4 py-16 text-center text-sm text-muted">
        Yönlendiriliyorsunuz...
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = register(name, email, password);
    if (!result.ok) {
      setError(result.error ?? "Kayıt başarısız.");
      return;
    }

    router.push("/");
  };

  return (
    <AuthFormLayout
      title="Kayıt Ol"
      subtitle="Code Blonde hesabınızı oluşturun ve favorilerinizi kaydedin."
      footerText="Zaten hesabınız var mı?"
      footerHref="/login"
      footerLinkLabel="Giriş Yap"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-muted">Ad Soyad</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-purple/40"
          />
        </label>
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
            autoComplete="new-password"
            className="mt-2 w-full rounded-xl border border-stone/80 bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand-purple/40"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-purple"
        >
          Kayıt Ol
        </button>
      </form>
    </AuthFormLayout>
  );
}
