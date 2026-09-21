# Portfolio Balanced Refactor Design

**Date:** 2026-09-18  
**Status:** Proposed for implementation  
**Scope:** Security, API boundaries, public rendering, portfolio UX, tests, CI, and agent instructions.

## Objective

Turn the current Next.js portfolio/blog into a production-safe portfolio that presents projects as case studies, renders public content with strong SEO, and has a small but reliable admin surface.

The refactor keeps Next.js, React, Prisma, PostgreSQL, Tailwind CSS, and the current content models. It avoids a rewrite and preserves existing URLs where they are useful.

## Success Criteria

- No public or admin response exposes password hashes.
- Every data mutation requires a valid admin session.
- `JWT_SECRET` is mandatory outside tests; the application cannot silently use a default secret.
- Public blog content is sanitized and only published posts are visible.
- Public blog and project pages render their initial data on the server.
- `/blog` is a real index page and every navigation control has a valid destination.
- Blog and project detail pages publish dynamic metadata, canonical URLs, and Open Graph data.
- Unit/integration tests and Playwright tests are discovered by separate runners.
- Typecheck, lint, unit tests, and build run in CI.
- Repository instructions live in a root `AGENTS.md`; tool-specific instruction files refer to it instead of duplicating architecture guidance.

## Non-goals

- Replacing PostgreSQL or Prisma.
- Introducing a separate backend service.
- Migrating to a hosted CMS.
- Building public accounts, comments, reactions, analytics dashboards, or social features.
- Adding multiple permanent coding agents.
- Redesigning every visual component before the security and data layers are stable.

## Current Risks Addressed

1. Public user, blog, and project responses serialize full Prisma `User` records, including password hashes.
2. Project mutations and blog mutation handlers lack authorization.
3. Authentication falls back to a predictable `dev-secret`.
4. Blog HTML is inserted into the DOM without sanitization.
5. The public data path is client component -> hook -> API -> service -> Prisma, causing loading flashes, duplicate fetches, and weak metadata support.
6. Jest discovers Playwright tests and files inside a committed Claude worktree gitlink.
7. Navigation includes out-of-range array access and placeholder controls.
8. Next.js 14.1.3 has known security advisories and the build reports stale configuration.

## Target Architecture

```text
app/
├── (public)/
│   ├── page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   └── about/page.tsx
├── (admin)/
│   └── admin/
│       ├── login/page.tsx
│       └── dashboard/
└── api/
    ├── auth/
    ├── posts/
    └── projects/

features/
├── auth/
│   ├── session.ts
│   ├── schemas.ts
│   └── service.ts
├── blog/
│   ├── repository.ts
│   ├── service.ts
│   ├── schemas.ts
│   ├── dto.ts
│   └── components/
└── projects/
    ├── repository.ts
    ├── service.ts
    ├── schemas.ts
    ├── dto.ts
    └── components/

lib/
├── db/client.ts
├── env.ts
└── security/sanitize.ts
```

The migration may preserve existing physical paths during early phases. The domain boundaries and contracts matter more than moving every file immediately.

## Domain Boundaries

### Repository

Repositories are the only modules that call Prisma. Public repository methods use explicit `select` objects and never return password fields.

Representative operations:

- `listPublishedPosts()`
- `getPublishedPostBySlug(slug)`
- `listPublicProjects()`
- `getPublicProjectBySlug(slug)`
- `listAdminPosts()`
- `createProject(input)`
- `updateProject(id, input)`
- `deleteProject(id)`

### Service

Services enforce application rules:

- published visibility;
- slug normalization and uniqueness errors;
- HTML sanitization;
- mapping database records to public/admin DTOs;
- translating expected Prisma errors into domain errors.

### Transport

Route handlers are thin adapters. They authenticate when required, validate input, call one service operation, and convert domain errors to HTTP responses.

Public Server Components call read-only services directly instead of making HTTP requests back into the same application.

## Public and Admin DTOs

