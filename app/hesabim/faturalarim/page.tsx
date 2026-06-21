'use client';

import { useInvoice } from '@raxonltd/raxon-core/hook';
import { FileText, Download, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { AccountPageHeader, AccountSpinner, accountLabelClass } from "@/core/component/account/account.ui";

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID: { label: "Ödendi", className: "border-[#5C4638]/30 bg-[#EDE0D1]/60 text-[#5C4638]" },
  PENDING: { label: "Bekliyor", className: "border-[#D9C5B0] bg-[#F8F1E9] text-[#8B6B57]" },
  CANCELLED: { label: "İptal", className: "border-[#D9C5B0] bg-[#F8F1E9] text-[#8B6B57]/70" },
  ISSUED: { label: "Kesildi", className: "border-[#A17E65]/40 bg-[#F5EDE4] text-[#5C4638]" },
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

  if (isLoading) return <AccountSpinner />;

  return (
    <div className="space-y-8">
      <AccountPageHeader
        title="Faturalarım"
        subtitle="Tüm faturalarınızı görüntüleyin ve indirin"
      />

      {invoices.length === 0 ? (
        <div className="rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] px-6 py-16 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-[#D9C5B0]" strokeWidth={1.25} />
          <h2 className="font-serif text-xl text-[#5C4638]">Henüz faturanız yok</h2>
          <p className="mt-2 text-sm text-[#8B6B57]">Siparişlerinizin faturaları burada görünecek.</p>
          <Link
            href="/urunler"
            className="mt-8 inline-flex items-center gap-2 border border-[#5C4638] px-6 py-3 text-[10px] tracking-[0.24em] uppercase text-[#5C4638] transition hover:bg-[#5C4638] hover:text-[#F8F1E9]"
          >
            Alışverişe Başla
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="border-b border-[#D9C5B0]/40 bg-[#F8F1E9]/80">
                <tr>
                  <th className={`px-5 py-4 text-left sm:px-6 ${accountLabelClass}`}>Fatura No</th>
                  <th className={`px-5 py-4 text-left sm:px-6 ${accountLabelClass}`}>Sipariş</th>
                  <th className={`px-5 py-4 text-left sm:px-6 ${accountLabelClass}`}>Tarih</th>
                  <th className={`px-5 py-4 text-left sm:px-6 ${accountLabelClass}`}>Tutar</th>
                  <th className={`px-5 py-4 text-left sm:px-6 ${accountLabelClass}`}>Durum</th>
                  <th className={`px-5 py-4 text-right sm:px-6 ${accountLabelClass}`}>İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9C5B0]/30">
                {invoices.map((invoice) => {
                  const status = statusConfig[invoice.status] || statusConfig.PENDING;
                  
                  return (
                    <tr key={invoice.id} className="transition hover:bg-[#F8F1E9]/50">
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-[#A17E65]" strokeWidth={1.5} />
                          <span className="text-sm font-medium text-[#5C4638]">{invoice.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#8B6B57] sm:px-6">
                        {invoice.order?.[0]?.orderNumber || "-"}
                      </td>
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-2 text-sm text-[#8B6B57]">
                          <Calendar className="h-4 w-4" strokeWidth={1.5} />
                          {invoice.invoiceDate
                            ? new Date(invoice.invoiceDate).toLocaleDateString("tr-TR")
                            : "-"}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-sm tabular-nums text-[#5C4638] sm:px-6">
                        {(invoice.totalPayAmount || 0).toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      </td>
                      <td className="px-5 py-4 sm:px-6">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right sm:px-6">
                        <button
                          type="button"
                          onClick={() => handleDownload(invoice.id, invoice.invoiceNumber)}
                          disabled={downloadMutation.isPending}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#D9C5B0] px-3 py-1.5 text-xs text-[#5C4638] transition hover:border-[#5C4638] disabled:opacity-50"
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
