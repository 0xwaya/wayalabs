# AI Factory

**Wayalabs product prototype** — factories of agent teams that run real-world task funnels and book income.

Inspired by cyberpunk “AI ecosystem” ops UIs (spatial factory + terminal drill-downs + live revenue bays). Mock USD now; swap crews for live models and real payout rails later.

## North star

1. **Assemble agent teams** per factory (named roles, unlocks, levels)  
2. **Run real-world task funnels** (intake → work → review → collect)  
3. **Book income** — cash + lifetime revenue is the score; XP only powers the crew  

## Income bays

| Bay | Factory | Funnel job |
|---|---|---|
| **CART** | Neon Cart | Commerce — list, convert, fulfill, support |
| **FORGE** | Forge Line | Fulfillment — procure, produce, QC, ship |
| **HUB** | Signal Hub | Demand — capture, route, book, invoice (unlock ~$1.6k lifetime / CMD 3) |

## Game loop

1. Launch an income funnel from the board  
2. Orchestrator routes steps to the room crew  
3. Tick advances work (AUTO ON; faster while funnels are live)  
4. Clear funnel → cash + bay revenue + XP → unlock agents / command  
5. Streak + parallel-bay bonuses stack payouts  
6. Working agents burn opex — keep funnels converting  

Progress saves to `localStorage` (`wayalabs-ai-factory-v4`). Keys: `T` tick · `A` auto · `1–3` bay · `Shift+R` reset.

## Winning strategies (prototype targets)

Pulled from live AI-ops reels that convert (Factorio map + terminal + real money proof):

- **Proof of income** as the hero metric (cash / lifetime / per-bay tiles)  
- **Named crews with roles** and visible step progress  
- **Multi-step funnels** you can read (not abstract XP grind)  
- **Multiple income bays** unlocking over time  
- **Shareable neon ops aesthetic** for 9:16 tour clips  
- Next: spatial map, live Stripe/Etsy proof rail, competitor-intel bay with originality guardrails  
- **Production plan** (real bots, webhooks, connectors): [`docs/internal/ai-factory-production.md`](../../docs/internal/ai-factory-production.md)
- **Phase 0 contracts:** [`src/lib/factory/`](./src/lib/factory/) · OpenAPI [`openapi/factory-v0.yaml`](./openapi/factory-v0.yaml)

## Run

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

Optional API: `GET/POST /api/factory`. The live UI uses a client session so each visitor has their own run.

## Wayalabs

Product prototype for selling multi-agent systems: Discovery → Lead engine → Platform builds that operate income funnels for customers.
