export const palette = {
    cream: "#F8F1E9",
    warmBeige: "#EDE0D1",
    softTaupe: "#D9C5B0",
    dustyRose: "#C9A99A",
    goldenNude: "#B89A7E",
    deepSand: "#A17E65",
    rosewood: "#8B6B57",
    espresso: "#5C4638",
    dark: "#2C2520",
};


export interface Shade {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  details: string;
  shades: Shade[];
  volume: string;
  badge?: string;
}
  export const PRODUCTS: Product[] = [
    {
      id: 1,
      name: "Velvet Nude",
      category: "Ruj",
      price: 649,
      badge: "Bestseller",
      description: "İpek gibi mat bitişli, ultra pigmentli nude ruj.",
      details: "12 saat kalıcı, nemlendirici formül. Dudak çizgilerini doldurur, asla kurutmaz.",
      shades: [
        { name: "Poudre", hex: "#D9C5B0" },
        { name: "Sable", hex: "#B89A7E" },
        { name: "Rose Cendré", hex: "#C9A99A" },
        { name: "Café Crème", hex: "#A17E65" },
      ],
      volume: "3.5g",
    },
    {
      id: 2,
      name: "Crème de Teint",
      category: "Fondöten",
      price: 899,
      description: "İkinci cilt hissi bırakan, hafif ve doğal kapatıcılık.",
      details: "Ciltle bütünleşen, ince bir film oluşturan krem fondöten. SPF 15 içerir.",
      shades: [
        { name: "Porcelaine", hex: "#F8F1E9" },
        { name: "Lait de Noix", hex: "#EDE0D1" },
        { name: "Beige Doré", hex: "#D9C5B0" },
        { name: "Sienne", hex: "#B89A7E" },
      ],
      volume: "30ml",
    },
    {
      id: 3,
      name: "Lueur Liquide",
      category: "Highlighter",
      price: 549,
      badge: "Yeni",
      description: "Işıkla parlayan, ince partiküllü sıvı aydınlatıcı.",
      details: "Yüzün en yüksek noktalarına uygulanır. Doğal ışıltı.",
      shades: [
        { name: "Champagne", hex: "#EDE0D1" },
        { name: "Or Rose", hex: "#D9C5B0" },
        { name: "Miel", hex: "#B89A7E" },
      ],
      volume: "15ml",
    },
    {
      id: 4,
      name: "Blush Sablé",
      category: "Allık",
      price: 749,
      description: "Işıltısız, doğal yanak rengi veren krem allık.",
      details: "Cilde eriyen doku. Elmacık kemiklerinde yumuşak pembelik yaratır.",
      shades: [
        { name: "Pêche", hex: "#E8C9B8" },
        { name: "Rose Thé", hex: "#C9A99A" },
        { name: "Biscuit", hex: "#D9C5B0" },
        { name: "Terre", hex: "#A17E65" },
      ],
      volume: "8g",
    },
    {
      id: 5,
      name: "Ombre Crème",
      category: "Göz Farı",
      price: 499,
      description: "Tek vuruşta katmanlanabilen krem göz farı.",
      details: "Parmakla veya fırçayla uygulanır. Mat ve hafif saten seçenekleri.",
      shades: [
        { name: "Nu", hex: "#D9C5B0" },
        { name: "Grège", hex: "#C9A99A" },
        { name: "Moka", hex: "#A17E65" },
        { name: "Noix", hex: "#8B6B57" },
      ],
      volume: "4g",
    },
    {
      id: 6,
      name: "Baume Lèvres",
      category: "Bakım",
      price: 399,
      badge: "Limited",
      description: "Nude rujların altına veya tek başına kullanılabilen nem balsamı.",
      details: "Shea yağı, argan ve vitamin E ile zenginleştirilmiş.",
      shades: [
        { name: "Transparent", hex: "#F8F1E9" },
        { name: "Rosé", hex: "#E8C9B8" },
      ],
      volume: "12ml",
    },
  ];

  export const CATEGORIES = ["Tümü", "Ruj", "Fondöten", "Allık", "Göz Farı", "Highlighter", "Bakım"]; 

  export interface NudeTone {
    name: string;
    hex: string;
    tone: string;
    productId: number;
    shadeIndex: number;
  }

  export const NUDE_TONES: NudeTone[] = [
    { name: "Poudre", hex: "#F8F1E9", tone: "Açık", productId: 1, shadeIndex: 0 },
    { name: "Lait", hex: "#EDE0D1", tone: "Açık", productId: 2, shadeIndex: 1 },
    { name: "Sable", hex: "#D9C5B0", tone: "Açık-Orta", productId: 1, shadeIndex: 1 },
    { name: "Pêche", hex: "#E8C9B8", tone: "Açık-Orta", productId: 4, shadeIndex: 0 },
    { name: "Rose Thé", hex: "#C9A99A", tone: "Orta", productId: 4, shadeIndex: 1 },
    { name: "Champagne", hex: "#EDE0D1", tone: "Açık", productId: 3, shadeIndex: 0 },
    { name: "Biscuit", hex: "#D9C5B0", tone: "Açık-Orta", productId: 4, shadeIndex: 2 },
    { name: "Grège", hex: "#C9A99A", tone: "Orta", productId: 5, shadeIndex: 1 },
    { name: "Café Crème", hex: "#B89A7E", tone: "Orta", productId: 1, shadeIndex: 3 },
    { name: "Miel", hex: "#A17E65", tone: "Orta-Koyu", productId: 3, shadeIndex: 2 },
    { name: "Terre", hex: "#8B6B57", tone: "Orta-Koyu", productId: 4, shadeIndex: 3 },
    { name: "Noix", hex: "#5C4638", tone: "Koyu", productId: 5, shadeIndex: 3 },
    { name: "Ivoire", hex: "#EDE0D1", tone: "Açık", productId: 2, shadeIndex: 0 },
    { name: "Beige Doré", hex: "#D9C5B0", tone: "Açık-Orta", productId: 2, shadeIndex: 2 },
    { name: "Ambre", hex: "#A17E65", tone: "Orta-Koyu", productId: 5, shadeIndex: 2 },
    { name: "Sienne", hex: "#B89A7E", tone: "Orta", productId: 2, shadeIndex: 3 },
  ];

  export function resolveToneProduct(tone: NudeTone) {
    const product = PRODUCTS.find((p) => p.id === tone.productId);
    if (!product) return null;
    const shade = product.shades[tone.shadeIndex];
    if (!shade) return null;
    return { product, shade, shadeIndex: tone.shadeIndex };
  }

  export interface PhilosophyItem {
    title: string;
    desc: string;
  }
  export const PHILOSOPHY: PhilosophyItem[] = [
    { title: "Cildinizin ritmine saygı", desc: "Saç, cilt ve vücut bakımında abartısız formüller — günlük ritualinize doğal uyum sağlar." },
    { title: "Her ihtiyaca özel çözüm", desc: "Parfümden peelinge, saç serumundan ağdaya; geniş ürün yelpazesiyle bütünsel bakım deneyimi." },
    { title: "Zamansız ve şeffaf güzellik", desc: "Vegan, cruelty-free içerikler; sade ambalaj ve güvenilir laboratuvar standartlarıyla Code Blonde güvencesi." },
  ];

  export interface Ingredient {
    icon: string;
    title: string;
    desc: string;
  }
  export const INGREDIENTS: Ingredient[] = [
    { icon: "🌿", title: "Doğal İçerik", desc: "%92 bitkisel kaynaklı formül" },
    { icon: "🐰", title: "Cruelty Free", desc: "Hayvan testi yapılmaz" },
    { icon: "♻️", title: "Sürdürülebilir", desc: "Geri dönüştürülebilir ambalaj" },
    { icon: "✨", title: "Dermatolojik", desc: "Hassas ciltler için test edildi" },
  ];

  export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    rating: number;
  }
  export const TESTIMONIALS: Testimonial[] = [
    {
      quote:
        "Code Blonde saç kremi dökülme sorunumu belirgin şekilde azalttı. Kokusu zarif, yapış yapış his bırakmıyor — artık vazgeçilmezim.",
      name: "Ayşe K.",
      role: "Sadık Müşteri",
      rating: 5,
    },
    {
      quote:
        "Peeling ürünlerinin dokusu ve kokusu harika. Code Blonde ciltte tahriş etmeden arındırıyor; her duş sonrası pürüzsüz bir his.",
      name: "Melis T.",
      role: "Güzellik Bloggerı",
      rating: 5,
    },
    {
      quote:
        "Parfüm koleksiyonu beklediğimden çok daha kalıcı. Code Blonde hem şık hem sade — günlük kullanım için tam isabet.",
      name: "Zeynep D.",
      role: "Moda Danışmanı",
      rating: 5,
    },
  ];

export const TRUST_ITEMS = ["Cruelty Free", "Vegan Formül", "Parabensiz", "Fransız Laboratuvar", "Tekrar Doldurulabilir"];

export const HOME_DATA = {
    PRODUCTS,
    NUDE_TONES,
    PHILOSOPHY,
    INGREDIENTS,
    TESTIMONIALS,
    TRUST_ITEMS,
    palette,
    CATEGORIES
  };