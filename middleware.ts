import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'pt'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get('accept-language');
  const browserLocale = acceptLanguage?.split(',')[0].toLowerCase();
  const localeToRedirect = browserLocale?.startsWith('pt') ? 'pt' : defaultLocale;
  
  const url = request.nextUrl.clone();
  url.pathname = `/${localeToRedirect}${pathname}`;
  
  return NextResponse.redirect(url);
}

export const config = { 
  matcher: [    
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};