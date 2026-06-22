'use client';

import { useAddress } from '@raxonltd/raxon-core/hook';
import { useRaxon } from '@raxonltd/raxon-core';
import { AddressType } from '@raxonltd/raxon-core/interface/prisma.interface';
import { MapPin, Plus, Home, Building2, Trash2, Edit2, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  AccountButtonPrimary,
  AccountPageHeader,
  AccountSpinner,
} from '@/core/component/account/account.ui';
import {
  AddressModal,
  type AddressFormData,
} from '@/core/component/account/AddressModal';

export default function AdreslerimPage() {
  const { profile } = useRaxon();
  const { fetch, delete: deleteAddress, create, update } = useAddress();
  const { data: addressesData, isLoading, refetch } = fetch();
  const addresses = addressesData?.data || [];
  const removeMutation = deleteAddress();
  const createMutation = create();
  const updateMutation = update();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<AddressFormData | null>(null);

  const openAddForm = () => {
    setEditingData(null);
    setIsFormOpen(true);
  };

  const handleEdit = (addressId: string) => {
    const address = addresses.find((a) => a.id === addressId);
    if (!address) return;

    setEditingData({
      id: address.id,
      title: address.title || '',
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      phoneNumber: address.phoneNumber || '',
      street: address.fullAddress || '',
      buildingNumber: '',
      apartmentNumber: '',
      fullAddress: address.fullAddress || '',
      administrativeAreaLevel1: address.administrativeAreaLevel1 || '',
      administrativeAreaLevel2: address.administrativeAreaLevel2 || '',
      administrativeAreaLevel3: address.administrativeAreaLevel3 || '',
      postalCode: address.postalCode || '',
      country: address.country || 'Türkiye',
      countryCode: address.countryCode || 'TR',
      isDefault: false,
      useAsBillingAddress: address.type === 'INVOICE',
      taxNumber: address.taxNumber || '',
      taxOffice: address.taxOffice || '',
      companyName: address.companyName || '',
    });
    setIsFormOpen(true);
  };

  const handleRemove = (id: string) => {
    if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) return;

    removeMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Adres silindi');
        refetch();
      },
      onError: () => {
        toast.error('İşlem başarısız');
      },
    });
  };

  const buildAddressPayload = (data: AddressFormData) => {
    const fullAddr = [data.street, data.buildingNumber, data.apartmentNumber].filter(Boolean).join(', ');
    const phoneDigits = data.phoneNumber.replace(/\D/g, '').replace(/^90/, '');

    return {
      title: data.title || 'Teslimat',
      type: data.useAsBillingAddress ? AddressType.INVOICE : AddressType.DELIVERY,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: phoneDigits || data.phoneNumber,
      postalCode: data.postalCode,
      administrativeAreaLevel1: data.administrativeAreaLevel1.trim(),
      administrativeAreaLevel2: data.administrativeAreaLevel2.trim(),
      administrativeAreaLevel3: data.administrativeAreaLevel3 || '',
      fullAddress: fullAddr || data.fullAddress,
      streetName: data.street,
      buildingName: data.buildingNumber || null,
      apartmentNumber: data.apartmentNumber || null,
      country: data.country || 'Türkiye',
      countryCode: data.countryCode || 'TR',
      ...(data.useAsBillingAddress
        ? {
            companyName: data.companyName || null,
            taxNumber: data.taxNumber || null,
            taxOffice: data.taxOffice || null,
          }
        : {}),
    };
  };

  const handleSubmit = (data: AddressFormData) => {
    const payload = buildAddressPayload(data);

    if (editingData?.id) {
      updateMutation.mutate(
        { ...payload, id: editingData.id },
        {
          onSuccess: () => {
            toast.success('Adres güncellendi');
            setIsFormOpen(false);
            setEditingData(null);
            refetch();
          },
          onError: () => {
            toast.error('Güncelleme başarısız');
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Adres eklendi');
          setIsFormOpen(false);
          refetch();
        },
        onError: () => {
          toast.error('Ekleme başarısız');
        },
      });
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) return <AccountSpinner />;

  const addressesList = (addresses || []) as Array<{
    id: string;
    title?: string;
    type?: string;
    isDefault?: boolean;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    fullAddress?: string;
    administrativeAreaLevel1?: string;
    administrativeAreaLevel2?: string;
    postalCode?: string;
    companyName?: string;
  }>;

  return (
    <div className="space-y-8">
      <AccountPageHeader
        title="Adreslerim"
        subtitle="Teslimat adreslerinizi yönetin"
        action={
          <AccountButtonPrimary onClick={openAddForm} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Yeni Adres
          </AccountButtonPrimary>
        }
      />

      {addressesList.length === 0 ? (
        <div className="rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] p-12 text-center">
          <MapPin className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">Kayıtlı Adresiniz Yok</h3>
          <p className="mb-6 text-sm text-gray-500">Teslimat adresi ekleyin.</p>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-lg bg-[#5C4638] px-6 py-3 text-sm text-white transition hover:bg-[#3F2F25]"
          >
            <Plus className="h-4 w-4" />
            Adres Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addressesList.map((address) => (
            <div
              key={address.id}
              className={`overflow-hidden rounded-xl border bg-white transition-colors ${
                address.isDefault ? 'border-[#5C4638]' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        address.isDefault ? 'bg-[#5C4638] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {address.type === 'INVOICE' ? (
                        <Building2 className="h-5 w-5" />
                      ) : (
                        <Home className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{address.title}</h3>
                      {address.isDefault && (
                        <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-gray-600">
                          <Check className="h-3 w-3" />
                          Varsayılan
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(address.id)}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(address.id)}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-sm text-gray-900">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{address.phoneNumber}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {address.fullAddress}
                    {address.administrativeAreaLevel2 && `, ${address.administrativeAreaLevel2}`}
                    {address.administrativeAreaLevel1 && `, ${address.administrativeAreaLevel1}`}
                  </p>
                  {address.postalCode && (
                    <p className="text-sm text-gray-500">{address.postalCode}</p>
                  )}
                  {address.companyName && (
                    <p className="mt-2 text-sm text-gray-500">{address.companyName}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        editingData={editingData}
        defaultRecipient={{
          firstName: profile?.firstName ?? undefined,
          lastName: profile?.lastName ?? undefined,
          phoneNumber: profile?.phoneNumber ?? undefined,
        }}
      />
    </div>
  );
}
