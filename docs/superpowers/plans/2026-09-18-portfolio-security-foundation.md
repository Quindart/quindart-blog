# Portfolio Security Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish deterministic tests and close the current authentication, password-disclosure, draft-visibility, input-validation, and stored-XSS risks without redesigning the public UI.

**Architecture:** Keep the existing route-handler and service structure during this phase, but introduce focused auth, validation, selection, and sanitization modules that later domain refactors can reuse. Public reads use explicit Prisma selects and published-only queries; all admin reads and mutations share one session verifier.

**Tech Stack:** Next.js App Router, TypeScript, Prisma/PostgreSQL, Jest with ts-jest, Playwright, Zod 4, bcryptjs, jsonwebtoken, sanitize-html, pnpm/RTK.

**Spec:** `docs/superpowers/specs/2026-09-18-portfolio-balanced-refactor-design.md`

## Global Constraints

- Preserve the existing `/`, `/blog`, `/blog/[slug]`, `/project`, and admin URLs in this phase.
- Never serialize `User.password` in any response.
- Every POST, PUT/PATCH, and DELETE route requires a valid admin session before parsing or applying input.
- `JWT_SECRET` has no fallback and must contain at least 32 characters when authentication code executes.
- Public post reads return only `status = "published"` records.
- Blog HTML is sanitized on write and again on public read during the migration window.
- Generated Prisma output, `.next`, and agent worktrees are excluded from linting, formatting, and tests.
- Use RTK for every shell command.
- Do not stage or commit unrelated working-tree changes.

---

## File Map

### Test boundaries

- `jest.config.js`: Jest discovers only unit and integration tests.
- `playwright.config.ts`: Playwright discovers only E2E tests and owns its web server.
- `tests/unit/**`: Pure unit tests.
- `tests/integration/**`: Route/service tests with controlled dependencies.
- `tests/e2e/admin.spec.ts`: Existing browser login flow.

### Security modules

- `lib/env.ts`: Runtime environment validation.
- `lib/security/sanitize.ts`: Blog HTML allowlist.
- `features/auth/token.ts`: Pure JWT creation and verification.
- `features/auth/session.ts`: Cookie-backed admin session lookup.
- `features/auth/schemas.ts`: Login input schema.
- `features/blog/schemas.ts`: Blog mutation schemas.
- `features/projects/schemas.ts`: Project mutation schemas.
- `features/users/schemas.ts`: User mutation schemas.

### Data exposure controls

- `features/data/selects.ts`: Prisma selects and result types for public/admin-safe records.
- `lib/services/*.service.ts`: Queries use the safe selects and published-only rules.

### HTTP adapters

- `lib/http/responses.ts`: Consistent validation and unauthorized responses.
- `app/api/**/route.ts`: Authentication, validation, and thin service calls.

---

### Task 1: Isolate Jest and Playwright Discovery

**Files:**
- Modify: `.gitignore`
- Delete from Git: `.claude/worktrees/quality-gate-impl`
- Modify: `jest.config.js`
- Modify: `playwright.config.ts`
- Move: `tests/admin.spec.ts` -> `tests/e2e/admin.spec.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: Existing Jest and Playwright installations.
- Produces: `pnpm test:unit`, `pnpm test:e2e`, and non-overlapping test discovery.

- [ ] **Step 1: Record and preserve the existing unrelated state**

Run:

```bash
rtk git status --short
rtk git diff -- .claude/worktrees/quality-gate-impl
```

Expected: the malformed gitlink is deleted or dirty, and no authored source change is hidden inside the parent repository diff. If unique work still exists outside Git, stop and preserve it before removing the gitlink.

- [ ] **Step 2: Remove the malformed gitlink and prevent recurrence**

Add to `.gitignore`:

```gitignore
.claude/worktrees/
```

Stage only the already-removed gitlink:

```bash
rtk git add -u .claude/worktrees/quality-gate-impl
```

- [ ] **Step 3: Move the Playwright test into its own directory**

Move `tests/admin.spec.ts` to `tests/e2e/admin.spec.ts` without changing the test body.

- [ ] **Step 4: Restrict Jest discovery**

Replace `jest.config.js` with:

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.ts',
    '<rootDir>/tests/unit/**/*.test.tsx',
    '<rootDir>/tests/integration/**/*.test.ts',
    '<rootDir>/tests/integration/**/*.test.tsx',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/.claude/',
    '/lib/prisma/generated/',
    '/tests/e2e/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          esModuleInterop: true,
        },
      },
    ],
  },
  collectCoverageFrom: [
    'features/**/*.ts',
    'lib/**/*.ts',
    'app/api/**/*.ts',
    '!**/*.d.ts',
    '!lib/prisma/generated/**',
  ],
};
```

