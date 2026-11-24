import { neon } from "@neondatabase/serverless";
import type {
  LeadIntake,
  LeadRecord,
  LeadStatus,
  SourcedCandidateIntake,
  SourcedCandidateRecord,
} from "@/lib/leads/types";

export type CrmEnv = {
  DATABASE_URL?: string;
  /** @deprecated Prefer DATABASE_URL (Neon). Kept for migration detection only. */
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  [key: string]: string | undefined;
};

export type CrmResult =
  | { ok: true; contactId: string; leadId: string; matchedExisting: boolean }
  | { ok: false; skipped: true; reason: "not_configured" }
  | { ok: false; skipped: false; error: string };

/** Injectable DB surface — Neon in prod, mocks in tests. */
export type CrmDb = {
  findContactByEmail(email: string): Promise<{ id: string } | null>;
  updateContact(
    id: string,
    fields: { name: string; company: string; updatedAt: string },
  ): Promise<void>;
  insertContact(fields: {
    email: string;
    name: string;
    company: string;
  }): Promise<{ id: string }>;
  insertLead(fields: {
    contactId: string;
    intent: string;
    message: string;
    source: string;
    status: LeadStatus;
  }): Promise<{ id: string }>;
  listNewLeads(limit: number): Promise<LeadRecord[]>;
  findCandidate(
    source: string,
    externalId: string,
  ): Promise<{ id: string } | null>;
  insertCandidate(row: {
    source: string;
    externalId: string;
    companyName: string;
    city: string;
    state: string;
    industry: string;
    signalSummary: string;
    sourceUrl: string;
    approvedAt: string | null;
  }): Promise<{ id: string }>;
  listNewCandidates(limit: number): Promise<SourcedCandidateRecord[]>;
};

export function crmConfig(env: CrmEnv = process.env) {
  const databaseUrl = env.DATABASE_URL?.trim() ?? "";
  return {
    databaseUrl,
    configured: databaseUrl.length > 0,
  };
}

export function createCrmClient(env: CrmEnv = process.env): CrmDb | null {
  const { databaseUrl, configured } = crmConfig(env);
  if (!configured) return null;
  const sql = neon(databaseUrl);
  return createNeonCrmDb(sql);
}

type NeonSql = (
  strings: TemplateStringsArray,
  ...params: unknown[]
) => Promise<Record<string, unknown>[]>;

