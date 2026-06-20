import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codeblonde.com";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Code Blonde markasının vizyonu, değerleri ve minimalist bakım felsefesi hakkında bilgi edinin.",
  alternates: {
    canonical: `${siteUrl}/hakkimizda`,
  },
  openGraph: {
    title: "Hakkımızda | Code Blonde",
    description:
      "Code Blonde markasının vizyonu, değerleri ve minimalist bakım felsefesi.",
    url: `${siteUrl}/hakkimizda`,
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Hakkımızda – Code Blonde",
  url: `${siteUrl}/hakkimizda`,
  description:
    "Code Blonde, doğanın saflığını modern formüllerle buluşturan minimalist bir bakım markasıdır.",
  mainEntity: {
    "@type": "Organization",
    name: "Code Blonde",
    url: siteUrl,
  },
};

const VALUES = [
  {
    title: "Doğallık",
    description:
      "Formüllerimizde cildinize iyi gelen, sade ve anlaşılır içeriklere öncelik veriyoruz.",
  },
  {
    title: "Şeffaflık",
    description:
      "Her ürünün ne işe yaradığını açıkça anlatıyor; gereksiz vaatlerden uzak duruyoruz.",
  },
  {
    title: "Minimalizm",
    description:
      "Az ama etkili ürünlerle günlük bakım rutininizi sadeleştiriyoruz.",
  },
  {
    title: "Özen",
    description:
      "Üretimden paketlemeye kadar her adımda kalite ve kullanıcı deneyimini ön planda tutuyoruz.",
  },
] as const;

export default function HakkimizdaPage() {
  return (
    <>
      <Script
        id="schema-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <main className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Code Blonde
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
              Hakkımızda
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Doğanın saflığını modern formüllerle buluşturan minimalist bir
              bakım markasıyız. Cildinize iyi gelen, sade ve etkili ürünler
              tasarlıyoruz.
            </p>
          </header>

          <section className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-charcoal">Vizyonumuz</h2>
              <p className="text-sm leading-7 text-muted sm:text-base">
                Code Blonde olarak, günlük bakımı karmaşık ritüellerden
                çıkarıp herkesin kolayca uygulayabileceği anlamlı bir deneyime
                dönüştürmeyi hedefliyoruz. Cilt ve saç bakımında doğal
                içeriklerle desteklenen, güvenilir ve şık bir marka olmak
                vizyonumuzun merkezinde yer alıyor.
              </p>
              <p className="text-sm leading-7 text-muted sm:text-base">
                Her koleksiyonumuzda formül, doku ve koku uyumunu özenle
                dengeliyor; kullanıcılarımıza hem kendilerini iyi hissettiren
                hem de sürdürülebilir alışkanlıklar kazandıran ürünler
                sunuyoruz.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-stone/70 bg-stone/30">
              <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-powder via-stone/40 to-powder">
                <p className="px-6 text-center text-sm font-medium text-muted">
                  Marka görseli yakında eklenecektir
                </p>
              </div>
            </div>
          </section>

          <section className="mt-16 border-t border-stone/60 pt-14">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-charcoal">Değerlerimiz</h2>
              <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                Markamızı şekillendiren ilkeler, ürün geliştirme sürecimizin
                her aşamasında bize rehberlik eder.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {VALUES.map((value) => (
                <article
                  key={value.title}
                  className="rounded-2xl border border-stone/70 bg-white p-6 transition-colors hover:border-primary-accent/40"
                >
                  <h3 className="text-lg font-semibold text-charcoal">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16 border-t border-stone/60 pt-14">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-charcoal">Bizi Ziyaret Edin</h2>
              <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                Showroom ve iletişim bilgilerimiz çok yakında burada yer alacak.
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-stone/70 bg-stone/40">
              <div className="flex min-h-[280px] items-center justify-center bg-gradient-to-br from-stone/50 via-stone/30 to-powder px-6 sm:min-h-[320px]">
                <p className="max-w-md text-center text-sm font-medium text-muted sm:text-base">
                  Adres bilgileri yakında eklenecektir
                </p>
              </div>
            </div>
          </section>

          <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-charcoal bg-charcoal px-8 py-3.5 text-sm font-semibold text-cream transition-colors hover:border-primary-accent hover:bg-primary-accent"
            >
              Ürünleri Keşfet
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center rounded-full border border-stone bg-white px-8 py-3.5 text-sm font-semibold text-charcoal transition-colors hover:border-primary-accent hover:text-primary-accent"
            >
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
