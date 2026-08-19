# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is pnpm (pinned to `pnpm@8.10.0` via `packageManager`).

```bash
pnpm dev                 # dev server on :3000
pnpm build               # prisma generate && next build
pnpm lint                # next lint (currently passes with warnings)
pnpm typecheck           # tsc --noEmit
pnpm format              # prettier . --write
```

Database (Prisma schema lives at `lib/prisma/schema.prisma`, wired via the `prisma.schema` key in `package.json`, so no `--schema` flag is needed):

```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev --name <name>
node scripts/seed-test-user.js    # upserts test@admin.local / TestPass123!
```

`package.json` declares `prisma.seed = tsx prisma/seed.ts`, but that file does not exist — `pnpm exec prisma db seed` will fail. Use the script above. `lib/prisma/fake.ts` is entirely commented-out sample seed data, not runnable.

E2E tests (Playwright, `tests/`):

```bash
pnpm exec playwright test                          # all
pnpm exec playwright test tests/admin.spec.ts      # one file
pnpm exec playwright test -g "login"               # one test by name
```

`playwright.config.ts` has **no `webServer`** — start `pnpm dev` yourself first, and seed the test user, or the suite fails on setup. There is no `test` script in `package.json` and no unit-test runner.

## Architecture

Next.js 14 App Router portfolio/blog. Everything is in-process: no separate backend.

**Data flow:** client component → hook (`hooks/useBlog.ts`, `hooks/useProject.ts`) → `fetch('/api/...')` → route handler in `app/api/**` → service in `lib/services/*.service.ts` → `prisma` singleton (`lib/prisma/prisma.ts`). Pages are almost all `"use client"` and fetch through the hooks rather than querying Prisma directly; route handlers are the only server-side data access point. Services own all Prisma queries and always `include: { seo, author, category }`.

**Prisma generated client is non-standard and committed to git** at `lib/prisma/generated` (`output` override in the schema, with `debian-openssl-3.0.x` binary target for deploy). Import types from `@/lib/prisma/generated`, not `@prisma/client`. Regenerating produces large diffs in tracked files — expected, not accidental.

**Models** (`lib/prisma/schema.prisma`): `User`, `Category`, `Post`, `Project`, `SEO`. `SEO` is a shared one-to-one satellite pointed at either a `Post` or a `Project`. `Post.content` and `Project.description` hold raw HTML/markdown and are rendered with `dangerouslySetInnerHTML` (see `app/blog/[slug]/page.tsx`). `Post.status` is a plain string (`"draft"` default, `"published"` used in practice) — no enum, and public read paths do not filter on it.

**Auth is hand-rolled JWT**, not NextAuth/Clerk:
- `POST /api/auth/login` verifies bcrypt (cost 12) and sets an HttpOnly `token` cookie signed with `process.env.JWT_SECRET` (falls back to `'dev-secret'` — set it in any real environment).
- There is **no `middleware.ts`**. The only server-side guard is `app/admin/dashboard/(protected)/layout.tsx`, which reads the cookie and `jwt.verify`s it.
- `lib/auth.ts` exports `requireAuth()` (throws `'Unauthorized'`) for route handlers, but only `POST /api/users` calls it. `GET /api/users` returns every user row (including password hashes) and all blog/project mutation endpoints are unauthenticated.

**Duplicate `/admin/dashboard` route:** both `app/admin/dashboard/page.tsx` and `app/admin/dashboard/(protected)/page.tsx` resolve to `/admin/dashboard` with identical content. The build resolves to the non-grouped one — it prerenders as static, so the `(protected)` auth guard does **not** apply to `/admin/dashboard` itself, only to `/posts`, `/projects`, `/users` beneath it. Deleting the ungrouped `page.tsx` (and its `layout.tsx`, whose sidebar/header the protected layout imports but never renders) is the fix if you touch this area.

**Styling:** Tailwind with a shadcn-style HSL CSS-variable theme in `styles/globals.css` (imported by `app/layout.tsx`, *not* `app/globals.css` as `components.json` claims), plus `flowbite-react` (`ThemeModeScript` in the root layout, `flowbite.plugin()` in `tailwind.config.ts`). The Tailwind `theme.screens`/`spacing`/`fontFamily` keys are **overridden, not extended** — arbitrary spacing steps outside the listed scale won't exist. Compose classes with `cn()` from `lib/utils.ts`; the ESLint Tailwind plugin also lints classes inside `twMerge(...)` and `createTheme(...)`.

**Layout structure:** `app/layout.tsx` wraps every route — including `/admin` — with the public `Header`/`Footer`/`MainBottomNavigation`. Components are grouped as `components/ui` (primitives), `components/shared` (chrome), `components/containers/<page>/<section>` (page sections), `components/admin`. Static copy (nav items, résumé/experience content) lives in `constants/`.

## Conventions and existing rough edges

- Path alias `@/*` → repo root.
- Prettier is 2-space (`.prettierrc`), but `lib/services/**` and `app/api/**` were written with 4-space indent and are unformatted. Running `pnpm format` across the repo would reindent them — scope formatting to files you actually change.
- Comments and user-facing API error strings are mixed English/Vietnamese (`app/api/projects/route.ts` returns Vietnamese messages). Match the surrounding file.
- `app/api/blogs/route.ts` exports `PUT`/`DELETE` that read `params.slug`, but it is the collection route with no dynamic segment — those handlers are dead code. `app/api/blogs/[slug]/route.ts` only implements `GET`, so posts have no working write API.
- `app/admin/login/page.tsx` redirects to `/dashboard/login`, which does not exist (should be `/admin/dashboard/login`). `GET /api/auth/logout` calls `NextResponse.redirect` with a relative URL, which Next rejects at runtime.
- `app/blog/page.tsx` is a placeholder stub; the blog list actually renders on `/` via `app/page.tsx`.
- `types/Blog.ts` and `types/Project.ts` hand-mirror the Prisma models (with `createdAt` as `string`, matching JSON responses). Keep them in sync when the schema changes.
- `.ai/clerk.prompt.md` is an unapplied plan to migrate to Clerk auth — the codebase does not use Clerk today.
- `.env` is gitignored and holds `DATABASE_URL` only; `JWT_SECRET` is currently unset (hence the `'dev-secret'` fallback).

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
rtk uv run <cmd>        # Compact uv project command output
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->