import Link from "next/link";
import { ItemLogo } from "@/theme/item/item.logo";
import { footerCategories, footerSupport } from "@/lib/data";
import { InstagramIcon } from "@/theme/item/item.icons";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
] as const;

export function SectionFooter() {
  return (
    <footer className="mt-auto border-t border-stone/70 bg-powder/40">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <ItemLogo variant="footer" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Code Blonde, doğanın saflığını modern formüllerle buluşturan
              minimalist bir bakım markasıdır. Cildinize iyi gelen, sade ve
              etkili ürünler.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
              Kategoriler
            </h2>
            <ul className="mt-4 space-y-2.5">
              {footerCategories.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
              Müşteri Hizmetleri
            </h2>
            <ul className="mt-4 space-y-2.5">
              {footerSupport.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
              Bizi Takip Edin
            </h2>
            <div className="mt-4 flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-stone bg-cream p-2.5 text-charcoal transition-colors hover:border-gold hover:text-gold"
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">
              info@codeblonde.com
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-stone/60 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Code Blonde. Tüm hakları saklıdır.
          </p>
          <p className="text-xs tracking-wide text-muted">
            Doğadan ilham, cilde özen.
          </p>
        </div>
      </div>
    </footer>
  );
}
