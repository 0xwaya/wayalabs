import { createLlmPlanner, llmConfigured } from "@/lib/agent/llm-planner";
import { AUTO_GOAL, DEFAULT_GOAL, plannerFor } from "@/lib/agent/planner";
import { createDefaultRegistry } from "@/lib/agent/skills";
import type { SkillRegistry } from "@/lib/agent/registry";
import type {
  AgentEnv,
  AgentRun,
  AgentState,
  Planner,
  RunStatus,
  SkillResult,
  StepRecord,
} from "@/lib/agent/types";

export type RunOptions = {
  goal: string;
  /** What the model-driven planner should accomplish (goal `auto`). */
  objective?: string;
  env?: AgentEnv;
  fetchImpl?: typeof fetch;
  registry?: SkillRegistry;
  planner?: Planner;
  /** Write skills are recorded as skipped instead of executed. */
  dryRun?: boolean;
  maxSteps?: number;
  maxRetries?: number;
  /** Stop starting new steps after this many ms. */
  deadlineMs?: number;
  now?: () => Date;
  sleep?: (ms: number) => Promise<void>;
};

export type RunError = { ok: false; status: number; error: string };

const defaultSleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

async function execute(
  fn: () => Promise<SkillResult>,
): Promise<SkillResult> {
  try {
    return await fn();
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Skill threw",
      retryable: false,
    };
  }
}

function finalStatus(steps: StepRecord[], budgetHit: boolean): RunStatus {
  if (budgetHit) return "budget_exhausted";
  const attempted = steps.filter((s) => s.status !== "skipped");
  if (attempted.length === 0) return "completed";
  const errors = attempted.filter((s) => s.status === "error").length;
  if (errors === 0) return "completed";
  return errors === attempted.length ? "failed" : "partial";
}

/**
 * Plan, act, observe loop. The planner picks one skill at a time from the
 * registry. Skill failures are recorded and the loop continues; the planner
 * decides what a failure means for the rest of the goal.
 */
export async function runAgent(
  options: RunOptions,
): Promise<AgentRun | RunError> {
  const registry = options.registry ?? createDefaultRegistry();
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;

  let planner = options.planner;
  let plannerKind: AgentRun["planner"] = "rules";
  if (!planner && options.goal === AUTO_GOAL) {
    if (llmConfigured(env)) {
      planner = createLlmPlanner({
        registry,
        env,
        fetchImpl,
        fallback: plannerFor(DEFAULT_GOAL)!,
      });
      plannerKind = "llm";
    } else {
      planner = plannerFor(DEFAULT_GOAL);
    }
  }
  planner ??= plannerFor(options.goal);
  if (!planner) {
    return { ok: false, status: 400, error: `Unknown goal: ${options.goal}` };
  }

  const now = options.now ?? (() => new Date());
  const sleep = options.sleep ?? defaultSleep;
  const dryRun = options.dryRun ?? false;
  const maxSteps = options.maxSteps ?? 8;
  const maxRetries = options.maxRetries ?? 1;
  const deadline = now().getTime() + (options.deadlineMs ?? 50_000);
  const startedAt = now().toISOString();

  const state: AgentState = {
    goal: options.goal,
    objective: options.objective,
    env,
    steps: [],
  };
  let summary = "";
  let budgetHit = false;

  for (let i = 0; ; i += 1) {
    if (i >= maxSteps || now().getTime() >= deadline) {
      budgetHit = true;
      summary = i >= maxSteps ? "Step budget exhausted." : "Time budget exhausted.";
      break;
    }

    const decision = await planner(state);
    if (decision.type === "finish") {
      summary = decision.summary;
      break;
    }

    const skill = registry.get(decision.skill);
    const stepStart = now().getTime();
    const base = { skill: decision.skill, reason: decision.reason };

    if (!skill) {
      state.steps.push({
        ...base,
        risk: "read",
        status: "error",
        attempts: 0,
        durationMs: 0,
        summary: "Unknown skill",
        error: `Skill not registered: ${decision.skill}`,
      });
      continue;
    }

    if (dryRun && skill.risk === "write") {
      state.steps.push({
        ...base,
        risk: skill.risk,
        status: "skipped",
        attempts: 0,
        durationMs: 0,
        summary: "Dry run: write skill not executed",
      });
      continue;
    }

    let attempts = 0;
    let result: SkillResult;
    do {
      attempts += 1;
      result = await execute(() => skill.run({ env, fetchImpl, now }));
      if (result.ok || !result.retryable || attempts > maxRetries) break;
      await sleep(500 * attempts);
    } while (true);

    const durationMs = now().getTime() - stepStart;
    state.steps.push(
      result.ok
        ? {
            ...base,
            risk: skill.risk,
            status: "ok",
            attempts,
            durationMs,
            summary: result.summary,
            data: result.data,
          }
        : {
            ...base,
            risk: skill.risk,
            status: "error",
            attempts,
            durationMs,
            summary: "Failed",
            error: result.error,
          },
    );
  }

  return {
    goal: options.goal,
    planner: plannerKind,
    dryRun,
    status: finalStatus(state.steps, budgetHit),
    startedAt,
    finishedAt: now().toISOString(),
    summary,
    steps: state.steps,
  };
}
