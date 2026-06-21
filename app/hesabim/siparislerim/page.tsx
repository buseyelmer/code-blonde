"use client";

import { useOrder } from "@raxonltd/raxon-core/hook";
import { Package, Truck, CheckCircle, Clock, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AccountPageHeader, AccountSpinner } from "@/core/component/account/account.ui";

const statusConfig: Record<string, { label: string; className: string; icon: LucideIcon }> = {
  PENDING: {
    label: "Bekliyor",
    className: "border-[#D9C5B0] bg-[#F8F1E9] text-[#8B6B57]",
    icon: Clock,
  },
  PROCESSING: {
    label: "Hazırlanıyor",
    className: "border-[#C9A99A]/50 bg-[#EDE0D1]/40 text-[#5C4638]",
    icon: Package,
  },
  SHIPPED: {
    label: "Kargoda",
    className: "border-[#A17E65]/40 bg-[#F5EDE4] text-[#5C4638]",
    icon: Truck,
  },
  DELIVERED: {
    label: "Teslim Edildi",
    className: "border-[#5C4638]/30 bg-[#EDE0D1]/60 text-[#5C4638]",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "İptal Edildi",
    className: "border-[#D9C5B0] bg-[#F8F1E9] text-[#8B6B57]/70",
    icon: Clock,
  },
};

export default function SiparislerimPage() {
  const { fetch } = useOrder();
  const { data: ordersData, isLoading } = fetch();
  const ordersList = ordersData?.data ?? [];

  if (isLoading) return <AccountSpinner />;

  return (
    <div className="space-y-8">
      <AccountPageHeader
        title="Siparişlerim"
        subtitle="Tüm siparişlerinizi görüntüleyin ve takip edin"
      />

      {ordersList.length === 0 ? (
        <div className="rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] px-6 py-16 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-[#D9C5B0]" strokeWidth={1.25} />
          <h2 className="font-serif text-xl text-[#5C4638]">Henüz siparişiniz yok</h2>
          <p className="mt-2 text-sm text-[#8B6B57]">İlk siparişinizi vermek için ürünlerimize göz atın.</p>
          <Link
            href="/urunler"
            className="mt-8 inline-flex items-center gap-2 border border-[#5C4638] px-6 py-3 text-[10px] tracking-[0.24em] uppercase text-[#5C4638] transition hover:bg-[#5C4638] hover:text-[#F8F1E9]"
          >
            Alışverişe Başla
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ordersList.map((order: {
            id: string;
            orderNumber?: string;
            createdAt: string;
            totalPayAmount?: number;
            status?: { status?: string };
            items?: { quantity: number }[];
          }) => {
            const status = statusConfig[order.status?.status || "PENDING"] || statusConfig.PENDING;
            const StatusIcon = status.icon;

            return (
              <Link
                key={order.id}
                href={`/hesabim/siparislerim/${order.id}`}
                className="block overflow-hidden rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] transition hover:border-[#A17E65]/50 hover:shadow-[0_4px_20px_-8px_rgba(92,70,56,0.1)]"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9C5B0]/60 bg-[#F8F1E9]">
                        <Package className="h-5 w-5 text-[#A17E65]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#5C4638]">
                          Sipariş #{order.orderNumber || order.id.slice(-8)}
                        </p>
                        <p className="mt-0.5 text-xs text-[#8B6B57]">
                          {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] tracking-[0.12em] uppercase ${status.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {status.label}
                      </span>
                      <span className="font-mono text-sm tabular-nums text-[#5C4638]">
                        {(order.totalPayAmount as number)?.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      </span>
                      <ChevronRight className="h-5 w-5 text-[#D9C5B0]" strokeWidth={1.5} />
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 border-t border-[#D9C5B0]/30 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-[#FDFAF6] bg-[#F5EDE4] text-xs text-[#8B6B57]"
                            >
                              {item.quantity}x
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-[#8B6B57]">{order.items.length} ürün</p>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
