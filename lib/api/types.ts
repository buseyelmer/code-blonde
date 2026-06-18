import type { Product } from "@/core/interface/product.interface";
import type { Category } from "@/core/interface/prisma.interface";
import type { ProductCategoryOption, ProductGroup } from "@/lib/api/group-products";

export const API_ENDPOINTS = {
  sandbox: "/api/sandbox",
  sandboxProducts: "/api/sandbox?scope=products",
} as const;

export type ApiEndpoint =
  (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];

export type SandboxHomeResponse = {
  products?: Product[];
  bestSeller?: Product[];
  category?: Category[];
  productCategories?: ProductCategoryOption[];
  productGroups?: ProductGroup[];
  error?: string;
  warnings?: string[];
  meta?: {
    scope?: string;
    productCount?: number;
    bestSellerCount?: number;
    categoryCount?: number;
    count?: number;
  };
};

export type SandboxProductsResponse = {
  products: Product[];
  productCategories?: ProductCategoryOption[];
  productGroups?: ProductGroup[];
  error?: string;
  warnings?: string[];
  meta?: { scope?: string; count?: number };
};