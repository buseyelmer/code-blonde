export const SITE_SLOGAN =
  "Arındır, besle, ışılda — cilt ve saç için doğal güzellik rituali.";

export const SITE_SHORT_SLOGAN = "Arındır · Besle · Işılda";

export const SITE_FOOTER_TAGLINE = "Vegan · Cruelty-Free · Doğal İçerik";

export const SITE_NAME = "Code Blonde";

export const SITE_DEFAULT_URL = "https://codeblonde.com";

export const SITE_DESCRIPTION =
  "Code Blonde; nude tonlarda premium kozmetik, cilt ve saç bakımı sunan doğal güzellik markasıdır. Vegan, cruelty-free ve bitkisel formüller.";

export const SITE_KEYWORDS = [
  "Code Blonde",
  "kozmetik",
  "nude makyaj",
  "cilt bakımı",
  "saç bakımı",
  "vegan kozmetik",
  "doğal güzellik",
  "cruelty-free",
] as const;

/** OG / Twitter / JSON-LD için varsayılan görseller (public/) */
export const SITE_OG_IMAGE = "/hero-product.png";
export const SITE_LOGO = "/code-blonde-logo.svg";
export const SITE_ICON = "/code-blonde-icon.svg";

export const SITE_CONTACT = {
  email: "furkanbahadirozdemir@gmail.com",
  phone: "+905524184348",
  phoneDisplay: "+90 552 418 43 48",
  locality: "İstanbul",
  country: "TR",
  countryName: "Türkiye",
  instagram: "https://www.instagram.com/codeblonde",
} as const;

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv && !fromEnv.includes("localhost")) return fromEnv;
  return SITE_DEFAULT_URL;
}

export function absoluteSiteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
