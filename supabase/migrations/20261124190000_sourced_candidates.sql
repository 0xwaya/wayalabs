-- Outbound sourced candidates (SBA FOIA, AI/automation intent news).
-- Never auto-emailed. Operator reviews in dashboard / digest.

create type public.sourced_candidate_status as enum (
  'new',
  'reviewed',
  'discarded',
  'converted'
);

create table if not exists public.sourced_candidates (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  external_id text not null,
  company_name text not null,
  city text not null default '',
  state text not null default '',
  industry text not null default '',
  signal_summary text not null,
  source_url text not null default '',
  approved_at date,
  status public.sourced_candidate_status not null default 'new',
  created_at timestamptz not null default now(),
  constraint sourced_candidates_source_external_unique unique (source, external_id)
);

create index if not exists sourced_candidates_status_created_at_idx
  on public.sourced_candidates (status, created_at desc);

alter table public.sourced_candidates enable row level security;

comment on table public.sourced_candidates is
  'Operator-only outbound candidates. Sourced from public data; never contacted by the job.';
