"use client";

import { useOrder } from "@raxonltd/raxon-core/hook";
import { CreditCard, FileText } from "lucide-react";
import { useParams } from "next/navigation";


const paymentStatusConfig: Record<string, { label: string; color: string }> = {
    PAID: { label: 'Ödendi', color: 'text-green-600' },
    PENDING: { label: 'Bekliyor', color: 'text-yellow-600' },
    FAILED: { label: 'Başarısız', color: 'text-red-600' },
    REFUNDED: { label: 'İade Edildi', color: 'text-blue-600' },
  };
  
export default function SiparisDetayPaymentPage() {
    
    const params = useParams();
    const orderId = params.id as string;
    const { detail } = useOrder();
    const { data: order, isLoading } = detail(orderId);

   

  
    if (order === undefined) {
      return <div>Sipariş bulunamadı</div>;
    }
    const paymentStatus = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.PENDING;
    return <>
   

<div className="space-y-6">
              <div>
                <h3 className="text-sm uppercase tracking-[0.15em] text-gray-500 font-medium mb-4">
                  Ödeme Bilgisi
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{order.paymentMethod?.name || 'Ödeme'}</p>
                      {order.paymentMethod?.description && (
                        <p className="text-sm text-gray-600">{order.paymentMethod.description}</p>
                      )}
                      <p className={`text-sm mt-0.5 ${paymentStatus.color}`}>Ödeme: {paymentStatus.label}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-[0.15em] text-gray-500 font-medium mb-4">
                  Fatura Adresi
                </h3>
                {order.invoiceAddress ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.invoiceAddress.firstName} {order.invoiceAddress.lastName}
                        </p>
                        {order.invoiceAddress.companyName && (
                          <p className="text-sm text-gray-600">{order.invoiceAddress.companyName}</p>
                        )}
                        {order.invoiceAddress.taxNumber && (
                          <p className="text-sm text-gray-500">
                            VKN: {order.invoiceAddress.taxNumber}
                            {order.invoiceAddress.taxOffice && ` - ${order.invoiceAddress.taxOffice}`}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          {order.invoiceAddress.fullAddress}
                          {order.invoiceAddress.administrativeAreaLevel2 && `, ${order.invoiceAddress.administrativeAreaLevel2}`}
                          {order.invoiceAddress.administrativeAreaLevel1 && `, ${order.invoiceAddress.administrativeAreaLevel1}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Fatura adresi bilgisi bulunmuyor.</p>
                )}
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-[0.15em] text-gray-500 font-medium mb-4">
                  Özet
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ürün Toplamı</span>
                    <span className="text-gray-900">{(order.totalProductPayAmount || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo</span>
                    <span className="text-gray-900">{(order.shipmentTotalAmount || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                  </div>
                  {order.campaignDiscountPayAmount && order.campaignDiscountPayAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">İndirim</span>
                      <span className="text-green-600">-{(order.campaignDiscountPayAmount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                    </div>
                  )}
                  {order.promoCodeDiscountPayAmount && order.promoCodeDiscountPayAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Promosyon Kodu İndirimi</span>
                      <span className="text-green-600">-{(order.promoCodeDiscountPayAmount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Toplam</span>
                      <span className="font-medium text-gray-900">{(order.totalPayAmount || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </>
}