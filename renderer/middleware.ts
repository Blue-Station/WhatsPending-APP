import languages from './public/langs/index.json';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
 
export function middleware(request: NextRequest): NextResponse<unknown> {
  if (request.nextUrl.pathname.includes('/_next') || request.nextUrl.pathname.includes('images')) return;

  const lang = languages.availableLangs.includes(request.headers.get('accept-language')) ? request.headers.get('accept-language') : languages.defaultLang;
  const cookies = request.cookies;
  
  if (!request.nextUrl.pathname.split('/')[1]) {
    return NextResponse.redirect(new URL(`/${lang}/${request.nextUrl.pathname}`, request.url));
  }
  
  if (!languages.availableLangs.includes(request.nextUrl.pathname.split('/')[1])) {
    return NextResponse.redirect(new URL(`/${lang}/${request.nextUrl.pathname.split('/').slice(2).join('/')}`, request.url));
  }

  if ((cookies.get('accessToken') || cookies.get('refreshToken')) && cookies.get('serverIP') && request.nextUrl.pathname.includes('/login')) {
    return NextResponse.redirect(new URL(`/${lang}/home`, request.url));
  }

  if (((!cookies.get('accessToken') && !cookies.get('refreshToken')) || !cookies.get('serverIP')) && !request.nextUrl.pathname.includes('/login')) {
    return NextResponse.redirect(new URL(`/${lang}/login`, request.url));
  }
}
