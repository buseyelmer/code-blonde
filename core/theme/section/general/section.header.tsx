'use client';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import capitalize from 'lodash/capitalize';
import { SectionAnnouncement } from './section.announcement';
import { Campaign, CampaignType, Category } from '@raxonltd/raxon-core/interface/prisma.interface';
import { useRaxon } from '@raxonltd/raxon-core';

function categoryLabel(cat: Category) {
  const raw = cat.name?.getName?.() ?? '';
  return raw ? capitalize(raw) : '';
}

function MobileCategoryTree({
  nodes,
  depth,
  onNavigate,
}: {
  nodes: Category[];
  depth: number;
  onNavigate: () => void;
}) {
  const sorted = [...nodes].sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));

  return (
    <ul className={depth === 0 ? 'space-y-0.5' : 'mt-1 space-y-0.5 border-l border-neutral-200 pl-3'} role="list">
      {sorted.map(cat => {
        if (cat.deletedAt) return null;
        const children = (cat.children ?? []).filter(c => !c.deletedAt);
        const hasChildren = children.length > 0;
        return (
          <MobileCategoryTreeItem key={cat.id} cat={cat} depth={depth} hasChildren={hasChildren} childrenNodes={children} onNavigate={onNavigate} />
        );
      })}
    </ul>
  );
}

function MobileCategoryTreeItem({
  cat,
  depth,
  hasChildren,
  childrenNodes,
  onNavigate,
}: {
  cat: Category;
  depth: number;
  hasChildren: boolean;
  childrenNodes: Category[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const label = categoryLabel(cat);

  return (
    <li>
      <div className="flex min-h-[48px] items-stretch gap-1 rounded-lg">
        <Link
          href={`/urunler?category=${cat.id}`}
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center py-3 text-[13px] font-medium text-neutral-800 transition hover:text-neutral-950"
        >
          <span className="truncate">{label || 'Kategori'}</span>
        </Link>
        {hasChildren ? (
          <button
            type="button"
            className="flex w-11 shrink-0 items-center justify-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            aria-expanded={open}
            aria-label={open ? 'Alt kategorileri gizle' : 'Alt kategorileri göster'}
            onClick={() => setOpen(o => !o)}
          >
            <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.5} />
          </button>
        ) : null}
      </div>
      {hasChildren && open ? <MobileCategoryTree nodes={childrenNodes} depth={depth + 1} onNavigate={onNavigate} /> : null}
    </li>
  );
}

function MobileNavDrawer({
  open,
  onClose,
  findHeaderCollection,
  categoryTree,
}: {
  open: boolean;
  onClose: () => void;
  findHeaderCollection: Campaign[];
  categoryTree: Category[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const handleNavigate = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label="Menü">
      <button type="button" className="absolute inset-0 bg-neutral-900/40" aria-label="Menüyü kapat" onClick={onClose} />
      <div className="absolute inset-0 flex flex-col bg-white shadow-xl">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-4">
          <span className="font-['Colabero'] text-sm font-semibold tracking-[0.32em] text-neutral-900">Menü</span>
          <button
            type="button"
            className="inline-flex p-2 text-neutral-900 transition-opacity hover:opacity-60"
            aria-label="Kapat"
            onClick={onClose}
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {findHeaderCollection.length > 0 && (
            <div className="mb-6">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Koleksiyonlar</p>
              <ul className="space-y-1">
                {findHeaderCollection.map(l => (
                  <li key={l.id}>
                    <Link
                      href={`/koleksiyon/${l.id}`}
                      onClick={handleNavigate}
                      className="block rounded-lg py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900"
                    >
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Kategoriler</p>
            <MobileCategoryTree nodes={categoryTree} depth={0} onNavigate={handleNavigate} />
          </div>
        </nav>
      </div>
    </div>,
    document.body
  );
}

export function SectionHeader() {
  const { category, campaign } = useRaxon();
  const { cart } = useRaxon();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  let findHeaderCollection = campaign.filter(c => c.type === CampaignType.COLLECTION && c.tags.includes('HERO'));

  const cartItemCount = cart?.items?.length || 0;

  return (
    <>
      {/* Top Bar */}
      <div className={mobileNavOpen ? 'max-lg:hidden' : undefined}>
        <SectionAnnouncement />
      </div>
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="-ml-1 inline-flex p-1.5 text-neutral-900 transition-opacity hover:opacity-60 lg:hidden"
                aria-expanded={mobileNavOpen}
                aria-label={mobileNavOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                onClick={() => setMobileNavOpen(o => !o)}
              >
                {mobileNavOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
              </button>
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileNavOpen(false)}>
                <span className="font-['Colabero'] text-sm font-semibold tracking-[0.32em]">Bulut</span>
              </Link>
            </div>

            <nav className="hidden items-center gap-7 lg:flex">
              {findHeaderCollection.map(l => (
                <Link key={l.id} href={`/koleksiyon/${l.id}`} className="text-[12px] font-semibold uppercase tracking-[0.22em] text-neutral-600 transition hover:text-neutral-900">
                  {l.title}
                </Link>
              ))}
              {category.map(c => (
                <Link key={c.id} href={`/urunler?category=${c.id}`} className="text-[12px] font-semibold uppercase tracking-[0.22em] text-neutral-600 transition hover:text-neutral-900">
                  {capitalize(c.name?.getName())}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4 md:space-x-6">
              <button className="text-neutral-900 hover:opacity-60 transition-opacity" aria-label="Ara" type="button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link href="/hesabim" className="text-neutral-900 hover:opacity-60 transition-opacity" aria-label="Hesap">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href="/sepet" className="text-neutral-900 hover:opacity-60 transition-opacity relative" aria-label="Sepet">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-0.5 text-[9px] font-medium text-white">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MobileNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} findHeaderCollection={findHeaderCollection} categoryTree={category} />
    </>
  );
}
