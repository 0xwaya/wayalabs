import type { Agent, Factory, Mission, OrchestratorState } from "./types";

const xpCurve = (level: number) => 80 + level * 40;

export const STATE_VERSION = 3;
export const STARTING_CASH = 750;

export function createSeedState(): OrchestratorState {
  const factories: Factory[] = [
    {
      id: "fx-neon-cart",
      name: "Neon Cart",
      theme: "ecommerce",
      bayLabel: "CART",
      tagline: "Commerce income bay — list, convert, fulfill, support",
      level: 1,
      xp: 0,
      xpToNext: xpCurve(1),
      revenue: 0,
      unlocked: true,
      unlockLevel: 1,
      color: "#39ff14",
    },
    {
      id: "fx-forge-line",
      name: "Forge Line",
      theme: "manufacturing",
      bayLabel: "FORGE",
      tagline: "Fulfillment income bay — procure, produce, QC, ship",
      level: 1,
      xp: 0,
      xpToNext: xpCurve(1),
      revenue: 0,
      unlocked: true,
      unlockLevel: 1,
      color: "#00e5ff",
    },
    {
      id: "fx-signal-hub",
      name: "Signal Hub",
      theme: "logistics",
      bayLabel: "HUB",
      tagline: "Demand funnel bay — capture, route, book, invoice",
      level: 1,
      xp: 0,
      xpToNext: xpCurve(1),
      revenue: 0,
      unlocked: false,
      unlockLevel: 3,
      color: "#ff2bd6",
    },
  ];

  const agents: Agent[] = [
    // Neon Cart — commerce crew
    agent("ag-nc-inv", "fx-neon-cart", "Stockwire", "inventory", 1),
    agent("ag-nc-sales", "fx-neon-cart", "Checkout Pulse", "sales", 1),
    agent("ag-nc-mkt", "fx-neon-cart", "Campaign Ghost", "marketing", 1),
    agent("ag-nc-sup", "fx-neon-cart", "Reply Drone", "support", 2, "locked"),
    // Forge Line — fulfillment crew
    agent("ag-fl-ops", "fx-forge-line", "Line Captain", "ops", 1),
    agent("ag-fl-qual", "fx-forge-line", "Caliper Eye", "quality", 1),
    agent("ag-fl-proc", "fx-forge-line", "Parts Broker", "procurement", 1),
    agent("ag-fl-log", "fx-forge-line", "Dock Runner", "logistics", 2, "locked"),
    // Signal Hub — demand crew
    agent("ag-sh-log", "fx-signal-hub", "Route Weaver", "logistics", 1, "locked"),
    agent("ag-sh-ops", "fx-signal-hub", "Yard Boss", "ops", 1, "locked"),
    agent("ag-sh-sales", "fx-signal-hub", "Slot Broker", "sales", 2, "locked"),
  ];

  const missions: Mission[] = [
    {
      id: "ms-nc-flash",
      factoryId: "fx-neon-cart",
      title: "Flash Drop Funnel",
      brief: "Real-world commerce run: sync inventory, push the offer, clear checkout.",
      xpReward: 55,
      revenueReward: 420,
      requiredRoles: ["inventory", "sales", "marketing"],
      status: "available",
      progress: 0,
      steps: [
        "Intake: audit hot SKUs",
        "Offer: merchandising + price pulse",
        "Convert: clear cart surge + confirm cash",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-nc-support",
      factoryId: "fx-neon-cart",
      title: "Retention Funnel: Ticket Storm",
      brief: "Protect revenue — unlock support, triage VIP threads, keep CSAT high.",
      xpReward: 70,
      revenueReward: 380,
      requiredRoles: ["support", "sales"],
      status: "available",
      progress: 0,
      steps: [
        "Qualify: triage VIP tickets",
        "Resolve: draft replies + CSAT check",
        "Collect: close loop with sales notes",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-nc-recover",
      factoryId: "fx-neon-cart",
      title: "Win-Back Funnel",
      brief: "Recover abandoned carts — win-back pulse + objection handling.",
      xpReward: 65,
      revenueReward: 510,
      requiredRoles: ["marketing", "support"],
      status: "available",
      progress: 0,
      steps: [
        "Segment abandoned carts",
        "Fire win-back offer",
        "Close objections → book revenue",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-fl-batch",
      factoryId: "fx-forge-line",
      title: "Batch 17 Fulfillment Funnel",
      brief: "Procure → produce → QC gate. Ship only when the funnel clears.",
      xpReward: 60,
      revenueReward: 640,
      requiredRoles: ["procurement", "ops", "quality"],
      status: "available",
      progress: 0,
      steps: [
        "Procure: lock parts PO",
        "Produce: Line Captain on Batch 17",
        "QC: Caliper Eye gate → release to cash",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-fl-ship",
      factoryId: "fx-forge-line",
      title: "Outbound Invoice Funnel",
      brief: "Unlock dock runner, stage pallets, scan out — cash on confirm.",
      xpReward: 75,
      revenueReward: 720,
      requiredRoles: ["logistics", "ops"],
      status: "available",
      progress: 0,
      steps: [
        "Stage outbound pallets",
        "Scan dock lanes",
        "Invoice → book revenue",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-fl-night",
      factoryId: "fx-forge-line",
      title: "Night Shift Throughput Funnel",
      brief: "Hold yield under load while logistics feeds the line — more units, more income.",
      xpReward: 80,
      revenueReward: 890,
      requiredRoles: ["ops", "quality", "logistics"],
      status: "available",
      progress: 0,
      steps: [
        "Set night cadence",
        "Sample mid-run quality",
        "Keep WIP flowing → payout",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-sh-clear",
      factoryId: "fx-signal-hub",
      title: "Demand Clear Funnel",
      brief: "Re-weave delayed lanes and push yard throughput into booked jobs.",
      xpReward: 85,
      revenueReward: 1100,
      requiredRoles: ["logistics", "ops"],
      status: "available",
      progress: 0,
      steps: [
        "Capture: remap delayed demand",
        "Route: clear dwell pods",
        "Book: confirm SLA → invoice",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-sh-auction",
      factoryId: "fx-signal-hub",
      title: "Premium Slot Funnel",
      brief: "Sell hot-lane capacity while logistics holds the reservation.",
      xpReward: 95,
      revenueReward: 1450,
      requiredRoles: ["sales", "logistics"],
      status: "available",
      progress: 0,
      steps: [
        "Price premium windows",
        "Reserve capacity",
        "Collect slot fees",
      ],
      stepIndex: 0,
    },
  ];

  return {
    version: STATE_VERSION,
    tick: 0,
    globalXp: 0,
    cash: STARTING_CASH,
    lifetimeRevenue: 0,
    questsCompleted: 0,
    streak: 0,
    factories,
    agents,
    missions,
    logs: [
      {
        id: "log-boot",
        at: new Date().toISOString(),
        factoryId: null,
        kind: "system",
        message:
          "Wayalabs AI Factory online. Build agent teams → run real-world funnels → book income.",
      },
    ],
    selectedFactoryId: "fx-neon-cart",
  };
}

function agent(
  id: string,
  factoryId: string,
  name: string,
  role: Agent["role"],
  unlockLevel: number,
  status: Agent["status"] = "idle",
): Agent {
  return {
    id,
    factoryId,
    name,
    role,
    status: unlockLevel > 1 ? "locked" : status,
    level: 1,
    xp: 0,
    unlockLevel,
    lastTask: null,
    progress: 0,
  };
}

export { xpCurve };
