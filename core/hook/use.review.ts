"use client";

import { nexineAxios } from "@raxonltd/raxon-core";
import { useQuery } from "@tanstack/react-query";

type ReviewFetchParams = {
  productId?: string;
  amount?: number;
  page?: number;
  enabled?: boolean;
};

/** Turbopack, raxon-core hook barrel'ındaki `export *` ile useReview'ı görmüyor. */
export function useReview() {
  return {
    fetch: (params?: ReviewFetchParams) =>
      useQuery({
        queryKey: ["review", params],
        enabled: params?.enabled ?? true,
        queryFn: async () => {
          const response = await nexineAxios.get("/customer/review", {
            params: {
              page: params?.page ?? 1,
              amount: params?.amount ?? 10,
              productId: params?.productId,
            },
          });
          return response.data;
        },
      }),
  };
}
