import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SozlesmelerPageProps {
  params: Promise<{
    id: string;
  }>;
}

const sozlesmeBasliklari: Record<string, string> = {
  'mesafeli-satis': 'Mesafeli Satış Sözleşmesi',
  'gizlilik-sozlesmesi': 'Gizlilik Politikası',
  'kullanim-sartlari': 'Kullanım Şartları',
  'kargo-teslimat': 'Kargo & Teslimat',
  'iade-degisim': 'İade & Değişim',
  'cerez-politikasi': 'Çerez Politikası',
};

const sozlesmeIcerikleri: Record<string, string[]> = {
  'mesafeli-satis': [
    '1. GENEL HÜKÜMLER',
    'Bu sözleşme, uzaktan satış yöntemiyle yapılan satışlara ilişkin olarak hazırlanmıştır.',
    'Sözleşme tarafları:',
    '- Satıcı: [Şirket Adı]',
    '- Alıcı: Sipariş veren müşteri',
    '',
    '2. SÖZLEŞME KONUSU',
    'Bu sözleşme, satıcının internet sitesi üzerinden sunmuş olduğu ürünlerin satışı ve teslimatı ile ilgili tarafların hak ve yükümlülüklerini düzenler.',
    '',
    '3. SİPARİŞ VE TESLİMAT',
    'Siparişler, internet sitesi üzerinden verilir. Sipariş onayı, satıcı tarafından e-posta ile müşteriye bildirilir.',
    'Teslimat süresi, sipariş onayından itibaren en geç 30 iş günü içerisinde gerçekleştirilir.',
    '',
    '4. ÖDEME',
    'Ödeme, sipariş sırasında belirtilen yöntemlerle yapılır.',
    'Ödeme onayından sonra sipariş işleme alınır.',
    '',
    '5. CAYMA HAKKI',
    'Müşteri, sözleşmeden cayma hakkını kullanabilir.',
    'Cayma hakkı, ürünün teslim alındığı tarihten itibaren 14 gün içinde kullanılabilir.',
    '',
    '6. İADE VE DEĞİŞİM',
    'İade ve değişim koşulları, ürün sayfasında belirtilmiştir.',
    'İade edilecek ürünler, orijinal ambalajında ve kullanılmamış olmalıdır.',
  ],
  'gizlilik-sozlesmesi': [
    '1. GENEL BİLGİLER',
    'Bu gizlilik politikası, kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi vermek amacıyla hazırlanmıştır.',
    '',
    '2. TOPLANAN VERİLER',
    'Aşağıdaki kişisel veriler toplanmaktadır:',
    '- Ad, soyad',
    '- E-posta adresi',
    '- Telefon numarası',
    '- Adres bilgileri',
    '- IP adresi',
    '- Çerez bilgileri',
    '',
    '3. VERİLERİN KULLANIM AMACI',
    'Toplanan kişisel veriler aşağıdaki amaçlarla kullanılmaktadır:',
    '- Sipariş işlemlerinin gerçekleştirilmesi',
    '- Müşteri hizmetleri sunumu',
    '- Yasal yükümlülüklerin yerine getirilmesi',
    '- Pazarlama faaliyetleri (izin verilmesi halinde)',
    '',
    '4. VERİLERİN PAYLAŞIMI',
    'Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmaz.',
    'Ödeme işlemleri için güvenli ödeme sağlayıcıları ile veri paylaşımı yapılabilir.',
    '',
    '5. VERİ GÜVENLİĞİ',
    'Kişisel verileriniz, teknik ve idari güvenlik önlemleri ile korunmaktadır.',
    'Verilerinize yetkisiz erişim engellenmektedir.',
    '',
    '6. HAKLARINIZ',
    'Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:',
    '- Verilerinize erişim hakkı',
    '- Verilerinizin düzeltilmesini talep etme hakkı',
    '- Verilerinizin silinmesini talep etme hakkı',
    '- Verilerinizin işlenmesine itiraz etme hakkı',
  ],
  'kullanim-sartlari': [
    '1. GENEL HÜKÜMLER',
    'Bu kullanım şartları, internet sitesinin kullanımına ilişkin kuralları belirler.',
    'Siteyi kullanarak, bu şartları kabul etmiş sayılırsınız.',
    '',
    '2. SİTE KULLANIMI',
    'Site, yasalara uygun şekilde kullanılmalıdır.',
    'Site üzerinden yasadışı faaliyetlerde bulunulamaz.',
    'Site içeriği, telif hakları ile korunmaktadır.',
    '',
    '3. KULLANICI HESAPLARI',
    'Hesap oluştururken doğru bilgiler verilmelidir.',
    'Hesap güvenliğinden kullanıcı sorumludur.',
    'Şifre güvenliği kullanıcının sorumluluğundadır.',
    '',
    '4. ÜRÜN BİLGİLERİ',
    'Ürün bilgileri, görseller ve fiyatlar bilgilendirme amaçlıdır.',
    'Fiyatlar önceden haber verilmeksizin değiştirilebilir.',
    'Stok durumu gerçek zamanlı olmayabilir.',
    '',
    '5. SORUMLULUK SINIRLAMALARI',
    'Site, kesintisiz ve hatasız hizmet verme garantisi vermez.',
    'Teknik sorunlardan kaynaklanan zararlardan sorumlu değildir.',
    'Üçüncü taraf bağlantılarından sorumlu değildir.',
    '',
    '6. FİKRİ MÜLKİYET',
    'Site içeriği, tasarımı ve yazılımı telif hakları ile korunmaktadır.',
    'İçerikler izinsiz kopyalanamaz, dağıtılamaz veya kullanılamaz.',
    '',
    '7. DEĞİŞİKLİKLER',
    'Bu kullanım şartları, önceden haber verilmeksizin değiştirilebilir.',
    'Değişiklikler, sitede yayınlandığı tarihten itibaren geçerlidir.',
  ],
  'kargo-teslimat': [
    '1. GENEL BİLGİLER',
    'Bu kargo ve teslimat politikası, siparişlerinizin nasıl kargoya verildiği ve teslim edildiği hakkında bilgi vermek amacıyla hazırlanmıştır.',
    '',
    '2. KARGO SÜRECİ',
    'Siparişleriniz ödeme onayından sonra 1-2 iş günü içinde kargoya verilir.',
    'Kargo işlemi tamamlandığında size e-posta ve SMS ile bilgilendirme yapılır.',
    'Kargo takip numaranız sipariş detay sayfanızdan görüntülenebilir.',
    '',
    '3. TESLİMAT SÜRESİ',
    'İstanbul içi teslimat: 1-2 iş günü',
    'Türkiye geneli teslimat: 2-5 iş günü',
    'Teslimat süreleri, siparişin kargoya verilme tarihinden itibaren hesaplanır.',
    'Hafta sonları ve resmi tatiller teslimat süresine dahil değildir.',
    '',
    '4. TESLİMAT ADRESİ',
    'Teslimat, sipariş sırasında belirttiğiniz adrese yapılır.',
    'Adres değişikliği, sipariş kargoya verilmeden önce müşteri hizmetleri ile iletişime geçilerek yapılabilir.',
    'Kargoya verildikten sonra adres değişikliği yapılamaz.',
    '',
    '5. TESLİMAT ÜCRETİ',
    'Belirli tutarın üzerindeki siparişlerde kargo ücretsizdir.',
    'Ücretsiz kargo limiti ve kargo ücretleri ürün sayfalarında belirtilmiştir.',
    'Kargo ücreti, sipariş özetinde görüntülenir.',
    '',
    '6. TESLİMAT SIRASINDAKİ DURUMLAR',
    'Teslimat sırasında ürünlerin kontrol edilmesi önerilir.',
    'Paket hasarlı veya eksik görünüyorsa, kargo görevlisinin yanında açıp kontrol ediniz.',
    'Hasarlı veya eksik ürünler için derhal müşteri hizmetleri ile iletişime geçiniz.',
    '',
    '7. TESLİMAT YAPILAMAYAN DURUMLAR',
    'Adreste bulunamama durumunda kargo firması ile iletişime geçilmesi gerekir.',
    '3 iş günü içinde teslim alınmayan paketler iade edilir.',
    'Yanlış adres bilgisi nedeniyle oluşan gecikmelerden sorumlu değiliz.',
  ],
  'iade-degisim': [
    '1. GENEL HÜKÜMLER',
    'Bu iade ve değişim politikası, satın aldığınız ürünlerin iade ve değişim koşullarını belirler.',
    'Tüketici Hakları Kanunu kapsamındaki haklarınız saklıdır.',
    '',
    '2. İADE HAKKI',
    'Ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz.',
    'İade hakkınızı kullanmak için herhangi bir gerekçe belirtmenize gerek yoktur.',
    'İade süreci başlatmak için müşteri hizmetleri ile iletişime geçiniz.',
    '',
    '3. İADE KOŞULLARI',
    'İade edilecek ürünler orijinal ambalajında ve etiketli olmalıdır.',
    'Ürünler kullanılmamış, yıkanmamış ve hasar görmemiş olmalıdır.',
    'Aksesuar ve yedek parçalar eksiksiz olmalıdır.',
    'Kişisel kullanım nedeniyle bozulmuş veya hasar görmüş ürünler iade edilemez.',
    '',
    '4. İADE SÜRECİ',
    'İade talebinizi müşteri hizmetleri üzerinden oluşturunuz.',
    'İade onayı sonrası kargo bilgileri size iletilecektir.',
    'Ürünü belirtilen adrese kargo ile gönderiniz.',
    'Ürün kontrol edildikten sonra iade işlemi tamamlanır.',
    '',
    '5. İADE ÖDEMESİ',
    'İade edilen ürünün bedeli, ödeme yaptığınız yönteme göre 7-14 iş günü içinde iade edilir.',
    'Kargo ücreti iade edilmez, ancak ücretsiz kargo kampanyası kapsamındaysa bu durum geçerli değildir.',
    'İade kargo ücreti müşteriye aittir.',
    '',
    '6. DEĞİŞİM',
    'Ürün değişimi, aynı ürünün farklı beden veya renk seçeneği için yapılabilir.',
    'Değişim talebi, ürünün teslim alındığı tarihten itibaren 14 gün içinde yapılmalıdır.',
    'Değişim için ürünün iade koşullarını sağlaması gerekir.',
    'Değişim sırasında fiyat farkı varsa bu fark tahsil edilir veya iade edilir.',
    '',
    '7. İADE EDİLEMEYEN ÜRÜNLER',
    'Kişiselleştirilmiş veya özel üretim ürünler',
    'İç çamaşırı ve mayo gibi hijyenik ürünler',
    'Açılmış ve kullanılmış kozmetik ürünler',
    'İndirimli kampanya ürünleri (belirtilmişse)',
    '',
    '8. HASARLI VEYA HATALI ÜRÜN',
    'Teslim aldığınız ürün hasarlı veya hatalıysa, derhal müşteri hizmetleri ile iletişime geçiniz.',
    'Bu durumda kargo ücreti tarafımıza aittir.',
    'Ürün fotoğrafları ile birlikte durumu bildiriniz.',
  ],
  'cerez-politikasi': [
    '1. GENEL BİLGİLER',
    'Bu çerez politikası, web sitemizde kullanılan çerezler hakkında bilgi vermek amacıyla hazırlanmıştır.',
    'Çerezler, web sitemizin düzgün çalışması ve kullanıcı deneyiminin iyileştirilmesi için kullanılmaktadır.',
    '',
    '2. ÇEREZ NEDİR?',
    'Çerezler, web sitelerini ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır.',
    'Çerezler, web sitesinin işlevselliğini artırır ve kullanıcı tercihlerini hatırlar.',
    'Çerezler kişisel bilgilerinizi doğrudan içermez, ancak cihazınız hakkında bilgi toplayabilir.',
    '',
    '3. ÇEREZ TÜRLERİ',
    'Zorunlu Çerezler: Web sitesinin temel işlevlerinin çalışması için gereklidir.',
    'Performans Çerezleri: Site performansını analiz etmek ve iyileştirmek için kullanılır.',
    'İşlevsellik Çerezleri: Kullanıcı tercihlerini hatırlamak için kullanılır.',
    'Hedefleme/İzleme Çerezleri: Reklam ve pazarlama amaçlı kullanılır.',
    '',
    '4. KULLANDIĞIMIZ ÇEREZLER',
    'Oturum Çerezleri: Site gezintisi sırasında oturum bilgilerini saklar.',
    'Kalıcı Çerezleri: Tercihlerinizi hatırlamak için kullanılır.',
    'Üçüncü Taraf Çerezleri: Analitik ve pazarlama hizmetleri için kullanılır.',
    '',
    '5. ÇEREZ YÖNETİMİ',
    'Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.',
    'Çerezleri devre dışı bırakırsanız, web sitesinin bazı özellikleri düzgün çalışmayabilir.',
    'Çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz.',
    '',
    '6. ÜÇÜNCÜ TARAF ÇEREZLER',
    'Web sitemizde Google Analytics gibi üçüncü taraf hizmetler kullanılmaktadır.',
    'Bu hizmetler kendi çerez politikalarına sahiptir.',
    'Üçüncü taraf çerez politikalarını ilgili hizmet sağlayıcıların web sitelerinden inceleyebilirsiniz.',
    '',
    '7. ÇEREZ ONAYI',
    'Web sitemizi kullanarak, çerez kullanımımızı kabul etmiş sayılırsınız.',
    'Çerez tercihlerinizi çerez ayarları sayfasından yönetebilirsiniz.',
    'Zorunlu çerezler, web sitesinin çalışması için her zaman aktif kalır.',
    '',
    '8. GÜNCELLEMELER',
    'Bu çerez politikası zaman zaman güncellenebilir.',
    'Güncellemeler bu sayfada yayınlandığı tarihten itibaren geçerlidir.',
    'Önemli değişiklikler durumunda size bildirim yapılabilir.',
  ],
};

