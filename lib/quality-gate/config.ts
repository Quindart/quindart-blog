import fs from "fs/promises";
import path from "path";
import { Config } from "./types";

export async function loadConfig(configPath?: string): Promise<Config> {
  const targetPath =
    configPath || path.resolve(".claude", "quality-gate-config.json");

  try {
    const content = await fs.readFile(targetPath, "utf-8");
    const parsed = JSON.parse(content);
    return validateConfig(parsed);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.log(`Config not found at ${targetPath}. Using defaults.`);
      return loadDefaultConfig();
    }
    throw new Error(
      `Failed to load config: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function loadDefaultConfig(): Promise<Config> {
  const defaultPath = path.resolve(__dirname, "default-config.json");
  const content = await fs.readFile(defaultPath, "utf-8");
  return validateConfig(JSON.parse(content));
}

export function validateConfig(config: unknown): Config {
  if (typeof config !== "object" || config === null) {
    throw new Error("Config must be a JSON object");
  }

  const c = config as Record<string, unknown>;

  if (
    !Array.isArray(c.required) ||
    !c.required.every((x) => typeof x === "string")
  ) {
    throw new Error("Config.required must be an array of strings");
  }
  if (
    !Array.isArray(c.optional) ||
    !c.optional.every((x) => typeof x === "string")
  ) {
    throw new Error("Config.optional must be an array of strings");
  }
  if (typeof c.thresholds !== "object" || c.thresholds === null) {
    throw new Error("Config.thresholds must be an object");
  }
  if (typeof c.pr !== "object" || c.pr === null) {
    throw new Error("Config.pr must be an object");
  }

  return c as unknown as Config;
}
