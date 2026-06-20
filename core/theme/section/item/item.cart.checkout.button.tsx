"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

type ItemCartCheckoutButtonProps = {
  label?: string;
  className?: string;
};

export function ItemCartCheckoutButton({
  label = "Ödemeyi Tamamla",
  className = "",
}: ItemCartCheckoutButtonProps) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  const handleCheckout = () => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      className={`btn-primary-solid w-full py-3.5 text-base shadow-md ${className}`}
    >
      {label}
    </button>
  );
}
