import { NextRequest, NextResponse } from 'next/server';

const RESERVED_SUBDOMAINS = [
  'www',
  'api',
  'admin',
  'mail',
  'ftp',
  'smtp',
  'imap',
  'localhost',
];

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Extract subdomain
  const parts = hostname.split('.');
  let subdomain: string | null = null;

  if (hostname.includes('quindart.com') && parts.length > 2) {
    // Extract subdomain from "test.quindart.com"
    subdomain = parts[0];
  } else if (
    hostname.includes('quindart.local') &&
    parts.length > 2
  ) {
    // Local testing: "test.quindart.local:3000"
    subdomain = parts[0];
  }

  // Check if subdomain is valid and not reserved
  if (
    subdomain &&
    !RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase()) &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/admin')
  ) {
    // Rewrite to landing page API route
    const url = request.nextUrl.clone();
    url.pathname = `/api/landing-pages/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  // Otherwise, continue with normal routing
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
