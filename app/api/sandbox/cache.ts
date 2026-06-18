import { NextResponse } from "next/server";

export const revalidate = 60;

const CACHE_HEADERS: Record<string, string> = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
};

export function jsonWithCache(body: unknown) {
  const response = NextResponse.json(body, { status: 200 });

  Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
