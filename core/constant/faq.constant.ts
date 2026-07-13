export type DefaultFaq = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
};

/** Panel boşsa veya ek içerik gerektiğinde gösterilen varsayılan SSS içeriği */
export const DEFAULT_FAQS: DefaultFaq[] = [
  {
    id: "default-kargo-sure",
    question: "Kargo süresi ne kadar?",
    answer:
      "Siparişleriniz ödeme onayından sonra genellikle 1–2 iş günü içinde kargoya verilir. İstanbul içi teslimat 1–2 iş günü, Türkiye geneli teslimat ise 2–5 iş günü sürmektedir. Hafta sonları ve resmi tatiller teslimat süresine dahil değildir.",
    tags: ["Kargo & Teslimat"],
  },
  {
    id: "default-kargo-ucret",
    question: "Kargo ücreti ne kadar? Ücretsiz kargo var mı?",
    answer:
      "Belirli tutarın üzerindeki siparişlerde kargo ücretsizdir. Güncel ücretsiz kargo limiti ve ücret bilgisi sepet özetinde ve ürün sayfalarında gösterilir. Kargo ücreti sipariş tamamlanmadan önce net olarak görüntülenir.",
    tags: ["Kargo & Teslimat"],
  },
  {
    id: "default-kargo-takip",
    question: "Siparişimi nasıl takip edebilirim?",
    answer:
      "Siparişiniz kargoya verildiğinde e-posta ve SMS ile bilgilendirilirsiniz. Takip numaranızı hesap sayfanızdaki sipariş detayından görüntüleyebilirsiniz.",
    tags: ["Kargo & Teslimat"],
  },
  {
    id: "default-iade",
    question: "İade koşulları nelerdir?",
    answer:
      "Ürünü teslim aldığınız tarihten itibaren 14 gün içinde cayma hakkınızı kullanabilirsiniz. İade edilecek ürünler orijinal ambalajında, etiketli, kullanılmamış ve hasarsız olmalıdır. İade talebi için müşteri hizmetleri ile iletişime geçebilirsiniz.",
    tags: ["İade & Değişim"],
  },
  {
    id: "default-degisim",
    question: "Ürün değişimi yapabilir miyim?",
    answer:
      "Aynı ürünün farklı beden veya varyantı için, teslimattan itibaren 14 gün içinde değişim talebinde bulunabilirsiniz. Ürünün iade koşullarını sağlaması gerekir. Fiyat farkı varsa tahsil edilir veya iade edilir.",
    tags: ["İade & Değişim"],
  },
  {
    id: "default-odeme",
    question: "Ödeme yöntemleri nelerdir?",
    answer:
      "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Kart ödemeleri güvenli ödeme altyapısı üzerinden işlenir; kart bilgileriniz tarafımızda saklanmaz.",
    tags: ["Ödeme"],
  },
  {
    id: "default-guvenli-odeme",
    question: "Ödeme işlemlerim güvenli mi?",
    answer:
      "Evet. Ödemeler SSL korumalı bağlantı ve güvenli ödeme sağlayıcıları üzerinden alınır. Kişisel ve kart verileriniz yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.",
    tags: ["Ödeme"],
  },
  {
    id: "default-vegan",
    question: "Ürünleriniz vegan ve cruelty-free mi?",
    answer:
      "Code Blonde ürünleri vegan ve cruelty-free yaklaşımıyla geliştirilir. Formüllerimizde hayvansal içerik kullanılmaz; hayvanlar üzerinde test yapılmaz. Ürün detay sayfalarından içerik bilgilerine ulaşabilirsiniz.",
    tags: ["Ürünler"],
  },
  {
    id: "default-kullanim",
    question: "Ürünleri nasıl kullanmalıyım?",
    answer:
      "Her ürün sayfasında kullanım önerileri yer alır. Genel olarak cilt ve saç bakımında temiz, kuru veya ürün talimatına uygun yüzeylere uygulayın. Hassas ciltlerde önce küçük bir alanda denemenizi öneririz. Sorularınız için bizimle iletişime geçebilirsiniz.",
    tags: ["Ürünler"],
  },
  {
    id: "default-hesap",
    question: "Hesap oluşturmak zorunlu mu?",
    answer:
      "Misafir olarak alışveriş yapabilirsiniz; ancak hesap oluşturursanız sipariş takibi, favoriler ve adres kaydı gibi özelliklerden daha kolay yararlanırsınız. Hesap oluştururken gizlilik politikamızı ve kullanım şartlarını kabul etmiş olursunuz.",
    tags: ["Hesap"],
  },
  {
    id: "default-iletisim",
    question: "Size nasıl ulaşabilirim?",
    answer:
      "İletişim formumuz üzerinden mesaj bırakabilir, e-posta veya telefon ile bize ulaşabilirsiniz. Yardım merkezi ve sözleşme sayfalarından da sık sorulan konulara hızlıca göz atabilirsiniz.",
    tags: ["İletişim"],
  },
];
