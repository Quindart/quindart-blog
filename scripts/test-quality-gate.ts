import { loadConfig } from "../lib/quality-gate/config";
import { orchestrate } from "../lib/quality-gate/orchestrator";

async function runIntegrationTest() {
  console.log("Starting quality-gate integration test...\n");

  try {
    // Test 1: Load config
    console.log("Test 1: Loading config...");
    const config = await loadConfig();
    console.log("✓ Config loaded successfully\n");

    // Test 2: Run orchestrator with minimal config
    console.log("Test 2: Running orchestrator (typecheck only)...");
    const testConfig = {
      required: ["typecheck"],
      optional: [],
      thresholds: { coverage: 80, eslintWarnings: "error" as const },
      pr: { createDraft: false, addLabels: [], requestReviewers: [] },
    };

    const result = await orchestrate(testConfig, {});
    console.log("✓ Orchestrator ran successfully\n");

    // Test 3: Verify result structure
    console.log("Test 3: Verifying result structure...");
    if (
      !("passed" in result) ||
      !("failed" in result) ||
      !("exitCode" in result)
    ) {
      throw new Error("Result structure invalid");
    }
    console.log("✓ Result structure valid\n");

    // Test 4: Print summary
    console.log("Test 4: Integration test summary...");
    console.log(`Passed: ${result.passed.length}`);
    console.log(`Failed: ${result.failed.length}`);
    console.log(`Exit code: ${result.exitCode}`);
    console.log("✓ All integration tests passed\n");

    process.exit(0);
  } catch (error) {
    console.error("Integration test failed:", error);
    process.exit(1);
  }
}

runIntegrationTest();
