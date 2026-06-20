'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LoginType } from '@raxonltd/raxon-core/interface/prisma.interface';
import Link from 'next/link';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  FileText, 
  LogOut,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useAuth } from '@raxonltd/raxon-core/hook';
import { useRaxon } from '@raxonltd/raxon-core';

const menuItems = [
  { href: '/hesabim', label: 'Hesabım', icon: User },
  { href: '/hesabim/siparislerim', label: 'Siparişlerim', icon: ShoppingBag },
  { href: '/hesabim/favorilerim', label: 'Favorilerim', icon: Heart },
  { href: '/hesabim/adreslerim', label: 'Adreslerim', icon: MapPin },
  { href: '/hesabim/faturalarim', label: 'Faturalarım', icon: FileText },
];

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, profile } = useRaxon();
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || profile?.loginType === LoginType.GUEST)) {
      router.push('/guvenlik/giris-yap');
    }
  }, [isAuthenticated, isLoading, profile, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || profile?.loginType === LoginType.GUEST) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-rose-900 flex items-center justify-center text-white text-lg font-medium">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {profile?.firstName} {profile?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{profile?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-rose-900 text-white' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-rose-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Çıkış Yap</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
