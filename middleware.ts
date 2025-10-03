import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Debug logs
  console.log(`[Middleware] Processing: ${request.url}`);
  console.log(`[Middleware] Pathname: ${url.pathname}`);
  
  // 1. Redirect HTTP to HTTPS
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }
  
  // 2. Redirect www to non-www
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.replace('www.', '');
    return NextResponse.redirect(url, 301);
  }
  
  // 3. Handle trailing slash for /pt
  if (url.pathname === '/pt') {
    url.pathname = '/pt/';
    return NextResponse.redirect(url, 301);
  }
  
  // 4. Block favicon from being processed as a page
  if (url.pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const locales = ['en', 'pt'];
  const defaultLocale = 'en';
  const { pathname } = request.nextUrl;

  // If it's the root page, let page.tsx handle the redirection
  if (pathname === '/') {
    return NextResponse.next();
  }

  
  // If the URL is /en or /en/, permanently redirect to the root.
  // This establishes the root (/) as the canonical URL for English.
  if (pathname === '/en' || pathname === '/en/') {
    const rootUrl = request.nextUrl.clone();
    rootUrl.pathname = '/';
    return NextResponse.redirect(rootUrl, 301);
  }

  // Routes that should not have locale prefixes
  const excludedRoutes = ['/login', '/admin'];
  const isExcludedRoute = excludedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isExcludedRoute) {
    return NextResponse.next();
  }

  // Check if the path already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next(); // If it already has, do nothing
  }

  // Special handling for pages that should redirect to localized pages, not anchors
  const staticPages = ['/about', '/portfolio', '/contact'];
  const isStaticPage = staticPages.some(page => 
    pathname === page || pathname === `${page}/`
  );

  if (isStaticPage) {
    console.log(`[Middleware] Static page detected: ${pathname}`);
    // Extract the page name and redirect to localized page
    const pageName = pathname.replace(/\/$/, '').substring(1); // Remove leading slash and trailing slash
    const browserLocale = request.headers.get('Accept-Language')?.split(',')[0].toLowerCase();
    const localeToRedirect = browserLocale?.startsWith('pt') ? 'pt' : defaultLocale;
    
    console.log(`[Middleware] Redirecting to: /${localeToRedirect}/${pageName}/`);
    
    // Redirect to proper localized page instead of anchor
    const redirectUrl = new URL(`/${localeToRedirect}/${pageName}/`, request.url);
    return NextResponse.redirect(redirectUrl, 301); // 301 permanent redirect is better for SEO
  }

  // Special handling for blog posts without locale prefix
  const blogPostMatch = pathname.match(/^\/blog\/([^\/]+)\/?$/);
  if (blogPostMatch) {
    const slug = blogPostMatch[1];
    const browserLocale = request.headers.get('Accept-Language')?.split(',')[0].toLowerCase();
    const localeToRedirect = browserLocale?.startsWith('pt') ? 'pt' : defaultLocale;
    
    const redirectUrl = new URL(`/${localeToRedirect}/blog/${slug}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Special handling for blog list page without locale prefix
  if (pathname === '/blog' || pathname === '/blog/') {
    const browserLocale = request.headers.get('Accept-Language')?.split(',')[0].toLowerCase();
    const localeToRedirect = browserLocale?.startsWith('pt') ? 'pt' : defaultLocale;
    
    const redirectUrl = new URL(`/${localeToRedirect}/blog`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If it doesn't have a locale, redirect with locale
  const browserLocale = request.headers.get('Accept-Language')?.split(',')[0].toLowerCase();
  const localeToRedirect = browserLocale?.startsWith('pt') ? 'pt' : defaultLocale;
  
  const redirectUrl = new URL(`/${localeToRedirect}${pathname}`, request.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    // Match all pages except static assets
    '/((?!_next/|images/|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)',
    // Always run for these specific routes that need redirection
    '/(about|contact|portfolio|blog)(.*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};