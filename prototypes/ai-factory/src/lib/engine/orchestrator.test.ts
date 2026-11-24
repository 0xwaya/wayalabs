import { beforeEach, describe, expect, it } from "vitest";
import {
  getState,
  resetState,
  selectFactory,
  startMission,
  tick,
} from "./orchestrator";

beforeEach(() => {
  resetState();
});

function runUntil(
  missionId: string,
  status: "completed" | "failed" | "active",
  maxTicks = 50,
) {
  let guard = 0;
  while (
    getState().missions.find((m) => m.id === missionId)?.status !== status &&
    guard < maxTicks
  ) {
    tick();
    guard += 1;
  }
  return getState();
}

describe("getState / resetState", () => {
  it("returns a clone with commandLevel", () => {
    const a = getState();
    const b = getState();
    expect(a.commandLevel).toBe(1);
    expect(a).not.toBe(b);
    expect(a.factories).not.toBe(b.factories);
  });

  it("reset restores seed defaults", () => {
    startMission("ms-nc-flash");
    tick();
    const after = resetState();
    expect(after.tick).toBe(0);
    expect(after.missions.find((m) => m.id === "ms-nc-flash")?.status).toBe(
      "available",
    );
  });
});

describe("selectFactory", () => {
  it("selects an unlocked factory", () => {
    const state = selectFactory("fx-forge-line");
    expect(state.selectedFactoryId).toBe("fx-forge-line");
  });

  it("refuses a locked factory", () => {
    const state = selectFactory("fx-signal-hub");
    expect(state.selectedFactoryId).toBe("fx-neon-cart");
    expect(state.logs[0]?.message).toMatch(/locked/i);
  });
});

describe("startMission", () => {
  it("starts a Neon Cart quest and routes the lead agent", () => {
    const state = startMission("ms-nc-flash");
    const mission = state.missions.find((m) => m.id === "ms-nc-flash");
    expect(mission?.status).toBe("active");
    expect(mission?.progress).toBeGreaterThan(0);
    const stockwire = state.agents.find((a) => a.id === "ag-nc-inv");
    expect(stockwire?.status).toBe("working");
    expect(state.logs[0]?.kind).toBe("route");
  });

  it("blocks a second active mission on the same factory", () => {
    startMission("ms-nc-flash");
    const state = startMission("ms-nc-support");
    expect(state.missions.find((m) => m.id === "ms-nc-support")?.status).toBe(
      "available",
    );
    expect(state.logs[0]?.message).toMatch(/already running/i);
  });

  it("blocks missions that need locked agents", () => {
    const state = startMission("ms-nc-support");
    expect(state.missions.find((m) => m.id === "ms-nc-support")?.status).toBe(
      "available",
    );
    expect(state.logs[0]?.message).toMatch(/Need unlocked support/i);
  });

  it("rejects unknown missions", () => {
    const state = startMission("nope");
    expect(state.logs[0]?.message).toMatch(/cannot start/i);
  });

  it("allows replaying a completed mission", () => {
    startMission("ms-nc-flash");
    runUntil("ms-nc-flash", "completed");
    const again = startMission("ms-nc-flash");
    expect(again.missions.find((m) => m.id === "ms-nc-flash")?.status).toBe(
      "active",
    );
  });
});

describe("tick game loop", () => {
  it("completes an active mission and awards XP", () => {
    startMission("ms-nc-flash");
    const state = runUntil("ms-nc-flash", "completed");
    const mission = state.missions.find((m) => m.id === "ms-nc-flash");
    expect(mission?.status).toBe("completed");
    expect(mission?.progress).toBe(100);
    expect(state.globalXp).toBeGreaterThanOrEqual(55);
    expect(state.tick).toBeGreaterThan(0);
  });

  it("levels Neon Cart and unlocks Reply Drone after enough XP", () => {
    // xpToNext at L1 = 120; flash reward = 55 → need 3 completions
    for (let i = 0; i < 3; i++) {
      startMission("ms-nc-flash");
      runUntil("ms-nc-flash", "completed");
    }
    const state = getState();
    const neon = state.factories.find((f) => f.id === "fx-neon-cart");
    expect(neon?.level).toBeGreaterThanOrEqual(2);
    const support = state.agents.find((a) => a.id === "ag-nc-sup");
    expect(support?.status).not.toBe("locked");
  });
});

describe("command level unlock", () => {
  it("unlocks Signal Hub at command level 3 (globalXp >= 240)", () => {
    // 55 XP per flash → 5 completions = 275 XP → commandLevel 3
    for (let i = 0; i < 5; i++) {
      startMission("ms-nc-flash");
      runUntil("ms-nc-flash", "completed");
    }
    const state = getState();
    expect(state.globalXp).toBeGreaterThanOrEqual(240);
    expect(state.commandLevel).toBeGreaterThanOrEqual(3);
    expect(state.factories.find((f) => f.id === "fx-signal-hub")?.unlocked).toBe(
      true,
    );
  });
});
