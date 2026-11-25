import type { AgentState, Decision, Planner, StepRecord } from "@/lib/agent/types";

export const DEFAULT_GOAL = "weekday-ops";
/** Model-driven goal. Falls back to the weekday-ops rules without an API key. */
export const AUTO_GOAL = "auto";
const DEFAULT_BACKLOG_LIMIT = 40;

function attempted(state: AgentState, skill: string): boolean {
  return state.steps.some((s) => s.skill === skill);
}

function okStep(state: AgentState, skill: string): StepRecord | undefined {
  return state.steps.find((s) => s.skill === skill && s.status === "ok");
}

function num(step: StepRecord | undefined, key: string): number {
  const value = step?.data?.[key];
  return typeof value === "number" ? value : 0;
}

function backlogLimit(state: AgentState): number {
  const parsed = Number.parseInt(state.env.AGENT_BACKLOG_LIMIT ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_BACKLOG_LIMIT;
}

function failingPages(step: StepRecord | undefined): number {
  const failing = step?.data?.failing;
  return Array.isArray(failing) ? failing.length : 0;
}

function finish(state: AgentState, fallback: string): Decision {
  const notes = state.steps.map((s) => `${s.skill}: ${s.summary}`);
  return {
    type: "finish",
    summary: notes.length > 0 ? notes.join("; ") : fallback,
  };
}

function single(skill: string): Planner {
  return (state) =>
    attempted(state, skill)
      ? finish(state, "nothing to do")
      : { type: "run", skill, reason: `Goal "${state.goal}" asks for ${skill}.` };
}

/**
 * Observe, then act: read the CRM and the public site first, then decide
 * whether to source more candidates (only while the review backlog is small),
 * alert on a broken site, and email a digest when there is something to read.
 */
const weekdayOps: Planner = (state) => {
  if (!attempted(state, "crm.snapshot")) {
    return { type: "run", skill: "crm.snapshot", reason: "Observe the CRM backlog before acting." };
  }
  if (!attempted(state, "site.health")) {
    return { type: "run", skill: "site.health", reason: "Check the public pages are up." };
  }

  const snapshot = okStep(state, "crm.snapshot");
  const health = okStep(state, "site.health");

  if (failingPages(health) > 0 && !attempted(state, "ops.alert")) {
    return {
      type: "run",
      skill: "ops.alert",
      reason: `${failingPages(health)} public page(s) failing.`,
    };
  }

  if (snapshot && !attempted(state, "lead.source")) {
    const backlog = num(snapshot, "openCandidates");
    if (backlog < backlogLimit(state)) {
      return {
        type: "run",
        skill: "lead.source",
        reason: `Review backlog is ${backlog}, under the limit of ${backlogLimit(state)}.`,
      };
    }
  }

  if (!attempted(state, "lead.digest")) {
    const open = num(snapshot, "openLeads") + num(snapshot, "openCandidates");
    const inserted = num(okStep(state, "lead.source"), "inserted");
    if (snapshot && open + inserted > 0) {
      return {
        type: "run",
        skill: "lead.digest",
        reason: `${open + inserted} open item(s) for the operator to review.`,
      };
    }
  }

  return finish(state, "nothing to do");
};

const healthWatch: Planner = (state) => {
  if (!attempted(state, "site.health")) {
    return { type: "run", skill: "site.health", reason: "Check the public pages are up." };
  }
  const health = okStep(state, "site.health");
  if (failingPages(health) > 0 && !attempted(state, "ops.alert")) {
    return { type: "run", skill: "ops.alert", reason: "Public page(s) failing." };
  }
  return finish(state, "nothing to do");
};

export const playbooks: Record<string, Planner> = {
  [DEFAULT_GOAL]: weekdayOps,
  health: healthWatch,
  snapshot: single("crm.snapshot"),
  source: single("lead.source"),
  digest: single("lead.digest"),
};

export const goalNames = [...Object.keys(playbooks), AUTO_GOAL];

export function plannerFor(goal: string): Planner | undefined {
  return Object.hasOwn(playbooks, goal) ? playbooks[goal] : undefined;
}
