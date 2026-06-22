export type GooglePlacePrediction = {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};

export type GooglePlaceDetails = {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  formatted_address: string;
};

export type ParsedAddressData = {
  streetNumber: string;
  streetName: string;
  neighborhood: string;
  district: string;
  city: string;
  province: string;
  country: string;
  countryCode: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
};

interface PlacesOptions {
  components?: string;
  language?: string;
  signal?: AbortSignal;
}

export async function fetchPlaceAutocomplete(
  input: string,
  { components = 'country:tr', language = 'tr', signal }: PlacesOptions = {},
): Promise<GooglePlacePrediction[]> {
  const url = new URL('/api/places/autocomplete', window.location.origin);
  url.searchParams.set('input', input);
  url.searchParams.set('components', components);
  url.searchParams.set('language', language);

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`Adres arama başarısız (${response.status})`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(data.error_message || 'Adres arama servisi yanıt vermedi');
  }

  return data.predictions || [];
}

export async function fetchPlaceDetails(
  placeId: string,
  { language = 'tr', signal }: { language?: string; signal?: AbortSignal } = {},
): Promise<GooglePlaceDetails> {
  const url = new URL('/api/places/details', window.location.origin);
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'geometry,address_components,formatted_address');
  url.searchParams.set('language', language);

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`Adres detayı alınamadı (${response.status})`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  if (data.status !== 'OK') {
    throw new Error(data.error_message || 'Adres detayı alınamadı');
  }

  return data.result;
}

function getAddressComponent(
  components: GooglePlaceDetails['address_components'],
  types: string[],
  useShort = false,
) {
  const component = components.find((comp) => types.some((type) => comp.types.includes(type)));
  return useShort ? component?.short_name || '' : component?.long_name || '';
}

export function parseGooglePlaceResult(placeDetails: GooglePlaceDetails): ParsedAddressData {
  const components = placeDetails.address_components;

  const district =
    getAddressComponent(components, ['administrative_area_level_2']) ||
    getAddressComponent(components, ['sublocality_level_1', 'sublocality']);

  const city =
    getAddressComponent(components, ['administrative_area_level_1']) ||
    getAddressComponent(components, ['locality', 'postal_town']);

  return {
    streetNumber: getAddressComponent(components, ['street_number']),
    streetName: getAddressComponent(components, ['route']),
    neighborhood: getAddressComponent(components, ['neighborhood', 'sublocality_level_1', 'sublocality']),
    district,
    city,
    province: getAddressComponent(components, ['administrative_area_level_1']),
    country: getAddressComponent(components, ['country']),
    countryCode: getAddressComponent(components, ['country'], true),
    postalCode: getAddressComponent(components, ['postal_code']),
    latitude: placeDetails.geometry.location.lat,
    longitude: placeDetails.geometry.location.lng,
    formattedAddress: placeDetails.formatted_address,
  };
}

export function parsedAddressToFormFields(parsed: ParsedAddressData) {
  const streetParts = [parsed.neighborhood, parsed.streetName].filter(Boolean);
  const street = streetParts.join(', ');

  return {
    street: street || parsed.formattedAddress,
    buildingNumber: parsed.streetNumber,
    apartmentNumber: '',
    postalCode: parsed.postalCode,
    administrativeAreaLevel1: parsed.province || parsed.city,
    administrativeAreaLevel2: parsed.district,
    administrativeAreaLevel3: parsed.neighborhood,
    country: parsed.country || 'Türkiye',
    countryCode: parsed.countryCode || 'TR',
  };
}