- [ ] **Step 5: Restrict Playwright discovery and configure the web server**

Update `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  webServer: {
    command: 'pnpm dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

- [ ] **Step 6: Name the test scripts explicitly**

Change the relevant `package.json` scripts to:

```json
{
  "test": "pnpm test:unit",
  "test:unit": "NODE_OPTIONS='--experimental-vm-modules' jest",
  "test:unit:watch": "NODE_OPTIONS='--experimental-vm-modules' jest --watch",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 7: Verify discovery without running database-dependent E2E**

Run:

```bash
rtk proxy pnpm exec jest --listTests
rtk playwright test --list
```

Expected: Jest lists no file from `tests/e2e` or `.claude`; Playwright lists exactly the admin login test.

- [ ] **Step 8: Commit the test-boundary change**

```bash
rtk git add .gitignore jest.config.js playwright.config.ts package.json tests/e2e/admin.spec.ts
rtk git add -u tests/admin.spec.ts .claude/worktrees/quality-gate-impl
rtk git commit -m "test: isolate unit and e2e discovery"
```

---

### Task 2: Add the Blog HTML Sanitization Boundary

**Files:**
- Create: `lib/security/sanitize.ts`
- Create: `tests/unit/security/sanitize.test.ts`

**Interfaces:**
- Consumes: `sanitize-html`.
- Produces: `sanitizeBlogHtml(input: string): string`.

- [ ] **Step 1: Write the failing sanitizer tests**

Create `tests/unit/security/sanitize.test.ts`:

```ts
import { sanitizeBlogHtml } from '@/lib/security/sanitize';

describe('sanitizeBlogHtml', () => {
  it('keeps supported article markup', () => {
    const html = '<h2>Title</h2><p>Hello <strong>world</strong></p><pre><code>const x = 1</code></pre>';

    expect(sanitizeBlogHtml(html)).toBe(html);
  });

  it('removes executable markup and event handlers', () => {
    const html = '<script>alert(1)</script><img src="https://example.com/a.png" onerror="alert(2)"><p onclick="alert(3)">Safe</p>';
    const result = sanitizeBlogHtml(html);

    expect(result).not.toContain('<script');
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('onclick');
    expect(result).toContain('<img src="https://example.com/a.png" />');
    expect(result).toContain('<p>Safe</p>');
  });

  it('removes unsafe link protocols and hardens external links', () => {
    const result = sanitizeBlogHtml('<a href="javascript:alert(1)" target="_blank">Bad</a><a href="https://example.com">Good</a>');

    expect(result).not.toContain('javascript:');
    expect(result).toContain('rel="noopener noreferrer"');
  });
});
```

- [ ] **Step 2: Run the test and confirm the missing-module failure**

Run:

```bash
rtk jest tests/unit/security/sanitize.test.ts --runInBand
```

Expected: FAIL because `@/lib/security/sanitize` does not exist.

- [ ] **Step 3: Implement the allowlist**

Create `lib/security/sanitize.ts`:

```ts
import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'p', 'br', 'blockquote',
  'ul', 'ol', 'li', 'strong', 'em', 's', 'a', 'img',
  'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

export function sanitizeBlogHtml(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      code: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attributes) => ({
        tagName,
        attribs: {
          ...attributes,
          rel: 'noopener noreferrer',
        },
      }),
    },
  });
}
```

- [ ] **Step 4: Run the sanitizer tests**

```bash
rtk jest tests/unit/security/sanitize.test.ts --runInBand
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit the sanitization helper**

```bash
rtk git add lib/security/sanitize.ts tests/unit/security/sanitize.test.ts
rtk git commit -m "feat: add blog html sanitizer"
```

---

### Task 3: Centralize Environment and Session Validation

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `.env.example`
- Create: `lib/env.ts`
- Create: `features/auth/token.ts`
- Create: `features/auth/session.ts`
- Create: `tests/unit/auth/token.test.ts`
- Modify: `lib/auth.ts`
- Modify: `app/api/auth/login/route.ts`
- Modify: `app/api/auth/logout/route.ts`
- Modify: `app/admin/dashboard/(protected)/layout.tsx`

**Interfaces:**
- Consumes: `jsonwebtoken`, `next/headers`, `zod`.
- Produces: `getJwtSecret()`, `createSessionToken()`, `verifySessionToken()`, `getAdminSession()`, `requireAdmin()`, `UnauthorizedError`.

- [ ] **Step 1: Install Zod 4**

```bash
rtk pnpm add zod@^4
```

- [ ] **Step 2: Write failing environment and token tests**

Create `tests/unit/auth/token.test.ts`:

```ts
import { getJwtSecret } from '@/lib/env';
import { createSessionToken, verifySessionToken } from '@/features/auth/token';

describe('JWT configuration and tokens', () => {
  const secret = 'portfolio-test-secret-with-at-least-32-characters';

  it('rejects a missing secret', () => {
    expect(() => getJwtSecret({})).toThrow('JWT_SECRET');
  });

  it('rejects a short secret', () => {
    expect(() => getJwtSecret({ JWT_SECRET: 'short' })).toThrow('32');
  });

  it('creates and verifies a typed admin session', () => {
    const token = createSessionToken(
      { userId: 7, email: 'admin@example.com' },
      secret,
    );

    expect(verifySessionToken(token, secret)).toEqual({
      userId: 7,
      email: 'admin@example.com',
    });
  });

  it('rejects malformed session claims', () => {
    expect(() => verifySessionToken('not-a-token', secret)).toThrow('Invalid session');
  });
});
```

- [ ] **Step 3: Run the test and confirm the missing-module failure**

```bash
rtk jest tests/unit/auth/token.test.ts --runInBand
```

Expected: FAIL because `lib/env.ts` and `features/auth/token.ts` do not exist.

- [ ] **Step 4: Implement environment validation**

Create `lib/env.ts`:

```ts
import { z } from 'zod';

const JwtEnvironmentSchema = z.object({
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must contain at least 32 characters'),
});

export function getJwtSecret(
  environment: Record<string, string | undefined> = process.env,
): string {
  return JwtEnvironmentSchema.parse(environment).JWT_SECRET;
}
```

- [ ] **Step 5: Implement pure JWT operations**

Create `features/auth/token.ts`:

```ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/env';

export type AdminSession = {
  userId: number;
  email: string;
};

function isAdminSession(payload: string | JwtPayload): payload is JwtPayload & AdminSession {
  return (
    typeof payload !== 'string' &&
    typeof payload.userId === 'number' &&
    typeof payload.email === 'string'
  );
}

export function createSessionToken(
  session: AdminSession,
  secret = getJwtSecret(),
): string {
  return jwt.sign(session, secret, { expiresIn: '7d' });
}

export function verifySessionToken(
  token: string,
  secret = getJwtSecret(),
): AdminSession {
  try {
    const payload = jwt.verify(token, secret);
    if (!isAdminSession(payload)) throw new Error('Invalid session claims');
    return { userId: payload.userId, email: payload.email };
  } catch {
    throw new Error('Invalid session');
  }
}
```

- [ ] **Step 6: Implement cookie-backed session access**

Create `features/auth/session.ts`:

```ts
import { cookies } from 'next/headers';
import { AdminSession, verifySessionToken } from './token';

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new UnauthorizedError();
  return session;
}
```

- [ ] **Step 7: Migrate auth consumers**

Change `lib/auth.ts` to compatibility exports only:

```ts
export { getAdminSession as auth, requireAdmin as requireAuth } from '@/features/auth/session';
```

In the login route, replace direct `jwt.sign` and the fallback secret with:

```ts
const token = createSessionToken({ userId: user.id, email: user.email });
```

Make the protected layout `async`, call `await getAdminSession()`, and redirect when the result is `null`.

Ensure both logout handlers clear the cookie with:

```ts
res.cookies.set('token', '', {
  path: '/',
  httpOnly: true,
  maxAge: 0,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
});
```

- [ ] **Step 8: Document environment names without values**

Create `.env.example`:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
JWT_SECRET=replace-with-at-least-32-random-characters
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
POSTHOG_API_KEY=
```

