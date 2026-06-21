"use client";

import { useRaxon } from "@raxonltd/raxon-core";
import { useFavorite } from "@raxonltd/raxon-core/hook";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState, type MouseEvent } from "react";

export function useProductFavorite(productId: string, initialFavorite = false) {
  const { modalAuthRef, isAuthenticated } = useRaxon();
  const { mutate: toggleFavorite, isPending } = useFavorite().toggle();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite, productId]);

  const toggle = useCallback(
    (event?: MouseEvent) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (!isAuthenticated) {
        modalAuthRef.current?.open();
        return;
      }

      if (!productId || isPending) return;

      const next = !isFavorite;
      setIsFavorite(next);

      toggleFavorite(
        { productId },
        {
          onError: () => setIsFavorite(!next),
          onSuccess: () => {
            void queryClient.invalidateQueries();
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
      queryClient,
      toggleFavorite,
    ],
  );

  return { isFavorite, toggle, isPending };
}
