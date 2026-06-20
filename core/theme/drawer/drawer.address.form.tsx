import React, { useImperativeHandle, useState } from 'react';
import { Drawer } from 'rizzui/drawer';
import { useForm } from 'react-hook-form';
import { useAddress } from '@raxonltd/raxon-core/hook';
import { Button } from 'rizzui/button';
import { Address } from '@raxonltd/raxon-core/interface/prisma.interface';
import { FormAddress } from '../form/form.address';

export interface DrawerAddressFormProps {}
export interface DrawerAddressFormRef {
  open: (address?: Address) => void;
  close: () => void;
}

export const DrawerAddressForm = React.forwardRef<DrawerAddressFormRef, DrawerAddressFormProps>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);

  const form = useForm();
  useImperativeHandle(ref, () => ({
    open: async (address?: Address) => {
      setIsOpen(true);
      setEditingAddress(address);
      if (address) {
        // İl ve ilçe bilgilerini API'den çekmemiz gerekiyor
        try {
          const provincesResponse = await fetch('/api/province');
          const provinces = await provincesResponse.json();
          
          // İl bilgisini bul
          const province = provinces.find((p: any) => p.province === address.administrativeAreaLevel1);
          
          let district = null;
          if (province) {
            // İlçe bilgisini bul
            const districtsResponse = await fetch(`/api/province?provinceCode=${province.provinceCode}`);
            const districts = await districtsResponse.json();
            district = districts.find((d: any) => d.district === address.administrativeAreaLevel2);
          }
          
          form.reset({
            ...address,
            administrativeAreaLevel1: province || null,
            administrativeAreaLevel2: district || null,
          });
        } catch (error) {
          console.error('Adres bilgileri yüklenirken hata:', error);
          form.reset(address);
        }
      } else {
        // Yeni adres eklerken formu temizle
        form.reset({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          fullAddress: '',
          description: null,
          administrativeAreaLevel1: null,
          administrativeAreaLevel2: null,
        });
      }
    },
    close: () => {
      setIsOpen(false);
      setEditingAddress(undefined);
    },
  }));

  const { mutate: createAddress } = useAddress().create();
  const { mutate: updateAddress } = useAddress().update();

  const handleSaveAddress = () => {
    form.handleSubmit(
      (data: any) => {

        if(data.id == undefined)
        {
            createAddress(
                {
                  ...data,
                  administrativeAreaLevel1: data.administrativeAreaLevel1.province,
                  administrativeAreaLevel2: data.administrativeAreaLevel2.district,
                },
                {
                  onSuccess: newAddress => {
                    form.reset({
                      firstName: '',
                      lastName: '',
                      phoneNumber: '',
                      fullAddress: '',
                      description: null,
                      administrativeAreaLevel1: null,
                      administrativeAreaLevel2: null,
      
                    });
                    setIsOpen(false);
                    setEditingAddress(undefined);
                  },
                  onError: error => {
                    console.error('Adres ekleme hatası:', error);
                  },
                }
              );
        } 
        else {
            updateAddress(
                {
                  ...data,
                  administrativeAreaLevel1: data.administrativeAreaLevel1.province,
                  administrativeAreaLevel2: data.administrativeAreaLevel2.district,
                },
                {
                  onSuccess: newAddress => {
                    form.reset({
                      firstName: '',
                      lastName: '',
                      phoneNumber: '',
                      fullAddress: '',
                      description: null,
                      administrativeAreaLevel1: null,
                      administrativeAreaLevel2: null,
                    });
                    setIsOpen(false);
                    setEditingAddress(undefined);
                  },
                  onError: error => {
                    console.error('Adres güncelleme hatası:', error);
                  },
                }
              );
        }
      
      },
      errors => {
        console.error('Form validasyon hataları:', errors);
      }
    )();
  };

  return (
    <Drawer isOpen={isOpen} onClose={() => {
      setIsOpen(false);
      setEditingAddress(undefined);
    }}>
      <div className="flex flex-col h-full p-4">
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </h2>
            <p className="text-gray-600 mt-2">
              {editingAddress ? 'Adres bilgilerinizi güncelleyin' : 'Teslimat için yeni bir adres oluşturun'}
            </p>
          </div>
          <FormAddress form={form} />
        </div>
        <div className="flex gap-3 border-t border-gray-200 pt-4">
          <Button onClick={() => {
            setIsOpen(false);
            setEditingAddress(undefined);
          }} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors text-sm">
            İptal
          </Button>
          <Button onClick={() => handleSaveAddress()} className="flex-1 px-4 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors text-sm">
            {editingAddress ? 'Güncelle' : 'Adresi Kaydet'}
          </Button>
        </div>
      </div>
    </Drawer>
  );
});
