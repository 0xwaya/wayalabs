import { describe, expect, it } from "vitest";
import {
  crmConfig,
  fileLead,
  listOpenLeads,
  type CrmDb,
} from "@/lib/leads/crm";

const intake = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  message: "Want a discovery sprint for a lead system.",
  intent: "discovery",
};

function mockDb(handlers: {
  contact?: { id: string } | null;
  leads?: Array<{
    id: string;
    intent: string;
    status: "new";
    created_at: string;
    contact: { name: string; email: string; company: string };
  }>;
}): CrmDb {
  return {
    async findContactByEmail() {
      return handlers.contact === undefined
        ? null
        : handlers.contact;
    },
    async updateContact() {},
    async insertContact() {
      return { id: "contact_new" };
    },
    async insertLead() {
      return { id: "lead_1" };
    },
    async listNewLeads() {
      return (handlers.leads ?? []).map((row) => ({
        id: row.id,
        intent: row.intent,
        status: row.status,
        created_at: row.created_at,
        contact: row.contact,
      }));
    },
    async findCandidate() {
      return null;
    },
    async insertCandidate() {
      return { id: "cand_1" };
    },
    async listNewCandidates() {
      return [];
    },
  };
}

describe("crmConfig", () => {
  it("is configured only when DATABASE_URL is set", () => {
    expect(crmConfig({}).configured).toBe(false);
    expect(
      crmConfig({ SUPABASE_URL: "https://x.supabase.co" }).configured,
    ).toBe(false);
    expect(
      crmConfig({
        DATABASE_URL: "postgresql://user:pass@host/db?sslmode=require",
      }).configured,
    ).toBe(true);
  });
});

describe("fileLead", () => {
  it("skips when CRM env is missing", async () => {
    const result = await fileLead(intake, {}, null);
    expect(result).toEqual({
      ok: false,
      skipped: true,
      reason: "not_configured",
    });
  });

  it("inserts a new contact and lead", async () => {
    const result = await fileLead(intake, {}, mockDb({}));
    expect(result).toEqual({
      ok: true,
      contactId: "contact_new",
      leadId: "lead_1",
      matchedExisting: false,
    });
  });

  it("matches an existing contact by email", async () => {
    const result = await fileLead(
      intake,
      {},
      mockDb({ contact: { id: "contact_existing" } }),
    );
    expect(result).toEqual({
      ok: true,
      contactId: "contact_existing",
      leadId: "lead_1",
      matchedExisting: true,
    });
  });
});

describe("listOpenLeads", () => {
  it("maps joined contact rows", async () => {
    const result = await listOpenLeads(
      {},
      mockDb({
        leads: [
          {
            id: "lead_1",
            intent: "discovery",
            status: "new",
            created_at: "2026-11-24T12:00:00.000Z",
            contact: {
              name: "Ada",
              email: "ada@example.com",
              company: "Analytical Engines",
            },
          },
        ],
      }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.leads[0]?.contact?.email).toBe("ada@example.com");
    }
  });
});
