'use client';

export function SectionHomeCta() {
  return (
    <section className="py-16 bg-rose-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-4">Doğru Bedeni Bulun</h2>
            <p className="text-sm text-rose-100/95 max-w-xl leading-relaxed">Ücretsiz beden ölçümüzü kullanarak mükemmel uyumu yakalayın. Uzmanlarımız size en uygun modeli seçmenizde yardımcı oluyor.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button type="button" className="bg-white text-rose-900 px-8 py-3.5 rounded-none text-xs font-semibold uppercase tracking-[0.15em] hover:bg-rose-50 transition-colors">Beden Ölçümü Al</button>
            <button type="button" className="border-2 border-white text-white px-8 py-3.5 rounded-none text-xs font-semibold uppercase tracking-[0.15em] hover:bg-white hover:text-rose-900 transition-colors">Beden Rehberi</button>
          </div>
        </div>
      </div>
    </section>
  );
}