Prisma model types do not cross the transport boundary.

```ts
type PublicAuthor = {
  id: number;
  name: string;
};

type PublicPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  createdAt: string;
  author: PublicAuthor;
  category: PublicCategory | null;
  seo: PublicSeo | null;
};
```

Admin DTOs may include draft state and internal IDs but never include passwords. User management responses expose only `id`, `name`, `email`, and timestamps.

## Authentication and Authorization

- `JWT_SECRET` is parsed through centralized environment validation and must be at least 32 characters.
- Login continues to use bcrypt and an HttpOnly, `sameSite=lax`, production-secure cookie.
- Session verification lives in `features/auth/session.ts`.
- `requireAdmin()` returns a typed session or throws a typed unauthorized error.
- Every POST, PUT/PATCH, and DELETE route calls `requireAdmin()` before reading or applying request data.
- Protected admin layouts also call the same session verifier.
- Logout clears the cookie with the same path and security attributes used at login.
- Login rate limiting is implemented behind a small interface. The first implementation can use an in-process limiter for local/single-instance deployment; multi-instance deployment must configure a shared provider before release.

Middleware remains responsible only for routing concerns unless a later phase establishes a concrete need for edge authorization.

## Validation and Error Handling

Zod schemas validate login, post, project, and user mutations.

HTTP mapping:

- invalid JSON or schema failure: `400` with field-safe validation details;
- missing/invalid session: `401`;
- authenticated but unauthorized: `403`;
- missing entity: `404`;
- slug/email conflict: `409`;
- unexpected failure: `500` with a generic client message and server-side logging.

Route handlers must not return raw Prisma errors or echo secrets.

## Content Safety

- Blog HTML is sanitized on write with an allowlist for headings, paragraphs, lists, links, images, code blocks, and safe attributes.
- Existing records are sanitized again on read during the migration window.
- Links receive safe protocol validation; external links receive `rel="noopener noreferrer"` where relevant.
- Project descriptions remain plain text unless the schema explicitly adopts sanitized rich text.

## Public Rendering and Caching

- Home, blog index, blog detail, project index, and project detail are Server Components.
- Client components are limited to interaction such as filtering, search input, animation, and mobile navigation.
- Public reads use Next.js revalidation or cache tags.
- Admin mutations invalidate the relevant blog/project tags after success.
- Client hooks no longer perform the initial public page load.

This removes duplicate fetches and allows metadata generation to use the same service methods as page rendering.

## Portfolio Information Architecture

### Home

1. Hero with role, specialization, location/availability, and contact/project calls to action.
2. Three featured project case studies.
3. Short experience timeline.
4. Focused technical strengths.
5. Selected writing or community work.
6. Contact call to action.

### Projects

The index shows meaningful actions only: project detail, source repository when public, and live demo when available. Decorative heart/share/view buttons are removed.

Each project detail includes problem, role, constraints, architecture, notable decisions, outcome, screenshots, stack, and verified links.

### Blog

`/blog` becomes a complete index with optional text/category filtering. Blog detail uses real author and publication data rather than hard-coded values.

### Community

Community remains available at `/community` but is removed from primary navigation until its invitation link and activity claims are verified and maintained.

## SEO and Accessibility

- Root metadata defines a title template and correct Vietnamese/English site description.
- Blog/project details implement `generateMetadata()` using domain services.
- Add Open Graph images, canonical URLs, `sitemap.ts`, and `robots.ts`.
- Set the document language to the primary content language or add a deliberate locale strategy.
- Use `next/link` for internal navigation.
- Navigation is generated from typed configuration, with no numeric array indexing.
- Interactive icon buttons have accessible names and working actions.
- Animations respect `prefers-reduced-motion`.
- Images use descriptive alt text and `priority` only above the fold.

## Test Strategy

```text
tests/
├── unit/
├── integration/
└── e2e/
```

### Unit

