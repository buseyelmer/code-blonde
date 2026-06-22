'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, X } from 'lucide-react';
import { useAddressAutocomplete } from '@/core/hook/use-address-autocomplete';
import { parsedAddressToFormFields, type ParsedAddressData } from '@/core/util/places.api';

import { AddressSearchInput } from '@/core/component/account/address-search-input';

export type AddressFormData = {
  id?: string;
  title: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  fullAddress: string;
  administrativeAreaLevel1: string;
  administrativeAreaLevel2: string;
  administrativeAreaLevel3: string;
  postalCode: string;
  country: string;
  countryCode: string;
  isDefault: boolean;
  useAsBillingAddress: boolean;
  taxNumber?: string;
  taxOffice?: string;
  companyName?: string;
};

const defaultFormData: AddressFormData = {
  title: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  street: '',
  buildingNumber: '',
  apartmentNumber: '',
  fullAddress: '',
  administrativeAreaLevel1: '',
  administrativeAreaLevel2: '',
  administrativeAreaLevel3: '',
  postalCode: '',
  country: 'Türkiye',
  countryCode: 'TR',
  isDefault: false,
  useAsBillingAddress: false,
  taxNumber: '',
  taxOffice: '',
  companyName: '',
};

function buildFullAddress(data: Pick<AddressFormData, 'street' | 'buildingNumber' | 'apartmentNumber'>) {
  return [data.street, data.buildingNumber, data.apartmentNumber].filter(Boolean).join(', ');
}

const groupedInputClass =
  'w-full border-0 bg-transparent px-3 py-3 text-sm text-[#5C4638] placeholder:text-[#8B6B57]/50 focus:outline-none focus:ring-0';

type AddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormData) => void;
  isSubmitting?: boolean;
  editingData?: AddressFormData | null;
  defaultRecipient?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  };
};