- [ ] **Step 9: Run focused and static checks**

```bash
rtk jest tests/unit/auth/token.test.ts --runInBand
rtk tsc --noEmit
rtk pnpm lint
```

Expected: token tests pass, TypeScript exits 0, and lint introduces no new warning.

- [ ] **Step 10: Commit centralized auth**

```bash
rtk git add package.json pnpm-lock.yaml .env.example lib/env.ts lib/auth.ts features/auth/token.ts features/auth/session.ts tests/unit/auth/token.test.ts app/api/auth/login/route.ts app/api/auth/logout/route.ts 'app/admin/dashboard/(protected)/layout.tsx'
rtk git commit -m "feat: centralize secure admin sessions"
```

---

### Task 4: Define Safe Prisma Selections

**Files:**
- Create: `features/data/selects.ts`
- Create: `tests/unit/data/selects.test.ts`
- Modify: `lib/services/user.service.ts`
- Modify: `lib/services/blog.service.ts`
- Modify: `lib/services/project.service.ts`

**Interfaces:**
- Consumes: Generated Prisma namespace.
- Produces: `safeUserSelect`, `publicAuthorSelect`, `publicPostSelect`, `publicProjectSelect`, and their inferred payload types.

- [ ] **Step 1: Write failing selection tests**

Create `tests/unit/data/selects.test.ts`:

