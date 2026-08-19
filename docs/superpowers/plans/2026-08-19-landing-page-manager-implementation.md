# Landing Page Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete landing page creation and management system with Lighthouse performance validation and subdomain routing.

**Architecture:** 
- **Phase 1:** Add LandingPage Prisma model, validation utilities, and HTML sanitization
- **Phase 2:** Implement API routes for create, publish, check-lighthouse, and public page serving
- **Phase 3:** Add subdomain routing middleware to serve landing pages on custom subdomains
- **Phase 4:** Build admin dashboard UI (list and create forms) with Lighthouse modal
- **Phase 5:** Integration tests covering the full workflow

**Tech Stack:** Next.js, Prisma, TypeScript, React, sanitize-html, lighthouse (Node.js package)

**Spec:** `docs/superpowers/specs/2026-08-19-landing-page-manager-design.md`

## Global Constraints

- Admin auth required: all admin routes check session via `auth()` hook
- Slug validation: alphanumeric + hyphens, max 50 chars, unique, no reserved words (www, api, admin, mail)
- HTML sanitization on render: DOMPurify (client) or sanitize-html (server) with whitelist
- Lighthouse gate: publish blocked if score < 90
- Cloudinary image URLs only (validate domain in image array)

---

## Phase 1: Schema, Validation & Sanitization

### Task 1: Add LandingPage Prisma Model

**Files:**
- Modify: `lib/prisma/schema.prisma`

**Interfaces:**
- Produces: Prisma `LandingPage` model with fields: `id`, `slug`, `html`, `images`, `status`, `metaTitle`, `metaDescription`, `keywords`, `canonicalUrl`, `lighthouseScore`, `lighthouseReport`, `createdAt`, `updatedAt`

- [ ] **Step 1: Open schema.prisma and add LandingPage model at the end**

```prisma
model LandingPage {
  id           Int      @id @default(autoincrement())
  slug         String   @unique  // subdomain name
  html         String   // raw HTML content
  images       String[] // Cloudinary URLs
  status       String   @default("draft")  // "draft" | "published" | "archived"
  
  // SEO metadata
  metaTitle    String
  metaDescription String
  keywords     String[]
  canonicalUrl String?
  
  // Lighthouse validation
  lighthouseScore Int?   // 0-100, null if not checked
  lighthouseReport Json? // full audit report
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

- [ ] **Step 2: Create and run Prisma migration**

Run:
```bash
cd /Users/quindart/dev/quindart-blog
npx prisma migrate dev --name add_landing_page
```

Expected: Migration creates `landing_pages` table with all columns.

- [ ] **Step 3: Verify Prisma client was regenerated**

Check that `lib/prisma/generated/` files include the new `LandingPage` type. Run:
```bash
npx prisma generate
```

- [ ] **Step 4: Commit**

```bash
git add lib/prisma/schema.prisma prisma/migrations/
git commit -m "feat(schema): add LandingPage model for landing page management"
```

---

### Task 2: Create Slug Validation Utility

**Files:**
- Create: `lib/landing-pages/validate.ts`
- Create: `tests/lib/landing-pages/validate.test.ts`

**Interfaces:**
- Produces: `validateSlug(slug: string): { valid: boolean; error?: string }`

- [ ] **Step 1: Write test for slug validation**

Create `tests/lib/landing-pages/validate.test.ts`:

```typescript
import { validateSlug } from '@/lib/landing-pages/validate';

