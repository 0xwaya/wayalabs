import { migrateState } from "./orchestrator";
import type { OrchestratorState } from "./types";

export const STORAGE_KEY = "wayalabs-ai-factory-v2";

export function loadPersistedState(): OrchestratorState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return migrateState(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function savePersistedState(state: OrchestratorState) {
  if (typeof window === "undefined") return;
  try {
    const { logs, ...rest } = state;
    // Cap logs in storage to keep writes cheap.
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...rest, logs: logs.slice(0, 40) }),
    );
  } catch {
    // Quota / private mode — ignore.
  }
}

export function clearPersistedState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
