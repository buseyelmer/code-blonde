"use client";

import { useOrder } from "@raxonltd/raxon-core/hook";
import { Order, TrackingCode } from "@raxonltd/raxon-core/interface/prisma.interface";
import { MapPin, Truck } from "lucide-react";
import { useParams } from "next/navigation";
function isTrackingCodeObject(tc: Order['trackingCode']): tc is TrackingCode {
  return tc !== null && tc !== undefined && typeof tc === 'object' && 'trackingNumber' in tc;
}
export default function SiparisDetayPaymentPage() {

    const params = useParams();
    const orderId = params.id as string;
    const { detail } = useOrder();
    const { data: order, isLoading } = detail(orderId);
  
    if (order === undefined) {
      return <div>Sipariş bulunamadı</div>;
    }
    
  return (
    <>
      <div className='space-y-6'>
        <div>
          <h3 className='text-sm uppercase tracking-[0.15em] text-gray-500 font-medium mb-4'>Teslimat Adresi</h3>
          {order.deliveryAddress ? (
            <div className='p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-start gap-3'>
                <MapPin className='w-5 h-5 text-gray-400 mt-0.5' />
                <div>
                  <p className='font-medium text-gray-900'>
                    {order.deliveryAddress.firstName} {order.deliveryAddress.lastName}
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>{order.deliveryAddress.phoneNumber}</p>
                  <p className='text-sm text-gray-600 mt-2'>
                    {order.deliveryAddress.fullAddress}
                    {order.deliveryAddress.administrativeAreaLevel2 && `, ${order.deliveryAddress.administrativeAreaLevel2}`}
                    {order.deliveryAddress.administrativeAreaLevel1 && `, ${order.deliveryAddress.administrativeAreaLevel1}`}
                  </p>
                  {order.deliveryAddress.postalCode && <p className='text-sm text-gray-500 mt-1'>{order.deliveryAddress.postalCode}</p>}
                </div>
              </div>
            </div>
          ) : (
            <p className='text-sm text-gray-500'>Teslimat adresi bilgisi bulunmuyor.</p>
          )}
        </div>

        <div>
          <h3 className='text-sm uppercase tracking-[0.15em] text-gray-500 font-medium mb-4'>Kargo Bilgisi</h3>
          <div className='p-4 bg-gray-50 rounded-lg'>
            <div className='flex items-start gap-3'>
              <Truck className='w-5 h-5 text-gray-400 mt-0.5' />
              <div>
                <p className='font-medium text-gray-900'>{order.deliveryMethod?.name || "Kargo"}</p>
                {order.deliveryMethod?.description && <p className='text-sm text-gray-600 mt-0.5'>{order.deliveryMethod.description}</p>}
                {typeof order.deliveryMethod?.courierFee === "number" && (
                  <p className='text-sm text-gray-600 mt-1'>Kargo ücreti: {order.deliveryMethod.courierFee.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</p>
                )}
                {order.trackingCode && (
                  <div className='mt-2'>
                    <p className='text-sm text-gray-600'>Takip:</p>
                    {typeof order.trackingCode === "string" ? (
                      /^https?:\/\//i.test(order.trackingCode) ? (
                        <a href={order.trackingCode} target='_blank' rel='noopener noreferrer' className='text-sm font-medium text-blue-600 hover:underline break-all'>
                          {order.trackingCode}
                        </a>
                      ) : (
                        <p className='text-sm font-medium text-gray-900 break-all'>{order.trackingCode}</p>
                      )
                    ) : isTrackingCodeObject(order.trackingCode) ? (
                      <>
                        <p className='text-sm font-medium text-gray-900'>{order.trackingCode.trackingNumber}</p>
                        {order.trackingCode.trackingLink && (
                          <a href={order.trackingCode.trackingLink} target='_blank' rel='noopener noreferrer' className='text-sm text-blue-600 hover:underline mt-1 inline-block'>
                            Kargoyu Takip Et →
                          </a>
                        )}
                      </>
                    ) : null}
                  </div>
                )}
                {order.deliveryDate && <p className='text-sm text-gray-600 mt-2'>Teslimat Tarihi: {new Date(order.deliveryDate).toLocaleDateString("tr-TR")}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