function createNeonCrmDb(sql: NeonSql): CrmDb {
  return {
    async findContactByEmail(email) {
      const rows = await sql`
        SELECT id FROM contacts WHERE email = ${email} LIMIT 1
      `;
      const id = rows[0]?.id;
      return typeof id === "string" ? { id } : null;
    },

    async updateContact(id, fields) {
      await sql`
        UPDATE contacts
        SET name = ${fields.name},
            company = ${fields.company},
            updated_at = ${fields.updatedAt}::timestamptz
        WHERE id = ${id}::uuid
      `;
    },

    async insertContact(fields) {
      const rows = await sql`
        INSERT INTO contacts (email, name, company)
        VALUES (${fields.email}, ${fields.name}, ${fields.company})
        RETURNING id
      `;
      const id = rows[0]?.id;
      if (typeof id !== "string") throw new Error("contact insert failed");
      return { id };
    },

    async insertLead(fields) {
      const rows = await sql`
        INSERT INTO leads (contact_id, intent, message, source, status)
        VALUES (
          ${fields.contactId}::uuid,
          ${fields.intent},
          ${fields.message},
          ${fields.source},
          ${fields.status}::lead_status
        )
        RETURNING id
      `;
      const id = rows[0]?.id;
      if (typeof id !== "string") throw new Error("lead insert failed");
      return { id };
    },

    async listNewLeads(limit) {
      const rows = await sql`
        SELECT
          l.id,
          l.intent,
          l.status,
          l.created_at,
          c.name AS contact_name,
          c.email AS contact_email,
          c.company AS contact_company
        FROM leads l
        JOIN contacts c ON c.id = l.contact_id
        WHERE l.status = 'new'
        ORDER BY l.created_at DESC
        LIMIT ${limit}
      `;
      return rows.map((row) => ({
        id: String(row.id),
        intent: String(row.intent),
        status: row.status as LeadStatus,
        created_at: toIso(row.created_at),
        contact: {
          name: String(row.contact_name ?? ""),
          email: String(row.contact_email ?? ""),
          company: String(row.contact_company ?? ""),
        },
      }));
    },

    async findCandidate(source, externalId) {
      const rows = await sql`
        SELECT id FROM sourced_candidates
        WHERE source = ${source} AND external_id = ${externalId}
        LIMIT 1
      `;
      const id = rows[0]?.id;
      return typeof id === "string" ? { id } : null;
    },

    async insertCandidate(row) {
      const rows = await sql`
        INSERT INTO sourced_candidates (
          source, external_id, company_name, city, state, industry,
          signal_summary, source_url, approved_at
        ) VALUES (
          ${row.source},
          ${row.externalId},
          ${row.companyName},
          ${row.city},
          ${row.state},
          ${row.industry},
          ${row.signalSummary},
          ${row.sourceUrl},
          ${row.approvedAt}
        )
        RETURNING id
      `;
      const id = rows[0]?.id;
      if (typeof id !== "string") throw new Error("candidate insert failed");
      return { id };
    },

    async listNewCandidates(limit) {
      const rows = await sql`
        SELECT
          id, source, company_name, city, state, industry,
          signal_summary, source_url, status, created_at
        FROM sourced_candidates
        WHERE status = 'new'
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
      return rows.map((row) => ({
        id: String(row.id),
        source: String(row.source),
        company_name: String(row.company_name),
        city: String(row.city ?? ""),
        state: String(row.state ?? ""),
        industry: String(row.industry ?? ""),
        signal_summary: String(row.signal_summary),
        source_url: String(row.source_url ?? ""),
        status: row.status as SourcedCandidateRecord["status"],
        created_at: toIso(row.created_at),
      }));
    },
  };
}

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

/**
 * After email succeeds: match contact by email, then file the lead.
 * Does not send mail and does not contact the person.
 */
export async function fileLead(
  intake: LeadIntake,
  env: CrmEnv = process.env,
  db: CrmDb | null = createCrmClient(env),
): Promise<CrmResult> {
  if (!db) {
    return { ok: false, skipped: true, reason: "not_configured" };
  }

  try {
    const email = intake.email.trim().toLowerCase();
    const name = intake.name.trim();
    const company = intake.company.trim();
    const now = new Date().toISOString();

    const existing = await db.findContactByEmail(email);
    let contactId: string;
    let matchedExisting = false;

    if (existing) {
      matchedExisting = true;
      contactId = existing.id;
      await db.updateContact(contactId, { name, company, updatedAt: now });
    } else {
      const inserted = await db.insertContact({ email, name, company });
      contactId = inserted.id;
    }

    const lead = await db.insertLead({
      contactId,
      intent: intake.intent,
      message: intake.message,
      source: intake.source ?? "contact_form",
      status: "new",
    });

    return {
      ok: true,
      contactId,
      leadId: lead.id,
      matchedExisting,
    };
  } catch (err) {
    return {
      ok: false,
      skipped: false,
      error: err instanceof Error ? err.message : "CRM write failed",
    };
  }
}

/** Open leads for the operator digest. Never emails the lead. */
export async function listOpenLeads(
  env: CrmEnv = process.env,
  db: CrmDb | null = createCrmClient(env),
  limit = 50,
): Promise<{ ok: true; leads: LeadRecord[] } | { ok: false; error: string }> {
  if (!db) {
    return { ok: false, error: "CRM is not configured." };
  }

  try {
    const leads = await db.listNewLeads(limit);
    return { ok: true, leads };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "CRM read failed",
    };
  }
}

export type FileCandidateResult =
  | { ok: true; id: string; inserted: boolean }
  | { ok: false; skipped: true; reason: "not_configured" }
  | { ok: false; skipped: false; error: string };

/** Upsert outbound candidate by (source, external_id). Idempotent. */
export async function fileSourcedCandidate(
  intake: SourcedCandidateIntake,
  env: CrmEnv = process.env,
  db: CrmDb | null = createCrmClient(env),
): Promise<FileCandidateResult> {
  if (!db) {
    return { ok: false, skipped: true, reason: "not_configured" };
  }

  try {
    const existing = await db.findCandidate(intake.source, intake.externalId);
    if (existing) {
      return { ok: true, id: existing.id, inserted: false };
    }

    const inserted = await db.insertCandidate({
      source: intake.source,
      externalId: intake.externalId,
      companyName: intake.companyName.trim(),
      city: (intake.city ?? "").trim(),
      state: (intake.state ?? "").trim().toUpperCase(),
      industry: (intake.industry ?? "").trim(),
      signalSummary: intake.signalSummary.trim(),
      sourceUrl: (intake.sourceUrl ?? "").trim(),
      approvedAt: intake.approvedAt ?? null,
    });
    return { ok: true, id: inserted.id, inserted: true };
  } catch (err) {
    return {
      ok: false,
      skipped: false,
      error: err instanceof Error ? err.message : "candidate insert failed",
    };
  }
}

export async function listOpenSourcedCandidates(
  env: CrmEnv = process.env,
  db: CrmDb | null = createCrmClient(env),
  limit = 50,
): Promise<
  { ok: true; candidates: SourcedCandidateRecord[] } | { ok: false; error: string }
> {
  if (!db) {
    return { ok: false, error: "CRM is not configured." };
  }

  try {
    const candidates = await db.listNewCandidates(limit);
    return { ok: true, candidates };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "CRM read failed",
    };
  }
}
