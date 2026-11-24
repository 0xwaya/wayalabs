# AI Factory

**Wayalabs product prototype** — gamified multi-agent orchestration with a cyberpunk ops UI.

Mock agents run quest-style missions across independent business “factories.” A local session orchestrator routes tasks, awards XP, levels factories/agents, and unlocks tools. Progress persists in the browser. Swap mock agents for real model calls later without changing the loop.

## Factories (MVP)

| Factory | Theme | Starting agents |
|---|---|---|
| **Neon Cart** | Ecommerce (Shopify-style) | Inventory, Sales, Marketing (+ Support @ L2) |
| **Forge Line** | Manufacturing plant | Ops, Quality, Procurement (+ Logistics @ L2) |
| **Signal Hub** | Logistics hub | Locked until command level 3 |

## Game loop

1. Launch a quest from the board  
2. Orchestrator routes steps to role agents  
3. Tick advances work (AUTO ON by default; faster while lanes are active)  
4. Complete quest → factory + agent XP → unlocks  
5. Streak every 3 clears and parallel-factory finishes grant bonus XP  
6. Global XP raises command level → unlocks Signal Hub  

Progress saves to `localStorage` (`wayalabs-ai-factory-v2`). Keyboard: `T` tick · `A` auto · `1–3` factory · `Shift+R` reset.

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

Optional API (server demo / tools): `GET/POST /api/factory` with actions `tick` | `reset` | `selectFactory` | `startMission`. The live UI uses a client session so each visitor has their own run.

## Stack

- Next.js 16 (App Router) + React 19 + Tailwind 4  
- Client session orchestrator (`src/lib/engine`) + local persistence  
- Mock agents only (level-scaled pace, swappable later)

## Wayalabs

Built as a **product prototype by Wayalabs** — demo surface for multi-agent systems sold through Discovery → Lead system / Platform builds.
