import {
  formatUsd,
  nextIncomeGoal,
  REVENUE_PER_COMMAND_LEVEL,
} from "./money";
import { createSeedState, STATE_VERSION, xpCurve } from "./seed";
import type {
  Agent,
  AgentRole,
  LogEvent,
  Mission,
  OrchestratorState,
} from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __aiFactoryState: OrchestratorState | undefined;
}

const STREAK_BONUS_EVERY = 3;
const STREAK_BONUS_XP = 20;
const STREAK_BONUS_CASH = 75;
const PARALLEL_BONUS_CASH = 60;
const PARALLEL_BONUS_XP = 10;
const AGENT_XP_PER_LEVEL = 40;
const OPEX_PER_WORKING_AGENT = 4;
const MIN_CASH_TO_LAUNCH = 40;

export type PublicState = OrchestratorState & {
  commandLevel: number;
  nextIncomeGoal: number;
};

export type FactorySession = {
  getState: () => PublicState;
  tick: () => PublicState;
  selectFactory: (factoryId: string) => PublicState;
  startMission: (missionId: string) => PublicState;
  reset: () => PublicState;
  /** Replace underlying state (e.g. hydrate from localStorage). */
  hydrate: (next: OrchestratorState) => PublicState;
};

function commandLevel(s: OrchestratorState): number {
  // Income is the primary progression driver — command unlocks from lifetime revenue.
  return Math.max(1, Math.floor(s.lifetimeRevenue / REVENUE_PER_COMMAND_LEVEL) + 1);
}

export function withCommandLevel(s: OrchestratorState): PublicState {
  return {
    ...structuredClone(s),
    commandLevel: commandLevel(s),
    nextIncomeGoal: nextIncomeGoal(s.lifetimeRevenue),
  };
}

function bookRevenue(s: OrchestratorState, amount: number, factoryId?: string) {
  if (amount <= 0) return;
  s.cash += amount;
  s.lifetimeRevenue += amount;
  if (factoryId) {
    const factory = s.factories.find((f) => f.id === factoryId);
    if (factory) factory.revenue += amount;
  }
  refreshLocks(s);
}

function pushLog(
  s: OrchestratorState,
  kind: LogEvent["kind"],
  message: string,
  factoryId: string | null = null,
) {
  s.logs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    factoryId,
    kind,
    message,
  });
  s.logs = s.logs.slice(0, 80);
}

function refreshLocks(s: OrchestratorState) {
  const cmd = commandLevel(s);
  for (const factory of s.factories) {
    if (!factory.unlocked && cmd >= factory.unlockLevel) {
      factory.unlocked = true;
      pushLog(
        s,
        "level",
        `${factory.name} grid unlocked at command level ${cmd}.`,
        factory.id,
      );
      for (const agent of s.agents.filter((a) => a.factoryId === factory.id)) {
        if (agent.unlockLevel <= factory.level && agent.status === "locked") {
          agent.status = "idle";
        }
      }
    }
  }

  for (const factory of s.factories) {
    for (const agent of s.agents.filter((a) => a.factoryId === factory.id)) {
      if (
        agent.status === "locked" &&
        factory.unlocked &&
        factory.level >= agent.unlockLevel
      ) {
        agent.status = "idle";
        pushLog(
          s,
          "agent",
          `${agent.name} came online (${agent.role}).`,
          factory.id,
        );
      }
    }
  }
}

function levelAgent(s: OrchestratorState, agent: Agent, amount: number) {
  agent.xp += amount;
  while (agent.xp >= AGENT_XP_PER_LEVEL) {
    agent.xp -= AGENT_XP_PER_LEVEL;
    agent.level += 1;
    pushLog(
      s,
      "level",
      `${agent.name} agent level → ${agent.level}`,
      agent.factoryId,
    );
  }
}

