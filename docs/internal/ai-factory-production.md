# AI Factory → production bots

Internal plan. Replaces mock tick agents with real bots, webhooks, and connectors while keeping the Factory floor as the control UI.

**Status:** planning  
**Prototype:** `prototypes/ai-factory` · live `ai-factory-pink.vercel.app`  
**Reuse:** lead-engine Supabase patterns, Resend, `CRON_SECRET` cron auth

---

## North star

The floor stays a **command UI**. Under it:

1. Launch a funnel → create a durable **Run**
2. Orchestrator routes each step to a **Bot** (role-bound)
3. Bot calls **Connectors** (Shopify, Stripe, mail, CRM, ship)
4. External systems fire **Webhooks** → proof events book real cash
5. Human gates block send / charge / ship until approved (v1)

Mock USD remains available as **Sandbox mode**. Production mode books only from verified webhook receipts.

---

## Current → target

| Layer today | Production |
|---|---|
| Client `createSession` + localStorage | Server run store (Supabase) + optional client cache |
| `tick()` advances fake progress | Step completion = bot job result or webhook proof |
| `revenueReward` hard-coded | Booked from payment / invoice / payout events |
| Agents = named UI cards | Agents = bot configs + credentials + tool ACL |
| `/api/factory` in-memory | Control API + webhook ingress + worker queue |

Keep the game loop (bays, unlocks, streaks) as **operator UX**. Economy numbers must reconcile to ledger rows, not seed constants.

---

## Architecture

```
┌────────────────┐   launch / approve    ┌─────────────────────┐
│  Factory floor │ ─────────────────────▶│  Control plane      │
│  (Next UI)     │ ◀── run state SSE/WS ─│  /api/factory/*     │
└────────────────┘                       └──────────┬──────────┘
                                                    │ enqueue step
                                         ┌──────────▼──────────┐
                                         │  Run engine         │
                                         │  runs · steps · ACL │
                                         └──────────┬──────────┘
                               ┌────────────────────┼────────────────────┐
                               ▼                    ▼                    ▼
                        ┌────────────┐       ┌────────────┐       ┌────────────┐
                        │ Bot worker │       │ Bot worker │       │ Bot worker │
                        │ inventory  │       │ sales      │       │ support …  │
                        └─────┬──────┘       └─────┬──────┘       └─────┬──────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
                        ┌────────────────────────────────────────────────┐
                        │ Connector SDK (signed outbound, idempotent)    │
                        │ Shopify · Stripe · Resend · CRM · Ship · Slack │
                        └───────────────────────┬────────────────────────┘
                                                │
┌───────────────────────┐                       │
│ Webhook ingress       │◀── payment.succeeded / order.paid / tracking.*
│ /api/hooks/:provider  │──▶ verify HMAC → normalize → ledger → advance run
└───────────────────────┘
```

### Control plane (keeps the floor honest)

- `POST /api/factory/runs` — launch funnel (checks bay unlock, cash/opex policy, bot readiness)
- `GET /api/factory/runs/:id` — run + step timeline
- `POST /api/factory/runs/:id/approve` — human gate for consequential tools
- `POST /api/factory/runs/:id/cancel`
- `GET /api/factory/state` — bays, crews, cash, lifetime (server truth)
- Optional: SSE/WebSocket for live floor updates (replace client AUTO tick in live mode)

### Bot workers

One worker process (or Vercel Workflow / queue consumer) per role family. Each step job:

```ts
type StepJob = {
  runId: string;
  stepId: string;
  bayId: string;          // fx-neon-cart | …
  agentId: string;        // ag-nc-sales | …
  role: AgentRole;
  mode: "sandbox" | "shadow" | "live";
  toolsAllowed: string[]; // ACL snapshot at enqueue
  input: Record<string, unknown>;
};
```

Bot returns `draft | waiting_approval | succeeded | failed` plus artifacts (draft email, SKU diff, invoice id).

### Connector SDK

Thin adapters. No business logic in providers.

| Connector | Used by roles | First verbs (v1) |
|---|---|---|
| **Shopify** | inventory, sales, marketing | read catalog/inventory; create draft discount; read orders |
| **Stripe** | sales, ops | create PaymentLink / invoice draft; read balance; webhook book |
| **Resend / Gmail** | support, marketing, sales | draft only → send after approve |
| **Supabase CRM** | sales, support, hub | match contact; file lead note (extend lead engine) |
| **ShipStation / EasyPost** | logistics | create label draft; tracking webhooks |
| **Slack / Discord** | all | operator alerts + approval buttons |
| **Calendly** (optional) | hub sales | booking webhooks → demand clear |

Every outbound call: timeout, retry with jitter, idempotency key = `runId:stepId:verb`.

### Webhook ingress

`POST /api/hooks/:provider` with per-provider secret.

