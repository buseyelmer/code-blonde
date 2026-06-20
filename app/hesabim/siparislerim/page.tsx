'use client';

import { useOrder } from '@raxonltd/raxon-core/hook';
import { Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PROCESSING: { label: 'Hazırlanıyor', color: 'bg-blue-100 text-blue-800', icon: Package },
  SHIPPED: { label: 'Kargoda', color: 'bg-purple-100 text-purple-800', icon: Truck },
  DELIVERED: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'İptal Edildi', color: 'bg-red-100 text-red-800', icon: Clock },
};

export default function SiparislerimPage() {
  const { fetch } = useOrder();
  const { data: ordersData, isLoading } = fetch();
  const orders = ordersData?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  const ordersList = orders || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl text-gray-900 font-serif font-bold">
          Siparişlerim
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Tüm siparişlerinizi görüntüleyin ve takip edin
        </p>
      </div>

      {/* Orders List */}
      {ordersList.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Siparişiniz Yok</h3>
          <p className="text-sm text-gray-500 mb-6">İlk siparişinizi vermek için ürünlerimize göz atın.</p>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-900 text-white rounded-lg hover:bg-rose-800 transition-colors text-sm"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ordersList.map((order: any) => {
            const status = statusConfig[order.status?.status || 'PENDING'] || statusConfig.PENDING;
            const StatusIcon = status.icon;

            return (
              <Link
                key={order.id}
                href={`/hesabim/siparislerim/${order.id}`}
                className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Sipariş #{order.orderNumber || order.id.slice(-8)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {(order.totalPayAmount as number)?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="w-10 h-10 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600"
                            >
                              {item.quantity}x
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.items.length} ürün
                        </p>
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