- DTO mapping excludes passwords.
- validation schemas accept and reject representative input;
- sanitizer removes scripts, event handlers, and unsafe protocols;
- session verification rejects missing, expired, and invalid tokens.

### Integration

- public post reads exclude drafts;
- public responses exclude password fields;
- every mutation rejects anonymous requests;
- authenticated project/post mutations return expected status codes;
- conflicts and not-found cases map correctly.

### E2E

- Playwright owns `tests/e2e` only and starts the application through `webServer`.
- A deterministic test admin and isolated test database are prepared before the suite.
- Cover login, protected navigation, one project mutation, public project display, and logout.

Jest ignores `.claude`, `.next`, generated Prisma files, and Playwright tests. Coverage applies to authored domain and route code only.

## Dependency and Build Migration

1. Establish passing tests around the current behavior first.
2. Upgrade Next.js and its ESLint config to a supported patched release using the official migration path.
3. Update stale Next configuration and verify image host restrictions.
4. Move Prisma configuration out of the deprecated `package.json#prisma` field.
5. Pin compatible Prisma CLI/client versions, generate the client during install/build, and remove generated output from version control.

Generated output is excluded from formatting, linting, tests, and source review. CI verifies that `prisma generate` succeeds from a clean checkout.

## Repository and Agent Setup

- Add root `AGENTS.md` with commands, architecture boundaries, security invariants, generated-file policy, and definition of done.
- Keep `CLAUDE.md` as a short adapter that points to `AGENTS.md` plus Claude-specific notes.
- Remove the malformed committed `.claude/worktrees/quality-gate-impl` gitlink after confirming no unique work needs preservation.
- Replace the current quality-gate proposal with normal package scripts and CI; do not allow tests to commit, push, or create pull requests.
- Add `.env.example` containing names and safe descriptions only.
- Add a CI workflow for install, typecheck, lint, unit/integration tests, and build. E2E may run in a separate job with PostgreSQL.

No permanent multi-agent topology is required. Review and security agents may be used per task once test boundaries are reliable.

## Implementation Phases

### Phase 1: Safety and deterministic checks

- Isolate Jest and Playwright discovery.
- Clean worktree/generated-file interference.
- Add environment validation and `.env.example`.
- Add public/admin selects and DTOs.
- Protect mutations and sanitize blog HTML.
- Add regression tests for the security invariants.

### Phase 2: Dependencies and domain boundaries

- Upgrade Next.js and align configuration.
- Introduce auth/blog/project domain modules.
- Make route handlers thin and normalize errors.
- Establish the Prisma generated-client policy.

### Phase 3: Server-rendered public experience

- Convert public reads to Server Components.
- Build complete blog and project index/detail pages.
- Fix typed navigation, redirects, loading, and empty/error states.
- Add dynamic metadata, sitemap, and robots.

### Phase 4: Portfolio presentation

- Restructure the home page around featured case studies and experience.
- Replace placeholder/dead controls with real actions.
- Review copy, dates, links, responsiveness, and accessibility.

### Phase 5: Automation and documentation

- Add CI and stable check scripts.
- Rewrite README.
- Add `AGENTS.md` and simplify tool-specific guidance.
- Run production build, unit/integration tests, E2E, dependency audit, and a final accessibility/performance review.

## Rollout and Compatibility

- Preserve `/`, `/blog`, `/blog/[slug]`, `/project`, and existing admin URLs during early phases.
- Use `/projects` as the canonical index and keep a permanent redirect from `/project`.
- Apply database migrations only when a schema change is necessary; the initial security work uses selects and validation without destructive migrations.
- Each phase must leave the production build runnable and should be independently reviewable.

## Definition of Done

- All success criteria are demonstrated by automated checks or a documented manual verification.
- No critical or high production dependency advisory remains without an explicit accepted exception.
- Lint produces no warnings in authored source.
- Formatting excludes generated/build/worktree artifacts and passes on authored files.
- Git status contains no agent-created artifacts.
- README and `AGENTS.md` describe the commands that actually pass.