```ts
import {
  publicAuthorSelect,
  publicPostSelect,
  publicProjectSelect,
  safeUserSelect,
} from '@/features/data/selects';

describe('safe Prisma selections', () => {
  it.each([
    ['user', safeUserSelect],
    ['author', publicAuthorSelect],
    ['post', publicPostSelect],
    ['project', publicProjectSelect],
  ])('%s selection never requests password', (_name, selection) => {
    expect(JSON.stringify(selection)).not.toContain('password');
  });

  it('selects a restricted author shape for public content', () => {
    expect(publicPostSelect.author).toEqual({ select: publicAuthorSelect });
    expect(publicProjectSelect.author).toEqual({ select: publicAuthorSelect });
  });
});
```

- [ ] **Step 2: Run the test and confirm the missing-module failure**

```bash
rtk jest tests/unit/data/selects.test.ts --runInBand
```

Expected: FAIL because `features/data/selects.ts` does not exist.

- [ ] **Step 3: Implement the selections and payload types**

Create `features/data/selects.ts`:

```ts
import type { Prisma } from '@/lib/prisma/generated';

export const safeUserSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const publicAuthorSelect = {
  id: true,
  name: true,
} satisfies Prisma.UserSelect;

const publicCategorySelect = {
  id: true,
  name: true,
  slug: true,
} satisfies Prisma.CategorySelect;

const publicSeoSelect = {
  id: true,
  metaTitle: true,
  metaDescription: true,
  keywords: true,
  canonicalUrl: true,
} satisfies Prisma.SEOSelect;

export const publicPostSelect = {
  id: true,
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  featuredImage: true,
  status: true,
  authorId: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
  author: { select: publicAuthorSelect },
  category: { select: publicCategorySelect },
  seo: { select: publicSeoSelect },
} satisfies Prisma.PostSelect;

export const publicProjectSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  images: true,
  links: true,
  authorId: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
  author: { select: publicAuthorSelect },
  category: { select: publicCategorySelect },
  seo: { select: publicSeoSelect },
} satisfies Prisma.ProjectSelect;

export type SafeUser = Prisma.UserGetPayload<{ select: typeof safeUserSelect }>;
export type PublicPost = Prisma.PostGetPayload<{ select: typeof publicPostSelect }>;
export type PublicProject = Prisma.ProjectGetPayload<{ select: typeof publicProjectSelect }>;
```

- [ ] **Step 4: Apply selections to all service operations**

Use `select: safeUserSelect` in every user create/read/update operation. Use `select: publicPostSelect` and `select: publicProjectSelect` for blog/project create, read, and update operations.

Replace service return annotations based on raw `Post`/`Project` models with `PublicPost`/`PublicProject`. Delete operations return the deleted entity ID or a minimal safe object rather than an author relation.

- [ ] **Step 5: Run tests and TypeScript**

```bash
rtk jest tests/unit/data/selects.test.ts --runInBand
rtk tsc --noEmit
```

Expected: selection tests pass and TypeScript exits 0.

- [ ] **Step 6: Commit safe selections**

```bash
rtk git add features/data/selects.ts tests/unit/data/selects.test.ts lib/services/user.service.ts lib/services/blog.service.ts lib/services/project.service.ts
rtk git commit -m "fix: prevent password disclosure in data responses"
```

---

### Task 5: Validate Auth, Blog, Project, and User Inputs

**Files:**
- Create: `features/auth/schemas.ts`
- Create: `features/blog/schemas.ts`
- Create: `features/projects/schemas.ts`
- Create: `features/users/schemas.ts`
- Create: `tests/unit/validation/schemas.test.ts`
- Create: `lib/http/responses.ts`

**Interfaces:**
- Consumes: Zod 4.
- Produces: `loginSchema`, `createPostSchema`, `updatePostSchema`, `createProjectSchema`, `updateProjectSchema`, `createUserSchema`, `updateUserSchema`, `validationErrorResponse()`, `unauthorizedResponse()`.

- [ ] **Step 1: Write failing schema tests**

