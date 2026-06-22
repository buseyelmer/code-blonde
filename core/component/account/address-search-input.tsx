'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, MapPin, Search } from 'lucide-react';

export type AddressSearchResult = {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};

type AddressSearchInputProps = {
  query: string;
  onQueryChange: (value: string) => void;
  results: AddressSearchResult[];
  isSearching: boolean;
  showResults: boolean;
  onShowResultsChange: (show: boolean) => void;
  onSelect: (placeId: string) => void;
  error?: string;
  placeholder?: string;
  noResultsText?: string;
  embedded?: boolean;
};

export function AddressSearchInput({
  query,
  onQueryChange,
  results,
  isSearching,
  showResults,
  onShowResultsChange,
  onSelect,
  error,
  placeholder = 'Mahalle, cadde, sokak veya posta kodu yazın…',
  noResultsText = 'Sonuç bulunamadı',
  embedded = false,
}: AddressSearchInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number } | null>(null);

  const updateDropdownPosition = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownStyle({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onShowResultsChange(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onShowResultsChange]);

  useEffect(() => {
    if (!showResults || query.length < 3) {
      setDropdownStyle(null);
      return;
    }

    updateDropdownPosition();

    const handleReposition = () => updateDropdownPosition();
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [showResults, query, results.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') onShowResultsChange(false);
    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      onSelect(results[0].place_id);
    }
  };

  const showDropdown = showResults && query.length >= 3;

  const dropdown =
    showDropdown && dropdownStyle
      ? createPortal(
          <div
            style={{
              position: 'fixed',
              top: dropdownStyle.top,
              left: dropdownStyle.left,
              width: dropdownStyle.width,
              zIndex: 9999,
            }}
            className="overflow-hidden rounded-xl border border-[#D9C5B0]/60 bg-white shadow-xl"
          >
            {results.length > 0 ? (
              <ul className="max-h-64 overflow-y-auto py-1">
                {results.map((result) => (
                  <li key={result.place_id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => onSelect(result.place_id)}
                      className="w-full px-4 py-3 text-left transition-colors hover:bg-[#F8F1E9] focus:bg-[#F8F1E9] focus:outline-none"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8F1E9]">
                          <MapPin className="h-3.5 w-3.5 text-[#A17E65]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#5C4638]">
                            {result.structured_formatting.main_text}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-[#8B6B57]">
                            {result.structured_formatting.secondary_text || result.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              !isSearching && (
                <p className="px-4 py-6 text-center text-sm text-[#8B6B57]">{noResultsText}</p>
              )
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          id="address-search"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => {
            updateDropdownPosition();
            if (query.length >= 3) onShowResultsChange(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className={`w-full py-3 pl-11 pr-11 text-sm text-[#5C4638] placeholder:text-[#8B6B57]/50 transition-all focus:outline-none focus:ring-0 ${
            embedded
              ? 'border-0 bg-transparent focus:border-0'
              : `rounded-xl border bg-[#FDFAF6] focus:border-[#5C4638] focus:outline-none focus:ring-2 focus:ring-[#5C4638]/10 ${
                  error ? 'border-red-400' : 'border-[#D9C5B0]/75'
                }`
          }`}
        />
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#A17E65]" />
        {isSearching ? (
          <Loader2 className="absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 animate-spin text-[#5C4638]" />
        ) : null}
      </div>

      {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
      {dropdown}
    </div>
  );
}
