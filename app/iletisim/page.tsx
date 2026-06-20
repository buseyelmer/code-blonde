import type { Metadata } from "next";
import { SectionLegalContactForm } from "@/theme/section/section.legal.contact.form";
import { ViewPageLayout } from "@/theme/view/view.page.layout";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Code Blonde müşteri hizmetleri iletişim bilgileri ve iletişim formu. Sorularınız için bize ulaşın.",
};

const contactInfo = [
  {
    label: "E-posta",
    value: "info@codeblonde.com",
    href: "mailto:info@codeblonde.com",
  },
  {
    label: "Telefon",
    value: "+90 (212) 000 00 00",
    href: "tel:+902120000000",
  },
  {
    label: "Çalışma Saatleri",
    value: "Pazartesi – Cuma, 09:00 – 18:00",
  },
  {
    label: "Adres",
    value: "İstanbul, Türkiye",
  },
];

export default function IletisimPage() {
  return (
    <ViewPageLayout
      title="İletişim"
      description="Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-charcoal">
            İletişim Bilgileri
          </h2>
          <ul className="space-y-4">
            {contactInfo.map((item) => (
              <li
                key={item.label}
                className="rounded-xl border border-stone/60 bg-white px-5 py-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-1 block text-sm text-charcoal transition-colors hover:text-brand-purple sm:text-base"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-charcoal sm:text-base">
                    {item.value}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed text-muted">
            Müşteri hizmetlerimiz iş günlerinde en geç 24 saat içinde size geri
            dönüş yapar.
          </p>
        </div>

        <div>
          <h2 className="mb-6 text-lg font-semibold text-charcoal">
            Bize Yazın
          </h2>
          <SectionLegalContactForm />
        </div>
      </div>
    </ViewPageLayout>
  );
}
