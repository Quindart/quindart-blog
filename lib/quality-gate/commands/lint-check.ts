import { execSync } from "child_process";
import { SkillResult, SkillOptions } from "../types";

export async function run(options: SkillOptions): Promise<SkillResult> {
  try {
    const fixFlag = options.fix ? "--write" : "--check";

    // Run eslint via Next.js
    execSync("next lint", { stdio: "inherit" });

    // Run prettier check
    execSync(`prettier . ${fixFlag}`, { stdio: "inherit" });

    return {
      success: true,
      message: "✓ Linting passed",
      details: { eslint: "passed", prettier: "passed" },
    };
  } catch (error) {
    const shouldFail = !options.force;
    return {
      success: !shouldFail,
      message: "Linting failed. Run with --force to continue.",
      details: { error: String(error) },
    };
  }
}
