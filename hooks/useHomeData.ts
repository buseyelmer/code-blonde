import { useFetchData } from "@/hooks/useFetchData";
import {
  API_ENDPOINTS,
  type SandboxHomeResponse,
  type SandboxProductsResponse,
} from "@/lib/api/types";

/** Ana sayfa verisi — /api/sandbox (scope=home) */
export function useSandboxData() {
  return useFetchData<SandboxHomeResponse>(API_ENDPOINTS.sandbox);
}

/** Yalnızca ürünler — /api/sandbox?scope=products */
export function useSandboxProducts(enabled = true) {
  return useFetchData<SandboxProductsResponse>(API_ENDPOINTS.sandboxProducts, {
    enabled,
  });
}
