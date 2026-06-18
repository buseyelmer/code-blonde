import { fetchData } from "@/lib/api-client";
import type { IData } from "@/core/interface/nexine.interface";
import type { Brand } from "@/core/interface/prisma.interface";

export const CODE_BLONDE_BRAND_NAME = "Code Blonde";

function normalizeBrandName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function matchesCodeBlonde(name: unknown): boolean {
  const normalized = normalizeBrandName(name);
  return (
    normalized === "code blonde" ||
    normalized === "code-blonde" ||
    normalized.includes("code blonde")
  );
}

export async function resolveCodeBlondeBrandId(): Promise<string | null> {
  const fromEnv = process.env.CODE_BLONDE_BRAND_ID?.trim();
  if (fromEnv) return fromEnv;

  const brandRes = await fetchData<IData<Brand>>("/customer/brand", {
    amount: 600,
  });

  const brands = brandRes?.data ?? [];
  const match = brands.find((brand) => matchesCodeBlonde(brand.name));

  if (!match?.id) {
    console.warn(
      `[resolve-brand] "${CODE_BLONDE_BRAND_NAME}" markası bulunamadı.`,
    );
    return null;
  }

  return match.id;
}

export function isCodeBlondeProduct(
  product: Record<string, unknown>,
  brandId?: string | null,
): boolean {
  if (brandId) {
    const productBrandId =
      typeof product.brandId === "string"
        ? product.brandId
        : product.brand && typeof product.brand === "object" && "id" in product.brand
          ? String((product.brand as { id?: string }).id ?? "")
          : "";

    if (productBrandId && productBrandId === brandId) return true;
  }

  if (typeof product.brand === "string") {
    return matchesCodeBlonde(product.brand);
  }

  if (product.brand && typeof product.brand === "object" && "name" in product.brand) {
    return matchesCodeBlonde((product.brand as { name?: string }).name);
  }

  return false;
}
