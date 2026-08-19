import { execSync } from "child_process";
import { SkillResult, SkillOptions } from "../types";

export async function run(options: SkillOptions): Promise<SkillResult> {
  try {
    execSync("rtk tsc --noEmit", { stdio: "inherit" });

    return {
      success: true,
      message: "✓ Typecheck passed",
      details: { typescript: "no errors" },
    };
  } catch (error) {
    const shouldFail = !options.force;
    return {
      success: !shouldFail,
      message: "Type errors found. Run with --force to continue.",
      details: { error: String(error) },
    };
  }
}
