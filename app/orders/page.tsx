"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ViewAccountShell } from "@/theme/view/view.account.shell";
import { useAuth } from "@/lib/context/AuthContext";
import { useUserOrders } from "@/lib/context/OrdersContext";
import { formatPrice } from "@/lib/product-utils";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();
  const { orders, isReady: ordersReady } = useUserOrders();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login?redirect=/orders");
    }
  }, [isReady, isAuthenticated, router]);

  if (!isReady || !ordersReady || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-muted">
        Yükleniyor...
      </div>
    );
  }

  return (
    <ViewAccountShell
      title="Siparişlerim"
      subtitle="Geçmiş siparişlerinizi bu sayfadan takip edebilirsiniz."
    >
      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone/80 bg-powder/20 px-6 py-12 text-center">
          <p className="text-sm text-muted">Henüz siparişiniz bulunmuyor.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone/70 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-3 py-3">Sipariş No</th>
                <th className="px-3 py-3">Tarih</th>
                <th className="px-3 py-3">Ürün</th>
                <th className="px-3 py-3">Ödeme</th>
                <th className="px-3 py-3">Durum</th>
                <th className="px-3 py-3 text-right">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-stone/40 last:border-0"
                >
                  <td className="px-3 py-4 font-medium text-charcoal">
                    {order.id}
                  </td>
                  <td className="px-3 py-4 text-muted">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-3 py-4 text-charcoal">
                    {order.items.length} ürün
                  </td>
                  <td className="px-3 py-4 text-muted">
                    {order.paymentMethod === "card" ? "Kredi Kartı" : "Havale/EFT"}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {order.status === "completed" ? "Tamamlandı" : "Beklemede"}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right font-semibold text-charcoal">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ViewAccountShell>
  );
}
