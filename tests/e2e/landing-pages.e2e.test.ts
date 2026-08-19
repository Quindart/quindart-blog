import { db } from '@/lib/prisma';

describe('Landing Pages E2E Flow', () => {
  beforeEach(async () => {
    await db.landingPage.deleteMany();
  });

  it('complete flow: create → check Lighthouse → publish → view', async () => {
    // 1. Create landing page
    const createRes = await fetch('http://localhost:3000/api/landing-pages/create', {
      method: 'POST',
      body: JSON.stringify({
        slug: 'e2e-test',
        html: '<h1>E2E Test Page</h1>',
        images: [],
        metaTitle: 'E2E Test',
        metaDescription: 'Testing the complete flow',
        keywords: ['test', 'e2e'],
        canonicalUrl: 'https://quindart.com/e2e',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    expect(createRes.status).toBe(201);
    const created = await createRes.json();
    expect(created.id).toBeDefined();
    expect(created.status).toBe('draft');
    expect(created.lighthouseScore).toBeNull();

    // 2. Check Lighthouse
    const lighthouseRes = await fetch('http://localhost:3000/api/landing-pages/check-lighthouse', {
      method: 'POST',
      body: JSON.stringify({ id: created.id }),
      headers: { 'Content-Type': 'application/json' },
    });

    expect(lighthouseRes.status).toBe(200);
    const audited = await lighthouseRes.json();
    expect(audited.lighthouseScore).toBeGreaterThanOrEqual(0);
    expect(audited.lighthouseScore).toBeLessThanOrEqual(100);
    expect(audited.lighthouseReport).toBeDefined();

    // 3. Publish (if score >= 90)
    if (audited.lighthouseScore >= 90) {
      const publishRes = await fetch('http://localhost:3000/api/landing-pages/publish', {
        method: 'POST',
        body: JSON.stringify({ id: created.id }),
        headers: { 'Content-Type': 'application/json' },
      });

      expect(publishRes.status).toBe(200);
      const published = await publishRes.json();
      expect(published.status).toBe('published');
      expect(published.subdomain).toContain('e2e-test');
    }

    // 4. View public page
    const publicRes = await fetch('http://localhost:3000/api/landing-pages/e2e-test');
    expect(publicRes.status).toBe(200);
    const html = await publicRes.text();
    expect(html).toContain('<title>E2E Test</title>');
    expect(html).toContain('E2E Test Page');
  });
});
