import { describe, expect, it } from "vitest";
import { createSeedState, xpCurve } from "./seed";

describe("xpCurve", () => {
  it("increases with level", () => {
    expect(xpCurve(2)).toBeGreaterThan(xpCurve(1));
    expect(xpCurve(1)).toBe(120);
  });
});

describe("createSeedState", () => {
  it("ships two unlocked factories and one locked logistics hub", () => {
    const state = createSeedState();
    const unlocked = state.factories.filter((f) => f.unlocked);
    const locked = state.factories.filter((f) => !f.unlocked);
    expect(unlocked.map((f) => f.id)).toEqual(["fx-neon-cart", "fx-forge-line"]);
    expect(locked.map((f) => f.id)).toEqual(["fx-signal-hub"]);
    expect(locked[0]?.unlockLevel).toBe(3);
  });

  it("seeds agents and missions across all factories", () => {
    const state = createSeedState();
    expect(state.agents.length).toBeGreaterThanOrEqual(8);
    expect(state.missions.length).toBeGreaterThanOrEqual(8);
    expect(state.missions.filter((m) => m.factoryId === "fx-signal-hub").length).toBe(2);
    expect(state.missions.every((m) => m.status === "available")).toBe(true);
    expect(state.questsCompleted).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.selectedFactoryId).toBe("fx-neon-cart");
  });

  it("locks support and dock agents until factory level 2", () => {
    const state = createSeedState();
    const support = state.agents.find((a) => a.id === "ag-nc-sup");
    const dock = state.agents.find((a) => a.id === "ag-fl-log");
    expect(support?.status).toBe("locked");
    expect(support?.unlockLevel).toBe(2);
    expect(dock?.status).toBe("locked");
  });
});