export function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  editingData = null,
  defaultRecipient,
}: AddressModalProps) {
  const [mode, setMode] = useState<'search' | 'manual'>('search');
  const [addressSearchError, setAddressSearchError] = useState<string | null>(null);

  const {
    query: addressSearchQuery,
    setQuery: setAddressSearchQuery,
    onUserQueryChange: onAddressSearchQueryChange,
    results: addressSearchResults,
    isSearching: isAddressSearching,
    showResults: showAddressSearchResults,
    setShowResults: setShowAddressSearchResults,
    selectPlace: selectAddressPlace,
    resetSearch: resetAddressSearch,
    searchError: autocompleteError,
  } = useAddressAutocomplete();

  const form = useForm<AddressFormData>({ defaultValues: defaultFormData });
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = form;
  const useAsBillingAddress = watch('useAsBillingAddress');
  const isEditing = Boolean(editingData?.id);

  useEffect(() => {
    if (!isOpen) return;

    if (editingData) {
      reset(editingData);
      setAddressSearchQuery(
        buildFullAddress(editingData) ||
          [editingData.administrativeAreaLevel2, editingData.administrativeAreaLevel1]
            .filter(Boolean)
            .join(', '),
      );
      setMode('manual');
    } else {
      reset({
        ...defaultFormData,
        firstName: defaultRecipient?.firstName || '',
        lastName: defaultRecipient?.lastName || '',
        phoneNumber: defaultRecipient?.phoneNumber || '',
      });
      resetAddressSearch();
      setMode('search');
    }
    setAddressSearchError(null);
  }, [isOpen, editingData, defaultRecipient, reset, resetAddressSearch, setAddressSearchQuery]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const applyParsedAddress = (parsed: ParsedAddressData) => {
    const fields = parsedAddressToFormFields(parsed);
    setValue('street', fields.street);
    setValue('buildingNumber', fields.buildingNumber);
    setValue('apartmentNumber', fields.apartmentNumber);
    setValue('administrativeAreaLevel1', fields.administrativeAreaLevel1);
    setValue('administrativeAreaLevel2', fields.administrativeAreaLevel2);
    setValue('administrativeAreaLevel3', fields.administrativeAreaLevel3);
    setValue('postalCode', fields.postalCode);
    setValue('country', fields.country);
    setValue('countryCode', fields.countryCode);
    setValue('fullAddress', buildFullAddress(fields));
    setMode('manual');
  };

  const handleSelectGoogleAddress = async (placeId: string) => {
    setAddressSearchError(null);
    const prediction = addressSearchResults.find((r) => r.place_id === placeId);
    if (!prediction) return;

    const parsed = await selectAddressPlace(prediction);
    if (!parsed) {
      setAddressSearchError('Adres bilgileri alınamadı. Lütfen tekrar deneyin.');
      return;
    }

    applyParsedAddress(parsed);
  };

  const handleAddressSearchQueryChange = (value: string) => {
    onAddressSearchQueryChange(value);
    setAddressSearchError(null);

    if (!value.trim()) {
      resetAddressSearch();
      setValue('street', '');
      setValue('buildingNumber', '');
      setValue('apartmentNumber', '');
      setValue('fullAddress', '');
      setValue('administrativeAreaLevel1', '');
      setValue('administrativeAreaLevel2', '');
      setValue('administrativeAreaLevel3', '');
      setValue('postalCode', '');
    }
  };

  const handleFormSubmit = (data: AddressFormData) => {
    const street = data.street.trim();
    const province = data.administrativeAreaLevel1.trim();
    const district = data.administrativeAreaLevel2.trim();

    if (!street || !province || !district) {
      setAddressSearchError('Lütfen geçerli bir adres seçin veya tüm zorunlu alanları doldurun.');
      setMode('manual');
      return;
    }

    const fullAddress = buildFullAddress(data);

    onSubmit({
      ...data,
      fullAddress,
      title: data.title.trim() || 'Teslimat',
    });
  };

  const handleClose = () => {
    reset(defaultFormData);
    resetAddressSearch();
    setMode('search');
    setAddressSearchError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={handleClose}>
      <div className="absolute inset-0 bg-[#5C4638]/30 backdrop-blur-[2px]" />

      <div
        className="relative flex h-full w-full max-w-lg flex-col bg-[#FDFAF6] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-modal-title"
      >
        <div className="flex items-start justify-between border-b border-[#D9C5B0]/40 px-6 py-5 sm:px-8">
          <div>
            <h2 id="address-modal-title" className="font-serif text-xl text-[#5C4638] sm:text-2xl">
              {isEditing ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </h2>
            <p className="mt-1 text-sm text-[#8B6B57]">
              {isEditing ? 'Adres bilgilerinizi güncelleyin' : 'Teslimat için yeni bir adres oluşturun'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-[#A17E65] transition hover:bg-[#F8F1E9] hover:text-[#5C4638]"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
            {/* Adres bilgileri */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[#5C4638]">Adres bilgileri</span>
                {mode === 'search' ? (
                  <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className="text-xs text-[#8B6B57] transition hover:text-[#5C4638] hover:underline"
                  >
                    Manuel gir
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode('search')}
                    className="text-xs text-[#8B6B57] transition hover:text-[#5C4638] hover:underline"
                  >
                    Adres ara
                  </button>
                )}
              </div>

              {mode === 'search' ? (
                <AddressSearchInput
                  query={addressSearchQuery}
                  onQueryChange={handleAddressSearchQueryChange}
                  results={addressSearchResults}
                  isSearching={isAddressSearching}
                  showResults={showAddressSearchResults}
                  onShowResultsChange={setShowAddressSearchResults}
                  onSelect={(placeId) => void handleSelectGoogleAddress(placeId)}
                  error={addressSearchError || autocompleteError || undefined}
                />
              ) : (
                <div className="overflow-hidden rounded-xl border border-[#D9C5B0]/75 bg-[#FDFAF6]">
                  <div className="border-b border-[#D9C5B0]/50 p-1">
                    <AddressSearchInput
                      query={addressSearchQuery}
                      onQueryChange={handleAddressSearchQueryChange}
                      results={addressSearchResults}
                      isSearching={isAddressSearching}
                      showResults={showAddressSearchResults}
                      onShowResultsChange={setShowAddressSearchResults}
                      onSelect={(placeId) => void handleSelectGoogleAddress(placeId)}
                      embedded
                    />
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-[#D9C5B0]/50 border-b border-[#D9C5B0]/50">
                    <div className="col-span-2 p-1">
                      <input
                        {...register('country', { required: 'Ülke gerekli' })}
                        placeholder="Ülke"
                        className={groupedInputClass}
                      />
                    </div>
                    <div className="p-1">
                      <input
                        {...register('postalCode')}
                        placeholder="Posta kodu"
                        className={groupedInputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-[#D9C5B0]/50 border-b border-[#D9C5B0]/50">
                    <div className="p-1">
                      <input
                        {...register('administrativeAreaLevel1', { required: 'İl gerekli' })}
                        placeholder="İl *"
                        className={groupedInputClass}
                      />
                    </div>
                    <div className="p-1">
                      <input
                        {...register('administrativeAreaLevel2', { required: 'İlçe gerekli' })}
                        placeholder="İlçe *"
                        className={groupedInputClass}
                      />
                    </div>
                  </div>

                  <div className="border-b border-[#D9C5B0]/50 p-1">
                    <input
                      {...register('street', { required: 'Mahalle, cadde, sokak gerekli' })}
                      placeholder="Mahalle, cadde, sokak *"
                      className={groupedInputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-[#D9C5B0]/50">
                    <div className="p-1">
                      <input
                        {...register('buildingNumber')}
                        placeholder="Bina / apartman no"
                        className={groupedInputClass}
                      />
                    </div>
                    <div className="p-1">
                      <input
                        {...register('apartmentNumber')}
                        placeholder="Daire no"
                        className={groupedInputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {addressSearchError && mode === 'manual' ? (
                <p className="mt-1.5 text-xs text-red-500">{addressSearchError}</p>
              ) : null}

              {mode === 'manual' &&
              (errors.street ||
                errors.administrativeAreaLevel1 ||
                errors.administrativeAreaLevel2 ||
                errors.country) ? (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.street?.message ||
                    errors.administrativeAreaLevel1?.message ||
                    errors.administrativeAreaLevel2?.message ||
                    errors.country?.message}
                </p>
              ) : null}
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                {...register('useAsBillingAddress')}
                className="h-4 w-4 rounded border-[#D9C5B0] text-[#5C4638] focus:ring-[#5C4638]/20"
              />
              <span className="text-sm text-[#5C4638]">Fatura adresi olarak kullan</span>
            </label>

            {useAsBillingAddress ? (
              <div className="space-y-3 rounded-xl border border-[#D9C5B0]/40 bg-[#F8F1E9] p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-[#A17E65]">Fatura bilgileri</p>
                <input
                  {...register('companyName')}
                  placeholder="Şirket adı (isteğe bağlı)"
                  className="w-full rounded-xl border border-[#D9C5B0]/60 bg-[#FDFAF6] px-4 py-3 text-sm text-[#5C4638] placeholder:text-[#8B6B57]/50 focus:border-[#5C4638] focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    {...register('taxOffice')}
                    placeholder="Vergi dairesi"
                    className="w-full rounded-xl border border-[#D9C5B0]/60 bg-[#FDFAF6] px-4 py-3 text-sm text-[#5C4638] placeholder:text-[#8B6B57]/50 focus:border-[#5C4638] focus:outline-none"
                  />
                  <input
                    {...register('taxNumber')}
                    placeholder="Vergi no / TCKN"
                    className="w-full rounded-xl border border-[#D9C5B0]/60 bg-[#FDFAF6] px-4 py-3 text-sm text-[#5C4638] placeholder:text-[#8B6B57]/50 focus:border-[#5C4638] focus:outline-none"
                  />
                </div>
              </div>
            ) : null}

            {/* Teslim alacak kişi */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-[#5C4638]">Teslim alacak kişi</h3>
              <div className="overflow-hidden rounded-xl border border-[#D9C5B0]/75 bg-[#FDFAF6]">
                <div className="grid grid-cols-2 divide-x divide-[#D9C5B0]/50">
                  <div className="p-1">
                    <input
                      {...register('firstName', { required: 'Ad gerekli' })}
                      placeholder="Ad"
                      className={groupedInputClass}
                    />
                  </div>
                  <div className="p-1">
                    <input
                      {...register('lastName', { required: 'Soyad gerekli' })}
                      placeholder="Soyad"
                      className={groupedInputClass}
                    />
                  </div>
                </div>
                <div className="border-t border-[#D9C5B0]/50 p-1">
                  <input
                    {...register('phoneNumber', { required: 'Telefon gerekli' })}
                    type="tel"
                    placeholder="Telefon numarası *"
                    className={groupedInputClass}
                  />
                </div>
              </div>
              {errors.firstName || errors.lastName || errors.phoneNumber ? (
                <p className="mt-1 text-xs text-red-500">
                  {errors.firstName?.message || errors.lastName?.message || errors.phoneNumber?.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex gap-3 border-t border-[#D9C5B0]/40 bg-white/70 px-6 py-5 sm:px-8">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-[#EDE0D1] px-4 py-3.5 text-sm font-medium text-[#5C4638] transition hover:bg-[#E0D0BE] disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#5C4638] px-4 py-3.5 text-sm font-medium text-[#F8F1E9] transition hover:bg-[#3F2F25] disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isEditing ? 'Güncelle' : 'Adresi Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
