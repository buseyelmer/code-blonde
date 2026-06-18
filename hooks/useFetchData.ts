"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ApiEndpoint } from "@/lib/api/types";

async function fetchJson<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `İstek başarısız oldu (${response.status})`);
  }

  return response.json() as Promise<T>;
}

type QueryKey = readonly ["fetchData", string];

type UseFetchDataOptions<T> = Omit<
  UseQueryOptions<T, Error, T, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useFetchData<T>(
  endpoint: ApiEndpoint | string,
  options?: UseFetchDataOptions<T>,
) {
  return useQuery<T, Error, T, QueryKey>({
    queryKey: ["fetchData", endpoint],
    queryFn: () => fetchJson<T>(endpoint),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    ...options,
  });
}
