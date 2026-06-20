import { Clock, Package, CheckCircle, Truck } from 'lucide-react';
export const GENERAL_STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock; description: string }> = {
    PENDING: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800', icon: Clock, description: 'Siparişiniz alındı, işleme alınmayı bekliyor.' },
    IN_PROGRESS: { label: 'Hazırlanıyor', color: 'bg-blue-100 text-blue-800', icon: Package, description: 'Siparişiniz hazırlanıyor veya yolda.' },
    COMPLETED: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800', icon: CheckCircle, description: 'Siparişiniz tamamlandı.' },
    CANCELLED: { label: 'İptal Edildi', color: 'bg-red-100 text-red-800', icon: Clock, description: 'Siparişiniz iptal edildi.' },
    PROCESSING: { label: 'Hazırlanıyor', color: 'bg-blue-100 text-blue-800', icon: Package, description: 'Siparişiniz hazırlanıyor.' },
    SHIPPED: { label: 'Kargoda', color: 'bg-purple-100 text-purple-800', icon: Truck, description: 'Siparişiniz kargoya verildi.' },
    DELIVERED: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800', icon: CheckCircle, description: 'Siparişiniz teslim edildi.' },
  };
  