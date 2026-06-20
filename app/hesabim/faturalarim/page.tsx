'use client';

import { useInvoice } from '@raxonltd/raxon-core/hook';
import { FileText, Download, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { label: string; color: string }> = {
  PAID: { label: 'Ödendi', color: 'bg-green-100 text-green-800' },
  PENDING: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800' },
  CANCELLED: { label: 'İptal', color: 'bg-red-100 text-red-800' },
  ISSUED: { label: 'Kesildi', color: 'bg-blue-100 text-blue-800' },
};

export default function FaturalarimPage() {
  const { fetch, download } = useInvoice();
  const { data: invoicesData, isLoading } = fetch();
  const downloadMutation = download();
  const invoices = invoicesData?.data || [];

  const handleDownload = (invoiceId: string, invoiceNumber: string | null) => {
    downloadMutation.mutate(invoiceId, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `fatura-${invoiceNumber || invoiceId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success('Fatura indirildi');
      },
      onError: () => {
        toast.error('Fatura indirilemedi');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl text-gray-900 font-serif font-bold">
          Faturalarım
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Tüm faturalarınızı görüntüleyin ve indirin
        </p>
      </div>

      {/* Invoices List */}
      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Faturanız Yok</h3>
          <p className="text-sm text-gray-500 mb-6">Siparişlerinizin faturaları burada görünecek.</p>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-900 text-white rounded-lg hover:bg-rose-800 transition-colors text-sm"
          >
            Alışverişe Başla
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">
                    Fatura No
                  </th>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">
                    Sipariş
                  </th>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">
                    Tarih
                  </th>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">
                    Tutar
                  </th>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">
                    Durum
                  </th>
                  <th className="text-right px-6 py-4 text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice) => {
                  const status = statusConfig[invoice.status] || statusConfig.PENDING;
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {invoice.order?.[0]?.orderNumber || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('tr-TR') : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {(invoice.totalPayAmount || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDownload(invoice.id, invoice.invoiceNumber)}
                          disabled={downloadMutation.isPending}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {downloadMutation.isPending && downloadMutation.variables === invoice.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          İndir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
