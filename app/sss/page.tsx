import type { Metadata } from "next";
import Link from "next/link";
import { SectionLegalFaqAccordion } from "@/theme/section/legal/section.legal.faq.accordion";
import { ViewPageLayout } from "@/theme/view/view.page.layout";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description:
    "Code Blonde sipariş takibi, ödeme yöntemleri, kargo ve iade süreçleri hakkında sık sorulan sorular.",
};

const faqItems = [
  {
    id: "faq-1",
    question: "Siparişimi nasıl takip edebilirim?",
    answer:
      "Siparişiniz kargoya verildiğinde e-posta ve SMS ile kargo takip numaranız tarafınıza iletilir. Bu numarayı kargo firmasının web sitesine girerek gönderinizi anlık olarak takip edebilirsiniz. Takip bilgilerine ulaşamazsanız info@codeblonde.com adresinden bize ulaşabilirsiniz.",
  },
  {
    id: "faq-2",
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer:
      "Kredi kartı, banka kartı ve güvenli online ödeme altyapısı üzerinden taksitli ödeme seçeneklerini kabul ediyoruz. Tüm ödemeler 256-bit SSL şifreleme ile korunmaktadır. Kapıda ödeme seçeneği kampanya dönemlerinde geçerli olabilir.",
  },
  {
    id: "faq-3",
    question: "Kargo ücreti ne kadar ve ne zaman ücretsiz?",
    answer:
      "500 TL ve üzeri siparişlerde kargo ücretsizdir. Bu tutarın altındaki siparişlerde kargo ücreti ödeme adımında hesabınıza yansıtılır. Teslimat süresi bulunduğunuz ile göre genellikle 2–5 iş günüdür.",
  },
  {
    id: "faq-4",
    question: "Ürün iadesi nasıl yapılır?",
    answer:
      "Ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içinde, kullanılmamış ve orijinal ambalajında olmak kaydıyla iade edebilirsiniz. İade talebinizi iletişim formumuz veya info@codeblonde.com üzerinden iletmeniz yeterlidir. Onay sonrası iade tutarı 5–10 iş günü içinde ödeme yönteminize iade edilir.",
  },
  {
    id: "faq-5",
    question: "Siparişim hasarlı veya eksik geldi, ne yapmalıyım?",
    answer:
      "Teslimat sırasında pakette hasar fark ederseniz kargo görevlisine tutanak tutturun ve en kısa sürede müşteri hizmetlerimizle iletişime geçin. Hasarlı veya eksik ürünlerde ücretsiz değişim veya iade işlemi gerçekleştirilir.",
  },
];

export default function SssPage() {
  return (
    <ViewPageLayout
      title="Sıkça Sorulan Sorular"
      description="Sipariş, ödeme, kargo ve iade süreçleri hakkında en çok merak edilen soruların yanıtları."
    >
      <SectionLegalFaqAccordion items={faqItems} />
      <p className="mt-8 text-sm text-muted">
        Aradığınız yanıtı bulamadınız mı?{" "}
        <Link
          href="/iletisim"
          className="font-medium text-charcoal underline-offset-4 hover:text-brand-purple hover:underline"
        >
          İletişim sayfamızdan
        </Link>{" "}
        bize ulaşabilirsiniz.
      </p>
    </ViewPageLayout>
  );
}
