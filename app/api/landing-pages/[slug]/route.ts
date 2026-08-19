import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Query database for landing page
    const landingPage = await db.landingPage.findUnique({
      where: { slug },
    });

    // Return 404 if not found or not published
    if (!landingPage || landingPage.status !== 'published') {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    // Sanitize HTML content
    const { sanitizeHtml } = await import('@/lib/landing-pages/sanitize');
    const sanitizedContent = await sanitizeHtml(landingPage.html);

    // Build keywords string
    const keywordsStr = (landingPage.keywords || []).join(', ');

    // Build HTML response with SEO meta tags
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(landingPage.metaTitle)}</title>
    <meta name="description" content="${escapeHtml(landingPage.metaDescription)}">
    <meta name="keywords" content="${escapeHtml(keywordsStr)}">
    ${landingPage.canonicalUrl ? `<link rel="canonical" href="${escapeHtml(landingPage.canonicalUrl)}">` : ''}
    <meta property="og:title" content="${escapeHtml(landingPage.metaTitle)}">
    <meta property="og:description" content="${escapeHtml(landingPage.metaDescription)}">
    <meta property="og:type" content="website">
  </head>
  <body>
    ${sanitizedContent}
  </body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching landing page:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
