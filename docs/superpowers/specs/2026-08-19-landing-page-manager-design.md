# Landing Page Manager with SEO & Lighthouse — Design Spec

**Date:** 2026-08-19  
**Author:** Admin Dashboard Feature  
**Status:** Design Phase

---

## Overview

Add a **Landing Page Manager** subsystem to the quindart-blog Next.js app. This allows the admin to create and publish landing pages by pasting raw HTML, adding SEO metadata and Cloudinary images, and validating Lighthouse performance (≥ 90 score) before going live. Each landing page gets its own subdomain (e.g., `promo.quindart.com`).

**Goals:**
- Rapid landing page creation (paste HTML + SEO fields)
- SEO-first: built-in meta fields and Lighthouse validation
- Mobile-optimized: Lighthouse check ensures responsive, performant pages
- Simple deployment: no build step, subdomain routing at request time

---

## Success Criteria

- Admin can paste HTML, add SEO fields, and upload Cloudinary images via a dashboard form
- Lighthouse audit runs on-demand and blocks publish if score < 90
- Published landing pages appear at `<slug>.quindart.com` without additional deployment
- All landing pages stored in Prisma with slug-based URL structure

---

## Architecture

### Three-Layer Design

```
┌─────────────────────────────────────────┐
│      Admin Dashboard (React)            │
│  (/app/admin/landing-pages/)            │
│  - Create form (HTML, SEO, images)      │
│  - List view (status, Lighthouse score) │
│  - Check Lighthouse button              │
│  - Publish button (enabled if ≥ 90)     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      API Routes & Logic                 │
│  (/app/api/landing-pages/)              │
│  - POST /create                         │
│  - POST /check-lighthouse               │
│  - POST /publish                        │
│  - GET /[slug] (public page render)     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Subdomain Routing Middleware           │
│  (/middleware.ts)                       │
│  - Extract subdomain from request       │
│  - Lookup landing page in DB            │
│  - Render or 404                        │
└─────────────────────────────────────────┘
```

### Data Flow

1. **Create:** Admin fills form → POST `/api/landing-pages/create` → store in DB as draft
2. **Preview:** Admin sees form preview + iframe with sanitized HTML
3. **Check Lighthouse:** Click button → POST `/api/landing-pages/check-lighthouse` → run audit → return score + store in DB
4. **Publish:** If score ≥ 90, click publish → POST `/api/landing-pages/publish` → mark status = "published"
5. **View Public:** User visits `slug.quindart.com` → Middleware extracts slug → queries DB → renders HTML with SEO meta tags

---

## Database Schema

### New Model: LandingPage

Add to `/lib/prisma/schema.prisma`:

```prisma
model LandingPage {
  id           Int      @id @default(autoincrement())
  slug         String   @unique  // subdomain name, e.g., "promo", "launch"
  html         String   // raw HTML content
  images       String[] // array of Cloudinary image URLs
  status       String   @default("draft")  // "draft" | "published" | "archived"
  
  // SEO metadata
  metaTitle    String   // page title tag
  metaDescription String // meta description
  keywords     String[] // SEO keywords array
  canonicalUrl String?  // optional canonical URL
  
  // Lighthouse validation
  lighthouseScore Int?   // latest score (0-100), null if not yet checked
  lighthouseReport Json? // full Lighthouse report JSON for detailed view
  
  // Audit
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**Why this schema:**
- `slug` is unique and URLs the subdomain
- `html` is raw user input (stored as-is, sanitized on render)
- `images` is an array of Cloudinary URLs for flexible image management
- `lighthouseScore` and `lighthouseReport` let the UI show pass/fail + detailed metrics
- `status` allows draft/published/archived workflows

---

## API Routes

### POST `/api/landing-pages/create`

**Purpose:** Store a new landing page in draft status.

**Request:**
```json
{
  "slug": "summer-promo",
  "html": "<html>...</html>",
  "images": ["https://res.cloudinary.com/...", "..."],
  "metaTitle": "Summer Promo",
  "metaDescription": "Limited time offer",
  "keywords": ["summer", "promo", "offer"],
  "canonicalUrl": "https://quindart.com/summer-promo"
}
```

**Response:**
```json
{
  "id": 1,
  "slug": "summer-promo",
  "status": "draft",
  "lighthouseScore": null,
  "createdAt": "2026-08-19T..."
}
```

**Logic:**
- Validate slug uniqueness
- Validate HTML is not empty
- Sanitize keywords (trim, lowercase)
- Store in DB with status = "draft"
- Return landing page record

---

### POST `/api/landing-pages/check-lighthouse`

**Purpose:** Run a Lighthouse audit on the stored HTML and return results.

**Request:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "lighthouseScore": 92,
  "lighthouseReport": { /* full Lighthouse JSON */ }
}
```