Create `tests/unit/validation/schemas.test.ts`:

```ts
import { loginSchema } from '@/features/auth/schemas';
import { createPostSchema } from '@/features/blog/schemas';
import { createProjectSchema } from '@/features/projects/schemas';
import { createUserSchema } from '@/features/users/schemas';

describe('request schemas', () => {
  it('normalizes login email', () => {
    expect(loginSchema.parse({ email: ' ADMIN@EXAMPLE.COM ', password: 'secret12' })).toEqual({
      email: 'admin@example.com',
      password: 'secret12',
    });
  });

  it('rejects unsafe or empty post input', () => {
    expect(() => createPostSchema.parse({ title: '', slug: '../bad' })).toThrow();
  });

  it('accepts a complete project', () => {
    expect(createProjectSchema.parse({
      title: 'Portfolio',
      slug: 'portfolio',
      description: 'Case study',
      authorId: 1,
      images: ['https://example.com/image.webp'],
      links: ['https://github.com/example/repo'],
    }).slug).toBe('portfolio');
  });

  it('requires a strong enough user password', () => {
    expect(() => createUserSchema.parse({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'short',
    })).toThrow();
  });
});
```

- [ ] **Step 2: Run the test and confirm missing modules**

```bash
rtk jest tests/unit/validation/schemas.test.ts --runInBand
```

Expected: FAIL because the schema modules do not exist.

- [ ] **Step 3: Implement shared schema fragments**

Use this slug and SEO definition in blog/project schema modules:

```ts
import { z } from 'zod';

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const seoSchema = z.object({
  metaTitle: z.string().trim().min(1).max(70),
  metaDescription: z.string().trim().min(1).max(170),
  keywords: z.array(z.string().trim().min(1)).max(20),
  canonicalUrl: z.string().url().optional(),
});
```

Implement:

```ts
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(128),
});

export const createPostSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: slugSchema,
  content: z.string().min(1),
  excerpt: z.string().trim().max(320).optional(),
  featuredImage: z.string().url().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  authorId: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive().optional(),
  seo: seoSchema.optional(),
});

export const updatePostSchema = createPostSchema
  .omit({ authorId: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const createProjectSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: slugSchema,
  description: z.string().trim().min(1).max(10_000),
  images: z.array(z.string().url()).max(20).default([]),
  links: z.array(z.string().url()).max(10).default([]),
  authorId: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive().optional(),
  seo: seoSchema.optional(),
});

export const updateProjectSchema = createProjectSchema
  .omit({ authorId: true })
  .partial()
  .extend({ id: z.coerce.number().int().positive() })
  .refine((value) => Object.keys(value).length > 1, 'At least one field is required');

export const createUserSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(12).max(128),
});

export const updateUserSchema = createUserSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required');
```

Export the shared `slugSchema` and `seoSchema` from `features/blog/schemas.ts`, then import them into `features/projects/schemas.ts` so there is one implementation.

- [ ] **Step 4: Implement standard HTTP error responses**

Create `lib/http/responses.ts`:

```ts
import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function validationErrorResponse(error: ZodError) {
  return NextResponse.json(
    {
      error: 'Invalid request',
      fields: error.flatten().fieldErrors,
    },
    { status: 400 },
  );
}
```

- [ ] **Step 5: Run schema tests and TypeScript**

```bash
rtk jest tests/unit/validation/schemas.test.ts --runInBand
rtk tsc --noEmit
```

Expected: schema tests pass and TypeScript exits 0.

- [ ] **Step 6: Commit validation boundaries**

```bash
rtk git add features/auth/schemas.ts features/blog/schemas.ts features/projects/schemas.ts features/users/schemas.ts tests/unit/validation/schemas.test.ts lib/http/responses.ts
rtk git commit -m "feat: validate admin request payloads"
```

---

### Task 6: Protect and Correct API Routes

**Files:**
- Modify: `app/api/auth/login/route.ts`
- Modify: `app/api/users/route.ts`
- Modify: `app/api/users/[id]/route.ts`
- Modify: `app/api/blogs/route.ts`
- Modify: `app/api/blogs/[slug]/route.ts`
- Modify: `app/api/projects/route.ts`
- Create: `tests/integration/api/anonymous-mutations.test.ts`

**Interfaces:**
- Consumes: `requireAdmin()`, request schemas, service methods, standard error responses.
- Produces: Protected, validated route handlers; blog mutations live in the dynamic route.

- [ ] **Step 1: Write failing anonymous-access tests**

Create `tests/integration/api/anonymous-mutations.test.ts`:

