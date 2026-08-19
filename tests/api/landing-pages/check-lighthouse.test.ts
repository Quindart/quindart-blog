import { POST } from '@/app/api/landing-pages/check-lighthouse/route';
import { db } from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/auth', () => ({
  requireAuth: jest.fn(() => ({ userId: 1 })),
}));

jest.mock('@/lib/landing-pages/lighthouse', () => ({
  runLighthouseAudit: jest.fn(async () => ({
    score: 85,
    report: {
      categories: {
        performance: { score: 0.8 },
        accessibility: { score: 0.9 },
        'best-practices': { score: 0.85 },
        seo: { score: 0.9 },
      },
      requestedUrl: 'http://localhost:3000',
      finalUrl: 'http://localhost:3000',
    },
  })),
}));

describe('POST /api/landing-pages/check-lighthouse', () => {
  let landingPageId: number;

  beforeEach(async () => {
    await db.landingPage.deleteMany({});
    const page = await db.landingPage.create({
      data: {
        slug: 'lighthouse-test',
        html: '<h1>Test Page</h1><p>Content</p>',
        images: [],
        metaTitle: 'Test',
        metaDescription: 'Test',
        keywords: [],
        status: 'draft',
      },
    });
    landingPageId = page.id;
  });

  it('runs Lighthouse audit and stores score', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/check-lighthouse', {
      method: 'POST',
      body: JSON.stringify({ id: landingPageId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(req as NextRequest);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.id).toBe(landingPageId);
    expect(json.lighthouseScore).toBeGreaterThanOrEqual(0);
    expect(json.lighthouseScore).toBeLessThanOrEqual(100);
    expect(json.lighthouseReport).toBeDefined();
  });

  it('returns 404 if landing page not found', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/check-lighthouse', {
      method: 'POST',
      body: JSON.stringify({ id: 99999 }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(req as NextRequest);
    expect(response.status).toBe(404);
  });

  it('stores report in DB', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/check-lighthouse', {
      method: 'POST',
      body: JSON.stringify({ id: landingPageId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await POST(req as NextRequest);

    const updated = await db.landingPage.findUnique({
      where: { id: landingPageId },
    });

    expect(updated?.lighthouseScore).toBeGreaterThanOrEqual(0);
    expect(updated?.lighthouseReport).toBeDefined();
  });
});
