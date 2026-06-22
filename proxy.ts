import { NextRequest, NextResponse } from 'next/server';
import { raxonServer } from '@raxonltd/raxon-core/server';

const handleRaxon = raxonServer({
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
});

function withNoCacheHeaders(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  return response;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/api/bootstrap' || pathname.startsWith('/api/places/')) {
    return handleRaxon(request as never);
  }

  const productSlugMatch = pathname.match(/^\/([^/]+)-(\d+)$/);
  if (productSlugMatch) {
    const productId = productSlugMatch[2];
    const url = request.nextUrl.clone();
    url.pathname = `/urunler/${productId}`;
    return withNoCacheHeaders(NextResponse.rewrite(url));
  }

  return withNoCacheHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    '/api/bootstrap',
    '/api/places/:path',
    '/((?!api|_next|static|favicon.ico|robots.txt|sitemap.xml).+)',
  ],
};