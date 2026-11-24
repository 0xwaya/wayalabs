import { createSeedState, xpCurve } from "./seed";
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

function state(): OrchestratorState {
  if (!globalThis.__aiFactoryState) {
    globalThis.__aiFactoryState = createSeedState();
  }
  return globalThis.__aiFactoryState;
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

function commandLevel(s: OrchestratorState): number {
  return Math.max(1, Math.floor(s.globalXp / 120) + 1);
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

export type PublicState = OrchestratorState & { commandLevel: number };

export function getState(): PublicState {
  const s = state();
  return {
    ...structuredClone(s),
    commandLevel: commandLevel(s),
  };
}

export function selectFactory(factoryId: string): PublicState {
  const s = state();
  const factory = s.factories.find((f) => f.id === factoryId);
  if (!factory?.unlocked) {
    pushLog(s, "system", `Factory ${factoryId} is still locked.`);
    return getState();
  }
  s.selectedFactoryId = factoryId;
  return getState();
}

export function startMission(missionId: string): PublicState {
  const s = state();
  const mission = s.missions.find((m) => m.id === missionId);
  if (!mission || mission.status !== "available") {
    pushLog(s, "system", `Mission ${missionId} cannot start.`);
    return getState();
  }

  const factory = s.factories.find((f) => f.id === mission.factoryId);
  if (!factory?.unlocked) {
    pushLog(s, "system", "Factory locked — cannot start mission.");
    return getState();
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
    return getState();
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
      return getState();
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
    lead.progress = 10;
    lead.lastTask = mockTaskFor(lead.role, mission.steps[0] ?? mission.title);
  }

  pushLog(
    s,
    "route",
    `Orchestrator routed "${mission.title}" → ${lead?.name ?? "crew"}.`,
    mission.factoryId,
  );
  return getState();
}

export function tick(): PublicState {
  const s = state();
  s.tick += 1;

  const activeFactoryIds = new Set(
    s.missions.filter((m) => m.status === "active").map((m) => m.factoryId),
  );

  for (const mission of s.missions.filter((m) => m.status === "active")) {
    advanceMission(s, mission);
  }

  for (const agent of s.agents) {
    if (agent.status === "done") {
      agent.status = "idle";
      agent.progress = 0;
      continue;
    }
    // Agents not on an active factory mission idle down visually.
    if (agent.status === "working" && !activeFactoryIds.has(agent.factoryId)) {
      agent.progress = Math.min(100, agent.progress + 20);
      if (agent.progress >= 100) {
        agent.status = "done";
        agent.xp += 8;
      }
    }
  }

  return getState();
}

function advanceMission(s: OrchestratorState, mission: Mission) {
  const role = mission.requiredRoles[mission.stepIndex] ?? mission.requiredRoles.at(-1);
  if (!role) return;
  const agent = pickAgent(s, mission.factoryId, role);
  if (!agent) {
    mission.status = "failed";
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

  if (agent.status === "working" && agent.progress >= 85) {
    agent.status = "done";
    agent.progress = 100;
    mission.stepIndex += 1;
    const total = Math.max(mission.steps.length, mission.requiredRoles.length);
    mission.progress = Math.min(99, Math.round((mission.stepIndex / total) * 100));

    if (mission.stepIndex >= total) {
      completeMission(s, mission);
    }
  } else if (agent.status === "working") {
    agent.progress = Math.min(100, agent.progress + 18);
    mission.progress = Math.min(
      95,
      mission.progress + 6 + Math.floor(Math.random() * 4),
    );
  }
}

function completeMission(s: OrchestratorState, mission: Mission) {
  mission.status = "completed";
  mission.progress = 100;
  awardFactoryXp(s, mission.factoryId, mission.xpReward);
  pushLog(
    s,
    "mission",
    `Quest complete: "${mission.title}" (+${mission.xpReward} XP)`,
    mission.factoryId,
  );

  for (const agent of s.agents.filter((a) => a.factoryId === mission.factoryId)) {
    if (agent.status === "working" || agent.status === "done") {
      agent.status = "idle";
      agent.progress = 0;
    }
  }
}

export function resetState(): PublicState {
  globalThis.__aiFactoryState = createSeedState();
  return getState();
}
