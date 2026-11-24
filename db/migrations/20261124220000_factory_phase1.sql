-- AI Factory Phase 1 — durable webhook + ledger + runs (Neon wayalabs).
-- Applied to project quiet-cherry-92183008. Re-run safe (IF NOT EXISTS).

create table if not exists public.factory_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text not null,
  kind text not null,
  commerce_key text,
  amount_cents integer,
  currency text,
  run_id text,
  bay_id text,
  raw jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  constraint factory_webhook_events_provider_event unique (provider, event_id)
);

create index if not exists factory_webhook_events_received_at_idx
  on public.factory_webhook_events (received_at desc);

create index if not exists factory_webhook_events_commerce_key_idx
  on public.factory_webhook_events (commerce_key);

create table if not exists public.factory_ledger_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'wayalabs',
  bay_id text,
  run_id text,
  amount_cents integer not null,
  currency text not null default 'usd',
  entry_kind text not null,
  commerce_key text,
  refund_id text,
  source_event_id uuid references public.factory_webhook_events (id),
  created_at timestamptz not null default now()
);

create unique index if not exists factory_ledger_credit_commerce_uidx
  on public.factory_ledger_entries (tenant_id, commerce_key)
  where entry_kind = 'credit' and commerce_key is not null;

create unique index if not exists factory_ledger_reversal_uidx
  on public.factory_ledger_entries (tenant_id, commerce_key, refund_id)
  where entry_kind = 'reversal' and refund_id is not null;

create table if not exists public.factory_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'wayalabs',
  bay_id text not null,
  funnel_id text not null,
  mode text not null default 'sandbox',
  status text not null default 'pending',
  step_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists factory_runs_status_updated_idx
  on public.factory_runs (status, updated_at desc);

create table if not exists public.factory_commerce_aliases (
  alias text primary key,
  canonical text not null,
  created_at timestamptz not null default now()
);

create index if not exists factory_commerce_aliases_canonical_idx
  on public.factory_commerce_aliases (canonical);
