import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchPlaceAutocomplete,
  fetchPlaceDetails,
  parseGooglePlaceResult,
  type GooglePlacePrediction,
  type ParsedAddressData,
} from '@/core/util/places.api';

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 3;

export function useAddressAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GooglePlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const searchOnChangeRef = useRef(false);

  const searchAddresses = useCallback(async (input: string) => {
    if (!input || input.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setShowResults(false);
      setSearchError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsSearching(true);
    setSearchError(null);

    try {
      const predictions = await fetchPlaceAutocomplete(input, { signal: controller.signal });
      setResults(predictions);
      setShowResults(true);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setResults([]);
        setShowResults(true);
        setSearchError(
          (error as Error).message || 'Adres arama şu an kullanılamıyor. Manuel giriş yapabilirsiniz.',
        );
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  const setQueryValue = useCallback((value: string, options?: { search?: boolean }) => {
    const shouldSearch = options?.search ?? false;
    searchOnChangeRef.current = shouldSearch;

    setQuery((prev) => {
      if (prev === value) {
        if (!shouldSearch) searchOnChangeRef.current = false;
        return prev;
      }
      return value;
    });

    if (!shouldSearch) {
      abortRef.current?.abort();
      setResults([]);
      setShowResults(false);
      setSearchError(null);
    }
  }, []);

  useEffect(() => {
    if (!searchOnChangeRef.current) return;

    const timer = setTimeout(() => {
      void searchAddresses(query);
      searchOnChangeRef.current = false;
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, searchAddresses]);

  const selectPlace = useCallback(
    async (prediction: GooglePlacePrediction): Promise<ParsedAddressData | null> => {
      setIsSelecting(true);
      setShowResults(false);
      setSearchError(null);

      try {
        const result = await fetchPlaceDetails(prediction.place_id);
        const parsed = parseGooglePlaceResult(result);
        setQueryValue(parsed.formattedAddress, { search: false });
        return parsed;
      } catch (error) {
        setSearchError((error as Error).message || 'Adres detayı alınamadı');
        return null;
      } finally {
        setIsSelecting(false);
      }
    },
    [setQueryValue],
  );

  const resetSearch = useCallback(() => {
    setQueryValue('', { search: false });
  }, [setQueryValue]);

  const setQueryProgrammatic = useCallback(
    (value: string) => setQueryValue(value, { search: false }),
    [setQueryValue],
  );

  const onUserQueryChange = useCallback(
    (value: string) => setQueryValue(value, { search: true }),
    [setQueryValue],
  );

  return {
    query,
    setQuery: setQueryProgrammatic,
    onUserQueryChange,
    results,
    isSearching: isSearching || isSelecting,
    showResults,
    setShowResults,
    selectPlace,
    resetSearch,
    searchError,
  };
}
