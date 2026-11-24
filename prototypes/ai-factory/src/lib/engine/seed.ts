import type { Agent, Factory, Mission, OrchestratorState } from "./types";

const xpCurve = (level: number) => 80 + level * 40;

export const STATE_VERSION = 2;

export function createSeedState(): OrchestratorState {
  const factories: Factory[] = [
    {
      id: "fx-neon-cart",
      name: "Neon Cart",
      theme: "ecommerce",
      tagline: "Shopify-style storefront ops — inventory, sales, support",
      level: 1,
      xp: 0,
      xpToNext: xpCurve(1),
      unlocked: true,
      unlockLevel: 1,
      color: "#39ff14",
    },
    {
      id: "fx-forge-line",
      name: "Forge Line",
      theme: "manufacturing",
      tagline: "Plant floor agents — procurement, quality, ops",
      level: 1,
      xp: 0,
      xpToNext: xpCurve(1),
      unlocked: true,
      unlockLevel: 1,
      color: "#00e5ff",
    },
    {
      id: "fx-signal-hub",
      name: "Signal Hub",
      theme: "logistics",
      tagline: "Routing grid — unlock at global command level 3",
      level: 1,
      xp: 0,
      xpToNext: xpCurve(1),
      unlocked: false,
      unlockLevel: 3,
      color: "#ff2bd6",
    },
  ];

  const agents: Agent[] = [
    // Neon Cart
    agent("ag-nc-inv", "fx-neon-cart", "Stockwire", "inventory", 1),
    agent("ag-nc-sales", "fx-neon-cart", "Checkout Pulse", "sales", 1),
    agent("ag-nc-mkt", "fx-neon-cart", "Campaign Ghost", "marketing", 1),
    agent("ag-nc-sup", "fx-neon-cart", "Reply Drone", "support", 2, "locked"),
    // Forge Line
    agent("ag-fl-ops", "fx-forge-line", "Line Captain", "ops", 1),
    agent("ag-fl-qual", "fx-forge-line", "Caliper Eye", "quality", 1),
    agent("ag-fl-proc", "fx-forge-line", "Parts Broker", "procurement", 1),
    agent("ag-fl-log", "fx-forge-line", "Dock Runner", "logistics", 2, "locked"),
    // Signal Hub (locked factory — agents locked)
    agent("ag-sh-log", "fx-signal-hub", "Route Weaver", "logistics", 1, "locked"),
    agent("ag-sh-ops", "fx-signal-hub", "Yard Boss", "ops", 1, "locked"),
    agent("ag-sh-sales", "fx-signal-hub", "Slot Broker", "sales", 2, "locked"),
  ];

  const missions: Mission[] = [
    {
      id: "ms-nc-flash",
      factoryId: "fx-neon-cart",
      title: "Flash Drop: Restock + Sell",
      brief: "Sync SKU counts, push a flash offer, clear the cart surge.",
      xpReward: 55,
      requiredRoles: ["inventory", "sales", "marketing"],
      status: "available",
      progress: 0,
      steps: [
        "Inventory audit on hot SKUs",
        "Price + merchandising pulse",
        "Sales funnel clear + confirm",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-nc-support",
      factoryId: "fx-neon-cart",
      title: "Ticket Storm Containment",
      brief: "Unlock support drone, triage inbound, keep CSAT above threshold.",
      xpReward: 70,
      requiredRoles: ["support", "sales"],
      status: "available",
      progress: 0,
      steps: [
        "Unlock Reply Drone (factory L2)",
        "Triage VIP tickets",
        "Close loop with sales notes",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-nc-recover",
      factoryId: "fx-neon-cart",
      title: "Abandoned Cart Recovery",
      brief: "Pulse win-back offers and answer the surge of reply threads.",
      xpReward: 65,
      requiredRoles: ["marketing", "support"],
      status: "available",
      progress: 0,
      steps: [
        "Segment abandoned carts",
        "Fire win-back pulse",
        "Reply Drone closes objections",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-fl-batch",
      factoryId: "fx-forge-line",
      title: "Batch 17: Zero Defect Run",
      brief: "Procure parts, run the line, pass quality gate.",
      xpReward: 60,
      requiredRoles: ["procurement", "ops", "quality"],
      status: "available",
      progress: 0,
      steps: [
        "Lock parts PO",
        "Spin Line Captain on Batch 17",
        "Caliper Eye quality gate",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-fl-ship",
      factoryId: "fx-forge-line",
      title: "Dock Rush",
      brief: "Unlock dock runner and clear outbound pallets.",
      xpReward: 75,
      requiredRoles: ["logistics", "ops"],
      status: "available",
      progress: 0,
      steps: [
        "Unlock Dock Runner (factory L2)",
        "Stage pallets",
        "Confirm outbound scan",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-fl-night",
      factoryId: "fx-forge-line",
      title: "Night Shift Overclock",
      brief: "Hold yield under load while logistics feeds the line.",
      xpReward: 80,
      requiredRoles: ["ops", "quality", "logistics"],
      status: "available",
      progress: 0,
      steps: [
        "Line Captain sets night cadence",
        "Caliper Eye samples mid-run",
        "Dock Runner keeps WIP flowing",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-sh-clear",
      factoryId: "fx-signal-hub",
      title: "Backlog Grid Clear",
      brief: "Re-weave delayed lanes and push yard throughput.",
      xpReward: 85,
      requiredRoles: ["logistics", "ops"],
      status: "available",
      progress: 0,
      steps: [
        "Route Weaver remaps delayed lanes",
        "Yard Boss clears dwell pods",
        "Confirm grid SLA green",
      ],
      stepIndex: 0,
    },
    {
      id: "ms-sh-auction",
      factoryId: "fx-signal-hub",
      title: "Hot Lane Auction",
      brief: "Sell premium slots while logistics holds capacity.",
      xpReward: 95,
      requiredRoles: ["sales", "logistics"],
      status: "available",
      progress: 0,
      steps: [
        "Unlock Slot Broker (hub L2)",
        "Price hot-lane windows",
        "Route Weaver reserves capacity",
      ],
      stepIndex: 0,
    },
  ];

  return {
    version: STATE_VERSION,
    tick: 0,
    globalXp: 0,
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
        message: "Wayalabs AI Factory orchestrator online. Mock agents armed.",
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