export default async function SozlesmelerPage({ params }: SozlesmelerPageProps) {
  const { id } = await params;

  if (!sozlesmeBasliklari[id]) {
    notFound();
  }

  const baslik = sozlesmeBasliklari[id];
  const icerik = sozlesmeIcerikleri[id];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          <Link href="/" className="transition-colors hover:text-rose-900">
            Ana Sayfa
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          <span className="line-clamp-2 text-gray-900">{baslik}</span>
        </nav>

        <div className="mx-auto max-w-4xl rounded-xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8 md:p-10">
          <h1 className="border-b border-gray-200 pb-4 text-2xl font-bold text-gray-900 sm:text-3xl">{baslik}</h1>

          <div className="prose prose-lg max-w-none pt-8">
            <div className="space-y-4 leading-relaxed text-gray-700">
              {icerik.map((paragraf, index) => {
                if (paragraf === '') {
                  return <div key={index} className="h-4" />;
                }

                if (paragraf.match(/^\d+\./)) {
                  return (
                    <h2 key={index} className="mt-8 border-b border-gray-100 pb-2 text-lg font-semibold text-gray-900 first:mt-0 sm:text-xl">
                      {paragraf}
                    </h2>
                  );
                }

                return (
                  <p key={index} className="text-base sm:text-lg">
                    {paragraf}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-8 text-sm text-gray-500">
            <p>Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
