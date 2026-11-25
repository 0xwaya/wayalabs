import type { CrmEnv } from "@/lib/leads/crm";
import type { MailEnv } from "@/lib/contact-delivery";

export type AgentEnv = CrmEnv &
  MailEnv & {
    LEAD_SOURCE_SBA?: string;
    LEAD_SOURCE_AI_INTENT?: string;
    SITE_URL?: string;
    AGENT_BACKLOG_LIMIT?: string;
    XAI_API_KEY?: string;
    AGENT_MODEL?: string;
    AGENT_LLM_BASE_URL?: string;
  };

/** `read` skills observe. `write` skills change state or notify the operator. */
export type SkillRisk = "read" | "write";

export type SkillContext = {
  env: AgentEnv;
  fetchImpl: typeof fetch;
  now: () => Date;
};

export type SkillResult =
  | { ok: true; summary: string; data: Record<string, unknown> }
  | { ok: false; error: string; retryable?: boolean };

export type Skill = {
  name: string;
  description: string;
  risk: SkillRisk;
  run(ctx: SkillContext): Promise<SkillResult>;
};

export type StepStatus = "ok" | "error" | "skipped";

export type StepRecord = {
  skill: string;
  reason: string;
  risk: SkillRisk;
  status: StepStatus;
  attempts: number;
  durationMs: number;
  summary: string;
  data?: Record<string, unknown>;
  error?: string;
};

export type AgentState = {
  goal: string;
  /** Free-text objective, used by the model-driven planner. */
  objective?: string;
  env: AgentEnv;
  steps: StepRecord[];
};

export type Decision =
  | { type: "run"; skill: string; reason: string }
  | { type: "finish"; summary: string };

/** Looks at what has happened so far and picks the next skill, or stops. */
export type Planner = (state: AgentState) => Decision | Promise<Decision>;

export type RunStatus =
  | "completed"
  | "partial"
  | "failed"
  | "budget_exhausted";

export type AgentRun = {
  goal: string;
  planner: "rules" | "llm";
  dryRun: boolean;
  status: RunStatus;
  startedAt: string;
  finishedAt: string;
  summary: string;
  steps: StepRecord[];
};