```ts
import { POST as createProject, PUT as updateProject, DELETE as deleteProject } from '@/app/api/projects/route';
import { POST as createPost } from '@/app/api/blogs/route';
import { PUT as updatePost, DELETE as deletePost } from '@/app/api/blogs/[slug]/route';

describe('anonymous admin mutations', () => {
  it.each([
    ['create project', () => createProject(new Request('http://localhost/api/projects', { method: 'POST', body: '{}' }) as never)],
    ['update project', () => updateProject(new Request('http://localhost/api/projects', { method: 'PUT', body: '{}' }) as never)],
    ['delete project', () => deleteProject(new Request('http://localhost/api/projects?id=1', { method: 'DELETE' }) as never)],
    ['create post', () => createPost(new Request('http://localhost/api/blogs', { method: 'POST', body: '{}' }))],
    ['update post', () => updatePost(new Request('http://localhost/api/blogs/example', { method: 'PUT', body: '{}' }), { params: { slug: 'example' } })],
    ['delete post', () => deletePost(new Request('http://localhost/api/blogs/example', { method: 'DELETE' }), { params: { slug: 'example' } })],
  ])('returns 401 for %s', async (_name, invoke) => {
    const response = await invoke();
    expect(response.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run the test and confirm current failures**

```bash
rtk jest tests/integration/api/anonymous-mutations.test.ts --runInBand
```

Expected: at least project and blog cases do not return 401; collection blog POST may be missing.

- [ ] **Step 3: Apply one handler pattern to every admin operation**

At the start of each admin read/mutation handler, before `request.json()`:

```ts
try {
  await requireAdmin();
} catch {
  return unauthorizedResponse();
}
```

Then validate parsed input:

```ts
const parsed = createProjectSchema.safeParse(await request.json());
if (!parsed.success) return validationErrorResponse(parsed.error);
```

Pass only `parsed.data` to the service.

Apply these rules:

- `POST /api/users`, `GET /api/users`, and every `/api/users/[id]` handler require admin.
- `POST /api/blogs` creates a post and requires admin.
- `PUT` and `DELETE` are removed from `app/api/blogs/route.ts` and implemented in `app/api/blogs/[slug]/route.ts`.
- `POST`, `PUT`, and `DELETE /api/projects` require admin.
- `GET /api/blogs`, `GET /api/blogs/[slug]`, and `GET /api/projects` remain public.
- Authentication occurs before parsing JSON so anonymous callers cannot exercise validators or database calls.

- [ ] **Step 4: Validate login requests**

Use `loginSchema.safeParse()` in `app/api/auth/login/route.ts` before querying Prisma. Return `validationErrorResponse()` for invalid email/password shapes while preserving the same generic `Invalid credentials` response for lookup or bcrypt failures.

- [ ] **Step 5: Run focused route tests**

```bash
rtk jest tests/integration/api/anonymous-mutations.test.ts --runInBand
rtk tsc --noEmit
```

Expected: all anonymous mutation cases return 401 and TypeScript exits 0.

- [ ] **Step 6: Commit protected routes**

```bash
rtk git add app/api/auth/login/route.ts app/api/users/route.ts 'app/api/users/[id]/route.ts' app/api/blogs/route.ts 'app/api/blogs/[slug]/route.ts' app/api/projects/route.ts tests/integration/api/anonymous-mutations.test.ts
rtk git commit -m "fix: protect and validate admin api routes"
```

---

### Task 7: Enforce Published Visibility and Sanitized Content

**Files:**
- Modify: `lib/services/blog.service.ts`
- Create: `tests/unit/services/blog.service.test.ts`

**Interfaces:**
- Consumes: `publicPostSelect`, `sanitizeBlogHtml()`.
- Produces: `getAllPosts({ includeDrafts? })`, `getPostBySlug(slug, { includeDrafts? })`, sanitized create/update/read results.

- [ ] **Step 1: Write failing blog-service tests**

Create `tests/unit/services/blog.service.test.ts`:

```ts
jest.mock('@/lib/prisma/prisma', () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma/prisma';
import { blogService } from '@/lib/services/blog.service';

const findMany = jest.mocked(prisma.post.findMany);
const create = jest.mocked(prisma.post.create);

describe('BlogService public safety', () => {
  beforeEach(() => jest.clearAllMocks());

  it('filters public lists to published posts', async () => {
    findMany.mockResolvedValue([]);

    await blogService.getAllPosts();

    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { status: 'published' },
    }));
  });

  it('allows authenticated admin callers to request drafts', async () => {
    findMany.mockResolvedValue([]);

    await blogService.getAllPosts({ includeDrafts: true });

    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: undefined,
    }));
  });

  it('sanitizes HTML before creating a post', async () => {
    create.mockResolvedValue({ id: 1 } as never);

    await blogService.createPost({
      title: 'Safe',
      slug: 'safe',
      content: '<p>Text</p><script>alert(1)</script>',
      authorId: 1,
    });

    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ content: '<p>Text</p>' }),
    }));
  });
});
```

- [ ] **Step 2: Run the test and confirm behavior failures**

```bash
rtk jest tests/unit/services/blog.service.test.ts --runInBand
```

Expected: FAIL because public queries do not filter status, `includeDrafts` is unsupported, and writes do not sanitize content.

- [ ] **Step 3: Implement public/admin visibility**

Use this options type and query behavior:

```ts
type BlogReadOptions = {
  includeDrafts?: boolean;
};