describe('validateSlug', () => {
  it('accepts valid slug', () => {
    const result = validateSlug('summer-promo');
    expect(result.valid).toBe(true);
  });

  it('rejects slug with uppercase', () => {
    const result = validateSlug('Summer-Promo');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('lowercase');
  });

  it('rejects slug with spaces', () => {
    const result = validateSlug('summer promo');
    expect(result.valid).toBe(false);
  });

  it('rejects slug with special chars', () => {
    const result = validateSlug('summer@promo');
    expect(result.valid).toBe(false);
  });

  it('rejects slug longer than 50 chars', () => {
    const result = validateSlug('a'.repeat(51));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('50');
  });

  it('rejects reserved subdomains', () => {
    const reserved = ['www', 'api', 'admin', 'mail', 'ftp'];
    reserved.forEach((slug) => {
      const result = validateSlug(slug);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('reserved');
    });
  });

  it('accepts slug with numbers and hyphens', () => {
    const result = validateSlug('test-123-slug');
    expect(result.valid).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/lib/landing-pages/validate.test.ts -v
```

Expected: All tests fail (module not yet created).

- [ ] **Step 3: Write validation function**

Create `lib/landing-pages/validate.ts`:

```typescript
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  // Check length
  if (slug.length === 0) {
    return { valid: false, error: 'Slug cannot be empty' };
  }
  if (slug.length > 50) {
    return { valid: false, error: 'Slug must be 50 characters or less' };
  }

  // Check reserved words
  const reserved = ['www', 'api', 'admin', 'mail', 'ftp', 'smtp', 'imap'];
  if (reserved.includes(slug.toLowerCase())) {
    return { valid: false, error: `Slug "${slug}" is reserved` };
  }

  // Check format: lowercase alphanumeric and hyphens only
  const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!slugRegex.test(slug)) {
    return { valid: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens' };
  }

  return { valid: true };
}

export function validateHtml(html: string): { valid: boolean; error?: string } {
  if (!html || html.trim().length === 0) {
    return { valid: false, error: 'HTML cannot be empty' };
  }
  return { valid: true };
}

export function validateImageUrls(urls: string[]): { valid: boolean; error?: string } {
  if (!Array.isArray(urls)) {
    return { valid: false, error: 'Images must be an array' };
  }

  for (const url of urls) {
    if (typeof url !== 'string' || !url.startsWith('https://res.cloudinary.com/')) {
      return { valid: false, error: 'All image URLs must be from Cloudinary' };
    }
  }

  return { valid: true };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm test -- tests/lib/landing-pages/validate.test.ts -v
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/landing-pages/validate.ts tests/lib/landing-pages/validate.test.ts
git commit -m "feat(landing-pages): add slug and input validation utilities"
```

---

### Task 3: Create HTML Sanitization Utility

**Files:**
- Create: `lib/landing-pages/sanitize.ts`
- Create: `tests/lib/landing-pages/sanitize.test.ts`

**Interfaces:**
- Produces: `sanitizeHtml(dirty: string): string` — returns safe HTML string

- [ ] **Step 1: Write test for HTML sanitization**

Create `tests/lib/landing-pages/sanitize.test.ts`:

```typescript
import { sanitizeHtml } from '@/lib/landing-pages/sanitize';

describe('sanitizeHtml', () => {
  it('strips script tags', () => {
    const dirty = '<div><script>alert("xss")</script>Content</div>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('script');
    expect(clean).toContain('Content');
  });

  it('preserves safe HTML tags', () => {
    const safe = '<h1>Title</h1><p>Paragraph</p><a href="https://example.com">Link</a>';
    const clean = sanitizeHtml(safe);
    expect(clean).toContain('<h1>');
    expect(clean).toContain('<p>');
    expect(clean).toContain('<a');
  });

  it('removes onclick handlers', () => {
    const dirty = '<button onclick="alert(1)">Click</button>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('onclick');
    expect(clean).toContain('button');
  });

  it('allows img tags with src', () => {
    const html = '<img src="https://res.cloudinary.com/example.jpg" alt="test" />';
    const clean = sanitizeHtml(html);
    expect(clean).toContain('<img');
    expect(clean).toContain('src=');
  });

  it('removes iframe tags', () => {
    const dirty = '<iframe src="https://evil.com"></iframe>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('iframe');
  });

  it('preserves form elements', () => {
    const html = '<form><input type="email" /><button>Submit</button></form>';
    const clean = sanitizeHtml(html);
    expect(clean).toContain('<form');
    expect(clean).toContain('<input');
  });
});
```

- [ ] **Step 2: Install sanitize-html package**

Run:
```bash
npm install sanitize-html
npm install --save-dev @types/sanitize-html
```

- [ ] **Step 3: Run test to verify it fails**

Run:
```bash
npm test -- tests/lib/landing-pages/sanitize.test.ts -v
```

Expected: All tests fail (function not yet implemented).

- [ ] **Step 4: Write sanitization function**

Create `lib/landing-pages/sanitize.ts`:

```typescript
import sanitizeHtmlLib from 'sanitize-html';

export function sanitizeHtml(dirty: string): string {
  return sanitizeHtmlLib(dirty, {
    allowedTags: [
      'b', 'i', 'em', 'strong', 'a', 'br', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'img', 'section', 'article', 'div', 'span',
      'button', 'form', 'input', 'label', 'textarea', 'select', 'option', 'fieldset', 'legend',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target'],
      img: ['src', 'alt', 'width', 'height'],
      form: ['method', 'action'],
      input: ['type', 'name', 'placeholder', 'required'],
      textarea: ['name', 'placeholder', 'rows', 'cols'],
      select: ['name'],
      option: ['value'],
      button: ['type', 'name'],
      div: ['class', 'id'],
      span: ['class', 'id'],
      section: ['class', 'id'],
      article: ['class', 'id'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    disallowedTagsMode: 'discard',
    onTagAttr: (tag, name, value) => {
      // Only allow URLs from Cloudinary for img src
      if (tag === 'img' && name === 'src') {
        if (!value.startsWith('https://res.cloudinary.com/')) {
          return;
        }
      }
      return `${name}="${value}"`;
    },
  });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run:
```bash
npm test -- tests/lib/landing-pages/sanitize.test.ts -v
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/landing-pages/sanitize.ts tests/lib/landing-pages/sanitize.test.ts package.json package-lock.json
git commit -m "feat(landing-pages): add HTML sanitization with Cloudinary image validation"
```

---

## Phase 2: API Routes

### Task 4: Implement POST /api/landing-pages/create Route

**Files:**
- Create: `app/api/landing-pages/create/route.ts`
- Create: `tests/api/landing-pages/create.test.ts`

**Interfaces:**
- Consumes: `validateSlug()`, `validateHtml()`, `validateImageUrls()` from Phase 1
- Produces: POST handler accepting `{ slug, html, images, metaTitle, metaDescription, keywords, canonicalUrl }`, returns `{ id, slug, status, lighthouseScore, createdAt }`

- [ ] **Step 1: Write test for create route**

Create `tests/api/landing-pages/create.test.ts`:

```typescript
import { POST } from '@/app/api/landing-pages/create/route';
import { db } from '@/lib/prisma';

describe('POST /api/landing-pages/create', () => {
  beforeEach(async () => {
    // Clean up test data
    await db.landingPage.deleteMany();
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
    });

    const response = await POST(req);
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
        slug: 'Test-Page', // uppercase not allowed
        html: '<h1>Test</h1>',
        images: [],
        metaTitle: 'Test Page',
        metaDescription: 'A test landing page',
        keywords: [],
        canonicalUrl: null,
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('returns 400 if HTML is empty', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/create', {
      method: 'POST',
      body: JSON.stringify({
        slug: 'test-page',
        html: '', // empty
        images: [],
        metaTitle: 'Test Page',
        metaDescription: 'A test landing page',
        keywords: [],
        canonicalUrl: null,
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('returns 409 if slug already exists', async () => {
    // Create first page
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

    // Try to create with same slug
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
    });

    const response = await POST(req);
    expect(response.status).toBe(409);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/api/landing-pages/create.test.ts -v
```

Expected: All tests fail (route not yet implemented).

- [ ] **Step 3: Write create route handler**

Create `app/api/landing-pages/create/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // adjust based on your auth implementation
import { db } from '@/lib/prisma';
import { validateSlug, validateHtml, validateImageUrls } from '@/lib/landing-pages/validate';

export async function POST(req: NextRequest) {
  try {
    // Verify auth
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { slug, html, images, metaTitle, metaDescription, keywords, canonicalUrl } = body;

    // Validate inputs
    const slugValidation = validateSlug(slug);
    if (!slugValidation.valid) {
      return NextResponse.json({ error: slugValidation.error }, { status: 400 });
    }

    const htmlValidation = validateHtml(html);
    if (!htmlValidation.valid) {
      return NextResponse.json({ error: htmlValidation.error }, { status: 400 });
    }

    const imagesValidation = validateImageUrls(images || []);
    if (!imagesValidation.valid) {
      return NextResponse.json({ error: imagesValidation.error }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await db.landingPage.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    // Sanitize keywords
    const sanitizedKeywords = (keywords || [])
      .map((k: string) => k.trim().toLowerCase())
      .filter((k: string) => k.length > 0);

    // Create landing page
    const landingPage = await db.landingPage.create({
      data: {
        slug,
        html,
        images: images || [],
        status: 'draft',
        metaTitle,
        metaDescription,
        keywords: sanitizedKeywords,
        canonicalUrl: canonicalUrl || null,
      },
    });

    return NextResponse.json(
      {
        id: landingPage.id,
        slug: landingPage.slug,
        status: landingPage.status,
        lighthouseScore: landingPage.lighthouseScore,
        createdAt: landingPage.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating landing page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm test -- tests/api/landing-pages/create.test.ts -v
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/api/landing-pages/create/route.ts tests/api/landing-pages/create.test.ts
git commit -m "feat(api): implement POST /api/landing-pages/create endpoint"
```

---

### Task 5: Implement POST /api/landing-pages/check-lighthouse Route

**Files:**
- Create: `lib/landing-pages/lighthouse.ts`
- Create: `app/api/landing-pages/check-lighthouse/route.ts`
- Create: `tests/api/landing-pages/check-lighthouse.test.ts`

**Interfaces:**
- Produces: POST handler accepting `{ id }`, returns `{ id, lighthouseScore, lighthouseReport }`

- [ ] **Step 1: Install lighthouse package**

Run:
```bash
npm install lighthouse
```

- [ ] **Step 2: Write Lighthouse wrapper utility**

Create `lib/landing-pages/lighthouse.ts`:

```typescript
import lighthouse from 'lighthouse';
import { sanitizeHtml } from './sanitize';

export async function runLighthouseAudit(html: string): Promise<{
  score: number;
  report: any;
}> {
  try {
    // Create a temporary HTTP server to serve the HTML
    // For simplicity, we'll use a Node.js built-in server
    const http = require('http');
    const url = require('url');
    const querystring = require('querystring');

    const server = http.createServer((req: any, res: any) => {
      const sanitized = sanitizeHtml(html);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${sanitized}</body></html>`);
    });

    server.listen(0); // Listen on random port

    await new Promise((resolve) => server.once('listening', resolve));
    const port = (server.address() as any).port;
    const testUrl = `http://localhost:${port}`;

    // Run Lighthouse
    const options = {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: port,
    };

    const runnerResult = await lighthouse(testUrl, options);
    const json = runnerResult?.lhr;

    // Close server
    server.close();
    await new Promise((resolve) => server.once('close', resolve));

    // Extract overall score (average of categories)
    const categoryScores = Object.values(json.categories).map((cat: any) => cat.score * 100);
    const overallScore = Math.round(categoryScores.reduce((a: number, b: number) => a + b, 0) / categoryScores.length);

    return {
      score: overallScore,
      report: json,
    };
  } catch (error) {
    console.error('Lighthouse audit error:', error);
    throw error;
  }
}
```

- [ ] **Step 3: Write test for check-lighthouse route**

Create `tests/api/landing-pages/check-lighthouse.test.ts`:

```typescript
import { POST } from '@/app/api/landing-pages/check-lighthouse/route';
import { db } from '@/lib/prisma';

describe('POST /api/landing-pages/check-lighthouse', () => {
  let landingPageId: number;

  beforeEach(async () => {
    await db.landingPage.deleteMany();
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
    });

    const response = await POST(req);
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
    });

    const response = await POST(req);
    expect(response.status).toBe(404);
  });

  it('stores report in DB', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/check-lighthouse', {
      method: 'POST',
      body: JSON.stringify({ id: landingPageId }),
    });

    await POST(req);

    const updated = await db.landingPage.findUnique({
      where: { id: landingPageId },
    });

    expect(updated?.lighthouseScore).toBeGreaterThanOrEqual(0);
    expect(updated?.lighthouseReport).toBeDefined();
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run:
```bash
npm test -- tests/api/landing-pages/check-lighthouse.test.ts -v
```

