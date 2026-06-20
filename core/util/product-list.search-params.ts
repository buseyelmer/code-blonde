import { parseAsArrayOf, parseAsInteger, parseAsJson, parseAsString } from 'nuqs';

export type ProductListOrder = {
  column: string;
  direction?: string;
};

export const productListSearchParams = {
  category: parseAsString,
  amount: parseAsInteger.withDefault(10),
  page: parseAsInteger.withDefault(1),
  tags: parseAsArrayOf(parseAsString),
  search: parseAsString,
  order: parseAsJson((value: unknown): ProductListOrder | null => {
    if (typeof value !== 'object' || value === null) return null;
    const v = value as Record<string, unknown>;
    if (typeof v.column !== 'string') return null;
    return {
      column: v.column,
      direction: typeof v.direction === 'string' ? v.direction : undefined,
    };
  }),
  orderDirection: parseAsString,
  attributeOptionId: parseAsString,
  viewMode: parseAsString.withDefault('grid'),
};
