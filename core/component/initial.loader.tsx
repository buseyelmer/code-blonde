"use client";

import { useEffect, useState } from "react";
import { useRaxon } from "@raxonltd/raxon-core";
import SiteLoading from "@/core/component/site.loading";

/**
 * İlk açılışta Raxon bootstrap bitene kadar logo loading gösterir.
 * Sonraki navigasyonlarda tekrar göstermez.
 */
export default function InitialLoader({ children }: { children: React.ReactNode }) {
  const { isLoading } = useRaxon();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading) setReady(true);
  }, [isLoading]);

  if (!ready) {
    return <SiteLoading />;
  }

  return children;
}
