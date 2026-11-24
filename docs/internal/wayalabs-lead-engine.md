# Wayalabs lead engine

Internal. The studio’s own lead system, shaped like `lead-system-kit.md`.

## Shape

1. **Intake** — `/contact` form (and Cal booking as the parallel path)
2. **Email** — Resend to `CONTACT_TO_EMAIL` (existing)
3. **CRM** — Supabase `contacts` + `leads` after email succeeds; match by email
4. **One scheduled job** — weekday digest to the operator at 13:00 UTC (`/api/leads/digest`). Does **not** email the lead.

## Data boundary

| Stored | Who reads | Retention |
|---|---|---|
| name, email, company, intent, message, status | Operator via Supabase service role / dashboard | Until operator deletes or marks lost |
| IP rate-limit stamps | App memory only | ~1 minute window |
| Digest content | Operator inbox | Email retention |

Anon and authenticated Supabase keys must not have RLS policies that expose these tables. Service role only.

## Provisioning (blocked on free-project cap)

Org already has two free projects (`urbanstone`, `queencity-soundboard`). Free tier allows two. To go live:

1. Pause or upgrade one project, **or** upgrade the org
2. Create project `wayalabs` in `us-east-1`
3. Run `supabase/migrations/20261124180000_lead_engine.sql` in the SQL editor (or `apply_migration`)
4. Set on Vercel (Production + Preview): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` (≥16 chars)
5. Redeploy

Until CRM env is set, contact intake still emails; CRM filing is skipped.

## Operator match rules

- Match `contacts.email` (lowercased)
- On match: update name/company, insert a new `leads` row
- On miss: insert contact, then lead
- Status starts at `new`. Operator moves to `contacted` / `qualified` / `won` / `lost` in the dashboard

## Job owner

- Schedule: `lead-digest` in `vercel.json` (Mon–Fri 13:00 UTC)
- Owner: Wayalabs operator (`CONTACT_TO_EMAIL`)
- Action: list `status=new` leads and email the operator
- Never contacts the submitter
