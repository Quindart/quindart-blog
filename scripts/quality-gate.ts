import { loadConfig } from '../lib/quality-gate/config';
import { orchestrate } from '../lib/quality-gate/orchestrator';

async function main() {
  const args = process.argv.slice(2);
  const configPath = args.find((a) => a.startsWith('--config='))?.split('=')[1];

  try {
    const config = await loadConfig(configPath);
    const options = {
      force: args.includes('--force'),
      skip: args.find((a) => a.startsWith('--skip='))?.split('=')[1],
    };

    const result = await orchestrate(config, options);

    console.log(`\n${'='.repeat(50)}`);
    console.log(
      `Summary: ${result.passed.length} passed, ${result.failed.length} failed, ${result.skipped.length} skipped`
    );
    console.log(`${'='.repeat(50)}\n`);

    process.exit(result.exitCode);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(2);
  }
}

main();
