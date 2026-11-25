<p align="center">
  <img src="docs/snapshots/01-command-floor.jpg" alt="AI Factory Command Floor — cash, lifetime, bays, and crew HUD" width="920" />
</p>

<h1 align="center">AI Factory</h1>

<p align="center">
  <strong>Wayalabs · Command Floor</strong><br />
  Spin up bays, deploy your crew, clear production runs, and rack up cash.
</p>

<p align="center">
  <a href="https://ai-factory-pink.vercel.app"><strong>Live demo</strong></a>
  ·
  <a href="../../docs/internal/ai-factory-production.md">Production plan</a>
  ·
  <a href="openapi/factory-v0.yaml">OpenAPI</a>
</p>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-prototype-39ff14?style=flat-square" />
  <img alt="Phase" src="https://img.shields.io/badge/phase-1%20Neon%20%2B%20webhooks-00e5ff?style=flat-square" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Neon" src="https://img.shields.io/badge/Neon-Postgres-00E599?style=flat-square&logo=neon&logoColor=black" />
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-Proprietary-ff2bd6?style=flat-square" />
</p>

---

## North star

1. **Assemble agent teams** per bay (named roles, unlocks, levels)
2. **Run real-world income funnels** (intake → work → review → collect)
3. **Book income** — cash + lifetime revenue is the score; XP only powers the crew

Sandbox ticks simulate USD today. Phase 1+ wires Stripe webhooks into a **Proof rail**; live mode will book only from verified receipts.

---

## Snapshots

| Command floor | Income bays |
|---|---|
| ![Command floor HUD](docs/snapshots/01-command-floor.jpg) | ![CART · FORGE · HUB bay cards](docs/snapshots/02-income-bays.jpg) |

| Proof rail | Room crew |
|---|---|
| ![Proof rail · Stripe webhook receipts](docs/snapshots/03-proof-rail.jpg) | ![Room crew · Neon Cart agents](docs/snapshots/04-room-crew.jpg) |

| Income funnels | Orchestrator log |
|---|---|
| ![Income funnel launch board](docs/snapshots/05-income-funnels.jpg) | ![Orchestrator route · mission · bonus log](docs/snapshots/06-orchestrator-log.jpg) |

---

## Architecture

```mermaid
flowchart TB
  subgraph Floor["Command Floor UI"]
    HUD["Cash · Lifetime · CMD · Streak"]
    Bays["CART · FORGE · HUB"]
    Crew["Room Crew agents"]
    Funnels["Income Funnels board"]
    Proof["Proof rail"]
    Log["Orchestrator log"]
  end

  subgraph Engine["Client session engine"]
    Session["createSession · tick · AUTO"]
    Blockers["getFunnelBlockers"]
    Persist["localStorage v4"]
  end

  subgraph Live["Phase 1+ live path"]
    Stripe["POST /api/hooks/stripe"]
    Neon[("Neon Postgres\nwayalabs")]
    Aliases["commerce_aliases"]
    Events["factory_webhook_events"]
  end

  Funnels -->|Launch| Session
  Session --> Crew
  Session --> Bays
  Session --> HUD
  Session --> Log
  Session --> Persist
  Blockers --> Funnels
  Stripe --> Aliases --> Neon
  Stripe --> Events --> Neon
  Neon --> Proof
```

| Layer | Role |
|---|---|
| **Floor** | Neon ops HUD — bays, crew, funnels, proof rail, terminal log |
| **Engine** | Per-tab `createSession`; deterministic progress; unlock gating |
| **Webhooks** | Stripe signature verify → alias link → persist (no booking yet) |
| **Neon** | CRM + Factory tables (`DATABASE_URL`, pooled) |

Full production roadmap: [`docs/internal/ai-factory-production.md`](../../docs/internal/ai-factory-production.md).

---

## Income bays

| Bay | Factory | Job | Unlock |
|---|---|---|---|
| **CART** | Neon Cart | Commerce — list, convert, fulfill, support | Start |
| **FORGE** | Forge Line | Fulfillment — procure, produce, QC, ship | Start |
| **HUB** | Signal Hub | Demand — capture, route, book, invoice | ~$1,600 lifetime / CMD 3 |

