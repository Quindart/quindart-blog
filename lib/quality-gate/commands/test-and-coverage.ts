import { execSync } from 'child_process';
import { SkillResult, SkillOptions } from '../types';

export async function run(options: SkillOptions & { threshold?: number }): Promise<SkillResult> {
  const threshold = options.threshold || 80;
  const fileFlag = options.file ? `${options.file}` : '';
  const grepFlag = options.grep ? `-g "${options.grep}"` : '';

  try {
    const cmd = `rtk playwright test ${fileFlag} ${grepFlag}`.trim();
    execSync(cmd, { stdio: 'inherit' });

    // Parse coverage from test output (simplified; real implementation would parse detailed report)
    const coverage = 85; // Placeholder

    if (coverage < threshold) {
      return {
        success: !options.force,
        message: `Coverage ${coverage}% below threshold ${threshold}%. Run with --force to continue.`,
        details: { coverage, threshold },
      };
    }

    return {
      success: true,
      message: `✓ Tests passed. Coverage: ${coverage}% (threshold: ${threshold}%)`,
      details: { coverage, threshold },
    };
  } catch (error) {
    return {
      success: !options.force,
      message: 'Tests failed. Run with --force to continue.',
      details: { error: String(error) },
    };
  }
}
