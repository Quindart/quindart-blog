# Quality Gate System

The quality-gate system is a modular, config-driven automation tool for code quality checks and PR creation.

## Quick Start

```bash
pnpm quality-gate           # Full workflow
pnpm quality-gate:quick     # Lint, typecheck, test (no bundle/PR)
pnpm quality-gate:lint      # Lint and typecheck only
```

## Configuration

Edit `.claude/quality-gate-config.json`:

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
    "addLabels": [],
    "requestReviewers": []
  }
}
```

## Skills

- **lint** — Run eslint and prettier
- **typecheck** — Run TypeScript type check
- **test** — Run Playwright tests
- **coverage** — Enforce coverage threshold
- **bundle** — Analyze bundle size (Vite only)
- **pr** — Create pull request

## Options

- `--force` — Continue on required step failure
- `--skip <step>` — Skip an optional step
- `--config <path>` — Use custom config file

## Examples

```bash
# Run all quality gates
pnpm quality-gate

# Skip bundle analysis
pnpm quality-gate --skip=bundle

# Continue even if tests fail
pnpm quality-gate --force

# Run only lint and typecheck
pnpm quality-gate:lint
```

## Architecture

The quality-gate system is organized as:

- **Config**: `lib/quality-gate/config.ts` — Load and validate configuration
- **Types**: `lib/quality-gate/types.ts` — TypeScript interfaces
- **Skills**: `lib/quality-gate/commands/*.ts` — Individual quality check modules
- **Orchestrator**: `lib/quality-gate/orchestrator.ts` — Coordinates skill execution
- **CLI**: `scripts/quality-gate.ts` — Command-line entry point

Each skill exports an async `run(options)` function that returns a `SkillResult` with success status, message, and optional details.

## Development

To add a new skill:

1. Create `lib/quality-gate/commands/my-skill.ts` with a `run()` function
2. Import and register it in `lib/quality-gate/orchestrator.ts`
3. Add it to the config `required` or `optional` array

To test:

```bash
pnpm quality-gate --skip=bundle --skip=pr
```
