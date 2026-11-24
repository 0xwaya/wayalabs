import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  LeadIntake,
  LeadRecord,
  LeadStatus,
  SourcedCandidateIntake,
  SourcedCandidateRecord,
} from "@/lib/leads/types";

export type CrmEnv = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  [key: string]: string | undefined;
};

export type CrmResult =
  | { ok: true; contactId: string; leadId: string; matchedExisting: boolean }
  | { ok: false; skipped: true; reason: "not_configured" }
  | { ok: false; skipped: false; error: string };

export function crmConfig(env: CrmEnv = process.env) {
  const url = env.SUPABASE_URL?.trim() ?? "";
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  return {
    url,
    serviceRoleKey,
    configured: url.length > 0 && serviceRoleKey.length > 0,
  };
}

export function createCrmClient(env: CrmEnv = process.env): SupabaseClient | null {
  const { url, serviceRoleKey, configured } = crmConfig(env);
  if (!configured) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * After email succeeds: match contact by email, then file the lead.
 * Does not send mail and does not contact the person.
 */
export async function fileLead(
  intake: LeadIntake,
  env: CrmEnv = process.env,
  client: SupabaseClient | null = createCrmClient(env),
): Promise<CrmResult> {
  if (!client) {
    return { ok: false, skipped: true, reason: "not_configured" };
  }

  const email = intake.email.trim().toLowerCase();
  const name = intake.name.trim();
  const company = intake.company.trim();
  const now = new Date().toISOString();

  const existing = await client
    .from("contacts")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing.error) {
    return { ok: false, skipped: false, error: existing.error.message };
  }

  let contactId = existing.data?.id as string | undefined;
  let matchedExisting = false;

  if (contactId) {
    matchedExisting = true;
    const update = await client
      .from("contacts")
      .update({ name, company, updated_at: now })
      .eq("id", contactId);
    if (update.error) {
      return { ok: false, skipped: false, error: update.error.message };
    }
  } else {
    const insert = await client
      .from("contacts")
      .insert({ email, name, company })
      .select("id")
      .single();
    if (insert.error || !insert.data?.id) {
      return {
        ok: false,
        skipped: false,
        error: insert.error?.message ?? "contact insert failed",
      };
    }
    contactId = insert.data.id as string;
  }

  const lead = await client
    .from("leads")
    .insert({
      contact_id: contactId,
      intent: intake.intent,
      message: intake.message,
      source: intake.source ?? "contact_form",
      status: "new" satisfies LeadStatus,
    })
    .select("id")
    .single();

  if (lead.error || !lead.data?.id) {
    return {
      ok: false,
      skipped: false,
      error: lead.error?.message ?? "lead insert failed",
    };
  }

  return {
    ok: true,
    contactId,
    leadId: lead.data.id as string,
    matchedExisting,
  };
}

/** Open leads for the operator digest. Never emails the lead. */
export async function listOpenLeads(
  env: CrmEnv = process.env,
  client: SupabaseClient | null = createCrmClient(env),
  limit = 50,
): Promise<{ ok: true; leads: LeadRecord[] } | { ok: false; error: string }> {
  if (!client) {
    return { ok: false, error: "CRM is not configured." };
  }

  const { data, error } = await client
    .from("leads")
    .select("id, intent, status, created_at, contact:contacts(name, email, company)")
    .eq("status", "new")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { ok: false, error: error.message };
  }

  const leads: LeadRecord[] = (data ?? []).map((row) => {
    const contactRaw = row.contact as
      | { name: string; email: string; company: string }
      | { name: string; email: string; company: string }[]
      | null;
    const contact = Array.isArray(contactRaw) ? (contactRaw[0] ?? null) : contactRaw;
    return {
      id: row.id as string,
      intent: row.intent as string,
      status: row.status as LeadStatus,
      created_at: row.created_at as string,
      contact,
    };
  });

  return { ok: true, leads };
}

export type FileCandidateResult =
  | { ok: true; id: string; inserted: boolean }
  | { ok: false; skipped: true; reason: "not_configured" }
  | { ok: false; skipped: false; error: string };

/** Upsert outbound candidate by (source, external_id). Idempotent. */
export async function fileSourcedCandidate(
  intake: SourcedCandidateIntake,
  env: CrmEnv = process.env,
  client: SupabaseClient | null = createCrmClient(env),
): Promise<FileCandidateResult> {
  if (!client) {
    return { ok: false, skipped: true, reason: "not_configured" };
  }

  const row = {
    source: intake.source,
    external_id: intake.externalId,
    company_name: intake.companyName.trim(),
    city: (intake.city ?? "").trim(),
    state: (intake.state ?? "").trim().toUpperCase(),
    industry: (intake.industry ?? "").trim(),
    signal_summary: intake.signalSummary.trim(),
    source_url: (intake.sourceUrl ?? "").trim(),
    approved_at: intake.approvedAt ?? null,
  };

  const existing = await client
    .from("sourced_candidates")
    .select("id")
    .eq("source", row.source)
    .eq("external_id", row.external_id)
    .maybeSingle();

  if (existing.error) {
    return { ok: false, skipped: false, error: existing.error.message };
  }

  if (existing.data?.id) {
    return { ok: true, id: existing.data.id as string, inserted: false };
  }

  const insert = await client
    .from("sourced_candidates")
    .insert(row)
    .select("id")
    .single();

  if (insert.error || !insert.data?.id) {
    return {
      ok: false,
      skipped: false,
      error: insert.error?.message ?? "candidate insert failed",
    };
  }

  return { ok: true, id: insert.data.id as string, inserted: true };
}

export async function listOpenSourcedCandidates(
  env: CrmEnv = process.env,
  client: SupabaseClient | null = createCrmClient(env),
  limit = 50,
): Promise<
  { ok: true; candidates: SourcedCandidateRecord[] } | { ok: false; error: string }
> {
  if (!client) {
    return { ok: false, error: "CRM is not configured." };
  }

  const { data, error } = await client
    .from("sourced_candidates")
    .select(
      "id, source, company_name, city, state, industry, signal_summary, source_url, status, created_at",
    )
    .eq("status", "new")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    candidates: (data ?? []) as SourcedCandidateRecord[],
  };
}
