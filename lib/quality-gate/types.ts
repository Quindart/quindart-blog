export interface Config {
  required: string[];
  optional: string[];
  thresholds: {
    coverage: number;
    eslintWarnings: "error" | "warn";
  };
  pr: {
    createDraft: boolean;
    addLabels: string[];
    requestReviewers: string[];
  };
}

export interface SkillResult {
  success: boolean;
  message: string;
  details?: {
    [key: string]: unknown;
  };
}

export interface SkillOptions {
  force?: boolean;
  [key: string]: unknown;
}

export interface SkillModule {
  run: (options: SkillOptions) => Promise<SkillResult>;
}

export type SkillName =
  "lint" | "typecheck" | "test" | "coverage" | "bundle" | "pr";
