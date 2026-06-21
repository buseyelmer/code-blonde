import { PRODUCTS, type Product, type Shade } from "@/core/constant/home.constant";

const TONE_PRODUCT_MAP: Record<string, { productId: number; shadeName: string }> = {
  Poudre: { productId: 1, shadeName: "Poudre" },
  Lait: { productId: 2, shadeName: "Lait de Noix" },
  Sable: { productId: 1, shadeName: "Sable" },
  Pêche: { productId: 4, shadeName: "Pêche" },
  "Rose Thé": { productId: 4, shadeName: "Rose Thé" },
  Champagne: { productId: 3, shadeName: "Champagne" },
  Biscuit: { productId: 4, shadeName: "Biscuit" },
  Grège: { productId: 5, shadeName: "Grège" },
  "Café Crème": { productId: 1, shadeName: "Café Crème" },
  Miel: { productId: 3, shadeName: "Miel" },
  Terre: { productId: 4, shadeName: "Terre" },
  Noix: { productId: 5, shadeName: "Noix" },
  Ivoire: { productId: 2, shadeName: "Porcelaine" },
  "Beige Doré": { productId: 2, shadeName: "Beige Doré" },
  Ambre: { productId: 5, shadeName: "Moka" },
  Sienne: { productId: 2, shadeName: "Sienne" },
};

export function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62;
}

export function resolveToneProduct(toneName: string): {
  product: Product;
  shade: Shade;
  shadeIndex: number;
} | null {
  const link = TONE_PRODUCT_MAP[toneName];
  if (!link) return null;

  const product = PRODUCTS.find((p) => p.id === link.productId);
  if (!product) return null;

  const shadeIndex = product.shades.findIndex((s) => s.name === link.shadeName);
  if (shadeIndex === -1) return null;

  return { product, shade: product.shades[shadeIndex], shadeIndex };
}