**Logic:**
- Fetch landing page from DB by ID
- Spawn a Lighthouse audit on the HTML (e.g., via Node's `lighthouse` package or a headless Chrome call)
- Parse the report, extract score
- Store score and full report in DB
- Return to client

**Note:** This could be async (background job) or sync depending on timeout tolerance. Start with sync (Lighthouse typically finishes in 10–20s).

---

### POST `/api/landing-pages/publish`

**Purpose:** Publish a landing page (mark as published, only if Lighthouse ≥ 90).

**Request:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "status": "published",
  "lighthouseScore": 92,
  "subdomain": "summer-promo.quindart.com"
}
```

**Logic:**
- Fetch landing page from DB by ID
- Check `lighthouseScore >= 90` (return error if not checked or < 90)
- Update status = "published"
- Return confirmation with subdomain URL

---

### GET `/api/landing-pages/[slug]` (Public)

**Purpose:** Serve the public landing page at `<slug>.quindart.com`.

**Request:** None (slug in path)

**Response:** Rendered HTML page with SEO meta tags injected.

**Logic:**
- Query DB by slug
- If not found or status != "published", return 404
- Inject SEO meta tags into HTML (title, description, canonical, keywords)
- Sanitize HTML (DOMPurify or `sanitize-html`)
- Return as HTML response with appropriate headers

---

## Subdomain Routing (Middleware)

### How It Works

Next.js middleware intercepts all requests and checks if the hostname matches a subdomain pattern.

**File:** `/middleware.ts` (or extend existing)

**Logic:**
```
if request.hostname matches *.quindart.com (not www, not api):
  extract subdomain (e.g., "summer-promo" from "summer-promo.quindart.com")
  query DB for LandingPage with matching slug
  if found and status = "published":
    rewrite request to /api/landing-pages/[slug]
    render the landing page
  else:
    404
else:
  continue to normal Next.js routing (main site)
