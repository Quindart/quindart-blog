import { execSync } from "child_process";
import { SkillResult, SkillOptions } from "../types";

export async function run(
  options: SkillOptions & { message?: string },
): Promise<SkillResult> {
  const message = options.message || "chore: quality gate commit";

  try {
    // Stage all changes
    execSync("rtk git add .", { stdio: "inherit" });

    // Commit
    execSync(`rtk git commit -m "${message}"`, { stdio: "inherit" });

    // Push (unless --no-push)
    if (!options.noPush) {
      execSync("rtk git push -u origin HEAD", { stdio: "inherit" });
    }

    // Create PR (unless --no-push, since we need a remote branch)
    if (!options.noPush) {
      const draftFlag = options.draft ? "--draft" : "";
      const output = execSync(
        `gh pr create ${draftFlag} --title "${message}"`,
        {
          encoding: "utf-8",
        },
      );

      const prUrl = output.trim();
      return {
        success: true,
        message: `✓ PR created: ${prUrl}`,
        details: { prUrl },
      };
    }

    return {
      success: true,
      message: "Changes committed. Use --no-push=false to create PR.",
      details: {},
    };
  } catch (error) {
    return {
      success: !options.force,
      message: `PR creation failed: ${String(error)}`,
      details: { error: String(error) },
    };
  }
}