async getAllPosts(options: BlogReadOptions = {}) {
  const posts = await prisma.post.findMany({
    where: options.includeDrafts ? undefined : { status: 'published' },
    select: publicPostSelect,
    orderBy: { createdAt: 'desc' },
  });

  return posts.map((post) => ({
    ...post,
    content: sanitizeBlogHtml(post.content),
  }));
}
```

Apply the same published condition to `getPostBySlug()`. Sanitize `data.content` in `createPost()` and sanitize only when `data.content !== undefined` in `updatePost()`. Sanitize returned content again for public reads during the migration window.

- [ ] **Step 4: Give the admin posts page explicit draft access**

Add an authenticated admin-read branch to `GET /api/blogs`:

```ts
const includeDrafts = new URL(request.url).searchParams.get('scope') === 'admin';
if (includeDrafts) {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }
}

const posts = await blogService.getAllPosts({ includeDrafts });
```

Update the admin posts page fetch URL to `/api/blogs?scope=admin`.

- [ ] **Step 5: Run service and security tests**

```bash
rtk jest tests/unit/services/blog.service.test.ts tests/unit/security/sanitize.test.ts tests/integration/api/anonymous-mutations.test.ts --runInBand
rtk tsc --noEmit
```

Expected: all focused tests pass and TypeScript exits 0.

- [ ] **Step 6: Commit visibility and sanitization enforcement**

```bash
rtk git add lib/services/blog.service.ts app/api/blogs/route.ts 'app/admin/dashboard/(protected)/posts/page.tsx' tests/unit/services/blog.service.test.ts
rtk git commit -m "fix: publish only sanitized blog content"
```

---

### Task 8: Rate-Limit Admin Login Attempts

**Files:**
- Create: `features/auth/rate-limit.ts`
- Create: `tests/unit/auth/rate-limit.test.ts`
- Modify: `app/api/auth/login/route.ts`

**Interfaces:**
- Consumes: Validated login email and request headers.
- Produces: `LoginRateLimiter`, `loginRateLimiter`, and HTTP `429` with `Retry-After` after five failed attempts in fifteen minutes.

- [ ] **Step 1: Write failing limiter tests**

Create `tests/unit/auth/rate-limit.test.ts`:

```ts
import { LoginRateLimiter } from '@/features/auth/rate-limit';

