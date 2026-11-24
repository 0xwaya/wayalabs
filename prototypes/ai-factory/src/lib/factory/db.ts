import { neon } from "@neondatabase/serverless";
import type { FactoryMode } from "./types-live";

export function factoryMode(env: NodeJS.ProcessEnv = process.env): FactoryMode {
  const raw = (env.FACTORY_MODE ?? "sandbox").trim().toLowerCase();
  if (raw === "shadow" || raw === "live") return raw;
  return "sandbox";
}

export function databaseUrl(env: NodeJS.ProcessEnv = process.env): string | null {
  const url = env.DATABASE_URL?.trim() ?? "";
  return url.length > 0 ? url : null;
}

export type FactorySql = (
  strings: TemplateStringsArray,
  ...params: unknown[]
) => Promise<Record<string, unknown>[]>;

export function createFactorySql(
  env: NodeJS.ProcessEnv = process.env,
): FactorySql | null {
  const url = databaseUrl(env);
  if (!url) return null;
  return neon(url) as FactorySql;
}