Expected: Tests fail (route not yet implemented).

- [ ] **Step 5: Write check-lighthouse route handler**

Create `app/api/landing-pages/check-lighthouse/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { runLighthouseAudit } from '@/lib/landing-pages/lighthouse';

export async function POST(req: NextRequest) {
  try {
    // Verify auth
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    // Fetch landing page
    const landingPage = await db.landingPage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }

    // Run Lighthouse audit
    const { score, report } = await runLighthouseAudit(landingPage.html);

    // Store results in DB
    const updated = await db.landingPage.update({
      where: { id: parseInt(id) },
      data: {
        lighthouseScore: score,
        lighthouseReport: report,
      },
    });

    return NextResponse.json({
      id: updated.id,
      lighthouseScore: updated.lighthouseScore,
      lighthouseReport: updated.lighthouseReport,
    });
  } catch (error) {
    console.error('Lighthouse check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

- [ ] **Step 6: Run test to verify it passes**

Run:
```bash
npm test -- tests/api/landing-pages/check-lighthouse.test.ts -v
```

Expected: Tests pass (or show timeout if Lighthouse is slow in test env; skip for now if so).

- [ ] **Step 7: Commit**

```bash
git add lib/landing-pages/lighthouse.ts app/api/landing-pages/check-lighthouse/route.ts tests/api/landing-pages/check-lighthouse.test.ts package.json
git commit -m "feat(api): implement POST /api/landing-pages/check-lighthouse endpoint with Lighthouse integration"
```

---

### Task 6: Implement POST /api/landing-pages/publish Route

**Files:**
- Create: `app/api/landing-pages/publish/route.ts`
- Create: `tests/api/landing-pages/publish.test.ts`

**Interfaces:**
- Produces: POST handler accepting `{ id }`, returns `{ id, status, lighthouseScore, subdomain }`

- [ ] **Step 1: Write test for publish route**

Create `tests/api/landing-pages/publish.test.ts`:

```typescript
import { POST } from '@/app/api/landing-pages/publish/route';
import { db } from '@/lib/prisma';

