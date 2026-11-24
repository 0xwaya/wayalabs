# AI Factory

**Wayalabs product prototype** — gamified multi-agent orchestration with a cyberpunk ops UI.

Mock agents run quest-style missions across independent business “factories.” The shared orchestrator routes tasks, awards XP, levels factories, and unlocks agents/tools. Swap mock agents for real model calls later without changing the loop.

## Factories (MVP)

| Factory | Theme | Starting agents |
|---|---|---|
| **Neon Cart** | Ecommerce (Shopify-style) | Inventory, Sales, Marketing (+ Support @ L2) |
| **Forge Line** | Manufacturing plant | Ops, Quality, Procurement (+ Logistics @ L2) |
| **Signal Hub** | Logistics hub | Locked until command level 3 |

## Game loop

1. Launch a quest from the board  
2. Orchestrator routes steps to role agents  
3. Tick advances work (AUTO ON by default)  
4. Complete quest → factory XP → level up → unlock agents  
5. Global XP raises command level → unlocks Signal Hub  

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test    # orchestrator + API unit tests
npm run build
```

API: `GET/POST /api/factory` with actions `tick` | `reset` | `selectFactory` | `startMission`.

## Stack

- Next.js 16 (App Router) + React 19 + Tailwind 4  
- In-memory orchestrator (`src/lib/engine`) — no DB required for the prototype  
- Mock agents only (deterministic-ish progress, swappable later)

## Wayalabs

Built as a **product prototype by Wayalabs** — demo surface for multi-agent systems sold through Discovery → Lead system / Platform builds.
