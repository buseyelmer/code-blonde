"use client";

import { nexineAxios, useRaxon } from "@raxonltd/raxon-core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import toast from "react-hot-toast";

export function useProductFavorite(productId: string, initialFavorite = false) {
  const { modalAuthRef, isAuthenticated } = useRaxon();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite, productId]);

  const { mutate: toggleFavorite, isPending } = useMutation({
    mutationFn: async (data: { productId: string }) => {
      const response = await nexineAxios.post("/customer/favorite", data, {
        headers: { "x-raxon-silent": "1" },
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["product"] });
      void queryClient.invalidateQueries({ queryKey: ["campaign"] });
      void queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
  });

  const toggle = useCallback(
    (event?: MouseEvent) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (!isAuthenticated) {
        modalAuthRef?.current?.open();
        return;
      }

      if (!productId || isPending) return;

      const next = !isFavorite;
      setIsFavorite(next);

      toggleFavorite(
        { productId },
        {
          onError: () => {
            setIsFavorite(!next);
            toast.error("Favori işlemi başarısız oldu");
          },
          onSuccess: () => {
            toast.success(next ? "Favorilere eklendi" : "Favorilerden çıkarıldı");
          },
        },
      );
    },
    [
      isAuthenticated,
      isFavorite,
      isPending,
      modalAuthRef,
      productId,
      toggleFavorite,
    ],
  );

  return { isFavorite, toggle, isPending };
}
