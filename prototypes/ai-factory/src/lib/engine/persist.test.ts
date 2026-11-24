import { afterEach, describe, expect, it, vi } from "vitest";
import { createSeedState } from "./seed";
import {
  STORAGE_KEY,
  clearPersistedState,
  loadPersistedState,
  savePersistedState,
} from "./persist";

afterEach(() => {
  clearPersistedState();
  vi.unstubAllGlobals();
});

describe("persist", () => {
  it("round-trips state through localStorage", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, v);
        },
        removeItem: (k: string) => {
          store.delete(k);
        },
      },
    });

    const seed = createSeedState();
    seed.globalXp = 99;
    seed.questsCompleted = 2;
    seed.streak = 2;
    savePersistedState(seed);

    expect(store.has(STORAGE_KEY)).toBe(true);
    const loaded = loadPersistedState();
    expect(loaded?.globalXp).toBe(99);
    expect(loaded?.questsCompleted).toBe(2);
    expect(loaded?.missions.length).toBe(seed.missions.length);
  });
});
