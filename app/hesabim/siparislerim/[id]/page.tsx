import { useInvoice, useOrder } from "@raxonltd/raxon-core/hook";
import { OrderItem } from "@raxonltd/raxon-core/interface/prisma.interface";
import { Package } from "lucide-react";
import { useParams } from "next/navigation";
function orderItemImageSrc(item: OrderItem): string | null {
  const base = process.env.NEXT_PUBLIC_STORAGE_URL?.replace(/\/$/, "");
  if (!base) return null;
  if (item.productImage) {
    const path = item.productImage.replace(/^\//, "");
    return `${base}/${path}`;
  }
  const rel = item.variant?.media?.[0]?.relativePath;
  if (rel) return `${base}/${rel.replace(/^\//, "")}`;
  return null;
}

export default function SiparisDetayPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { detail } = useOrder();
  const { data: order, isLoading } = detail(orderId);

  if (order === undefined) {
    return <div>Sipariş bulunamadı</div>;
  }

  return (
    <>
      <div className='space-y-4'>
        <h3 className='text-sm uppercase tracking-[0.15em] text-gray-500 font-medium mb-4'>Sipariş Ürünleri ({order.items?.length || 0})</h3>
        {order.items?.map((item) => {
          const imgSrc = orderItemImageSrc(item);
          const lineTotal = item.linePayAmount ?? item.totalPayAmount ?? 0;
          const unitPrice = item.unitFinalTaxIncludePrice ?? item.lineUnitPrice ?? (item.quantity ? lineTotal / item.quantity : 0);

          return (
            <div key={item.id} className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
              <div className='w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                {imgSrc ? <img src={imgSrc} alt={item.productName || ""} className='w-full h-full object-cover rounded-lg' /> : <Package className='w-6 h-6 text-gray-400' />}
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='font-medium text-gray-900 truncate'>{item.productName}</h4>
                <p className='text-sm text-gray-500'>
                  {item.variant?.variantNumber || item.productUnitName || item.unitName || "Adet"} × {item.quantity}
                </p>
              </div>
              <div className='text-right'>
                <p className='font-medium text-gray-900'>{lineTotal.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</p>
                <p className='text-xs text-gray-500'>{unitPrice.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })} / adet</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
