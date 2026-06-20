'use client';
import { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import '@/core/util/util';
import { QueryClient } from '@tanstack/react-query';
import { SectionHeader } from '../theme/section/general/section.header';
import { SectionFooter } from '../theme/section/general/section.footer';
import { usePathname } from 'next/navigation';
import { RaxonProvider, useRaxon } from '@raxonltd/raxon-core';
var localClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});
export default function GeneralLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  let isShowHeader = useMemo(() => {
    return !pathname.includes('/home') && !pathname.includes('/odeme');
  }, [pathname]);

  return (
    <RaxonProvider apiKey={process.env.NEXT_PUBLIC_API_KEY ?? ''} apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ''}>
      <Toaster />
      <div className="min-h-screen  text-neutral-900 selection:bg-neutral-200">
        {isShowHeader && <SectionHeader />}

        <main>{children}</main>

        {isShowHeader && <SectionFooter />}
      </div>
    </RaxonProvider>
  );
}
