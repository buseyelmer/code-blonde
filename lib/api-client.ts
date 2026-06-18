import { getServerEnv } from "@/lib/env";

export type FetchParams = Record<
  string,
  string | number | boolean | string[] | undefined | null
>;

export type FetchDataOptions = {
  /** ISR: saniye cinsinden yeniden doğrulama süresi */
  revalidate?: number;
  cache?: RequestCache;
};

/** Sandbox ve ürün API çağrıları için önerilen cache süresi */
export const API_REVALIDATE_SECONDS = 60;

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly body?: string,
    public readonly url?: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

function buildUrl(baseUrl: string, endpoint: string, params?: FetchParams): string {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${baseUrl.replace(/\/$/, "")}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, String(item)));
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

function buildHeaders(): Record<string, string> {
  const env = getServerEnv();

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  if (env.apiKey) {
    headers["x-api-key"] = env.apiKey;
  }

  if (env.ticimaxAjaxProToken) {
    headers["X-Ajaxpro-Token"] = env.ticimaxAjaxProToken;
  }

  if (env.ticimaxMemberCode) {
    headers["X-Ticimax-MemberCode"] = env.ticimaxMemberCode;
  }

  if (env.siteUrl) {
    headers.Referer = env.siteUrl;
    headers.Origin = env.siteUrl.replace(/\/$/, "");
  }

  return headers;
}

async function parseErrorBody(response: Response): Promise<string> {
  try {
    return (await response.text()).slice(0, 1500);
  } catch {
    return "";
  }
}

export async function fetchData<T>(
  endpoint: string,
  params?: FetchParams,
  options?: FetchDataOptions,
): Promise<T | null> {
  try {
    const env = getServerEnv();
    const requestUrl = buildUrl(env.apiBaseUrl, endpoint, params);
    const headers = buildHeaders();

    const fetchInit: RequestInit & { next?: { revalidate: number } } = {
      method: "GET",
      headers,
    };

    if (options?.revalidate !== undefined) {
      fetchInit.next = { revalidate: options.revalidate };
    } else if (options?.cache) {
      fetchInit.cache = options.cache;
    } else {
      fetchInit.cache = "no-store";
    }

    const response = await fetch(requestUrl, fetchInit);

    if (!response.ok) {
      const body = await parseErrorBody(response);
      console.error("[api-client] API hatası:", {
        status: response.status,
        statusText: response.statusText,
        url: requestUrl,
        body,
      });
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error("[api-client]", error.message);
    } else {
      console.error("[api-client] Beklenmeyen hata:", error);
    }
    return null;
  }
}
