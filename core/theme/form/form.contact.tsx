import { Send } from 'lucide-react';

const labelClass = 'mb-2 block text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500';
const fieldOk = 'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all focus:border-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-900';
const fieldErr = 'w-full rounded-lg border border-red-500 bg-white px-4 py-3 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500';

export const FormContact = ({ form, onSubmit, isPending }: { form: any; onSubmit: any; isPending: boolean }) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            Ad *
          </label>
          <input
            type="text"
            id="firstName"
            {...form.register('firstName')}
            className={form.formState.errors.firstName ? fieldErr : fieldOk}
            placeholder="Adınız"
          />
          {form.formState.errors.firstName && <p className="mt-1 text-sm text-red-600">{form.formState.errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Soyad *
          </label>
          <input
            type="text"
            id="lastName"
            {...form.register('lastName')}
            className={form.formState.errors.lastName ? fieldErr : fieldOk}
            placeholder="Soyadınız"
          />
          {form.formState.errors.lastName && <p className="mt-1 text-sm text-red-600">{form.formState.errors.lastName.message}</p>}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="email" className={labelClass}>
            E-posta *
          </label>
          <input
            type="email"
            id="email"
            {...form.register('email')}
            className={form.formState.errors.email ? fieldErr : fieldOk}
            placeholder="ornek@email.com"
          />
          {form.formState.errors.email && <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="phoneNumber" className={labelClass}>
            Telefon
          </label>
          <input
            type="tel"
            id="phoneNumber"
            {...form.register('phoneNumber')}
            className={form.formState.errors.phoneNumber ? fieldErr : fieldOk}
            placeholder="Telefon numaranız"
          />
          {form.formState.errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{form.formState.errors.phoneNumber.message}</p>}
        </div>
        <div>
          <label htmlFor="subject" className={labelClass}>
            Konu *
          </label>
          <select id="subject" {...form.register('subject')} className={form.formState.errors.subject ? fieldErr : fieldOk}>
            <option value="">Konu seçin</option>
            <option value="genel">Genel bilgi</option>
            <option value="siparis">Sipariş</option>
            <option value="iade">İade / değişim</option>
            <option value="urun">Ürün bilgisi</option>
            <option value="oneri">Öneri / şikayet</option>
            <option value="diger">Diğer</option>
          </select>
          {form.formState.errors.subject && <p className="mt-1 text-sm text-red-600">{form.formState.errors.subject.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Mesajınız *
        </label>
        <textarea
          id="message"
          rows={6}
          {...form.register('message')}
          className={`resize-none ${form.formState.errors.message ? fieldErr : fieldOk}`}
          placeholder="Mesajınızı buraya yazın..."
        />
        {form.formState.errors.message && <p className="mt-1 text-sm text-red-600">{form.formState.errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending || form.formState.isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-900 px-8 py-4 text-sm font-medium uppercase tracking-wide text-white shadow-md transition hover:bg-rose-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending || form.formState.isSubmitting ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Gönderiliyor…</span>
          </>
        ) : (
          <>
            <Send className="h-5 w-5" strokeWidth={1.5} />
            <span>Mesaj gönder</span>
          </>
        )}
      </button>
    </form>
  );
};
