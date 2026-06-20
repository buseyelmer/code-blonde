import { Address } from '@raxonltd/raxon-core/interface/prisma.interface';
import { UseFormReturn } from 'react-hook-form';
import { Input } from 'rizzui/input';
import { Textarea } from 'rizzui/textarea';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function FormAddress({ address, form }: { address?: Address; form: UseFormReturn<any> }) {
 
  

  const selectedProvinceCode = form.watch('administrativeAreaLevel1.provinceCode');

 
  
  const { data: provinces } = useQuery({
    queryKey: ['web', 'province'],
    queryFn: async () => {
      var response = await axios.get<IProvince[]>('/api/province');
      return response.data;
    },
  });

  const { data: districts } = useQuery({
    queryKey: ['web', 'district', selectedProvinceCode],
    queryFn: async () => {
      var response = await axios.get<IProvince[]>('/api/province?provinceCode=' + selectedProvinceCode);
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      {/* Form Alanları - HTML örneğindeki gibi düzenlendi */}
      <div className="grid grid-cols-12 gap-4">
        {/* Ad */}
        {/* Ad Soyad */}
        <div className="col-span-6">
          <Input size="md" error={form.formState.errors.firstName?.message as string} {...form.register('firstName')} placeholder="Ad Soyad" className="peer" label="Ad *" required />
        </div>
        <div className="col-span-6">
          <Input size="md" error={form.formState.errors.lastName?.message as string} {...form.register('lastName')} placeholder="Ad Soyad" className="peer" label="Soyad *" required />
        </div>
        <div className="col-span-12">
          <Input size="md" error={form.formState.errors.phoneNumber?.message as string} {...form.register('phoneNumber')} placeholder="Telefon Numarası" className="peer" label="Telefon Numarası *" required />
        </div>

        {/* İl Seçiniz */}
        <div className="col-span-6">
          <label className="rizzui-input-label block text-sm mb-1.5 font-medium"> İl Seçiniz * </label>
          <select
            value={form.watch('administrativeAreaLevel1.provinceCode')}
            required
            onChange={e => {
              var findProvince = provinces?.find(province => province.provinceCode == Number(e.target.value));
              form.reset({
                ...form.getValues(),
                administrativeAreaLevel1: findProvince,
              });
            }}
            className="rizzui-input-container flex items-center peer w-full transition duration-200 [&.is-focus]:ring-[0.8px] ring-[0.6px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary [&_input::placeholder]:opacity-60 px-3.5 py-2 text-sm h-10 rounded-md border border-muted ring-muted bg-transparent"
          >
            <option value="">İl Seçiniz</option>
            {provinces?.sort((a, b) => a.province.localeCompare(b.province, 'tr', { sensitivity: 'base' })).map(province => {
              return <option value={province.provinceCode}>{province.province}</option>;
            })}
          </select>
        </div>

        {/* İlçe Seçiniz */}
        <div className="col-span-6">
          <label className="rizzui-input-label block text-sm mb-1.5 font-medium"> İlçe Seçiniz * </label>
          <select
            value={form.watch('administrativeAreaLevel2.districtCode')}
            onChange={e => {
              var findDistrict = districts?.find(district => district.districtCode == e.target.value);
              form.reset({
                ...form.getValues(),
                administrativeAreaLevel2: findDistrict,
              });
            }}
            className="rizzui-input-container flex items-center peer w-full transition duration-200 [&.is-focus]:ring-[0.8px] ring-[0.6px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary [&_input::placeholder]:opacity-60 px-3.5 py-2 text-sm h-10 rounded-md border border-muted ring-muted bg-transparent"
          >
            <option value="">İl Seçiniz</option>
            {districts?.sort((a, b) => a.district.localeCompare(b.district, 'tr', { sensitivity: 'base' })).map(district => {
              return <option value={district.districtCode}>{district.district}</option>;
            })}
          </select>
        </div>

        {/* Adres */}
        <div className="col-span-12">
          <Textarea size="md" error={form.formState.errors.streetName?.message as string} {...form.register('fullAddress')} placeholder="Adres" rows={3} className="peer" label="Adres" required />
        </div>
      </div>
    </div>
  );
}
