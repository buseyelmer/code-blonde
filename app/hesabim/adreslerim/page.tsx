'use client';

import { useAddress } from '@raxonltd/raxon-core/hook';
import { MapPin, Plus, Home, Building2, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AccountButtonPrimary, AccountPageHeader, AccountSpinner } from '@/core/component/account/account.ui';

type AddressTypeUI = 'HOME' | 'WORK';

type AddressFormData = {
  id?: string;
  title: string;
  type: AddressTypeUI;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  fullAddress: string;
  administrativeAreaLevel1: string;
  administrativeAreaLevel2: string;
  administrativeAreaLevel3: string;
  postalCode: string;
  country: string;
  countryCode: string;
  isDefault: boolean;
  taxNumber?: string;
  taxOffice?: string;
  companyName?: string;
};

const defaultFormData: AddressFormData = {
  title: '',
  type: 'HOME',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  fullAddress: '',
  administrativeAreaLevel1: '',
  administrativeAreaLevel2: '',
  administrativeAreaLevel3: '',
  postalCode: '',
  country: 'Türkiye',
  countryCode: 'TR',
  isDefault: false,
  taxNumber: '',
  taxOffice: '',
  companyName: '',
};

export default function AdreslerimPage() {
  const { fetch, delete: deleteAddress, create, update, detail } = useAddress();
  const { data: addressesData, isLoading, refetch } = fetch();
  const addresses = addressesData?.data || [];
  const removeMutation = deleteAddress();
  const createMutation = create();
  const updateMutation = update();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<AddressFormData>({
    defaultValues: defaultFormData,
  });

  const handleEdit = (addressId: string) => {
    const address = addresses.find(a => a.id === addressId);
    if (!address) return;

    form.reset({
      id: address.id,
      title: address.title || '',
      type: (address.type === 'DELIVERY' ? 'HOME' : 'WORK') as AddressTypeUI,
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      phoneNumber: address.phoneNumber || '',
      fullAddress: address.fullAddress || '',
      administrativeAreaLevel1: address.administrativeAreaLevel1 || '',
      administrativeAreaLevel2: address.administrativeAreaLevel2 || '',
      administrativeAreaLevel3: address.administrativeAreaLevel3 || '',
      postalCode: address.postalCode || '',
      country: address.country || 'Türkiye',
      countryCode: address.countryCode || 'TR',
      isDefault: false,
      taxNumber: address.taxNumber || '',
      taxOffice: address.taxOffice || '',
      companyName: address.companyName || '',
    });
    setEditingId(addressId);
    setShowForm(true);
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
      }
    });
  };

  const handleSubmit = (data: AddressFormData) => {
    const payload = {
      ...data,
      streetName: data.fullAddress,
    };

    if (editingId) {
      updateMutation.mutate({ ...payload, id: editingId }, {
        onSuccess: () => {
          toast.success('Adres güncellendi');
          setShowForm(false);
          setEditingId(null);
          form.reset(defaultFormData);
          refetch();
        },
        onError: () => {
          toast.error('Güncelleme başarısız');
        }
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Adres eklendi');
          setShowForm(false);
          form.reset(defaultFormData);
          refetch();
        },
        onError: () => {
          toast.error('Ekleme başarısız');
        }
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    form.reset(defaultFormData);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) return <AccountSpinner />;

  const addressesList = addresses || [];

  return (
    <div className="space-y-8">
      <AccountPageHeader
        title="Adreslerim"
        subtitle="Teslimat adreslerinizi yönetin"
        action={
          !showForm ? (
            <AccountButtonPrimary onClick={() => setShowForm(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Yeni Adres
            </AccountButtonPrimary>
          ) : undefined
        }
      />

      {/* Address Form */}
      {showForm && (
        <div className="rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              {editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-5">
            {/* Address Type */}
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-3">
                Adres Tipi
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => form.setValue('type', 'HOME')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                    form.watch('type') === 'HOME'
                      ? 'border-[#5C4638] bg-[#5C4638] text-white'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Ev
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue('type', 'WORK')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                    form.watch('type') === 'WORK'
                      ? 'border-[#5C4638] bg-[#5C4638] text-white'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  İş
                </button>
              </div>
              <input type="hidden" {...form.register('type')} />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                Adres Başlığı
              </label>
              <input
                {...form.register('title', { required: 'Adres başlığı gerekli' })}
                placeholder="Örn: Ev Adresi, İş Adresi"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#5C4638] transition-colors"
              />
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                  Ad
                </label>
                <input
                  {...form.register('firstName', { required: 'Ad gerekli' })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#5C4638] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                  Soyad
                </label>
                <input
                  {...form.register('lastName', { required: 'Soyad gerekli' })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#5C4638] transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                Telefon
              </label>
              <input
                {...form.register('phoneNumber', { required: 'Telefon gerekli' })}
                placeholder="0 (5XX) XXX XX XX"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#5C4638] transition-colors"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                Açık Adres
              </label>
              <textarea
                {...form.register('fullAddress', { required: 'Adres gerekli' })}
                rows={3}
                placeholder="Sokak, bina no, daire no..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#5C4638] transition-colors resize-none"
              />
            </div>

            {/* City/District */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                  İl
                </label>
                <input
                  {...form.register('administrativeAreaLevel1', { required: 'İl gerekli' })}
                  placeholder="İstanbul"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#5C4638] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                  İlçe
                </label>
                <input
                  {...form.register('administrativeAreaLevel2', { required: 'İlçe gerekli' })}
                  placeholder="Kadıköy"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#5C4638] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                  Posta Kodu
                </label>
                <input
                  {...form.register('postalCode')}
                  placeholder="34000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#5C4638] transition-colors"
                />
              </div>
            </div>

            {/* Company Info (only for WORK type) */}
            {form.watch('type') === 'WORK' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Şirket Bilgileri (İsteğe Bağlı)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                      Şirket Adı
                    </label>
                    <input
                      {...form.register('companyName')}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#5C4638] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                      Vergi Dairesi
                    </label>
                    <input
                      {...form.register('taxOffice')}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#5C4638] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                    Vergi Numarası / TCKN
                  </label>
                  <input
                    {...form.register('taxNumber')}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#5C4638] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#5C4638] text-white rounded-lg hover:bg-[#3F2F25] transition-colors text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {editingId ? 'Güncelle' : 'Kaydet'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses Grid */}
      {addressesList.length === 0 ? (
        <div className="rounded-sm border border-[#D9C5B0]/50 bg-[#FDFAF6] p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Kayıtlı Adresiniz Yok</h3>
          <p className="text-sm text-gray-500 mb-6">Teslimat adresi ekleyin.</p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5C4638] text-white rounded-lg hover:bg-[#3F2F25] transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Adres Ekle
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addressesList.map((address: any) => (
            <div
              key={address.id}
              className={`bg-white rounded-xl border overflow-hidden transition-colors ${
                address.isDefault ? 'border-[#5C4638]' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      address.isDefault ? 'bg-[#5C4638] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {address.type === 'WORK' ? <Building2 className="w-5 h-5" /> : <Home className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{address.title}</h3>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                          <Check className="w-3 h-3" />
                          Varsayılan
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(address.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(address.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-sm text-gray-900">{address.firstName} {address.lastName}</p>
                  <p className="text-sm text-gray-600">{address.phoneNumber}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {address.fullAddress}
                    {address.administrativeAreaLevel2 && `, ${address.administrativeAreaLevel2}`}
                    {address.administrativeAreaLevel1 && `, ${address.administrativeAreaLevel1}`}
                  </p>
                  {address.postalCode && (
                    <p className="text-sm text-gray-500">{address.postalCode}</p>
                  )}
                  {address.companyName && (
                    <p className="text-sm text-gray-500 mt-2">{address.companyName}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