describe('LoginRateLimiter', () => {
  it('blocks an identity after the configured attempt limit', () => {
    const limiter = new LoginRateLimiter({ limit: 2, windowMs: 60_000 });

    expect(limiter.consume('127.0.0.1:admin@example.com', 1_000).allowed).toBe(true);
    expect(limiter.consume('127.0.0.1:admin@example.com', 2_000).allowed).toBe(true);
    expect(limiter.consume('127.0.0.1:admin@example.com', 3_000)).toEqual({
      allowed: false,
      retryAfterSeconds: 58,
    });
  });

  it('starts a new window after expiry', () => {
    const limiter = new LoginRateLimiter({ limit: 1, windowMs: 10_000 });
    limiter.consume('key', 1_000);

    expect(limiter.consume('key', 11_001).allowed).toBe(true);
  });

  it('resets attempts after a successful login', () => {
    const limiter = new LoginRateLimiter({ limit: 1, windowMs: 10_000 });
    limiter.consume('key', 1_000);
    limiter.reset('key');

    expect(limiter.consume('key', 2_000).allowed).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and confirm the missing-module failure**

```bash
rtk jest tests/unit/auth/rate-limit.test.ts --runInBand
```

Expected: FAIL because `features/auth/rate-limit.ts` does not exist.

- [ ] **Step 3: Implement the in-process limiter**

Create `features/auth/rate-limit.ts`:

```ts
type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type AttemptWindow = {
  count: number;
  startedAt: number;
};

type RateLimitResult =
  | { allowed: true; retryAfterSeconds: 0 }
  | { allowed: false; retryAfterSeconds: number };

export class LoginRateLimiter {
  private readonly attempts = new Map<string, AttemptWindow>();

  constructor(private readonly options: RateLimitOptions) {}

  consume(key: string, now = Date.now()): RateLimitResult {
    const current = this.attempts.get(key);
    if (!current || now - current.startedAt >= this.options.windowMs) {
      this.attempts.set(key, { count: 1, startedAt: now });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (current.count >= this.options.limit) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((this.options.windowMs - (now - current.startedAt)) / 1_000),
        ),
      };
    }

    current.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const loginRateLimiter = new LoginRateLimiter({
  limit: 5,
  windowMs: 15 * 60 * 1_000,
});
```

- [ ] **Step 4: Enforce the limiter in the login route**

After `loginSchema` succeeds and before the user query, create the identity key:

```ts
const forwardedFor = request.headers
  .get('x-forwarded-for')
  ?.split(',')[0]
  ?.trim();
const rateLimitKey = `${forwardedFor || 'unknown'}:${parsed.data.email}`;
const rateLimit = loginRateLimiter.consume(rateLimitKey);

if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: 'Too many login attempts' },
    {
      status: 429,
      headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
    },
  );
}
```

Call `loginRateLimiter.reset(rateLimitKey)` only after bcrypt verification succeeds. Add a server-side comment that production multi-instance deployment must replace the singleton with a shared-store implementation.

- [ ] **Step 5: Run limiter, auth, and TypeScript checks**

```bash
rtk jest tests/unit/auth/rate-limit.test.ts tests/unit/auth/token.test.ts --runInBand
rtk tsc --noEmit
```

Expected: limiter and token tests pass and TypeScript exits 0.

- [ ] **Step 6: Commit login throttling**

```bash
rtk git add features/auth/rate-limit.ts tests/unit/auth/rate-limit.test.ts app/api/auth/login/route.ts
rtk git commit -m "fix: rate limit admin login attempts"
```

---

### Task 9: Add the Phase-One Quality Command and Verify

**Files:**
- Modify: `package.json`
- Modify: `.prettierignore`
- Create: `.prettierignore` if absent
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: All preceding tasks.
- Produces: `pnpm check` as the deterministic phase-one gate.

- [ ] **Step 1: Exclude generated and workspace artifacts from formatting**

Set `.prettierignore` to:

```text
.next/
.claude/worktrees/
coverage/
lib/prisma/generated/
node_modules/
playwright-report/
test-results/
```

- [ ] **Step 2: Add deterministic scripts**

Add to `package.json`:

```json
{
  "format:check": "prettier --check features lib/auth.ts lib/env.ts lib/security lib/http lib/services app/api tests jest.config.js playwright.config.ts package.json",
  "check": "pnpm typecheck && pnpm lint && pnpm format:check && pnpm test:unit -- --runInBand && pnpm build"
}
```

- [ ] **Step 3: Correct the operational notes**

Update `CLAUDE.md` so it states:

```markdown
- `pnpm test:unit` runs Jest unit and integration tests.
- `pnpm test:e2e` runs Playwright and starts the dev server automatically.
- `pnpm check` is the required local quality gate.
- `JWT_SECRET` is required and must contain at least 32 characters.
- Public Prisma responses must use selections from `features/data/selects.ts`.
```

Remove statements claiming there is no test script, no middleware, or a duplicate dashboard route when they are no longer true.

- [ ] **Step 4: Run the complete phase-one verification**

Run:

```bash
rtk pnpm check
rtk proxy pnpm audit --prod --json | rtk proxy jq '.metadata.vulnerabilities'
rtk git diff --check
rtk git status --short
```

Expected:

- typecheck exits 0;
- lint exits 0 with no new warnings from changed files;
- formatting check exits 0 for authored files;
- all Jest tests pass;
- production build exits 0;
- audit still reports the known Next.js advisories, which are scheduled for the dependency migration plan;
- Git shows only intended task changes and any explicitly preserved unrelated user change.

- [ ] **Step 5: Commit the phase-one gate**

```bash
rtk git add package.json .prettierignore CLAUDE.md
rtk git commit -m "chore: add security foundation quality gate"
```

- [ ] **Step 6: Record handoff evidence**

In the implementation handoff, report exact command exit codes, Jest test counts, build warnings, remaining audit counts, and the next recommended plan: dependency migration before public Server Component and UI refactors.
