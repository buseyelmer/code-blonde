import type { Metadata } from "next";
import { PageLayout } from "@/components/legal/PageLayout";

export const metadata: Metadata = {
  title: "Kargo & İade",
  description:
    "Code Blonde kargo süreçleri, teslimat bilgileri ve iade koşulları hakkında detaylı bilgi.",
};

export default function KargoVeIadePage() {
  return (
    <PageLayout
      title="Kargo & İade"
      description="Siparişlerinizin teslimat süreci ve iade koşulları hakkında bilmeniz gereken her şey."
    >
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">Kargo Süreci</h2>
        <p>
          Code Blonde olarak siparişlerinizi özenle hazırlayıp anlaşmalı kargo
          firmalarımız aracılığıyla adresinize ulaştırıyoruz. Onaylanan
          siparişler genellikle 1–3 iş günü içinde kargoya verilir.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>500 TL ve üzeri siparişlerde kargo ücretsizdir.</li>
          <li>
            Kargo takip numaranız siparişiniz kargoya verildiğinde e-posta ve
            SMS ile tarafınıza iletilir.
          </li>
          <li>
            Teslimat süresi bulunduğunuz ile göre 2–5 iş günü arasında
            değişebilir.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">
          Teslimat Koşulları
        </h2>
        <p>
          Siparişiniz adresinize ulaştığında kargo görevlisi tarafından teslim
          edilir. Teslimat sırasında paketin dış ambalajında hasar fark ederseniz
          tutanak tutturmanızı ve müşteri hizmetlerimizle iletişime geçmenizi
          rica ederiz.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">İade Şartları</h2>
        <p>
          Code Blonde ürünlerini teslim aldığınız tarihten itibaren 14 gün
          içinde, kullanılmamış ve orijinal ambalajında olmak kaydıyla iade
          edebilirsiniz.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>
            Hijyen nedeniyle açılmış veya kullanılmış kişisel bakım ürünleri
            iade kapsamı dışındadır.
          </li>
          <li>
            İade talebinizi info@codeblonde.com adresine veya iletişim
            formumuz üzerinden iletebilirsiniz.
          </li>
          <li>
            Onaylanan iadelerde ürün bedeli, ödeme yönteminize göre 5–10 iş
            günü içinde iade edilir.
          </li>
          <li>İade kargo ücreti, ayıplı ürünler dışında alıcıya aittir.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">
          Değişim İşlemleri
        </h2>
        <p>
          Ürün değişimi talepleriniz için müşteri hizmetlerimizle iletişime
          geçebilirsiniz. Stok durumuna göre eşdeğer ürünle değişim veya iade
          işlemi gerçekleştirilir.
        </p>
      </section>
    </PageLayout>
  );
}