function awardFactoryXp(s: OrchestratorState, factoryId: string, amount: number) {
  const factory = s.factories.find((f) => f.id === factoryId);
  if (!factory) return;
  factory.xp += amount;
  s.globalXp += amount;
  while (factory.xp >= factory.xpToNext) {
    factory.xp -= factory.xpToNext;
    factory.level += 1;
    factory.xpToNext = xpCurve(factory.level);
    pushLog(
      s,
      "level",
      `${factory.name} leveled to ${factory.level}. New agents may unlock.`,
      factory.id,
    );
  }
  refreshLocks(s);
}

function pickAgent(
  s: OrchestratorState,
  factoryId: string,
  role: AgentRole,
): Agent | null {
  return (
    s.agents.find(
      (a) =>
        a.factoryId === factoryId &&
        a.role === role &&
        a.status !== "locked" &&
        a.status !== "error",
    ) ?? null
  );
}

function mockTaskFor(role: AgentRole, step: string): string {
  const verbs: Record<AgentRole, string> = {
    inventory: "counting & syncing",
    sales: "closing & confirming",
    ops: "scheduling & spinning",
    marketing: "targeting & pulsing",
    support: "triaging & resolving",
    logistics: "routing & staging",
    quality: "sampling & gating",
    procurement: "sourcing & locking",
  };
  return `${verbs[role]} — ${step}`;
}

function selectFactoryOn(s: OrchestratorState, factoryId: string) {
  const factory = s.factories.find((f) => f.id === factoryId);
  if (!factory?.unlocked) {
    pushLog(s, "system", `Factory ${factoryId} is still locked.`);
    return;
  }
  s.selectedFactoryId = factoryId;
}

function startMissionOn(s: OrchestratorState, missionId: string) {
  const mission = s.missions.find((m) => m.id === missionId);
  // Allow replay of completed quests so the income loop can continue.
  if (!mission || (mission.status !== "available" && mission.status !== "completed")) {
    pushLog(s, "system", `Mission ${missionId} cannot start.`);
    return;
  }

  const factory = s.factories.find((f) => f.id === mission.factoryId);
  if (!factory?.unlocked) {
    pushLog(s, "system", "Factory locked — cannot start mission.");
    return;
  }

  if (s.cash < MIN_CASH_TO_LAUNCH) {
    pushLog(
      s,
      "mission",
      `Need ${formatUsd(MIN_CASH_TO_LAUNCH)} operating cash to launch — clear a payout first.`,
      mission.factoryId,
    );
    return;
  }

  const active = s.missions.find(
    (m) => m.factoryId === mission.factoryId && m.status === "active",
  );
  if (active) {
    pushLog(
      s,
      "mission",
      `${factory.name} already running "${active.title}".`,
      factory.id,
    );
    return;
  }

  for (const role of mission.requiredRoles) {
    const agent = pickAgent(s, mission.factoryId, role);
    if (!agent) {
      pushLog(
        s,
        "mission",
        `Need unlocked ${role} agent for "${mission.title}". Level up the factory.`,
        mission.factoryId,
      );
      return;
    }
  }

  mission.status = "active";
  mission.progress = 5;
  mission.stepIndex = 0;
  s.selectedFactoryId = mission.factoryId;

  const firstRole = mission.requiredRoles[0];
  const lead = firstRole ? pickAgent(s, mission.factoryId, firstRole) : null;
  if (lead) {
    lead.status = "working";
    lead.progress = 12;
    lead.lastTask = mockTaskFor(lead.role, mission.steps[0] ?? mission.title);
  }

  pushLog(
    s,
    "route",
    `Orchestrator routed "${mission.title}" → ${lead?.name ?? "crew"}.`,
    mission.factoryId,
  );
}

