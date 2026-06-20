import Link from 'next/link';
import { useRaxon } from '@raxonltd/raxon-core';
import { useMemo } from 'react';

export function SectionFooter() {
  const { branch, flatCategory,collection } = useRaxon();

  let footerCategory = useMemo(() => {
    return flatCategory.filter(it => it.tags.includes('footer'));
  }, [flatCategory]);

  return (
    <footer className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="relative inline-block">
              <p className="font-['Colabero'] text-sm font-semibold tracking-[0.32em]">Bulut</p>
              <span className="absolute -top-5 right-[0.32em] text-[10px] text-neutral-400 tracking-wider">İÇ GİYİM</span>
            </div>

            {branch?.openAddress && <p className="mt-4 text-sm text-neutral-600">{branch.openAddress}</p>}

            <div className="mt-4 space-y-2 text-sm text-neutral-600">
              {branch?.phoneNumber && (
                <p>
                  <span className="font-medium text-neutral-900">Tel:</span>{' '}
                  <a href={`tel:${branch.phoneNumber}`} className="transition hover:text-neutral-900">
                    {branch.phoneNumber}
                  </a>
                </p>
              )}
              {branch?.email && (
                <p>
                  <span className="font-medium text-neutral-900">E-posta:</span>{' '}
                  <a href={`mailto:${branch.email}`} className="transition hover:text-neutral-900">
                    {branch.email}
                  </a>
                </p>
              )}
            </div>

            {branch?.workingHours && (
              <div className="mt-4 text-sm text-neutral-600">
                <p className="font-medium text-neutral-900">Çalışma Saatleri</p>
                <p className="mt-1">{branch.workingHours}</p>
              </div>
            )}

            {branch?.socialMediaLinks && Object.keys(branch.socialMediaLinks).length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {Object.entries(branch.socialMediaLinks as Record<string, string>).map(([key, url]) => {
                  if (!url) return null;
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-neutral-900 transition" aria-label={key}>
                      <span className="text-xs uppercase tracking-wider font-medium">{key}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-900">Alışveriş</p>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
              {
                collection.map(it=>(
                  <li key={it.id}>
                    <Link href={`/koleksiyon/${it.id}`} className="transition hover:text-neutral-900">
                      {it.title}
                    </Link>
                  </li>
                ))
              }
              <li>
                <Link href="/urunler" className="transition hover:text-neutral-900">
                  Tüm Ürünler
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-900">Çok İlgi Gören Kategoriler</p>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
              {footerCategory.map(it => (
                <li key={it.id}>
                  <Link href={`/urunler?category=${it.id}`} className="transition hover:text-neutral-900">
                    {it.name?.getName()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-900">Kurumsal</p>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
              <li>
                <Link href="/hakkimizda" className="transition hover:text-neutral-900">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="transition hover:text-neutral-900">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/sozlesmeler/kargo-teslimat" className="transition hover:text-neutral-900">
                  Kargo & Teslimat
                </Link>
              </li>
              <li>
                <Link href="/sozlesmeler/iade-degisim" className="transition hover:text-neutral-900">
                  İade & Değişim
                </Link>
              </li>
              <li>
                <Link href="/sss" className="transition hover:text-neutral-900">
                  SSS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-neutral-200 pt-8 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Bulut Istanbul. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/sozlesmeler/gizlilik-sozlesmesi" className="transition hover:text-neutral-900">
              Gizlilik Politikası
            </Link>
            <Link href="/sozlesmeler/kullanim-sartlari" className="transition hover:text-neutral-900">
              Kullanım Şartları
            </Link>
            <Link href="/sozlesmeler/cerez-politikasi" className="transition hover:text-neutral-900">
              Çerez Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
