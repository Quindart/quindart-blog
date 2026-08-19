# Quality Gate Skills Design

**Date:** 2026-08-18  
**Scope:** Modular skills system for code quality automation — lint, test, coverage, bundle analysis, and PR creation.

## Overview

A set of independent, composable skills that automate quality checks and PR workflows. A master skill (`/quality-gate`) orchestrates them based on a config file, allowing required steps (lint, typecheck) to always run and optional steps (coverage, bundle, PR) to be skipped at runtime.

## Config Structure

**Location:** `.claude/quality-gate-config.json`

```json
{
  "required": ["lint", "typecheck"],
  "optional": ["test", "coverage", "bundle", "pr"],
  "thresholds": {
    "coverage": 80,
    "eslintWarnings": "error"
  },
  "pr": {
    "createDraft": false,
    "addLabels": ["enhancement"],
    "requestReviewers": []
  }
}
```

**Fields:**
- `required` — steps that must pass; flow stops on first failure
- `optional` — steps the user is prompted to run; can be skipped at runtime
- `thresholds.coverage` — minimum coverage percentage (default 80)
- `thresholds.eslintWarnings` — "error" treats warnings as errors; "warn" is permissive
- `pr.*` — options for PR creation (draft mode, labels, reviewers)

## Skills

### 1. Master Skill: `/quality-gate`

**Purpose:** Orchestrate the quality gate flow based on config.

**Behavior:**
- Read `.claude/quality-gate-config.json`
- Execute required steps in order; stop on first failure
- For each optional step, prompt "Run [step]? (Y/n)"
- Summarize results: "✓ 4/6 steps passed"
- Exit with non-zero if any required step fails

**Options:**
- `--skip <step>` — skip an optional step
- `--force` — continue on required step failure (for recovery)
- `--config <path>` — use alternate config file

### 2. `/lint-check`

**Purpose:** Run eslint and prettier; report violations.

**Steps:**
1. Run `rtk next lint` (eslint via Next.js)
2. Run `rtk prettier --check` to detect unformatted files
3. Group violations by file/severity
4. Report: "3 errors, 2 warnings in 2 files"

**Options:**
- `--fix` — auto-apply prettier formatting
- `--strict` — fail on warnings (respects config `eslintWarnings` setting)

**Pattern suggestions** (reported, not enforced):
- Props drilling detection: flag 3+ levels of prop-passing in a component tree
- Callback hell detection: warn on nested callbacks >2 levels deep
- Simple logic suggestion: flag complex conditional chains (recommend ternary or early return)

### 3. `/typecheck`

**Purpose:** Run TypeScript type checker.

**Steps:**
1. Run `rtk tsc --noEmit`
2. Group errors by file and error code
3. Report: "5 errors in 3 files"

**Options:**
- `--fix` — not applicable (types must be fixed manually)

### 4. `/test-and-coverage`

**Purpose:** Run Playwright tests and check coverage.

**Steps:**
1. Prompt user: "Run all tests or a subset? (all/single file/by name)"
2. Run `rtk playwright test` (or scoped command)
3. Parse coverage from test output
4. Compare against threshold (config `coverage` or default 80%)
5. Report: "12 passed, 0 failed. Coverage: 85% (✓ above 80%)"

**Options:**
- `--file <path>` — run tests for a specific file only
- `--grep <pattern>` — run tests matching a pattern
- `--threshold <num>` — override config coverage threshold

### 5. `/bundle-analyze`

**Purpose:** Analyze bundle size and tree-shaking opportunities.

**Prerequisites:** Vite configuration (optional; skill gracefully skips if not present).

**Steps:**
1. Check if Vite is configured in `package.json` or `vite.config.ts`
2. If Vite: run build analysis (via vite-plugin-visualizer or rollup-plugin-visualizer)
3. Report: "Bundle size: 125KB (gzip: 35KB). Tree-shake candidates: 5 unused exports"
4. If Vite not present: skip and report "Vite not configured; bundler analysis unavailable"

**Options:**
- `--ignore-vite` — skip bundle analysis even if Vite is present

### 6. `/create-pr`

**Purpose:** Commit changes, push, and create a pull request.

**Steps:**
1. Prompt user for commit message (single line)
2. Run `git add .` (or prompt for file selection)
3. Run `git commit -m "<message>"`
4. Run `git push -u origin <current-branch>`
5. Create PR via `gh pr create`:
   - Title: commit message (or user override)
   - Body: auto-generated with test/coverage summary
   - Draft: per config `pr.createDraft`
   - Labels: per config `pr.addLabels`
   - Reviewers: per config `pr.requestReviewers`
6. Report: PR URL

**Options:**
- `--draft` — create as draft regardless of config
- `--no-push` — commit only, don't push

## Runtime Flow

```
User invokes: /quality-gate

1. Load config from .claude/quality-gate-config.json
2. For each step in config.required:
   - Run step
   - If fails → stop, report error, exit 1
   - If passes → continue

3. For each step in config.optional:
   - Prompt "Run [step]? (Y/n)"
   - If yes → run step, report result
   - If no → skip

4. Summary report
   - "✓ 4/6 steps passed"
   - List failures (if any)
```

## Linting Rules & Patterns (Reported, Not Enforced)

The `/lint-check` skill reports patterns as **suggestions**, not hard failures. Examples:

- **Props drilling:** "components/MyComponent.tsx uses 4-level prop chain. Consider context or compound components."
- **Callback hell:** "app/api/route.ts has nested callbacks 3+ levels deep. Consider async/await or helper functions."
- **Complex conditionals:** "components/Button.tsx has nested ternaries. Consider simplifying with early return or switch."

These are advisory — the user decides whether to refactor.

## Error Handling

- **Missing config:** Create default config and prompt user to review
- **Subcommand fails:** Report the failure, offer `--force` to continue
- **PR creation fails:** Report reason (branch not pushed, GH auth missing, etc.) and suggest remedies
- **Coverage below threshold:** Fail the step; user can `--force` past it or raise threshold in config

## Testing Strategy

Each skill is tested independently:
- `lint-check.test.ts` — mock eslint/prettier outputs, verify grouping logic
- `typecheck.test.ts` — mock tsc output, verify error parsing
- `test-and-coverage.test.ts` — mock test/coverage reports, verify thresholds
- `bundle-analyze.test.ts` — mock vite output, verify graceful skip if no vite
- `create-pr.test.ts` — mock git/gh commands, verify commit/push/PR creation
- `quality-gate.test.ts` — integration test: run full flow with mock subskills

## Extensibility

- **New steps:** Add to config, write new skill file following the template
- **New thresholds:** Add to config `thresholds` object, read in relevant skill
- **Custom config:** Pass `--config <path>` to load alternate config

---

**Next:** Implementation plan via `writing-plans` skill.
