import { beforeEach, describe, expect, it } from "vitest";
import {
  createSession,
  getFunnelBlockers,
  getState,
  migrateState,
  resetState,
  selectFactory,
  startMission,
  tick,
} from "./orchestrator";
import { createSeedState } from "./seed";

beforeEach(() => {
  resetState();
});

/** Drive an active funnel until it pays out and resets to available. */
function runFunnel(missionId: string, maxTicks = 60) {
  const before = getState().questsCompleted;
  let guard = 0;
  while (getState().questsCompleted <= before && guard < maxTicks) {
    const status = getState().missions.find((m) => m.id === missionId)?.status;
    if (status !== "active" && getState().questsCompleted <= before) {
      // Funnel never started / stalled
      break;
    }
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
    expect(state.logs[0]?.message).toMatch(/Already running/i);
  });

  it("blocks missions that need locked agents", () => {
    const state = startMission("ms-nc-support");
    expect(state.missions.find((m) => m.id === "ms-nc-support")?.status).toBe(
      "available",
    );
    expect(state.logs[0]?.message).toMatch(/Unlock support/i);
  });

  it("rejects unknown missions", () => {
    const state = startMission("nope");
    expect(state.logs[0]?.message).toMatch(/cannot start/i);
  });

  it("allows relaunching after payout", () => {
    startMission("ms-nc-flash");
    runFunnel("ms-nc-flash");
    const again = startMission("ms-nc-flash");
    expect(again.missions.find((m) => m.id === "ms-nc-flash")?.status).toBe(
      "active",
    );
  });
});

describe("getFunnelBlockers", () => {
  it("flags locked support on Ticket Storm before bay L2", () => {
    const blockers = getFunnelBlockers(getState(), "ms-nc-support");
    expect(blockers.some((b) => b.code === "locked_role" && b.role === "support")).toBe(
      true,
    );
  });

  it("clears blockers after Reply Drone unlocks", () => {
    for (let i = 0; i < 3; i++) {
      startMission("ms-nc-flash");
      runFunnel("ms-nc-flash");
    }
    const blockers = getFunnelBlockers(getState(), "ms-nc-support");
    expect(blockers.filter((b) => b.code === "locked_role")).toHaveLength(0);
  });
});

describe("tick game loop", () => {
  it("completes a funnel and books revenue + XP", () => {
    startMission("ms-nc-flash");
    const state = runFunnel("ms-nc-flash");
    const mission = state.missions.find((m) => m.id === "ms-nc-flash");
    expect(mission?.status).toBe("available");
    expect(mission?.progress).toBe(0);
    expect(state.questsCompleted).toBe(1);
    expect(state.globalXp).toBeGreaterThanOrEqual(55);
    expect(state.lifetimeRevenue).toBeGreaterThanOrEqual(420);
    expect(state.cash).toBeGreaterThan(750);
    expect(state.factories.find((f) => f.id === "fx-neon-cart")?.revenue).toBeGreaterThanOrEqual(
      420,
    );
    expect(state.tick).toBeGreaterThan(0);
  });

  it("levels Neon Cart and unlocks Reply Drone after enough XP", () => {
    for (let i = 0; i < 3; i++) {
      startMission("ms-nc-flash");
      runFunnel("ms-nc-flash");
    }
    const state = getState();
    const neon = state.factories.find((f) => f.id === "fx-neon-cart");
    expect(neon?.level).toBeGreaterThanOrEqual(2);
    const support = state.agents.find((a) => a.id === "ag-nc-sup");
    expect(support?.status).not.toBe("locked");
  });

  it("keeps funnel progress monotonic within a run", () => {
    startMission("ms-nc-flash");
    let last = 0;
    for (let i = 0; i < 8; i++) {
      const state = tick();
      const mission = state.missions.find((m) => m.id === "ms-nc-flash");
      if (!mission || mission.status !== "active") break;
      expect(mission.progress).toBeGreaterThanOrEqual(last);
      last = mission.progress;
    }
  });
});

describe("command level unlock", () => {
  it("unlocks Signal Hub when lifetime revenue reaches command 3 (~$1600)", () => {
    for (let i = 0; i < 4; i++) {
      startMission("ms-nc-flash");
      runFunnel("ms-nc-flash");
    }
    const state = getState();
    expect(state.lifetimeRevenue).toBeGreaterThanOrEqual(1600);
    expect(state.commandLevel).toBeGreaterThanOrEqual(3);
    expect(state.factories.find((f) => f.id === "fx-signal-hub")?.unlocked).toBe(
      true,
    );
  });
});

describe("streak + session", () => {
  it("tracks questsCompleted and streak income bonuses", () => {
    for (let i = 0; i < 3; i++) {
      startMission("ms-nc-flash");
      runFunnel("ms-nc-flash");
    }
    const state = getState();
    expect(state.questsCompleted).toBe(3);
    expect(state.streak).toBe(3);
    expect(state.lifetimeRevenue).toBeGreaterThanOrEqual(420 * 3 + 75);
    expect(state.globalXp).toBeGreaterThanOrEqual(185);
    expect(state.logs.some((l) => l.kind === "bonus")).toBe(true);
  });

  it("runs income funnels on two bays in parallel", () => {
    startMission("ms-nc-flash");
    startMission("ms-fl-batch");
    const mid = tick();
    expect(mid.missions.filter((m) => m.status === "active")).toHaveLength(2);
    runFunnel("ms-nc-flash");
    // Forge may still be active or already paid — finish if needed
    if (getState().missions.find((m) => m.id === "ms-fl-batch")?.status === "active") {
      runFunnel("ms-fl-batch");
    }
    const state = getState();
    expect(state.factories.find((f) => f.id === "fx-neon-cart")?.revenue).toBeGreaterThan(0);
    expect(state.factories.find((f) => f.id === "fx-forge-line")?.revenue).toBeGreaterThan(0);
  });

  it("createSession isolates client state from the global store", () => {
    const session = createSession();
    session.startMission("ms-fl-batch");
    expect(session.getState().missions.find((m) => m.id === "ms-fl-batch")?.status).toBe(
      "active",
    );
    expect(getState().missions.find((m) => m.id === "ms-fl-batch")?.status).toBe(
      "available",
    );
  });

  it("migrateState merges saved progress onto current seed content", () => {
    const seed = createSeedState();
    seed.globalXp = 300;
    seed.lifetimeRevenue = 900;
    seed.cash = 1200;
    seed.questsCompleted = 4;
    seed.streak = 2;
    seed.factories[0]!.level = 2;
    seed.factories[0]!.xp = 10;
    seed.factories[0]!.revenue = 900;
    const partial = {
      version: 1,
      tick: 12,
      globalXp: 300,
      lifetimeRevenue: 900,
      cash: 1200,
      factories: seed.factories,
      agents: seed.agents,
      missions: seed.missions.slice(0, 2),
      logs: [],
      selectedFactoryId: "fx-neon-cart",
    };
    const migrated = migrateState(partial);
    expect(migrated?.version).toBe(3);
    expect(migrated?.globalXp).toBe(300);
    expect(migrated?.lifetimeRevenue).toBe(900);
    expect(migrated?.missions.length).toBe(seed.missions.length);
    expect(migrated?.missions.every((m) => m.revenueReward > 0)).toBe(true);
    expect(migrated?.questsCompleted).toBe(0);
  });
});
