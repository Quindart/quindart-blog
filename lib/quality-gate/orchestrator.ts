import { Config, SkillModule, SkillResult } from './types';
import * as lintCheck from './commands/lint-check';
import * as typecheck from './commands/typecheck';
import * as testAndCoverage from './commands/test-and-coverage';
import * as bundleAnalyze from './commands/bundle-analyze';
import * as createPr from './commands/create-pr';

const SKILLS: Record<string, SkillModule> = {
  lint: lintCheck,
  typecheck: typecheck,
  test: testAndCoverage,
  coverage: testAndCoverage,
  bundle: bundleAnalyze,
  pr: createPr,
};

export interface OrchestratorOptions {
  force?: boolean;
  skip?: string;
  [key: string]: unknown;
}

export interface OrchestratorResult {
  passed: string[];
  failed: string[];
  skipped: string[];
  exitCode: number;
}

export async function orchestrate(
  config: Config,
  options: OrchestratorOptions = {}
): Promise<OrchestratorResult> {
  const results: OrchestratorResult = {
    passed: [],
    failed: [],
    skipped: [],
    exitCode: 0,
  };

  // Execute required steps
  for (const step of config.required) {
    const skill = SKILLS[step];
    if (!skill) {
      console.error(`Unknown skill: ${step}`);
      results.failed.push(step);
      results.exitCode = 1;
      if (!options.force) break;
      continue;
    }

    console.log(`\n→ Running ${step}...`);
    const result = await skill.run({ ...options, force: options.force });

    if (result.success) {
      console.log(`✓ ${result.message}`);
      results.passed.push(step);
    } else {
      console.error(`✗ ${result.message}`);
      results.failed.push(step);
      results.exitCode = 1;
      if (!options.force) break;
    }
  }

  // Prompt for optional steps
  for (const step of config.optional) {
    if (options.skip === step) {
      results.skipped.push(step);
      continue;
    }

    // In real implementation, prompt interactively
    console.log(`\nRun optional step: ${step}? (Y/n)`);
    // For testing, skip optional steps
    results.skipped.push(step);
  }

  return results;
}
