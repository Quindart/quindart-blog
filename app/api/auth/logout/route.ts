import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('token', '', {
    path: '/',
    httpOnly: true,
    maxAge: 0,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res;
}

export async function GET() {
  // Support GET for quick browser redirects
  const res = NextResponse.redirect('/admin/dashboard/login');
  res.cookies.set('token', '', { path: '/', maxAge: 0 });
  return res;
}

