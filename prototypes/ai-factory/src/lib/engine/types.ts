export type AgentRole =
  | "inventory"
  | "sales"
  | "ops"
  | "marketing"
  | "support"
  | "logistics"
  | "quality"
  | "procurement";

export type AgentStatus = "idle" | "queued" | "working" | "done" | "error" | "locked";

export type MissionStatus = "available" | "active" | "completed" | "failed";

export type FactoryTheme = "ecommerce" | "manufacturing" | "logistics";

export type Agent = {
  id: string;
  factoryId: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  level: number;
  xp: number;
  unlockLevel: number;
  lastTask: string | null;
  progress: number;
};

export type Mission = {
  id: string;
  factoryId: string;
  title: string;
  brief: string;
  /** Soft progression for factory/agent unlocks. */
  xpReward: number;
  /** Primary win metric — simulated USD booked when the quest clears. */
  revenueReward: number;
  requiredRoles: AgentRole[];
  status: MissionStatus;
  progress: number;
  steps: string[];
  stepIndex: number;
};

export type Factory = {
  id: string;
  name: string;
  theme: FactoryTheme;
  /** Short bay label shown in the top income strip (e.g. CART, FORGE). */
  bayLabel: string;
  tagline: string;
  level: number;
  xp: number;
  xpToNext: number;
  /** Lifetime USD booked by this factory's agent team. */
  revenue: number;
  unlocked: boolean;
  unlockLevel: number;
  color: string;
};

export type LogEvent = {
  id: string;
  at: string;
  factoryId: string | null;
  kind: "system" | "route" | "agent" | "mission" | "level" | "bonus";
  message: string;
};

export type OrchestratorState = {
  version: number;
  tick: number;
  globalXp: number;
  /** Spendable operating cash (USD). */
  cash: number;
  /** Cumulative revenue booked — the real score. */
  lifetimeRevenue: number;
  questsCompleted: number;
  streak: number;
  factories: Factory[];
  agents: Agent[];
  missions: Mission[];
  logs: LogEvent[];
  selectedFactoryId: string;
};
