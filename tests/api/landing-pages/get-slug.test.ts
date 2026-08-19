import { GET } from '@/app/api/landing-pages/[slug]/route';
import { db } from '@/lib/prisma';
import { NextRequest } from 'next/server';

describe('GET /api/landing-pages/[slug]', () => {
  beforeEach(async () => {
    await db.landingPage.deleteMany({});
  });

  afterEach(async () => {
    await db.landingPage.deleteMany({});
  });

  it('returns published page with SEO meta tags', async () => {
    const slug = 'public-page-' + Date.now();
    await db.landingPage.create({
      data: {
        slug: slug,
        html: '<h1>Hello World</h1>',
        images: [],
        metaTitle: 'My Landing Page',
        metaDescription: 'This is a test page',
        keywords: ['test', 'page'],
        canonicalUrl: 'https://quindart.com/public-page',
        status: 'published',
      },
    });

    const req = new Request(`http://localhost:3000/api/landing-pages/${slug}`, {
      method: 'GET',
    });

    const response = await GET(req as NextRequest, { params: { slug: slug } });
    expect(response.status).toBe(200);

    const html = await response.text();
    expect(html).toContain('<title>My Landing Page</title>');
    expect(html).toContain('meta');
    expect(html).toContain('og:description');
    expect(html).toContain('Hello World');
  });

  it('returns 404 if page not found', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/nonexistent', {
      method: 'GET',
    });

    const response = await GET(req as NextRequest, { params: { slug: 'nonexistent' } });
    expect(response.status).toBe(404);
  });

  it('returns 404 if page is draft', async () => {
    const slug = 'draft-page-' + Date.now();
    await db.landingPage.create({
      data: {
        slug: slug,
        html: '<h1>Draft</h1>',
        images: [],
        metaTitle: 'Draft',
        metaDescription: 'Draft',
        keywords: [],
        status: 'draft',
      },
    });

    const req = new Request(`http://localhost:3000/api/landing-pages/${slug}`, {
      method: 'GET',
    });

    const response = await GET(req as NextRequest, { params: { slug: slug } });
    expect(response.status).toBe(404);
  });

  it('sanitizes script tags', async () => {
    const slug = 'xss-test-' + Date.now();
    await db.landingPage.create({
      data: {
        slug: slug,
        html: '<h1>Test</h1><script>alert("xss")</script>',
        images: [],
        metaTitle: 'XSS Test',
        metaDescription: 'XSS Test',
        keywords: [],
        status: 'published',
      },
    });

    const req = new Request(`http://localhost:3000/api/landing-pages/${slug}`, {
      method: 'GET',
    });

    const response = await GET(req as NextRequest, { params: { slug: slug } });
    const html = await response.text();
    expect(html).not.toContain('<script>');
    expect(html).toContain('<h1>Test</h1>');
  });
});