```

**Wildcard DNS requirement:**
- Point `*.quindart.com` to your app's server/Vercel deployment
- Existing `www.quindart.com` and main site routes bypass middleware (check host logic)

---

## Admin Dashboard Components

### Create/Edit Page

**File:** `/app/admin/landing-pages/create.tsx` or `edit.tsx`

**Components:**
- **HTML textarea:** paste raw HTML, shows validation messages
- **Images input:** add/remove Cloudinary image URLs, shows preview thumbnails
- **SEO fields:**
  - Meta Title (text input)
  - Meta Description (textarea)
  - Keywords (tag input, comma-separated)
  - Canonical URL (text input, optional)
- **Preview pane:** iframe showing sanitized HTML rendering
- **Check Lighthouse button:** calls API, shows modal with score + report link
- **Publish button:** enabled only if lighthouseScore ≥ 90

**Form submission:** POST `/api/landing-pages/create` on save.

---

### List Page

**File:** `/app/admin/landing-pages/index.tsx`

**Columns:**
- Slug (+ link to live subdomain if published)
- Status (draft | published)
- Lighthouse Score (null if not checked, or 0–100 with color coding)
- Created date
- Actions (Edit, View, Delete, Check Lighthouse)

---

## Security & Sanitization

### XSS Protection

- **Input:** User pastes HTML directly into textarea
- **Storage:** Store raw HTML in DB (no parsing or manipulation)
- **Render (public page):** Use a sanitization library before rendering
  - **Recommended:** `sanitize-html` (Node.js) or `DOMPurify` (React)
  - **Config:** Allow common HTML tags (h1–h6, p, img, a, button, form, input, etc.), strip scripts
  - **Images:** Allow `<img src="">` but validate URLs are from trusted Cloudinary domain

### Auth

- All admin routes (`/app/admin/landing-pages/`) require auth (check user session)
- API routes (`/api/landing-pages/create`, `/publish`, etc.) require auth
- Public GET route (`/api/landing-pages/[slug]`) is unauthenticated (landing page is public)

### Slug Validation

- Only alphanumeric + hyphens (a-z, 0-9, -)
- Max 50 chars
- Must be unique in DB
- Prevent reserved subdomains (www, api, admin, mail, etc.)

---

## Lighthouse Integration

### Tool Choice

- **Node.js `lighthouse` package:** simplest for server-side audits
  - `npm install lighthouse`
  - Requires Chrome/Chromium on server
  - Vercel has Chrome built-in, so this works on deployment

### Flow

1. Admin clicks "Check Lighthouse" button in form
2. Frontend makes POST request to `/api/landing-pages/check-lighthouse`
3. Backend:
   - Renders the stored HTML page locally (could spin up a temp HTTP server or use headless Chrome)
   - Runs Lighthouse audit against that URL
   - Extracts score from report
   - Stores score + full report in DB
4. Frontend receives response, displays score in modal
5. If score ≥ 90, enable publish button

### Timeout & Performance

- Lighthouse audit takes ~10–20 seconds
- For better UX, consider:
  - Show loading spinner / progress indicator
  - Set reasonable timeout (30s) on API route
  - Optionally queue for background job if load becomes an issue

---

## Testing Strategy

### Unit Tests

- **Schema validation:** slug uniqueness, required fields
- **Sanitization:** HTML with script tags → stripped on render
- **Slug validation:** reject reserved names, invalid chars

### Integration Tests

- **Create flow:** POST to create → verify DB record created with status "draft"
- **Lighthouse flow:** POST to check → verify score stored, publish button enabled
- **Publish flow:** POST to publish → verify status = "published", lighthouse score ≥ 90
- **Subdomain routing:** mock request to `test.quindart.com` → verify middleware routes to landing page

### E2E Tests (admin dashboard)

- Create a new landing page (fill form, submit)
- See it in list as draft
- Click "Check Lighthouse" → see score modal
- If ≥ 90, publish → status changes to published
- Visit published subdomain → see live page

---

## Deployment Notes

### Local Development

1. Ensure `CLOUDINARY_API_KEY` and `CLOUDINARY_CLOUD_NAME` are in `.env` (already in use for existing image features)
2. For subdomain testing locally, add entries to `/etc/hosts`:
   ```
   127.0.0.1 localhost.quindart.local
   127.0.0.1 test.quindart.local
   ```
   Then run app and visit `test.quindart.local:3000`

### Production (Vercel)

- Wildcard DNS `*.quindart.com` already configured (or will be)
- Lighthouse audit on Vercel: Chrome is available; `lighthouse` package will work
- Database: Prisma with PostgreSQL connection (existing setup)

---

## Future Enhancements (Out of Scope)

- Edit published pages
- Delete landing pages (archive workflow)
- Analytics (page views, conversion tracking)
- A/B testing (multiple versions per slug)
- Custom domains (point user's domain at landing page)
- Template library (start from pre-built templates, not just raw HTML)

---

## Summary

The Landing Page Manager is a self-contained subsystem with:
- **Data:** LandingPage Prisma model (HTML, SEO, images, Lighthouse score)
- **Admin UI:** Create/edit form + list view in `/app/admin/landing-pages/`
- **API:** Create, check Lighthouse, publish endpoints
- **Routing:** Subdomain middleware for public access
- **Quality:** Lighthouse gate (must be ≥ 90 to publish)

Implementation can proceed in phases:
1. Schema + API routes + middleware
2. Admin dashboard UI
3. Lighthouse integration
4. E2E testing + polish