1. Verify signature (Stripe/Shopify HMAC; shared secret for others)
2. **Ingress dedupe** on `(provider, event_id)` — drop exact redeliveries
3. Map → `ProofEvent` (`payment_captured`, `order_paid`, `shipment_delivered`, `ticket_resolved`, `payment_refunded`, `dispute_opened`, …)
4. Resolve **canonical commerce id** before booking (see below)
5. Attach to open Run when correlation id present (`metadata.run_id` / order tag)
6. Else credit bay **inbox** for operator attach
7. Append **ledger** row only if the commerce key is new (or amount delta for partial refund)
8. Advance or complete the Run step if waiting on that proof

**Never** book revenue from bot self-report alone in live mode.

#### Cross-provider purchase dedupe (P1)

`(provider, event_id)` alone is not enough: Shopify `orders/paid` and Stripe `payment_intent.succeeded` for the same checkout are different keys and would double-book.

Before inserting a credit:

1. Extract `commerce_key` in priority order:
   - Stripe PaymentIntent / Charge id (`pi_…` / `ch_…`)
   - else Shopify order id / checkout token
   - else `run_id` + provider external id (last resort)
2. Stamp every related webhook with that `commerce_key`
3. **Ledger unique constraint:** `unique(tenant_id, commerce_key, entry_kind)` for `credit` — second source stores the webhook but does **not** create another credit
4. Prefer a single **book-of-record provider per bay** (v1 CART: Stripe if PaymentIntent present, else Shopify). Secondary provider events attach as evidence only

#### Refunds & disputes (P2)

Credits must reverse when money comes back.

| Provider event | Ledger action |
|---|---|
| Stripe `charge.refunded` / `refund.created` | Idempotent `reversal` (or partial) keyed by `commerce_key` + refund id |
| Stripe `charge.dispute.created` / funds withdrawn | `reversal` (dispute); later `credit` if won |
| Shopify refund webhook | Same pattern via shared `commerce_key` |

Rules:

- Reversals are **new rows** (never mutate the original credit)
- Floor cash / lifetime = `sum(amount_cents)` including negatives
- Partial refunds: book `-refunded_cents`; allow multiple reversals while `|sum(reversals)| ≤ original credit`
- Idempotency: `unique(tenant_id, provider, event_id)` on webhook_events; ledger reversals unique on `(commerce_key, refund_id)`

---

## Data model (Supabase)

Extend the existing Wayalabs project (service role only; no anon RLS exposure).

```
tenants                 -- later multi-customer; v1 single Wayalabs row
bays                    -- CART / FORGE / HUB config
bots                    -- agent card ↔ credentials ↔ tool ACL ↔ unlock rules
funnel_templates        -- steps, required roles, sandbox reward hint
runs                    -- active production runs
run_steps               -- status, bot_id, artifacts, approval
connectors              -- provider, status, scopes, last_health
connector_secrets       -- vaulted refs (never in client)
webhook_events          -- raw + normalized, unique(provider, event_id); commerce_key
ledger_entries          -- amount_cents (+/-), currency, entry_kind (credit|reversal|fee),
                           commerce_key, source_event_id, bay_id, run_id
approvals               -- pending tool executions
```

Constraints (enforce in migration):

- `webhook_events`: `unique(provider, event_id)`
- `ledger_entries`: one **credit** per `(tenant_id, commerce_key)`; reversals unique on `(tenant_id, commerce_key, refund_id)`

Cash on the floor = `sum(ledger_entries.amount_cents)` filtered by tenant (credits positive, refunds/disputes negative). Keep a cached balance on `tenants` updated transactionally.

---

## Role → real work map

| Bay | Bot (prototype name) | Role | Real job |
|---|---|---|---|
| CART | Stockwire | inventory | Shopify inventory sync / low-stock pulse |
| CART | Checkout Pulse | sales | Stripe/Shopify checkout assist + payment proof |
| CART | Campaign Ghost | marketing | draft campaign / win-back sequence (send gated) |
| CART | Reply Drone | support | draft ticket replies; escalate VIP |
| FORGE | Parts Broker | procurement | draft PO / supplier email |
| FORGE | Line Captain | ops | stage work order; Slack status |
| FORGE | Caliper Eye | quality | checklist + human QC gate |
| FORGE | Dock Runner | logistics | label draft + tracking wait |
| HUB | Route Weaver | logistics | demand lane remap from CRM/calendar |
| HUB | Yard Boss | ops | capacity board / SLA chase |
| HUB | Slot Broker | sales | invoice / payment link for premium slots |

---

## Funnel → run templates (v1)

Start with **one live funnel per bay**:

1. **CART — Flash Drop**  
   Stockwire audit → Campaign Ghost draft offer → Checkout Pulse wait on `order_paid` / `payment_intent.succeeded`
2. **FORGE — Batch 17**  
   Parts Broker PO draft → Line Captain produce checklist → Caliper Eye approve → ledger on invoice paid
3. **HUB — Demand Clear**  
   Route Weaver CRM queue → Yard Boss route → Slot Broker Stripe invoice → webhook book

Other funnels stay sandbox until connectors are healthy.

---

## Security & ops

Aligned with Wayalabs agent posture (approved sources, human gates, no unattended purchase/post/deploy):

