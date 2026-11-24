-- Wayalabs lead engine CRM. Service-role access only (no public RLS policies).

create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  company text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contacts_email_unique unique (email)
);

create type public.lead_status as enum (
  'new',
  'contacted',
  'qualified',
  'won',
  'lost'
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete restrict,
  intent text not null,
  message text not null,
  source text not null default 'contact_form',
  status public.lead_status not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists leads_status_created_at_idx
  on public.leads (status, created_at desc);

create index if not exists leads_contact_id_idx
  on public.leads (contact_id);

alter table public.contacts enable row level security;
alter table public.leads enable row level security;

comment on table public.contacts is
  'Wayalabs CRM contacts. Matched by email on intake. Operator-only via service role.';
comment on table public.leads is
  'Wayalabs inquiries. Email delivery happens before insert. Digest job never emails the lead.';
