import { POST } from '@/app/api/landing-pages/create/route';
import { db } from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/auth', () => ({
  requireAuth: jest.fn(() => ({ userId: 1 })),
}));

describe('POST /api/landing-pages/create', () => {
  beforeEach(async () => {
    await db.landingPage.deleteMany({});
  });

  it('creates landing page with valid input', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/create', {
      method: 'POST',
      body: JSON.stringify({
        slug: 'test-page',
        html: '<h1>Test</h1>',
        images: [],
        metaTitle: 'Test Page',
        metaDescription: 'A test landing page',
        keywords: ['test', 'page'],
        canonicalUrl: 'https://quindart.com/test',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(req as NextRequest);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.id).toBeDefined();
    expect(json.slug).toBe('test-page');
    expect(json.status).toBe('draft');
    expect(json.lighthouseScore).toBeNull();
  });

  it('returns 400 if slug is invalid', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/create', {
      method: 'POST',
      body: JSON.stringify({
        slug: 'Test-Page',
        html: '<h1>Test</h1>',
        images: [],
        metaTitle: 'Test Page',
        metaDescription: 'A test landing page',
        keywords: [],
        canonicalUrl: null,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(req as NextRequest);
    expect(response.status).toBe(400);
  });

  it('returns 400 if HTML is empty', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/create', {
      method: 'POST',
      body: JSON.stringify({
        slug: 'test-page',
        html: '',
        images: [],
        metaTitle: 'Test Page',
        metaDescription: 'A test landing page',
        keywords: [],
        canonicalUrl: null,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(req as NextRequest);
    expect(response.status).toBe(400);
  });

  it('returns 409 if slug already exists', async () => {
    await db.landingPage.create({
      data: {
        slug: 'duplicate',
        html: '<h1>Test</h1>',
        images: [],
        metaTitle: 'Test',
        metaDescription: 'Test',
        keywords: [],
        status: 'draft',
      },
    });

    const req = new Request('http://localhost:3000/api/landing-pages/create', {
      method: 'POST',
      body: JSON.stringify({
        slug: 'duplicate',
        html: '<h1>Test 2</h1>',
        images: [],
        metaTitle: 'Test 2',
        metaDescription: 'Test 2',
        keywords: [],
        canonicalUrl: null,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(req as NextRequest);
    expect(response.status).toBe(409);
  });
});
