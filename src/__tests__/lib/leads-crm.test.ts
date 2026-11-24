import { describe, expect, it, vi } from "vitest";
import { crmConfig, fileLead, listOpenLeads } from "@/lib/leads/crm";

const intake = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  message: "Want a discovery sprint for a lead system.",
  intent: "discovery",
};

function mockClient(handlers: {
  maybeSingle?: { data: { id: string } | null; error: null | { message: string } };
  updateError?: { message: string } | null;
  insertContact?: { data: { id: string } | null; error: null | { message: string } };
  insertLead?: { data: { id: string } | null; error: null | { message: string } };
  list?: { data: unknown[]; error: null | { message: string } };
}) {
  const from = vi.fn((table: string) => {
    if (table === "contacts") {
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: async () =>
              handlers.maybeSingle ?? { data: null, error: null },
          }),
        }),
        update: () => ({
          eq: async () => ({ error: handlers.updateError ?? null }),
        }),
        insert: () => ({
          select: () => ({
            single: async () =>
              handlers.insertContact ?? {
                data: { id: "contact_new" },
                error: null,
              },
          }),
        }),
      };
    }
    if (table === "leads") {
      return {
        insert: () => ({
          select: () => ({
            single: async () =>
              handlers.insertLead ?? { data: { id: "lead_1" }, error: null },
          }),
        }),
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: async () =>
                handlers.list ?? { data: [], error: null },
            }),
          }),
        }),
      };
    }
    throw new Error(`unexpected table ${table}`);
  });

  return { from } as never;
}

describe("crmConfig", () => {
  it("is unconfigured without both URL and service role", () => {
    expect(crmConfig({}).configured).toBe(false);
    expect(crmConfig({ SUPABASE_URL: "https://x.supabase.co" }).configured).toBe(
      false,
    );
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
    const result = await fileLead(intake, {}, mockClient({}));
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
      mockClient({
        maybeSingle: { data: { id: "contact_existing" }, error: null },
      }),
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
      mockClient({
        list: {
          data: [
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
          error: null,
        },
      }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.leads[0]?.contact?.email).toBe("ada@example.com");
    }
  });
});