- **Modes:** `sandbox` (sim) · `shadow` (bots draft, no side effects) · `live` (gated tools)
- **Tool ACL** on each bot; deny-by-default
- **Approval required** for: send email, create charge, create shipment label, publish discount
- **Spend caps** per bay / day (hard stop in connector)
- **Secrets** in Vercel env / vault; never in `localStorage`
- **Webhook** IP allowlists where provider supports; always signature verify
- **Audit log** = Factory terminal (persist `log_events`)
- **PII** stays in CRM/support systems; floor shows redacted summaries

---

## Repo / deploy shape

| Piece | Location | Host |
|---|---|---|
| Floor UI | `prototypes/ai-factory` (then `0xwaya/ai-factory`) | Vercel project `ai-factory` |
| Control + hooks API | same app `src/app/api/**` | Vercel |
| Workers | Vercel Workflow **or** separate worker service | start with Workflow / queue |
| DB | Supabase `wayalabs` | shared with lead engine |
| Connectors | `src/lib/connectors/*` | in-process first |

Promote to standalone repo when control plane + one live funnel are stable.

### Env (additive)

```
FACTORY_MODE=sandbox|shadow|live
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SHOPIFY_SHOP=
SHOPIFY_ADMIN_TOKEN=
SHOPIFY_WEBHOOK_SECRET=
RESEND_API_KEY=
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
FACTORY_APPROVAL_CHANNEL=
CRON_SECRET=
```

---

## Phased delivery

### Phase 0 — Contract freeze (this doc)

- [x] Map mock agents → bots / connectors / proofs
- [x] Freeze `ProofEvent` + `StepJob` TypeScript types in prototype (`prototypes/ai-factory/src/lib/factory/`)
- [x] OpenAPI sketch for `/api/hooks/*` and `/api/factory/runs` (`prototypes/ai-factory/openapi/factory-v0.yaml`)

### Phase 1 — Durable skeleton (no live side effects)

- [ ] Supabase migrations: runs, steps, ledger, webhook_events, bots
- [ ] Server `GET state` from DB; floor can dual-read (feature flag)
- [ ] Webhook receivers: Stripe + Shopify verify + persist (no booking yet)
- [ ] Connector health pings on a cron (`/api/factory/connectors/health`)
- [ ] Keep sandbox tick path for visitors without creds

### Phase 2 — Shadow bots

- [ ] Workers for inventory / sales / support that **draft only**
- [ ] Slack/UI approval cards
- [ ] Flash Drop run template drives real drafts; completion still sandbox-paid **or** waits for test-mode Stripe events
- [ ] Proof rail UI: last N webhook events on the floor

### Phase 3 — First live income path

- [ ] Stripe test → live: book ledger on `payment_intent.succeeded` with `metadata.run_id`
- [ ] One CART funnel ends only on payment proof
- [ ] Daily spend/send caps + kill switch (`FACTORY_MODE=shadow`)
- [ ] Operator runbook + incident channel

### Phase 4 — Expand bays

- [ ] FORGE shipping + QC gate
- [ ] HUB CRM + invoice (tie into lead engine contacts)
- [ ] Unlock rules driven by lifetime ledger, not seed XP alone
- [ ] Multi-tenant tenant_id (customer factories)

### Phase 5 — Productize

- [ ] Customer onboarding: connect Shopify/Stripe OAuth
- [ ] Per-tenant bot packs
- [ ] Standalone `ai-factory` repo + billing

---

## Acceptance checks (per phase)

| Phase | Done when |
|---|---|
| 0 | Live TS contracts + OpenAPI sketch checked in; commerce_key dedupe helpers tested |
| 1 | Webhook replay is idempotent; runs survive deploy; sandbox still playable |
| 2 | Operator can approve/reject a draft email from a Flash Drop run |
| 3 | $1 real (or Stripe live) payment with `run_id` appears on CART tile + ledger |
| 3b | Same checkout from Stripe + Shopify books **once**; refund webhook posts reversal and floor cash drops |
| 4 | Two bays book from different providers in one day without double-count |
| 5 | Second tenant isolated; no cross-ledger bleed |

---

## Open decisions

1. **Worker host:** Vercel Workflow vs Railway/Fly worker (prefer Workflow until queue depth hurts)
2. **Shopify vs Etsy first** for CART proof rail (README mentioned both; pick one for Phase 3)
3. **Support channel:** Gmail API vs shared helpdesk (Intercom/Front) for Reply Drone
4. **Whether sandbox visitors share** the production ledger view (recommend: separate demo tenant)

---

## Immediate next engineering slice

Phase 0 done. Smallest Phase 1 vertical without live risk:

1. Migration `factory_webhook_events` + `factory_ledger_entries` (honor `commerce_key` uniques)
2. `POST /api/hooks/stripe` — verify, store, no side effects
3. Floor panel **Proof rail** reading last events (service-backed)
4. Feature flag: `FACTORY_MODE=sandbox` default on Vercel

Then wire Flash Drop step 3 to *wait* on a matching Stripe test event before calling `bookRevenue`.