function completeMission(s: OrchestratorState, mission: Mission) {
  mission.status = "completed";
  mission.progress = 100;
  s.questsCompleted += 1;
  s.streak += 1;

  let xp = mission.xpReward;
  let cash = mission.revenueReward;

  // Parallel ops bonus: another factory also active when this finishes.
  const otherActive = s.missions.some(
    (m) => m.id !== mission.id && m.status === "active",
  );
  if (otherActive) {
    xp += PARALLEL_BONUS_XP;
    cash += PARALLEL_BONUS_CASH;
    pushLog(
      s,
      "bonus",
      `Parallel ops +${formatUsd(PARALLEL_BONUS_CASH)} / +${PARALLEL_BONUS_XP} XP.`,
      mission.factoryId,
    );
  }

  if (s.streak > 0 && s.streak % STREAK_BONUS_EVERY === 0) {
    xp += STREAK_BONUS_XP;
    cash += STREAK_BONUS_CASH;
    pushLog(
      s,
      "bonus",
      `Streak x${s.streak} — +${formatUsd(STREAK_BONUS_CASH)} income surge.`,
      mission.factoryId,
    );
  }

  bookRevenue(s, cash, mission.factoryId);
  awardFactoryXp(s, mission.factoryId, xp);
  pushLog(
    s,
    "mission",
    `Paid out: "${mission.title}" → ${formatUsd(cash)} (+${xp} XP)`,
    mission.factoryId,
  );

  for (const agent of s.agents.filter((a) => a.factoryId === mission.factoryId)) {
    if (agent.status === "working" || agent.status === "done") {
      levelAgent(s, agent, 12);
      agent.status = "idle";
      agent.progress = 0;
    }
  }
}

function advanceMission(s: OrchestratorState, mission: Mission) {
  const role = mission.requiredRoles[mission.stepIndex] ?? mission.requiredRoles.at(-1);
  if (!role) return;
  const agent = pickAgent(s, mission.factoryId, role);
  if (!agent) {
    mission.status = "failed";
    s.streak = 0;
    pushLog(
      s,
      "mission",
      `"${mission.title}" stalled — missing ${role}.`,
      mission.factoryId,
    );
    return;
  }

  if (agent.status === "idle" || agent.status === "done") {
    agent.status = "working";
    agent.progress = 15;
    agent.lastTask = mockTaskFor(
      agent.role,
      mission.steps[mission.stepIndex] ?? mission.title,
    );
    pushLog(
      s,
      "route",
      `Step ${mission.stepIndex + 1}: ${agent.name} (${role})`,
      mission.factoryId,
    );
  }

  // Higher-level agents clear steps slightly faster.
  const pace = 20 + Math.min(10, (agent.level - 1) * 2);

  if (agent.status === "working" && agent.progress >= 85) {
    agent.status = "done";
    agent.progress = 100;
    levelAgent(s, agent, 6);
    mission.stepIndex += 1;
    const total = Math.max(mission.steps.length, mission.requiredRoles.length);
    mission.progress = Math.min(99, Math.round((mission.stepIndex / total) * 100));

    if (mission.stepIndex >= total) {
      completeMission(s, mission);
    }
  } else if (agent.status === "working") {
    agent.progress = Math.min(100, agent.progress + pace);
    mission.progress = Math.min(
      95,
      mission.progress + 7 + Math.floor(Math.random() * 4),
    );
  }
}

function tickOn(s: OrchestratorState) {
  s.tick += 1;

  const activeFactoryIds = new Set(
    s.missions.filter((m) => m.status === "active").map((m) => m.factoryId),
  );

  for (const mission of s.missions.filter((m) => m.status === "active")) {
    advanceMission(s, mission);
  }

  const working = s.agents.filter((a) => a.status === "working").length;
  if (working > 0) {
    const burn = working * OPEX_PER_WORKING_AGENT;
    s.cash = Math.max(0, s.cash - burn);
  }

  for (const agent of s.agents) {
    if (agent.status === "done") {
      agent.status = "idle";
      agent.progress = 0;
      continue;
    }
    // Agents not on an active factory mission idle down visually.
    if (agent.status === "working" && !activeFactoryIds.has(agent.factoryId)) {
      agent.progress = Math.min(100, agent.progress + 22);
      if (agent.progress >= 100) {
        agent.status = "done";
        levelAgent(s, agent, 8);
      }
    }
  }
}

