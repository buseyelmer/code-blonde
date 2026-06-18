import type { Metadata } from "next";
import { PageLayout } from "@/components/legal/PageLayout";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Code Blonde gizlilik politikası ve KVKK kapsamında kişisel verilerin korunmasına ilişkin bilgilendirme metni.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <PageLayout
      title="Gizlilik Politikası"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerinizin işlenmesine ilişkin bilgilendirme metni."
    >
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">1. Veri Sorumlusu</h2>
        <p>
          Code Blonde olarak kişisel verilerinizin güvenliğine önem veriyoruz.
          Bu politika, web sitemiz üzerinden toplanan kişisel verilerin hangi
          amaçlarla işlendiğini açıklamaktadır.
        </p>
        <p className="text-muted">
          Veri Sorumlusu: Code Blonde — info@codeblonde.com
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">
          2. İşlenen Kişisel Veriler
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>Kimlik bilgileri (ad, soyad)</li>
          <li>İletişim bilgileri (e-posta, telefon, adres)</li>
          <li>Sipariş ve ödeme bilgileri</li>
          <li>Web sitesi kullanım verileri (çerezler, IP adresi)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">
          3. Kişisel Verilerin İşlenme Amaçları
        </h2>
        <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>Sipariş süreçlerinin yürütülmesi ve teslimat</li>
          <li>Müşteri hizmetleri ve destek faaliyetleri</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          <li>Pazarlama iletişimi (açık rızanız dahilinde)</li>
          <li>Web sitesi güvenliğinin sağlanması</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">
          4. Kişisel Verilerin Aktarılması
        </h2>
        <p>
          Kişisel verileriniz; kargo firmaları, ödeme kuruluşları ve yasal
          zorunluluk halinde yetkili kamu kurumlarıyla, yalnızca gerekli
          olduğu ölçüde paylaşılabilir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">
          5. KVKK Kapsamındaki Haklarınız
        </h2>
        <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
          <li>Verilerin silinmesini veya yok edilmesini talep etme</li>
        </ul>
        <p>
          Taleplerinizi info@codeblonde.com adresine iletebilirsiniz. Başvurular
          en geç 30 gün içinde yanıtlanır.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">6. Çerezler</h2>
        <p>
          Web sitemiz, kullanıcı deneyimini iyileştirmek ve site trafiğini
          analiz etmek amacıyla çerezler kullanabilir. Tarayıcı ayarlarınızdan
          çerezleri yönetebilir veya devre dışı bırakabilirsiniz.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">
          7. Politika Güncellemeleri
        </h2>
        <p>
          Bu gizlilik politikası gerektiğinde güncellenebilir. Güncellemeler
          bu sayfada yayımlandığı tarihte yürürlüğe girer.
        </p>
        <p className="text-sm text-muted">Son güncelleme: Haziran 2026</p>
      </section>
    </PageLayout>
  );
}
