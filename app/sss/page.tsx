'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Search, MessageSquare, Mail, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useFaq } from '@raxonltd/raxon-core/hook';
import { useRaxon } from '@raxonltd/raxon-core';
import { Faq } from '@raxonltd/raxon-core/interface/prisma.interface';

const nudePalette = {
  cream: '#F8F1E9',
  warmBeige: '#EDE0D1',
  softTaupe: '#D9C5B0',
  dustyRose: '#C9A99A',
  goldenNude: '#B89A7E',
  deepSand: '#A17E65',
  rosewood: '#8B6B57',
  espresso: '#5C4638',
};

interface FaqItemProps {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ faq, isOpen, onToggle }: FaqItemProps) {
  return (
    <div 
      className="border-b transition-colors"
      style={{ borderColor: `${nudePalette.softTaupe}40` }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-6 text-left transition-colors sm:py-7"
        style={{ 
          backgroundColor: isOpen ? `${nudePalette.warmBeige}50` : 'transparent',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          marginLeft: '-1.5rem',
          marginRight: '-1.5rem',
          borderRadius: isOpen ? '0.75rem' : '0'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = `${nudePalette.warmBeige}30`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <h3 
          className="flex-1 pr-2 text-base font-medium tracking-tight sm:text-lg"
          style={{ color: nudePalette.espresso }}
        >
          {faq.question}
        </h3>
        <ChevronDown
          className="h-5 w-5 shrink-0 transition-transform duration-300"
          style={{ 
            color: isOpen ? nudePalette.deepSand : `${nudePalette.rosewood}80`,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>
      {isOpen && (
        <div 
          className="animate-in fade-in slide-in-from-top-2 pb-6 duration-200"
          style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem' }}
        >
          <p 
            className="whitespace-pre-line text-sm leading-relaxed md:text-[15px]"
            style={{ color: `${nudePalette.rosewood}cc` }}
          >
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SssPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const { branch } = useRaxon();

  const { fetch } = useFaq();
  const { data, isLoading } = fetch({ page: 1, amount: 100 });

  const faqs = data?.data || [];

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    faqs.forEach(faq => {
      faq.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch =
        searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === null || faq.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [faqs, searchQuery, selectedTag]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div 
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: nudePalette.cream, color: nudePalette.espresso }}
    >
      {/* Subtle background pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(${nudePalette.softTaupe} 0.6px, transparent 1px)`,
          backgroundSize: '5px 5px'
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Breadcrumb */}
        <nav 
          className="mb-8 flex flex-wrap items-center gap-2 text-[11px] font-light uppercase tracking-[0.2em]"
          style={{ color: `${nudePalette.rosewood}99` }}
        >
          <Link 
            href="/" 
            className="transition-colors duration-300 hover:text-[#5C4638]"
            style={{ color: `${nudePalette.rosewood}b3` }}
          >
            Ana Sayfa
          </Link>
          <ChevronRight 
            className="h-3.5 w-3.5 shrink-0" 
            style={{ color: `${nudePalette.softTaupe}99` }}
          />
          <span style={{ color: nudePalette.espresso }}>Sıkça Sorulan Sorular</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-12 text-center lg:mb-16">
          <div 
            className="mb-4 inline-block rounded-full border px-5 py-1.5 text-[10px] font-light uppercase tracking-[0.25em]"
            style={{ 
              borderColor: `${nudePalette.dustyRose}80`,
              color: nudePalette.deepSand
            }}
          >
            Yardım Merkezi
          </div>
          <h1 
            className="font-serif text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: nudePalette.espresso }}
          >
            Size nasıl
            <br />
            <span 
              className="italic"
              style={{ color: nudePalette.deepSand }}
            >
              yardımcı
            </span>{' '}
            olabiliriz?
          </h1>
          <p 
            className="mx-auto mt-5 max-w-lg text-sm font-light leading-relaxed sm:text-base"
            style={{ color: `${nudePalette.rosewood}cc` }}
          >
            Merak ettiğiniz soruların yanıtlarını burada bulabilirsiniz. 
            Aradığınızı bulamazsanız bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column - FAQ List */}
          <div className="lg:col-span-7">
            {/* Search */}
            <div className="mb-8">
              <p 
                className="mb-3 text-[10px] font-light uppercase tracking-[0.22em]"
                style={{ color: nudePalette.deepSand }}
              >
                Sorularınızı arayın
              </p>
              <div 
                className="relative"
                style={{ 
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  border: `1px solid ${nudePalette.softTaupe}60`,
                  boxShadow: `0 4px 20px -4px ${nudePalette.softTaupe}40`
                }}
              >
                <Search 
                  className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2" 
                  strokeWidth={1.5}
                  style={{ color: `${nudePalette.dustyRose}99` }}
                />
                <input
                  type="text"
                  placeholder="Sorularınızı arayın..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border-0 bg-transparent py-4 pl-14 pr-5 text-[15px] transition-all placeholder:font-light focus:outline-none focus:ring-0"
                  style={{ 
                    color: nudePalette.espresso,
                  }}
                />
              </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="rounded-full px-5 py-2.5 text-[11px] font-light uppercase tracking-[0.15em] transition-all duration-200"
                  style={{
                    backgroundColor: selectedTag === null ? nudePalette.espresso : 'white',
                    color: selectedTag === null ? nudePalette.cream : nudePalette.rosewood,
                    border: `1px solid ${selectedTag === null ? nudePalette.espresso : `${nudePalette.softTaupe}60`}`,
                    boxShadow: selectedTag === null ? `0 4px 14px -2px ${nudePalette.espresso}30` : 'none'
                  }}
                >
                  Tümü
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className="rounded-full px-5 py-2.5 text-[11px] font-light uppercase tracking-[0.12em] transition-all duration-200"
                    style={{
                      backgroundColor: selectedTag === tag ? nudePalette.espresso : 'white',
                      color: selectedTag === tag ? nudePalette.cream : nudePalette.rosewood,
                      border: `1px solid ${selectedTag === tag ? nudePalette.espresso : `${nudePalette.softTaupe}60`}`,
                      boxShadow: selectedTag === tag ? `0 4px 14px -2px ${nudePalette.espresso}30` : 'none'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* FAQ Container */}
            <div 
              className="overflow-hidden rounded-3xl border bg-white/70 p-6 backdrop-blur-sm sm:p-8"
              style={{ borderColor: `${nudePalette.softTaupe}40` }}
            >
              {isLoading ? (
                <div className="py-16 text-center">
                  <div 
                    className="mx-auto h-8 w-8 animate-spin rounded-full border-2"
                    style={{ 
                      borderColor: `${nudePalette.softTaupe}40`,
                      borderTopColor: nudePalette.espresso
                    }}
                  />
                  <p 
                    className="mt-4 text-sm font-light"
                    style={{ color: nudePalette.rosewood }}
                  >
                    Yükleniyor...
                  </p>
                </div>
              ) : filteredFaqs.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <HelpCircle 
                    className="mx-auto mb-4 h-12 w-12" 
                    strokeWidth={1}
                    style={{ color: `${nudePalette.softTaupe}80` }}
                  />
                  <p 
                    className="text-sm font-light"
                    style={{ color: `${nudePalette.rosewood}99` }}
                  >
                    {searchQuery || selectedTag ? 'Aradığınız kriterlere uygun soru bulunamadı.' : 'Henüz soru eklenmemiş.'}
                  </p>
                </div>
              ) : (
                <div>
                  {filteredFaqs.map(faq => (
                    <FaqItem 
                      key={faq.id} 
                      faq={faq} 
                      isOpen={openItems.has(faq.id)} 
                      onToggle={() => toggleItem(faq.id)} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Contact CTA Card */}
            <div 
              className="mt-8 overflow-hidden rounded-3xl border p-8 sm:p-10"
              style={{ 
                borderColor: `${nudePalette.softTaupe}40`,
                background: `linear-gradient(145deg, ${nudePalette.warmBeige}60, ${nudePalette.cream})`
              }}
            >
              <h3 
                className="font-serif text-xl tracking-tight sm:text-2xl"
                style={{ color: nudePalette.espresso }}
              >
                Hâlâ cevabını bulamadınız mı?
              </h3>
              <p 
                className="mt-3 text-sm font-light leading-relaxed"
                style={{ color: `${nudePalette.rosewood}cc` }}
              >
                Bizimle iletişime geçin; size yardımcı olmaktan mutluluk duyarız.
              </p>
              <Link
                href="/iletisim"
                className="group mt-6 inline-flex items-center gap-2 text-[11px] font-light uppercase tracking-[0.15em] transition-colors duration-300"
                style={{ color: nudePalette.espresso }}
              >
                <span className="border-b border-transparent transition-all duration-300 group-hover:border-[#5C4638]">
                  İletişime geç
                </span>
                <ArrowUpRight 
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" 
                />
              </Link>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              {/* Stats Cards */}
              <p 
                className="mb-4 text-[10px] font-light uppercase tracking-[0.22em]"
                style={{ color: nudePalette.deepSand }}
              >
                Özet
              </p>
              <div className="mb-8 grid grid-cols-2 gap-3">
                <div 
                  className="rounded-2xl border p-5 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg"
                  style={{ 
                    borderColor: `${nudePalette.softTaupe}40`,
                    backgroundColor: 'white/60'
                  }}
                >
                  <span 
                    className="block font-serif text-3xl tracking-tight"
                    style={{ color: nudePalette.espresso }}
                  >
                    {faqs.length}
                  </span>
                  <span 
                    className="mt-1 block text-[10px] font-light uppercase tracking-[0.15em]"
                    style={{ color: nudePalette.deepSand }}
                  >
                    Toplam soru
                  </span>
                </div>
                <div 
                  className="rounded-2xl border p-5 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg"
                  style={{ 
                    borderColor: `${nudePalette.softTaupe}40`,
                    backgroundColor: 'white/60'
                  }}
                >
                  <span 
                    className="block font-serif text-3xl tracking-tight"
                    style={{ color: nudePalette.espresso }}
                  >
                    {allTags.length}
                  </span>
                  <span 
                    className="mt-1 block text-[10px] font-light uppercase tracking-[0.15em]"
                    style={{ color: nudePalette.deepSand }}
                  >
                    Kategori
                  </span>
                </div>
              </div>

              {/* Contact Links */}
              <div className="space-y-3">
                <Link
                  href="/iletisim"
                  className="group flex items-start gap-4 rounded-2xl border bg-white/60 p-5 backdrop-blur-sm transition-all duration-300"
                  style={{ 
                    borderColor: `${nudePalette.softTaupe}50`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${nudePalette.dustyRose}80`;
                    e.currentTarget.style.backgroundColor = `${nudePalette.warmBeige}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${nudePalette.softTaupe}50`;
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.6)';
                  }}
                >
                  <span 
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300"
                    style={{ 
                      borderColor: nudePalette.softTaupe,
                      color: nudePalette.rosewood
                    }}
                  >
                    <MessageSquare className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 
                      className="text-[15px] font-medium tracking-tight"
                      style={{ color: nudePalette.espresso }}
                    >
                      İletişim
                    </h4>
                    <p 
                      className="text-xs font-light"
                      style={{ color: `${nudePalette.rosewood}99` }}
                    >
                      Bizimle iletişime geçin
                    </p>
                  </div>
                  <ChevronRight 
                    className="mt-1.5 h-5 w-5 shrink-0 transition-all duration-300 group-hover:translate-x-0.5" 
                    style={{ color: `${nudePalette.dustyRose}99` }}
                  />
                </Link>

                {branch?.email && (
                  <a
                    href={`mailto:${branch.email}`}
                    className="group flex items-start gap-4 rounded-2xl border bg-white/60 p-5 backdrop-blur-sm transition-all duration-300"
                    style={{ 
                      borderColor: `${nudePalette.softTaupe}50`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${nudePalette.dustyRose}80`;
                      e.currentTarget.style.backgroundColor = `${nudePalette.warmBeige}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${nudePalette.softTaupe}50`;
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    <span 
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300"
                      style={{ 
                        borderColor: nudePalette.softTaupe,
                        color: nudePalette.rosewood
                      }}
                    >
                      <Mail className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 
                        className="text-[15px] font-medium tracking-tight"
                        style={{ color: nudePalette.espresso }}
                      >
                        E-posta
                      </h4>
                      <p 
                        className="break-all text-xs font-light"
                        style={{ color: `${nudePalette.rosewood}99` }}
                      >
                        {branch.email}
                      </p>
                    </div>
                    <ChevronRight 
                      className="mt-1.5 h-5 w-5 shrink-0 transition-all duration-300 group-hover:translate-x-0.5" 
                      style={{ color: `${nudePalette.dustyRose}99` }}
                    />
                  </a>
                )}
              </div>

              {/* Quick Help Card */}
              <div 
                className="mt-8 rounded-3xl border p-6 sm:p-8"
                style={{ 
                  borderColor: `${nudePalette.softTaupe}40`,
                  backgroundColor: nudePalette.espresso
                }}
              >
                <h4 
                  className="font-serif text-xl tracking-tight"
                  style={{ color: nudePalette.cream }}
                >
                  Hızlı Yardım
                </h4>
                <p 
                  className="mt-2 text-sm font-light leading-relaxed"
                  style={{ color: `${nudePalette.warmBeige}cc` }}
                >
                  En çok sorulan sorulara göz atın ve hızlıca yanıt bulun.
                </p>
                <div className="mt-5 space-y-2">
                  {['Kargo & Teslimat', 'İade & Değişim', 'Ödeme Seçenekleri'].map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm font-light transition-all duration-200"
                      style={{ 
                        backgroundColor: `${nudePalette.warmBeige}15`,
                        color: nudePalette.cream
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${nudePalette.warmBeige}30`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${nudePalette.warmBeige}15`;
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div 
          className="mt-16 border-t pt-12 text-center sm:mt-20 sm:pt-16"
          style={{ borderColor: `${nudePalette.softTaupe}50` }}
        >
          <p 
            className="mb-6 text-base font-light"
            style={{ color: `${nudePalette.rosewood}cc` }}
          >
            Ürünlerimizi keşfetmek ister misiniz?
          </p>
          <Link
            href="/urunler"
            className="group inline-flex items-center gap-3 rounded-full px-10 py-4 text-sm font-light uppercase tracking-[0.15em] transition-all duration-300"
            style={{ 
              backgroundColor: nudePalette.espresso,
              color: nudePalette.cream,
              boxShadow: `0 8px 24px -6px ${nudePalette.espresso}40`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3F2F25';
              e.currentTarget.style.boxShadow = `0 12px 32px -8px ${nudePalette.espresso}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = nudePalette.espresso;
              e.currentTarget.style.boxShadow = `0 8px 24px -6px ${nudePalette.espresso}40`;
            }}
          >
            Ürünlere git
            <ChevronRight 
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" 
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
