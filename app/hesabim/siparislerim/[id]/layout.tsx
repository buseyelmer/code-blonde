"use client";

import { GENERAL_STATUS_CONFIG } from "@/core/constant/general.constant";
import { useOrder, useInvoice } from "@raxonltd/raxon-core/hook";
import type { Order, OrderItem, TrackingCode } from "@raxonltd/raxon-core/interface/prisma.interface";
import { Package, Truck, CheckCircle, Clock, ChevronLeft, MapPin, CreditCard, FileText, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

/** API `deliveryStatus` (DeliveryStatus) + eski sipariş durumu kodları için */
const deliveryProgressSteps = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;

function resolveStatusCode(order: Order): string {
  if (order.deliveryStatus) return order.deliveryStatus;
  const dict = order.status?.name;
  const legacy = dict?.[0]?.code || dict?.[0]?.value || (Array.isArray(dict) ? (dict as { getName?: () => string }).getName?.() : null);
  if (legacy && legacy !== "----") {
    const map: Record<string, string> = {
      PROCESSING: "IN_PROGRESS",
      SHIPPED: "IN_PROGRESS",
      DELIVERED: "COMPLETED",
    };
    return map[legacy] || legacy;
  }
  return "PENDING";
}

export default function SiparisDetayLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const orderId = params.id as string;

  const { detail } = useOrder();
  const { downloadByOrder } = useInvoice();
  const { data: order, isLoading } = detail(orderId);
  const downloadMutation = downloadByOrder();

  const [activeTab, setActiveTab] = useState<"items" | "shipping" | "payment">("items");

  const handleDownloadInvoice = () => {
    downloadMutation.mutate(orderId, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `fatura-${order?.orderNumber || orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Fatura indirildi");
      },
      onError: () => {
        toast.error("Fatura indirilemedi");
      },
    });
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 className='w-8 h-8 animate-spin text-gray-900' />
      </div>
    );
  }

  if (!order) {
    return (
      <div className='space-y-6'>
        <div className='bg-white rounded-xl border border-gray-200 p-12 text-center'>
          <Package className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>Sipariş Bulunamadı</h3>
          <p className='text-sm text-gray-500 mb-6'>Aradığınız sipariş mevcut değil.</p>
          <Link href='/hesabim/siparislerim' className='inline-flex items-center gap-2 px-6 py-3 bg-rose-900 text-white rounded-lg hover:bg-rose-800 transition-colors text-sm'>
            <ChevronLeft className='w-4 h-4' />
            Siparişlerime Dön
          </Link>
        </div>
      </div>
    );
  }

  const statusCode = resolveStatusCode(order);
  const status = GENERAL_STATUS_CONFIG[statusCode] || GENERAL_STATUS_CONFIG.PENDING;
  const StatusIcon = status.icon;

  const progressActiveIndex =
    statusCode === "CANCELLED" ? -1 : (deliveryProgressSteps as readonly string[]).indexOf(statusCode) >= 0 ? (deliveryProgressSteps as readonly string[]).indexOf(statusCode) : 0;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <Link href='/hesabim/siparislerim' className='inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-2'>
            <ChevronLeft className='w-4 h-4' />
            Siparişlerim
          </Link>
          <h1 className='text-2xl md:text-3xl text-gray-900 font-serif font-bold'>Sipariş #{order.orderNumber || order.id.slice(-8)}</h1>
          <p className='text-sm text-gray-600 mt-1'>{new Date(order.createdAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <div className='flex items-center gap-3'>
          {order.invoice && order.invoice.length > 0 && (
            <button
              onClick={handleDownloadInvoice}
              disabled={downloadMutation.isPending}
              className='flex items-center gap-2 px-4 py-2 bg-rose-900 text-white rounded-lg hover:bg-rose-800 transition-colors text-sm disabled:opacity-50'>
              {downloadMutation.isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : <Download className='w-4 h-4' />}
              Fatura İndir
            </button>
          )}
        </div>
      </div>

      {/* Status Card */}
      <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
        <div className={`p-6 ${status.color} bg-opacity-50`}>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-xl bg-white bg-opacity-80 flex items-center justify-center'>
              <StatusIcon className='w-6 h-6' />
            </div>
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
              <p className='text-sm text-gray-700 mt-1'>{status.description}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='px-6 py-4 border-t border-gray-100'>
          <div className='flex items-center justify-between'>
            {deliveryProgressSteps.map((step, index) => {
              const stepStatus = GENERAL_STATUS_CONFIG[step];
              const isActive = statusCode !== "CANCELLED" && index <= progressActiveIndex;
              const isCurrent = statusCode !== "CANCELLED" && index === progressActiveIndex;

              return (
                <div key={step} className='flex flex-col items-center flex-1'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      isActive ? "bg-rose-900 text-white" : "bg-gray-200 text-gray-500"
                    } ${isCurrent ? "ring-2 ring-rose-900 ring-offset-2" : ""}`}>
                    {index + 1}
                  </div>
                  <span className={`text-xs mt-2 text-center ${isActive ? "text-gray-900 font-medium" : "text-gray-400"}`}>{stepStatus?.label ?? step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
        <div className='border-b border-gray-200'>
          <div className='flex'>
            <button
              onClick={() => setActiveTab("items")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === "items" ? "text-rose-900 border-b-2 border-rose-900" : "text-gray-500 hover:text-gray-700"}`}>
              Ürünler
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === "shipping" ? "text-rose-900 border-b-2 border-rose-900" : "text-gray-500 hover:text-gray-700"}`}>
              Teslimat
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === "payment" ? "text-rose-900 border-b-2 border-rose-900" : "text-gray-500 hover:text-gray-700"}`}>
              Ödeme
            </button>
          </div>
        </div>

        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
}