/** Normalize older persisted snapshots into the current schema. */
export function migrateState(raw: unknown): OrchestratorState | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<OrchestratorState>;
  if (!Array.isArray(candidate.factories) || !Array.isArray(candidate.missions)) {
    return null;
  }

  const seed = createSeedState();
  const byId = <T extends { id: string }>(items: T[]) =>
    new Map(items.map((item) => [item.id, item]));

  const factoryMap = byId(candidate.factories);
  const agentMap = byId(candidate.agents ?? []);
  const missionMap = byId(candidate.missions);

  const factories = seed.factories.map((f) => {
    const saved = factoryMap.get(f.id);
    if (!saved) return f;
    return {
      ...f,
      ...saved,
      id: f.id,
      name: f.name,
      theme: f.theme,
      bayLabel: f.bayLabel,
      tagline: f.tagline,
      revenue: typeof saved.revenue === "number" ? saved.revenue : 0,
    };
  });

  const agents = seed.agents.map((a) => {
    const saved = agentMap.get(a.id);
    return saved
      ? {
          ...a,
          ...saved,
          id: a.id,
          factoryId: a.factoryId,
          name: a.name,
          role: a.role,
        }
      : a;
  });

  const missions = seed.missions.map((m) => {
    const saved = missionMap.get(m.id);
    if (!saved) return m;
    return {
      ...m,
      ...saved,
      id: m.id,
      factoryId: m.factoryId,
      title: m.title,
      brief: m.brief,
      requiredRoles: m.requiredRoles,
      steps: m.steps,
      xpReward: m.xpReward,
      revenueReward: m.revenueReward,
    };
  });

  const selected =
    factories.find((f) => f.id === candidate.selectedFactoryId && f.unlocked)?.id ??
    seed.selectedFactoryId;

  return {
    version: STATE_VERSION,
    tick: typeof candidate.tick === "number" ? candidate.tick : 0,
    globalXp: typeof candidate.globalXp === "number" ? candidate.globalXp : 0,
    cash: typeof candidate.cash === "number" ? candidate.cash : seed.cash,
    lifetimeRevenue:
      typeof candidate.lifetimeRevenue === "number" ? candidate.lifetimeRevenue : 0,
    questsCompleted:
      typeof candidate.questsCompleted === "number" ? candidate.questsCompleted : 0,
    streak: typeof candidate.streak === "number" ? candidate.streak : 0,
    factories,
    agents,
    missions,
    logs: Array.isArray(candidate.logs) ? candidate.logs.slice(0, 80) : seed.logs,
    selectedFactoryId: selected,
  };
}

export function createSession(initial?: OrchestratorState): FactorySession {
  let s: OrchestratorState = initial
    ? structuredClone(initial)
    : createSeedState();

  return {
    getState: () => withCommandLevel(s),
    tick: () => {
      tickOn(s);
      return withCommandLevel(s);
    },
    selectFactory: (factoryId) => {
      selectFactoryOn(s, factoryId);
      return withCommandLevel(s);
    },
    startMission: (missionId) => {
      startMissionOn(s, missionId);
      return withCommandLevel(s);
    },
    reset: () => {
      s = createSeedState();
      return withCommandLevel(s);
    },
    hydrate: (next) => {
      s = structuredClone(next);
      refreshLocks(s);
      return withCommandLevel(s);
    },
  };
}

function globalState(): OrchestratorState {
  if (!globalThis.__aiFactoryState) {
    globalThis.__aiFactoryState = createSeedState();
  }
  return globalThis.__aiFactoryState;
}

/** Server / test helpers — mutate the process-global orchestrator. */
export function getState(): PublicState {
  return withCommandLevel(globalState());
}

export function selectFactory(factoryId: string): PublicState {
  selectFactoryOn(globalState(), factoryId);
  return getState();
}

export function startMission(missionId: string): PublicState {
  startMissionOn(globalState(), missionId);
  return getState();
}

export function tick(): PublicState {
  tickOn(globalState());
  return getState();
}

export function resetState(): PublicState {
  globalThis.__aiFactoryState = createSeedState();
  return getState();
}