### Room crew (Neon Cart)

| Agent | Role | Example work |
|---|---|---|
| Stockwire | inventory | Audit hot SKUs |
| Checkout Pulse | sales | Merchandising + price pulse |
| Campaign Ghost | marketing | Abandoned-cart win-back |
| Reply Drone | support | VIP triage · objections (bay L2) |

Forge and Hub crews follow the same pattern (ops, quality, procurement, logistics, sales).

---

## Game loop

1. Launch an **Income Funnel** (e.g. Flash Drop · $420 · +55 XP)
2. Orchestrator **routes** each step to a room-crew agent
3. **Tick** advances work (`AUTO ON`; faster while funnels are live)
4. Clear funnel → **cash** + bay revenue + XP → unlock agents / command
5. **Streak** + parallel-bay bonuses stack payouts
6. Working agents burn **opex** — keep lines converting

Progress saves to `localStorage` (`wayalabs-ai-factory-v4`).

### Hotkeys

| Key | Action |
|---|---|
| `T` | Manual tick |
| `A` | Toggle AUTO |
| `1`–`3` | Select bay |
| `Shift+R` | Reset run |

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 · Tailwind CSS 4 · Orbitron / Share Tech Mono |
| Engine | TypeScript session orchestrator · Vitest |
| Persistence | `localStorage` (sandbox) · Neon Postgres (live proofs / CRM) |
| Webhooks | Stripe HMAC verify · commerce-key alias graph |
| Deploy | Vercel project `ai-factory` · `FACTORY_MODE=sandbox` |

```
prototypes/ai-factory/
├── openapi/factory-v0.yaml          # Control plane + hooks contract
├── docs/snapshots/                  # Floor screenshots
├── src/
│   ├── app/api/
│   │   ├── factory/                 # Legacy tick API + /proofs
│   │   └── hooks/stripe/            # Webhook ingress
│   ├── components/
│   │   ├── Dashboard.tsx            # Command floor
│   │   └── ProofRail.tsx
│   └── lib/
│       ├── engine/                  # Sandbox game loop
│       └── factory/                 # Live types, ingest, commerce keys
└── LICENSE                          # Proprietary
```

---

## Run

```bash
cd prototypes/ai-factory
npm install
npm run dev
```

```bash
npm test
npm run build
```

### Environment

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Phase 1 proofs | Neon pooled URL (already on Vercel) |
| `FACTORY_MODE` | optional | `sandbox` (default) · `shadow` · `live` |
| `STRIPE_WEBHOOK_SECRET` | for Stripe | Point endpoint at `/api/hooks/stripe` |

Sandbox play works with no env — each browser tab runs its own session.

---

## APIs

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/factory/proofs` | Recent webhook receipts for the Proof rail |
| `POST` | `/api/hooks/stripe` | Verify + persist Stripe events (allowlisted types) |
| `GET/POST` | `/api/factory` | Optional tick/reset API (UI uses client session) |

Contracts: [`openapi/factory-v0.yaml`](./openapi/factory-v0.yaml) · types in [`src/lib/factory/`](./src/lib/factory/).

---

## Roadmap

| Phase | Status |
|---|---|
| **0** Contract freeze (types + OpenAPI) | Done |
| **1** Neon + Stripe persist + Proof rail | Done |
| **2** Shadow bots (draft-only + approvals) | Next |
| **3** First live CART Flash Drop (book on payment proof) | Planned |
| **4** FORGE / HUB live rails | Planned |
| **5** Multi-tenant productize | Planned |

---

## License

**Proprietary — All Rights Reserved.** See [`LICENSE`](./LICENSE).

© 2026 [Wayalabs](https://wayalabs.com). Not open source. Contact `admin@wayalabs.com` for licensing.

This package lives under `prototypes/ai-factory` until promoted to a standalone `0xwaya/ai-factory` repository. It is **not** wired into the main wayalabs.com Next app.
