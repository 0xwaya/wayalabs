# Wayalabs lead engine

Internal. The studio’s own lead system, shaped like `lead-system-kit.md`.

## Shape

1. **Intake** — `/contact` form (and Cal booking as the parallel path)
2. **Email** — Resend to `CONTACT_TO_EMAIL` (existing)
3. **CRM** — Neon Postgres `contacts` + `leads` after email succeeds; match by email
4. **Outbound sourcer** — weekday job pulls public signals into `sourced_candidates`
5. **Digest** — weekday operator email of open inbound + sourced rows. Does **not** email leads or candidates.

## Where leads come from

| Channel | Table | Notes |
|---|---|---|
| Contact form | `contacts` / `leads` | Opt-in inbound |
| SBA 7(a) FOIA | `sourced_candidates` (`sba_7a`) | Recent approvals in trade/service NAICS. Public FOIA CSV; quarterly lag |
| AI / automation intent news | `sourced_candidates` (`ai_intent_news`) | Nationwide Google News RSS filtered for **buyer** headlines (deploy/adopt/invest). Vendor fundraise headlines are dropped |

Sourced rows are **candidates for operator review**, not consented inbound leads. Do not cold-email from the job.

## Data boundary

| Stored | Who reads | Retention |
|---|---|---|
| inbound name, email, company, intent, message, status | Operator via service role | Until operator deletes or marks lost |
| sourced company, geo, industry, signal, source URL | Operator via service role | Until reviewed / discarded |
| Digest / sourcer mail | Operator inbox | Email retention |

Anon keys must not expose these tables. Service role only.

## Provisioning

**Database:** Neon org `wayalabs` · project `wayalabs` (`quiet-cherry-92183008`) · `aws-us-east-2` · database `wayalabs`.  
CRM tables are already applied (`contacts`, `leads`, `sourced_candidates`). SQL sources remain in `supabase/migrations/` until moved to `db/migrations/`.

To go live on Vercel:

1. Copy the **pooled** connection string from Neon console → set `DATABASE_URL` on Vercel (wayalabs + ai-factory)
2. Set `CRON_SECRET` (≥16 chars)
3. CRM client uses `@neondatabase/serverless` + `DATABASE_URL` (already shipped)
4. Optional toggles: `LEAD_SOURCE_SBA=0` or `LEAD_SOURCE_AI_INTENT=0` to disable a channel
5. Redeploy

Do **not** reuse the Neon **Stone estimator** project for CRM/Factory data.

## Operator match rules (inbound)

- Match `contacts.email` (lowercased)
- On match: update name/company, insert a new `leads` row
- Status starts at `new`

## Sourced candidate rules

- Unique on `(source, external_id)`
- Status starts at `new` → operator moves to `reviewed` / `discarded` / `converted`
- SBA NAICS allowlist: construction / specialty trade / stone & metal fab / building materials / facilities / repair (`src/lib/leads/sourcers/sba.ts`)
- AI intent: buyer verbs only; raises/Series/seed headlines excluded

## Jobs

| Schedule | Path | Action |
|---|---|---|
| Mon–Fri 12:00 UTC | `/api/leads/source` | Fetch SBA + AI intent → file candidates → email operator sample |
| Mon–Fri 13:00 UTC | `/api/leads/digest` | Email open inbound + sourced queues |

Both require `Authorization: Bearer $CRON_SECRET`. Never contact the company or submitter.