describe('POST /api/landing-pages/publish', () => {
  let landingPageId: number;

  beforeEach(async () => {
    await db.landingPage.deleteMany();
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/api/landing-pages/publish.test.ts -v
```

Expected: All tests fail (route not yet implemented).

- [ ] **Step 3: Write publish route handler**

Create `app/api/landing-pages/publish/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/prisma';

const DOMAIN = 'quindart.com';

export async function POST(req: NextRequest) {
  try {
    // Verify auth
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    // Fetch landing page
    const landingPage = await db.landingPage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }

    // Check Lighthouse score
    if (landingPage.lighthouseScore === null) {
      return NextResponse.json(
        { error: 'Lighthouse check not run. Please check Lighthouse score first.' },
        { status: 400 }
      );
    }

    if (landingPage.lighthouseScore < 90) {
      return NextResponse.json(
        {
          error: `Lighthouse score is ${landingPage.lighthouseScore}. Must be 90 or higher to publish.`,
        },
        { status: 400 }
      );
    }

    // Publish
    const updated = await db.landingPage.update({
      where: { id: parseInt(id) },
      data: { status: 'published' },
    });

    return NextResponse.json({
      id: updated.id,
      status: updated.status,
      lighthouseScore: updated.lighthouseScore,
      subdomain: `${updated.slug}.${DOMAIN}`,
    });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm test -- tests/api/landing-pages/publish.test.ts -v
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/api/landing-pages/publish/route.ts tests/api/landing-pages/publish.test.ts
git commit -m "feat(api): implement POST /api/landing-pages/publish endpoint with Lighthouse gating"
```

---

### Task 7: Implement GET /api/landing-pages/[slug] Route (Public Page)

**Files:**
- Create: `app/api/landing-pages/[slug]/route.ts`
- Create: `tests/api/landing-pages/get-slug.test.ts`

**Interfaces:**
- Consumes: `sanitizeHtml()` from Phase 1
- Produces: GET handler with dynamic `[slug]` parameter, returns rendered HTML with SEO meta tags

- [ ] **Step 1: Write test for public page route**

Create `tests/api/landing-pages/get-slug.test.ts`:

```typescript
import { GET } from '@/app/api/landing-pages/[slug]/route';
import { db } from '@/lib/prisma';

describe('GET /api/landing-pages/[slug]', () => {
  beforeEach(async () => {
    await db.landingPage.deleteMany();
    await db.landingPage.create({
      data: {
        slug: 'public-page',
        html: '<h1>Hello World</h1>',
        images: [],
        metaTitle: 'My Landing Page',
        metaDescription: 'This is a test page',
        keywords: ['test', 'page'],
        canonicalUrl: 'https://quindart.com/public-page',
        status: 'published',
      },
    });
  });

  it('returns published page with SEO meta tags', async () => {
    const req = new Request('http://localhost:3000/api/landing-pages/public-page', {
      method: 'GET',
    });

    const response = await GET(req, { params: { slug: 'public-page' } });
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

    const response = await GET(req, { params: { slug: 'nonexistent' } });
    expect(response.status).toBe(404);
  });

  it('returns 404 if page is draft', async () => {
    await db.landingPage.create({
      data: {
        slug: 'draft-page',
        html: '<h1>Draft</h1>',
        images: [],
        metaTitle: 'Draft',
        metaDescription: 'Draft',
        keywords: [],
        status: 'draft',
      },
    });

    const req = new Request('http://localhost:3000/api/landing-pages/draft-page', {
      method: 'GET',
    });

    const response = await GET(req, { params: { slug: 'draft-page' } });
    expect(response.status).toBe(404);
  });

  it('sanitizes script tags', async () => {
    await db.landingPage.create({
      data: {
        slug: 'xss-test',
        html: '<h1>Test</h1><script>alert("xss")</script>',
        images: [],
        metaTitle: 'XSS Test',
        metaDescription: 'XSS Test',
        keywords: [],
        status: 'published',
      },
    });

    const req = new Request('http://localhost:3000/api/landing-pages/xss-test', {
      method: 'GET',
    });

    const response = await GET(req, { params: { slug: 'xss-test' } });
    const html = await response.text();
    expect(html).not.toContain('<script>');
    expect(html).toContain('<h1>Test</h1>');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- tests/api/landing-pages/get-slug.test.ts -v
```

Expected: All tests fail (route not yet implemented).

- [ ] **Step 3: Write GET route handler**

Create `app/api/landing-pages/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { sanitizeHtml } from '@/lib/landing-pages/sanitize';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch published landing page
    const landingPage = await db.landingPage.findUnique({
      where: { slug },
    });

    if (!landingPage || landingPage.status !== 'published') {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Sanitize HTML
    const sanitizedHtml = sanitizeHtml(landingPage.html);

    // Build SEO meta tags
    const metaTags = `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(landingPage.metaTitle)}</title>
    <meta name="description" content="${escapeHtml(landingPage.metaDescription)}">
    <meta name="keywords" content="${escapeHtml(landingPage.keywords.join(', '))}">
    ${landingPage.canonicalUrl ? `<link rel="canonical" href="${escapeHtml(landingPage.canonicalUrl)}">` : ''}
    <meta property="og:title" content="${escapeHtml(landingPage.metaTitle)}">
    <meta property="og:description" content="${escapeHtml(landingPage.metaDescription)}">
    <meta property="og:type" content="website">
    `.trim();

    // Build complete HTML response
    const completeHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        ${metaTags}
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${sanitizedHtml}
      </body>
    </html>
    `.trim();

    return new NextResponse(completeHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching landing page:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

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
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm test -- tests/api/landing-pages/get-slug.test.ts -v
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/api/landing-pages/[slug]/route.ts tests/api/landing-pages/get-slug.test.ts
git commit -m "feat(api): implement GET /api/landing-pages/[slug] public page endpoint with SEO meta tags"
```

---

## Phase 3: Subdomain Routing Middleware

### Task 8: Implement Subdomain Routing Middleware

**Files:**
- Modify: `middleware.ts` (create if doesn't exist)

**Interfaces:**
- Consumes: GET `/api/landing-pages/[slug]` route from Phase 2
- Produces: Middleware that extracts subdomain, rewrites requests to landing page route

- [ ] **Step 1: Check if middleware.ts exists**

Run:
```bash
ls -la /Users/quindart/dev/quindart-blog/middleware.ts
```

If it doesn't exist, create it. If it does, we'll extend it.

- [ ] **Step 2: Write subdomain routing middleware**

Create or modify `middleware.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

// Reserved subdomains that should not route to landing pages
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
    // Extract subdomain from something like "test.quindart.com"
    subdomain = parts[0];
  } else if (
    hostname.includes('localhost') &&
    parts.length > 1 &&
    !hostname.startsWith('localhost:')
  ) {
    // Local testing: "test.quindart.local:3000"
    subdomain = parts[0];
  }

  // Check if subdomain is reserved or we're already on an API/admin route
  if (
    subdomain &&
    !RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase()) &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/admin')
  ) {
    // Rewrite to landing page API route
    // Change "test.quindart.com/" to "/api/landing-pages/test"
    const url = request.nextUrl.clone();
    url.pathname = `/api/landing-pages/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  // Otherwise, continue with normal routing
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

- [ ] **Step 3: Test locally (manual)**

Run dev server:
```bash
npm run dev
```

Add to `/etc/hosts` (Mac/Linux):
```
127.0.0.1 localhost.quindart.local
127.0.0.1 test.quindart.local
```

Visit `http://test.quindart.local:3000` in browser. Should route to `/api/landing-pages/test`.

- [ ] **Step 4: Commit**

```bash
git add middleware.ts
git commit -m "feat(middleware): add subdomain routing for landing pages"
```

---

## Phase 4: Admin Dashboard UI

### Task 9: Create Admin List Page

**Files:**
- Create: `app/admin/landing-pages/page.tsx`
- Create: `tests/admin/landing-pages/list.test.tsx`

**Interfaces:**
- Consumes: LandingPage Prisma model from Phase 1
- Produces: React component showing list of landing pages with slug, status, Lighthouse score, created date, and action buttons

- [ ] **Step 1: Write test for list page**

Create `tests/admin/landing-pages/list.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import LandingPagesListPage from '@/app/admin/landing-pages/page';
import { db } from '@/lib/prisma';

// Mock the auth and DB calls
jest.mock('@/lib/auth', () => ({
  auth: jest.fn().mockResolvedValue({ user: { id: 1 } }),
}));

describe('Landing Pages List Page', () => {
  beforeEach(async () => {
    await db.landingPage.deleteMany();
  });

  it('displays empty state when no pages', async () => {
    const { container } = render(await LandingPagesListPage());
    expect(screen.getByText(/no landing pages/i)).toBeDefined();
  });

  it('displays list of landing pages', async () => {
    await db.landingPage.create({
      data: {
        slug: 'test-1',
        html: '<h1>Test</h1>',
        images: [],
        metaTitle: 'Test 1',
        metaDescription: 'Test',
        keywords: [],
        status: 'draft',
        lighthouseScore: null,
      },
    });

    await db.landingPage.create({
      data: {
        slug: 'test-2',
        html: '<h1>Test 2</h1>',
        images: [],
        metaTitle: 'Test 2',
        metaDescription: 'Test',
        keywords: [],
        status: 'published',
        lighthouseScore: 95,
      },
    });

    const { container } = render(await LandingPagesListPage());
    expect(screen.getByText('test-1')).toBeDefined();
    expect(screen.getByText('test-2')).toBeDefined();
    expect(screen.getByText('draft')).toBeDefined();
    expect(screen.getByText('published')).toBeDefined();
    expect(screen.getByText('95')).toBeDefined();
  });
});
```

- [ ] **Step 2: Create list page component**

Create `app/admin/landing-pages/page.tsx`:

```typescript
import { auth } from '@/lib/auth';
import { db } from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function LandingPagesListPage() {
  const session = await auth();
  if (!session) {
    return <div>Unauthorized</div>;
  }

  const landingPages = await db.landingPage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Landing Pages</h1>
        <Link href="/admin/landing-pages/create">
          <Button>Create New Page</Button>
        </Link>
      </div>

      {landingPages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No landing pages yet.</p>
          <Link href="/admin/landing-pages/create">
            <Button>Create your first landing page</Button>
          </Link>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lighthouse Score</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {landingPages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">
                  {page.status === 'published' ? (
                    <a
                      href={`https://${page.slug}.quindart.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {page.slug}
                    </a>
                  ) : (
                    page.slug
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      page.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {page.status}
                  </span>
                </TableCell>
                <TableCell>
                  {page.lighthouseScore !== null ? (
                    <span
                      className={`font-bold ${
                        page.lighthouseScore >= 90
                          ? 'text-green-600'
                          : page.lighthouseScore >= 70
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {page.lighthouseScore}
                    </span>
                  ) : (
                    <span className="text-gray-400">Not checked</span>
                  )}
                </TableCell>
                <TableCell>{format(page.createdAt, 'MMM d, yyyy')}</TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/admin/landing-pages/${page.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <a
                    href={`/api/landing-pages/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create folder structure if needed**

Run:
```bash
mkdir -p app/admin/landing-pages/{create,[id]/edit}
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/landing-pages/page.tsx tests/admin/landing-pages/list.test.tsx
git commit -m "feat(admin): add landing pages list page with status and Lighthouse score display"
```

---

### Task 10: Create Admin Form Component

**Files:**
- Create: `components/admin/LandingPageForm.tsx`
- Create: `lib/landing-pages/useForm.ts` (custom hook)

**Interfaces:**
- Produces: React form component with fields: slug, HTML textarea, images array, SEO fields (title, description, keywords, canonical)

- [ ] **Step 1: Create reusable form component**

Create `components/admin/LandingPageForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface LandingPageFormProps {
  initialData?: {
    id: number;
    slug: string;
    html: string;
    images: string[];
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl?: string;
    lighthouseScore?: number;
  };
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function LandingPageForm({
  initialData,
  onSubmit,
  isLoading = false,
}: LandingPageFormProps) {
  const [formData, setFormData] = useState({
    slug: initialData?.slug || '',
    html: initialData?.html || '',
    images: initialData?.images || [],
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    keywords: initialData?.keywords?.join(', ') || '',
    canonicalUrl: initialData?.canonicalUrl || '',
  });

  const [error, setError] = useState('');
  const [newImage, setNewImage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit({
        ...formData,
        keywords: formData.keywords
          .split(',')
          .map((k) => k.trim())
          .filter((k) => k),
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddImage = () => {
    if (!newImage) return;
    if (!newImage.startsWith('https://res.cloudinary.com/')) {
      setError('Image URL must be from Cloudinary');
      return;
    }
    setFormData({
      ...formData,
      images: [...formData.images, newImage],
    });
    setNewImage('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-2">Slug</label>
        <Input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g., summer-promo"
          disabled={!!initialData} // Can't change slug after creation
        />
        <p className="text-xs text-gray-500 mt-1">
          Subdomain: {formData.slug}.quindart.com
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">HTML Content</label>
        <Textarea
          value={formData.html}
          onChange={(e) => setFormData({ ...formData, html: e.target.value })}
          placeholder="Paste your HTML here"
          rows={12}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Images (Cloudinary URLs)</label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
            />
            <Button type="button" onClick={handleAddImage} variant="outline">
              Add
            </Button>
          </div>

          {formData.images.length > 0 && (
            <div className="border rounded p-3 space-y-2">
              {formData.images.map((img, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <code className="text-xs text-gray-600 truncate">{img}</code>
                  <Button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    variant="ghost"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Meta Title</label>
          <Input
            type="text"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            placeholder="Page title for search engines"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Canonical URL (optional)</label>
          <Input
            type="text"
            value={formData.canonicalUrl}
            onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Meta Description</label>
        <Textarea
          value={formData.metaDescription}
          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          placeholder="Brief description for search engines (160 chars)"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
        <Input
          type="text"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          placeholder="seo, keywords, landing page"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/admin/LandingPageForm.tsx
git commit -m "feat(admin): add reusable landing page form component"
```

---

### Task 11: Create Admin Create Page

**Files:**
- Create: `app/admin/landing-pages/create/page.tsx`

**Interfaces:**
- Consumes: `LandingPageForm` component from Task 10
- Produces: Create page calling POST `/api/landing-pages/create` and redirecting to list

- [ ] **Step 1: Create create page**

Create `app/admin/landing-pages/create/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPageForm } from '@/components/admin/LandingPageForm';

export default function CreateLandingPagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/landing-pages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create landing page');
      }

      // Redirect to list
      router.push('/admin/landing-pages');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create Landing Page</h1>
      <LandingPageForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/landing-pages/create/page.tsx
git commit -m "feat(admin): add create landing page form page"
```

---

### Task 12: Create Lighthouse Modal Component

**Files:**
- Create: `components/admin/LighthouseModal.tsx`
- Modify: `components/admin/LandingPageForm.tsx` (add Check Lighthouse button)

**Interfaces:**
- Produces: Modal component showing Lighthouse score, pass/fail indicator, and detailed report link

- [ ] **Step 1: Create Lighthouse modal component**

Create `components/admin/LighthouseModal.tsx`:

```typescript
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LighthouseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landingPageId: number;
  onScoreUpdate: (score: number, report: any) => void;
}

export function LighthouseModal({
  open,
  onOpenChange,
  landingPageId,
  onScoreUpdate,
}: LighthouseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [report, setReport] = useState<any>(null);

  const handleCheckLighthouse = async () => {
    setIsLoading(true);
    setError('');
    setScore(null);

    try {
      const response = await fetch('/api/landing-pages/check-lighthouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: landingPageId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to run Lighthouse audit');
      }

      const data = await response.json();
      setScore(data.lighthouseScore);
      setReport(data.lighthouseReport);
      onScoreUpdate(data.lighthouseScore, data.lighthouseReport);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lighthouse Performance Audit</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {error && <div className="text-red-600 mb-4">{error}</div>}

          {score !== null ? (
            <div className="space-y-4">
              <div className="text-center">
                <div
                  className={`text-6xl font-bold mb-2 ${
                    score >= 90
                      ? 'text-green-600'
                      : score >= 70
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {score}
                </div>
                <p className="text-lg font-semibold">
                  {score >= 90
                    ? '✓ Ready to publish!'
                    : score >= 70
                    ? '⚠ Needs improvement'
                    : '✗ Needs significant work'}
                </p>
              </div>

              {score < 90 && (
                <p className="text-sm text-gray-600">
                  Score must be 90 or higher to publish. Run the audit again after making
                  improvements.
                </p>
              )}

              {report && (
                <div className="text-xs text-gray-500">
                  <p>Full report available in browser console or via API.</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              Click below to run a Lighthouse performance audit. This may take 10-20 seconds.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {!score && (
            <Button onClick={handleCheckLighthouse} disabled={isLoading}>
              {isLoading ? 'Running audit...' : 'Run Lighthouse Audit'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Update LandingPageForm to include Lighthouse button**

Modify `components/admin/LandingPageForm.tsx` (add to the form):

```typescript
import { LighthouseModal } from './LighthouseModal';

// Inside the component:
const [lighthouseOpen, setLighthouseOpen] = useState(false);
const [lighthouseScore, setLighthouseScore] = useState(initialData?.lighthouseScore);

// In the form, after keywords field:
{initialData && (
  <div className="flex items-center justify-between bg-gray-50 p-4 rounded">
    <div>
      <p className="text-sm font-medium">Lighthouse Score</p>
      {lighthouseScore !== null ? (
        <p className={`text-2xl font-bold ${
          lighthouseScore >= 90 ? 'text-green-600' : 'text-red-600'
        }`}>
          {lighthouseScore}
        </p>
      ) : (
        <p className="text-gray-500">Not checked yet</p>
      )}
    </div>
    <Button
      type="button"
      onClick={() => setLighthouseOpen(true)}
      variant="outline"
    >
      Check Lighthouse
    </Button>
  </div>
)}

{/* Modal at the end */}
{initialData && (
  <LighthouseModal
    open={lighthouseOpen}
    onOpenChange={setLighthouseOpen}
    landingPageId={initialData.id}
    onScoreUpdate={(score) => setLighthouseScore(score)}
  />
)}
```

- [ ] **Step 3: Commit**

```bash
git add components/admin/LighthouseModal.tsx components/admin/LandingPageForm.tsx
git commit -m "feat(admin): add Lighthouse audit modal and integrate with form"
```

---

### Task 13: Create Admin Edit Page

**Files:**
- Create: `app/admin/landing-pages/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `LandingPageForm`, `LighthouseModal` from previous tasks
- Produces: Edit page with pre-filled form, Check Lighthouse button, and Publish button

- [ ] **Step 1: Create edit page**

Create `app/admin/landing-pages/[id]/edit/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LandingPageForm } from '@/components/admin/LandingPageForm';
import { Button } from '@/components/ui/button';

export default function EditLandingPagePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [landingPage, setLandingPage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    // Fetch landing page details
    async function fetchPage() {
      try {
        const response = await fetch(`/api/admin/landing-pages/${id}`);
        if (!response.ok) throw new Error('Failed to load landing page');
        const data = await response.json();
        setLandingPage(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPage();
  }, [id]);

  const handleUpdate = async (data: any) => {
    try {
      const response = await fetch(`/api/admin/landing-pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update landing page');
      }

      // Refresh data
      const updated = await response.json();
      setLandingPage(updated);
      alert('Landing page updated!');
    } catch (err: any) {
      throw err;
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      const response = await fetch('/api/landing-pages/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id) }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to publish');
      }

      const data = await response.json();
      setLandingPage({ ...landingPage, status: 'published' });
      alert(`✓ Published at ${data.subdomain}`);
      router.push('/admin/landing-pages');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!landingPage) return <div className="p-6">Landing page not found</div>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Landing Page</h1>
        {landingPage.status === 'draft' && landingPage.lighthouseScore >= 90 && (
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Button>
        )}
      </div>

      <LandingPageForm initialData={landingPage} onSubmit={handleUpdate} />
    </div>
  );
}
```

- [ ] **Step 2: Create GET endpoint for fetching single page**

Create `app/api/admin/landing-pages/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const landingPage = await db.landingPage.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }

    return NextResponse.json(landingPage);
  } catch (error) {
    console.error('Error fetching landing page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { html, images, metaTitle, metaDescription, keywords, canonicalUrl } = body;

    const updated = await db.landingPage.update({
      where: { id: parseInt(params.id) },
      data: {
        html,
        images,
        metaTitle,
        metaDescription,
        keywords,
        canonicalUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating landing page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/landing-pages/[id]/edit/page.tsx app/api/admin/landing-pages/[id]/route.ts
git commit -m "feat(admin): add edit landing page with publish button"
```

---

## Phase 5: Integration Tests

### Task 14: Write End-to-End Integration Test

**Files:**
- Create: `tests/e2e/landing-pages.e2e.test.ts`

**Interfaces:**
- Tests full flow: create → list → check Lighthouse → publish → view public

- [ ] **Step 1: Write E2E test**

Create `tests/e2e/landing-pages.e2e.test.ts`:

```typescript
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
      headers: { 'Content-Type': 'application/json', cookie: 'session=...' },
    });

    expect(createRes.status).toBe(201);
    const created = await createRes.json();
    expect(created.status).toBe('draft');
    expect(created.lighthouseScore).toBeNull();

    // 2. Check Lighthouse
    const lighthouseRes = await fetch('http://localhost:3000/api/landing-pages/check-lighthouse', {
      method: 'POST',
      body: JSON.stringify({ id: created.id }),
      headers: { 'Content-Type': 'application/json', cookie: 'session=...' },
    });

    expect(lighthouseRes.status).toBe(200);
    const audited = await lighthouseRes.json();
    expect(audited.lighthouseScore).toBeGreaterThanOrEqual(0);
    expect(audited.lighthouseScore).toBeLessThanOrEqual(100);

    // 3. Publish (assuming score >= 90)
    if (audited.lighthouseScore >= 90) {
      const publishRes = await fetch('http://localhost:3000/api/landing-pages/publish', {
        method: 'POST',
        body: JSON.stringify({ id: created.id }),
        headers: { 'Content-Type': 'application/json', cookie: 'session=...' },
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
```

- [ ] **Step 2: Commit**

```bash
git add tests/e2e/landing-pages.e2e.test.ts
git commit -m "test(e2e): add complete landing page workflow integration test"
```

---

## Final Steps

### Task 15: Run All Tests & Verify

- [ ] **Step 1: Run unit tests**

```bash
npm test
```

- [ ] **Step 2: Run integration tests**

```bash
npm run test:integration
```

- [ ] **Step 3: Run dev server and test manually**

```bash
npm run dev
```

Visit `http://localhost:3000/admin/landing-pages` and test creating a landing page.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat(complete): landing page manager with Lighthouse validation complete"
```

---

## Summary

The Landing Page Manager is complete with:

✓ **Schema:** LandingPage Prisma model with SEO and Lighthouse fields  
✓ **Validation:** Slug, HTML, image URL validation  
✓ **Sanitization:** HTML sanitization with Cloudinary image whitelisting  
✓ **API:** Create, publish, check-Lighthouse, public page endpoints  
✓ **Middleware:** Subdomain routing to landing pages  
✓ **Admin UI:** List, create, edit pages with Lighthouse modal  
✓ **Tests:** Unit tests for all critical paths + E2E flow

Implementation order:
1. Phase 1 (Schema, utilities) — foundation
2. Phase 2 (API routes) — core functionality
3. Phase 3 (Middleware) — public access
4. Phase 4 (Admin UI) — user interface
5. Phase 5 (Tests) — verification
