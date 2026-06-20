'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginType } from '@raxonltd/raxon-core/interface/prisma.interface';
import { useRaxon } from '@raxonltd/raxon-core';

export default function GuvenlikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, profile } = useRaxon();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && profile?.loginType !== LoginType.GUEST) {
      router.push('/hesabim');
    }
  }, [isAuthenticated, isLoading, profile, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F1E9]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
        <p className="mt-4 text-sm font-light tracking-widest text-[#8B6B57]">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F1E9] text-[#5C4638] selection:bg-[#C9A99A] selection:text-[#F8F1E9] overflow-x-hidden">
      {children}
    </div>
  );
}
