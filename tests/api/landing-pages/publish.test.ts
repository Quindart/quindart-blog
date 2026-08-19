import { POST } from '@/app/api/landing-pages/publish/route';
import { db } from '@/lib/prisma';

jest.mock('@/lib/auth', () => ({
  requireAuth: jest.fn(() => ({ userId: 1 })),
}));

describe('POST /api/landing-pages/publish', () => {
  let landingPageId: number;

  beforeEach(async () => {
    await db.landingPage.deleteMany({});
    const page = await db.landingPage.create({
      data: {
        slug: 'publish-test',
        html: '<h1>Test</h1>',
        images: [],
        metaTitle: 'Test',
        metaDescription: 'Test',
        keywords: [],
        status: 'draft',
        lighthouseScore: 95, // good score
      },
    });
    landingPageId = page.id;
  });

  it('publishes page if Lighthouse score >= 90', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/publish', {
      method: 'POST',
      body: JSON.stringify({ id: landingPageId }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.status).toBe('published');
    expect(json.subdomain).toContain('publish-test.quindart.com');
  });

  it('returns 400 if Lighthouse score not checked', async () => {
    const nocheckPage = await db.landingPage.create({
      data: {
        slug: 'no-check',
        html: '<h1>Test</h1>',
        images: [],
        metaTitle: 'Test',
        metaDescription: 'Test',
        keywords: [],
        status: 'draft',
        lighthouseScore: null, // not checked
      },
    });

    const req = new Request('http://localhost:3000/api/landing-pages/publish', {
      method: 'POST',
      body: JSON.stringify({ id: nocheckPage.id }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('returns 400 if Lighthouse score < 90', async () => {
    const badPage = await db.landingPage.create({
      data: {
        slug: 'bad-score',
        html: '<h1>Test</h1>',
        images: [],
        metaTitle: 'Test',
        metaDescription: 'Test',
        keywords: [],
        status: 'draft',
        lighthouseScore: 75, // below 90
      },
    });

    const req = new Request('http://localhost:3000/api/landing-pages/publish', {
      method: 'POST',
      body: JSON.stringify({ id: badPage.id }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('returns 404 if landing page not found', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/publish', {
      method: 'POST',
      body: JSON.stringify({ id: 99999 }),
    });

    const response = await POST(req);
    expect(response.status).toBe(404);
  });
});
