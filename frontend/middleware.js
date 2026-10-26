import { NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['uz', 'ru', 'en'];
const DEFAULT_LOCALE = 'uz';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Bypass static files, API routes, admin panel, uploads, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/teachers') ||
    pathname.includes('.') // Static files like .ico, .mp4, .png, etc.
  ) {
    return NextResponse.next();
  }

  // 2. Check if pathname already starts with one of the supported locales
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 3. Check if URL ends with /{locale} (e.g. /filiallar/uz -> /uz/filiallar)
  const endLocaleMatch = pathname.match(new RegExp(`^(.+)/(${SUPPORTED_LOCALES.join('|')})/?$`));
  if (endLocaleMatch) {
    const cleanPath = endLocaleMatch[1] || '';
    const endLocale = endLocaleMatch[2];
    const target = `/${endLocale}${cleanPath}${request.nextUrl.search}`;
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 3. Resolve preferred locale from cookie (or fallback to default 'uz')
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const targetLocale =
    cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)
      ? cookieLocale
      : DEFAULT_LOCALE;

  // 4. Redirect to /<locale><pathname> (e.g., / -> /uz, /kurslar -> /uz/kurslar)
  const redirectUrl = new URL(
    `/${targetLocale}${pathname === '/' ? '' : pathname}${request.nextUrl.search}`,
    request.url
  );

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!api|_next/static|_next/image|admin|teachers|uploads|favicon.ico|.*\\..*).*)',
  ],
};
